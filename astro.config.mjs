import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Server output so we can host the /api/contact endpoint that writes to Airtable.
export default defineConfig({
  site: 'https://equityguardians.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4321,
  },
  compressHTML: true,
});
