import type { APIRoute } from 'astro';
import { buildClearCookie, isSecureRequest } from '../../../lib/partner-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const cookie = buildClearCookie(isSecureRequest(request));
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/partners',
      'Set-Cookie': cookie,
    },
  });
};

// Also accept GET so a plain <a href="/api/partners/logout"> works.
export const GET: APIRoute = async ({ request }) => {
  const cookie = buildClearCookie(isSecureRequest(request));
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/partners',
      'Set-Cookie': cookie,
    },
  });
};
