/**
 * The address of the client that sent a request, as a key for the rate limits.
 *
 * A Fetch `Request` carries no socket address, so the server in front of the API routes has to
 * pass it on: `scripts/serve.mjs` replaces any {@link CLIENT_ADDRESS_HEADER} a client sent with
 * the socket's remote address. Behind a proxy or on another host, set the header from the address
 * that proxy reports and drop any value the client sent; a header a client can set is not a limit.
 *
 * A request without a readable header has no address (`null`). That is the case in
 * `npx expo start`, which runs the routes without a way to pass the address. Such requests are
 * not limited per client; the limiter slows them down instead (`src/server/auth-limiter.ts`), so
 * they never lock each other out.
 *
 * @module
 */

/** Header that carries the client's address, set by the server in front of the routes. */
export const CLIENT_ADDRESS_HEADER = 'x-client-address';

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const IPV4_MAPPED = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i;
const HEX_GROUP = /^[0-9a-f]{1,4}$/i;
const IPV6_GROUPS = 8;
const IPV6_CLIENT_GROUPS = 4;
const IPV6_NETWORK_GROUPS = 3;
const MAX_HEADER_LENGTH = 64;

/**
 * Where a request comes from, as keys for the rate limits.
 *
 * - `client` is one client: an IPv4 address, or the /64 network of an IPv6 address, since one
 *   home or one server usually gets a whole /64.
 * - `network` is the site the client belongs to: the IPv4 address again, or the /48 network of an
 *   IPv6 address, which one customer usually gets. It has its own, larger budget, so the 65,536
 *   /64 networks of one /48 cannot fill the limiter tables.
 */
export interface ClientAddress {
  client: string;
  network: string;
}

function ipv4(address: string): string | null {
  const parts = IPV4.exec(address)?.slice(1).map(Number);
  if (!parts || parts.some((part) => part > 255)) return null;
  return parts.join('.');
}

// The eight groups of an IPv6 address as numbers, or null when it is not one.
function ipv6Groups(address: string): number[] | null {
  const halves = address.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = IPV6_GROUPS - head.length - tail.length;
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const groups = [...head, ...Array<string>(halves.length === 2 ? missing : 0).fill('0'), ...tail];
  if (!groups.every((group) => HEX_GROUP.test(group))) return null;
  return groups.map((group) => parseInt(group, 16));
}

function ipv6Prefix(groups: number[], count: number): string {
  const prefix = groups.slice(0, count).map((group) => group.toString(16));
  return `${prefix.join(':')}::/${count * 16}`;
}

/**
 * The {@link ClientAddress} of an IPv4 or IPv6 address; an IPv4-mapped IPv6 address counts as its
 * IPv4 address. `null` when `raw` is neither.
 */
export function parseClientAddress(raw: string): ClientAddress | null {
  const address = raw.trim().split('%', 1)[0] ?? '';
  const mapped = IPV4_MAPPED.exec(address)?.[1];
  if (mapped || !address.includes(':')) {
    const v4 = ipv4(mapped ?? address);
    return v4 ? { client: v4, network: v4 } : null;
  }
  const groups = ipv6Groups(address);
  if (!groups) return null;
  return {
    client: ipv6Prefix(groups, IPV6_CLIENT_GROUPS),
    network: ipv6Prefix(groups, IPV6_NETWORK_GROUPS),
  };
}

/** The address of the request's client; `null` when it is not known. */
export function clientAddress(request: Request): ClientAddress | null {
  const header = request.headers.get(CLIENT_ADDRESS_HEADER);
  if (!header || header.length > MAX_HEADER_LENGTH) return null;
  return parseClientAddress(header);
}
