import type { APIRoute } from 'astro';

const routes = [
  '/',
  '/about',
  '/services',
  '/attorneys',
  '/insights',
  '/insights/missed-payment-to-auction-gavel',
  '/insights/surplus-equity',
  '/insights/recurring-bills-slow-equity',
  '/insights/when-to-call-an-attorney',
  '/insights/realtors-foreclosure-protection',
  '/insights/tax-lien-surplus-reform',
  '/contact',
  '/privacy',
  '/terms',
];

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') || 'https://equityguardians.com';
  const now = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${base}${r}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${r === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
