/**
 * The address of the client that sent a request, as a key for the rate limits.
 *
 * A Fetch `Request` carries no socket address, so the server in front of the API routes has to
 * pass it on: `scripts/serve.mjs` replaces any {@link CLIENT_ADDRESS_HEADER} a client sent with
 * the socket's remote address. Behind a proxy or on another host, set the header from the address
 * that proxy reports and drop any value the client sent; a header a client can set is not a limit.
 *
 * Requests without the header share the key {@link UNKNOWN_CLIENT}, so they also share one
 * client limit. That is the case in `npx expo start`, which runs the routes without a way to pass
 * the address.
 *
 * @module
 */

/** Header that carries the client's address, set by the server in front of the routes. */
export const CLIENT_ADDRESS_HEADER = 'x-client-address';

/** Key of every request whose address is missing or cannot be read. */
export const UNKNOWN_CLIENT = 'unknown';

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV4_MAPPED = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i;
const HEX_GROUP = /^[0-9a-f]{1,4}$/i;
const IPV6_GROUPS = 8;
// One home or one server usually gets a whole /64, so its addresses count as one client.
const IPV6_PREFIX_GROUPS = 4;

function ipv4(address: string): string | null {
  const parts = IPV4.exec(address)?.slice(1).map(Number);
  if (!parts || parts.some((part) => part > 255)) return null;
  return parts.join('.');
}

function ipv6Prefix(address: string): string | null {
  const halves = address.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = IPV6_GROUPS - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const groups = [...head, ...Array<string>(halves.length === 2 ? missing : 0).fill('0'), ...tail];
  if (!groups.every((group) => HEX_GROUP.test(group))) return null;
  const prefix = groups
    .slice(0, IPV6_PREFIX_GROUPS)
    .map((group) => parseInt(group, 16).toString(16));
  return `${prefix.join(':')}::/64`;
}

/**
 * A stable key for one client address: an IPv4 address as it is, an IPv4-mapped IPv6 address as
 * its IPv4 address, and an IPv6 address as its /64 network. `null` when it is neither.
 */
export function normalizeAddress(raw: string): string | null {
  const address = raw.trim().split('%', 1)[0] ?? '';
  const mapped = IPV4_MAPPED.exec(address)?.[1];
  if (mapped) return ipv4(mapped);
  if (address.includes(':')) return ipv6Prefix(address);
  return ipv4(address);
}

/** The rate-limit key of the request's client; {@link UNKNOWN_CLIENT} when it is not known. */
export function clientKey(request: Request): string {
  const header = request.headers.get(CLIENT_ADDRESS_HEADER);
  if (!header || header.length > 64) return UNKNOWN_CLIENT;
  return normalizeAddress(header) ?? UNKNOWN_CLIENT;
}
