#!/usr/bin/env node
// Serves the production build in dist/ (`npm run build`): the web app's static files and the API
// routes, on one Node.js HTTP server. The same build runs on any host that expo-server has an
// adapter for (Express, Vercel, Netlify, Cloudflare Workers, Bun, EAS Hosting).
//
//   npm run build && npm run serve           PORT (default 3000) and HOST (default 127.0.0.1)
//
// Behind a reverse proxy, set TRUST_PROXY to the proxy's addresses, comma-separated
// (TRUST_PROXY=127.0.0.1,::1): the client address is then read from X-Forwarded-For, but only on
// connections from those addresses.
import { randomBytes } from 'node:crypto';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { isIP } from 'node:net';
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

// An address as one form: lower case, and an IPv4-mapped IPv6 address as its IPv4 address.
function plainAddress(address) {
  const lower = address.trim().toLowerCase();
  const plain = lower.startsWith('::ffff:') && isIP(lower.slice(7)) === 4 ? lower.slice(7) : lower;
  return isIP(plain) ? plain : null;
}

const TRUSTED_PROXIES = new Set();
for (const entry of (process.env.TRUST_PROXY ?? '').split(',')) {
  if (!entry.trim()) continue;
  const address = plainAddress(entry);
  if (!address) {
    console.error(`TRUST_PROXY must list IP addresses, got "${entry.trim()}".`);
    process.exit(1);
  }
  TRUSTED_PROXIES.add(address);
}

// The API's rate limits key on these headers (src/server/client-address.ts). The routes trust the
// address only with this secret, which lives in this process and is never sent to a client.
const CLIENT_ADDRESS_HEADER = 'x-client-address';
const CLIENT_ADDRESS_SECRET_HEADER = 'x-client-address-secret';
process.env.CLIENT_ADDRESS_SECRET = randomBytes(32).toString('base64url');

const handleRoute = createRequestHandler({ build: join(ROOT, 'server') });

// The socket's address, or, on a connection from a trusted proxy, the nearest address in
// X-Forwarded-For that is not a trusted proxy. null when there is none or it is malformed: the
// API then slows such requests down instead of limiting them per client.
function clientAddressOf(req) {
  const peer = plainAddress(req.socket.remoteAddress ?? '');
  if (!peer || !TRUSTED_PROXIES.has(peer)) return peer;
  const hops = [req.headers['x-forwarded-for'] ?? ''].flat().join(',').split(',').reverse();
  for (const hop of hops) {
    if (!hop.trim()) continue;
    const address = plainAddress(hop);
    if (!address) return null;
    if (!TRUSTED_PROXIES.has(address)) return address;
  }
  return null;
}

// expo-server builds the route's Request from req.rawHeaders, so the values a client sent are
// removed there and this server's own are added.
function setClientAddress(req) {
  const raw = req.rawHeaders;
  for (let index = raw.length - 2; index >= 0; index -= 2) {
    const name = raw[index].toLowerCase();
    if (name === CLIENT_ADDRESS_HEADER || name === CLIENT_ADDRESS_SECRET_HEADER) {
      raw.splice(index, 2);
    }
  }
  const address = clientAddressOf(req);
  if (!address) return;
  raw.push(CLIENT_ADDRESS_HEADER, address);
  raw.push(CLIENT_ADDRESS_SECRET_HEADER, process.env.CLIENT_ADDRESS_SECRET);
}

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
  setClientAddress(req);
  handleRoute(req, res, (error) => {
    res.statusCode = error ? 500 : 404;
    res.end();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Serving dist/ on http://${HOST}:${PORT}`);
  if (TRUSTED_PROXIES.size > 0) {
    console.log(
      `Reading client addresses from X-Forwarded-For of ${[...TRUSTED_PROXIES].join(', ')}`,
    );
  }
});
