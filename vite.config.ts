import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // Tailwind/Vite emit a small amount of inline style; revisit with hashes/nonces if it can be removed.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // LSS CDN for card art (per .claude/rules/security.md and fab-domain.md).
  "img-src 'self' https://cards.fabtcg.com data:",
  "font-src 'self' data: https://fonts.gstatic.com",
  // connect-src is intentionally narrow; widen here as the API + Supabase hosts get wired in.
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

function injectProdCsp(): Plugin {
  return {
    name: 'chainsmith:inject-prod-csp',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.server) return html;
        return html.replace(
          '<meta name="viewport"',
          `<meta http-equiv="Content-Security-Policy" content="${PROD_CSP}" />\n    <meta name="viewport"`,
        );
      },
    },
  };
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    injectProdCsp(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
