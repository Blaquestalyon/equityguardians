import { defineMiddleware } from 'astro:middleware';
import { getPartnerSessionFromRequest } from './lib/partner-auth';

// Paths under /partners that are always accessible without a session.
// (Login page, login/logout endpoints, and static assets served alongside.)
const PARTNER_PUBLIC_PATHS = new Set<string>([
  '/partners',
  '/partners/',
  '/api/partners/login',
  '/api/partners/logout',
]);

function isPartnerProtected(pathname: string): boolean {
  if (!pathname.startsWith('/partners')) return false;
  if (PARTNER_PUBLIC_PATHS.has(pathname)) return false;
  // Everything else under /partners/* is gated.
  return true;
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const url = new URL(ctx.request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  const session = getPartnerSessionFromRequest(ctx.request);
  // Expose session (if any) to pages via locals for header UI.
  (ctx.locals as any).partner = session;

  if (isPartnerProtected(path)) {
    if (!session) {
      const returnTo = encodeURIComponent(url.pathname + url.search);
      return ctx.redirect(`/partners?next=${returnTo}`, 302);
    }
  }

  return next();
});
