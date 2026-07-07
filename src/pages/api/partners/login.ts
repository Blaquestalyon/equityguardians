import type { APIRoute } from 'astro';
import {
  buildSessionCookie,
  getConfiguredPasscode,
  isSecureRequest,
  issueToken,
  passcodesMatch,
} from '../../../lib/partner-auth';

export const prerender = false;

interface LoginPayload {
  name?: string;
  passcode?: string;
  next?: string;
}

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

async function parseBody(request: Request): Promise<LoginPayload> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return (await request.json().catch(() => ({}))) as LoginPayload;
  }
  const form = await request.formData();
  const out: LoginPayload = {};
  form.forEach((v, k) => ((out as any)[k] = String(v)));
  return out;
}

// Only allow relative same-site paths as the post-login redirect target.
function safeNext(input: string | undefined): string {
  if (!input) return '/partners/hub';
  const decoded = (() => {
    try { return decodeURIComponent(input); } catch { return input; }
  })();
  if (!decoded.startsWith('/')) return '/partners/hub';
  if (decoded.startsWith('//')) return '/partners/hub';
  if (!decoded.startsWith('/partners')) return '/partners/hub';
  return decoded;
}

export const POST: APIRoute = async ({ request }) => {
  let body: LoginPayload;
  try {
    body = await parseBody(request);
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const name = (body.name || '').trim();
  const passcode = (body.passcode || '').toString();
  const next = safeNext(body.next);

  if (!name || name.length < 2) {
    return json({ error: 'Please enter your full name.' }, 400);
  }
  if (name.length > 80) {
    return json({ error: 'Name is too long.' }, 400);
  }
  if (!passcode) {
    return json({ error: 'Please enter the partner passcode.' }, 400);
  }

  const expected = getConfiguredPasscode();
  if (!expected) {
    console.error('[partners/login] PARTNER_PASSCODE is not set on the server.');
    return json(
      { error: 'The partner portal is not fully configured yet. Please contact admin@equityguardians.com.' },
      503,
    );
  }

  if (!passcodesMatch(passcode, expected)) {
    // Small jitter so response timing doesn't help attackers.
    await new Promise((r) => setTimeout(r, 250 + Math.floor(Math.random() * 250)));
    return json({ error: 'Passcode incorrect. Contact your EG partner lead if you need it resent.' }, 401);
  }

  const token = issueToken(name);
  const cookie = buildSessionCookie(token, isSecureRequest(request));

  return json({ ok: true, next, name }, 200, { 'Set-Cookie': cookie });
};

export const GET: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
