import { clientAddress, parseClientAddress } from '@/server/client-address';

function requestFrom(address?: string) {
  return new Request('http://localhost/api/auth/sign-in', {
    headers: address === undefined ? {} : { 'x-client-address': address },
  });
}

describe('parseClientAddress', () => {
  it.each([
    ['203.0.113.9', '203.0.113.9'],
    [' 203.0.113.009 ', '203.0.113.9'],
    ['::ffff:203.0.113.9', '203.0.113.9'],
    ['2001:db8:85a3:12:8a2e:370:7334:1', '2001:db8:85a3:12::/64'],
    ['2001:DB8:85a3:0012::1', '2001:db8:85a3:12::/64'],
    ['2001:db8::1', '2001:db8:0:0::/64'],
    ['fe80::1%en0', 'fe80:0:0:0::/64'],
    ['::1', '0:0:0:0::/64'],
  ])('reads the client of %s as %s', (raw, key) => {
    expect(parseClientAddress(raw)?.client).toBe(key);
  });

  it.each([
    '',
    '256.0.0.1',
    '1.2.3',
    'example.com',
    '1::2::3',
    '1:2:3:4:5:6:7:8:9',
    'g::1',
    '::ffff:999.0.0.1',
  ])('refuses %p', (raw) => {
    expect(parseClientAddress(raw)).toBeNull();
  });

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
});

describe('clientAddress', () => {
  it('keys addresses of one IPv6 /64 network together', () => {
    expect(clientAddress(requestFrom('2001:db8:1:2::a'))).toEqual(
      clientAddress(requestFrom('2001:db8:1:2::b')),
    );
    expect(clientAddress(requestFrom('2001:db8:1:2::a'))?.client).not.toBe(
      clientAddress(requestFrom('2001:db8:1:3::a'))?.client,
    );
  });

  it('answers null without a readable header', () => {
    expect(clientAddress(requestFrom())).toBeNull();
    expect(clientAddress(requestFrom('not an address'))).toBeNull();
    expect(clientAddress(requestFrom(`${'1'.repeat(65)}`))).toBeNull();
  });
});
