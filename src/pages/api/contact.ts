import type { APIRoute } from 'astro';

export const prerender = false;

interface Payload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  subject?: string;
  message?: string;
  source?: string;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function parseBody(request: Request): Promise<Payload> {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await request.json().catch(() => ({}))) as Payload;
  }
  const form = await request.formData();
  const out: Payload = {};
  form.forEach((v, k) => ((out as any)[k] = String(v)));
  return out;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: Payload;
  try {
    body = await parseBody(request);
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400);
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();
  const address = (body.address || '').trim();
  const subject = (body.subject || 'General inquiry').trim();
  const message = (body.message || '').trim();
  const source = (body.source || 'contact_page').trim();

  // Newsletter subs come with only email; treat missing name/message as ok in that case.
  const isNewsletter = source.startsWith('insights_page_newsletter');

  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'A valid email is required.' }, 400);
  }
  if (!isNewsletter && (!name || !message)) {
    return jsonResponse({ error: 'Please include your name and a short message.' }, 400);
  }

  const token = import.meta.env.AIRTABLE_TOKEN;
  const baseId = import.meta.env.AIRTABLE_BASE_ID;
  const table = import.meta.env.AIRTABLE_TABLE || 'Inquiries';

  if (!token || !baseId) {
    // Fail gracefully so the site works pre-Airtable-config.
    // We still log so the operator can see submissions in Railway logs.
    console.log('[contact] Missing Airtable config. Submission:', {
      name, email, phone, address, subject, message, source,
    });
    return jsonResponse({
      ok: true,
      warning: 'Received (Airtable not configured — check Railway logs).',
    });
  }

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;

  const fields: Record<string, string> = {
    Name: name || '(newsletter)',
    Email: email,
    Phone: phone,
    Address: address,
    Subject: subject,
    Message: message,
    Source: source,
    'Submitted At': new Date().toISOString(),
  };

  // Strip empty strings so Airtable doesn't complain about type mismatches.
  Object.keys(fields).forEach((k) => {
    if (fields[k] === '') delete fields[k];
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{ fields }],
        // typecast lets Airtable coerce e.g. Single Select values on the fly.
        typecast: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[contact] Airtable error', res.status, errText);
      return jsonResponse(
        { error: 'Our form service is temporarily unavailable. Please email admin@equityguardians.com.' },
        502,
      );
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error', err);
    return jsonResponse(
      { error: 'Something went wrong. Please try again shortly.' },
      500,
    );
  }
};

export const GET: APIRoute = () => jsonResponse({ error: 'Method not allowed.' }, 405);
