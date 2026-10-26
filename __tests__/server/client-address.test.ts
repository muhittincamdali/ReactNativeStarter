import {
  clientKey,
  normalizeAddress,
  parseClientAddress,
  UNKNOWN_CLIENT,
} from '@/server/client-address';

function requestFrom(address?: string) {
  return new Request('http://localhost/api/auth/sign-in', {
    headers: address === undefined ? {} : { 'x-client-address': address },
  });
}

describe('normalizeAddress', () => {
  it.each([
    ['203.0.113.9', '203.0.113.9'],
    [' 203.0.113.009 ', '203.0.113.9'],
    ['::ffff:203.0.113.9', '203.0.113.9'],
    ['2001:db8:85a3:12:8a2e:370:7334:1', '2001:db8:85a3:12::/64'],
    ['2001:DB8:85a3:0012::1', '2001:db8:85a3:12::/64'],
    ['2001:db8::1', '2001:db8:0:0::/64'],
    ['fe80::1%en0', 'fe80:0:0:0::/64'],
    ['::1', '0:0:0:0::/64'],
  ])('reads %s as %s', (raw, key) => {
    expect(normalizeAddress(raw)).toBe(key);
  });

  it.each(['', '256.0.0.1', '1.2.3', 'example.com', '1::2::3', '1:2:3:4:5:6:7:8:9', 'g::1'])(
    'refuses %p',
    (raw) => {
      expect(normalizeAddress(raw)).toBeNull();
    },
  );
});

describe('parseClientAddress', () => {
  it('keys an IPv6 client by its /64 and its network by its /48', () => {
    expect(parseClientAddress('2001:db8:85a3:12:8a2e:370:7334:1')).toEqual({
      client: '2001:db8:85a3:12::/64',
      network: '2001:db8:85a3::/48',
    });
  });

  it('uses an IPv4 address, mapped or not, as both client and network', () => {
    expect(parseClientAddress('::FFFF:203.0.113.9')).toEqual({
      client: '203.0.113.9',
      network: '203.0.113.9',
    });
  });

  it('refuses what is not an address', () => {
    expect(parseClientAddress('::ffff:999.0.0.1')).toBeNull();
    expect(parseClientAddress('example.com')).toBeNull();
  });
});

describe('clientKey', () => {
  it('keys addresses of one IPv6 /64 network together', () => {
    expect(clientKey(requestFrom('2001:db8:1:2::a'))).toBe(
      clientKey(requestFrom('2001:db8:1:2::b')),
    );
    expect(clientKey(requestFrom('2001:db8:1:2::a'))).not.toBe(
      clientKey(requestFrom('2001:db8:1:3::a')),
    );
  });

  it('answers the shared unknown key without a readable header', () => {
    expect(clientKey(requestFrom())).toBe(UNKNOWN_CLIENT);
    expect(clientKey(requestFrom('not an address'))).toBe(UNKNOWN_CLIENT);
    expect(clientKey(requestFrom(`${'1'.repeat(65)}`))).toBe(UNKNOWN_CLIENT);
  });
});
