#!/usr/bin/env node
// Serves the production build in dist/ (`npm run build`): the web app's static files and the API
// routes, on one Node.js HTTP server. The same build runs on any host that expo-server has an
// adapter for (Express, Vercel, Netlify, Cloudflare Workers, Bun, EAS Hosting).
//
//   npm run build && npm run serve           PORT (default 3000) and HOST (default 127.0.0.1)
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// The ES module build of expo-server's adapters uses extensionless imports that Node.js cannot
// resolve, so the CommonJS build is loaded.
const { createRequestHandler } = createRequire(import.meta.url)('expo-server/adapter/http');

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const CLIENT = join(ROOT, 'client');
const RAW_PORT = process.env.PORT ?? '3000';
const PORT = /^[0-9]{1,5}$/.test(RAW_PORT) ? Number(RAW_PORT) : Number.NaN;
const HOST = process.env.HOST ?? '127.0.0.1';
const TYPES = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
};

if (!existsSync(join(ROOT, 'server'))) {
  console.error('No build in dist/. Run `npm run build` first.');
  process.exit(1);
}
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`PORT must be an integer from 1 to 65535, got "${RAW_PORT}".`);
  process.exit(1);
}

const handleRoute = createRequestHandler({ build: join(ROOT, 'server') });

// A static file under dist/client for this URL path, or null. Paths that would leave the
// folder ("/../", encoded or not) are refused.
function staticFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;
  const path = normalize(join(CLIENT, decoded));
  if (!path.startsWith(CLIENT + sep)) return null;
  return existsSync(path) && statSync(path).isFile() ? path : null;
}

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  const file = req.method === 'GET' || req.method === 'HEAD' ? staticFile(pathname) : null;
  if (file) {
    const immutable = pathname.startsWith('/_expo/static/');
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(file).pipe(res);
    return;
  }
  handleRoute(req, res, (error) => {
    res.statusCode = error ? 500 : 404;
    res.end();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Serving dist/ on http://${HOST}:${PORT}`);
});
