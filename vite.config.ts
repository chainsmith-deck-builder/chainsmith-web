import { defineConfig, loadEnv, type Plugin, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// Single `/api/*` proxy entry that strips the prefix on its way to the
// backend. The prefix keeps backend paths (`/decks`, `/heroes`, …) from
// colliding with SPA routes (`/decks/new`, `/decks/$id/edit`).
function devProxyConfig(target: string): Record<string, ProxyOptions> {
  return {
    '/api': {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  };
}

const PROD_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  // Tailwind/Vite emit a small amount of inline style; revisit with hashes/nonces if it can be removed.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Card / hero art CDNs. The upstream the-fab-cube dataset doesn't host on
  // cards.fabtcg.com — populated `imageUrl`s come from CloudFront and Google
  // Cloud Storage, plus the cards.fabtcg.com host that .claude/rules/security.md
  // anticipates. Hot-linked, never proxied. Widen this list (or revisit
  // proxying) before adding any new image source.
  "img-src 'self' https://cards.fabtcg.com https://*.cloudfront.net https://storage.googleapis.com data:",
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_API_PROXY_TARGET ?? 'http://localhost:8080';
  return {
    plugins: [
      TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
      react(),
      injectProdCsp(),
    ],
    server: {
      port: 5173,
      strictPort: true,
      proxy: devProxyConfig(proxyTarget),
    },
    preview: {
      port: 4173,
      strictPort: true,
    },
  };
});
