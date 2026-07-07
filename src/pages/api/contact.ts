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

  // Support both server-only (import.meta.env) and process.env variable names,
  // and accept common alternate variable names in case an operator sets them differently.
  const env = { ...process.env, ...(import.meta.env as any) };
  const token =
    env.AIRTABLE_TOKEN ||
    env.AIRTABLE_API_KEY ||
    env.AIRTABLE_PAT ||
    env.AIRTABLE_ACCESS_TOKEN;
  const baseId = env.AIRTABLE_BASE_ID || env.AIRTABLE_BASE;
  const table = env.AIRTABLE_TABLE || env.AIRTABLE_TABLE_NAME || 'Inquiries';

  if (!token || !baseId) {
    console.error('[contact] Missing Airtable config.', {
      hasToken: Boolean(token),
      hasBaseId: Boolean(baseId),
      table,
    });
    return jsonResponse(
      {
        error:
          'Our contact system is not fully configured yet. Please email admin@equityguardians.com or call +1 (888) 364-0999. (Server missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID)',
      },
      503,
    );
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
      // Surface a helpful hint to the operator in the response body without leaking secrets.
      let hint = 'Please email admin@equityguardians.com or call +1 (888) 364-0999.';
      if (res.status === 401 || res.status === 403) {
        hint = 'Airtable rejected our credentials (401/403). Check AIRTABLE_TOKEN scope & base access.';
      } else if (res.status === 404) {
        hint = `Airtable table not found. Verify AIRTABLE_BASE_ID and AIRTABLE_TABLE (looking for "${table}").`;
      } else if (res.status === 422) {
        hint = 'Airtable schema mismatch. Ensure fields Name/Email/Phone/Address/Subject/Message/Source exist.';
      }
      return jsonResponse({ error: hint, airtableStatus: res.status }, 502);
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
