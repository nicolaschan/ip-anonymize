# ip-anonymize
[![Build Status](https://travis-ci.org/nicolaschan/ip-anonymize.svg?branch=master)](https://travis-ci.org/nicolaschan/ip-anonymize)
[![codecov](https://codecov.io/gh/nicolaschan/ip-anonymize/branch/master/graph/badge.svg)](https://codecov.io/gh/nicolaschan/ip-anonymize)
[![dependencies Status](https://david-dm.org/nicolaschan/ip-anonymize/status.svg)](https://david-dm.org/nicolaschan/ip-anonymize)
[![npm](https://img.shields.io/npm/dw/ip-anonymize.svg)](https://www.npmjs.com/package/ip-anonymize)
[![npm](https://img.shields.io/npm/v/ip-anonymize.svg)](https://www.npmjs.com/package/ip-anonymize)

Truncate IPv4 and IPv6 address binary and format back as an IP address.
- Supports IPv4
- Supports IPv6
  - Supports `x:x:x:x:x:x:x:x` format
  - Supports `x:x:x:x:x:x:d.d.d.d` format
  - Automatically compresses zeros optimally
- Choose number of bits to keep

```js
anonymize('192.168.42.1') // -> '192.168.42.0'
anonymize('192.168.42.1', 16) // -> '192.168.0.0'
anonymize('::ffff:192.168.42.1', 16) // -> '::ffff:192.168.0.0'
anonymize('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', 16, 16) // -> 'ffff::'
```

This package converts an IP address to binary and keeps a specified number of bits on the left while setting the remaining bits to zero. It then converts the binary back into an IP address string and returns it. For example, if the binary was `10101010` and we wanted to keep the first four bits (4-bit mask), the binary would become `10100000`.

**Note:**
Although this technique adds some uncertainty about the actual IP address, using this package is not sufficient to anonymize users in all cases, such as if the traffic from one user comes from one large IP block or if other information is stored along with the truncated IP address. This package is meant to simply help with truncating and formatting IP addresses and makes no claim that this technique is the best choice for any particular use case. Take extra care when storing IP addresses along with other potentially identifying information.

## Getting Started
```bash
$ npm install ip-anonymize --save # Using npm
$ yarn add ip-anonymize # OR use yarn
```

## Usage
```js
const anonymize = require('ip-anonymize')

const ipv4 = '192.168.1.16'
anonymize(ipv4) // '192.168.1.0'

// Use 16-bit mask
anonymize(ipv4, 8) // '192.0.0.0'

const ipv6 = 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'
anonymize(ipv6) // 'ffff:ff00::'

// Use 16-bit mask (first number is for IPv4, second for IPv6)
anonymize(ipv6, 16, 16) // 'ffff::'

// IPv4-compatible IPv6 and IPv4-mapped IPv6 use the IPv4 mask on the IPv4 part
const ipv4Compatible = '::192.168.0.1'
anonymize(ipv4Compatible, 16, 16) // '::192.168.0.0'
const ipv4Mapped = '::ffff:192.168.0.1'
anonymize(ipv4Mapped, 16, 16) // '::ffff:192.168.0.0'

// Returns null if IP address is invalid
anonymize('not an ip', 16, 16) // null
```

## API Documentation
```js
const anonymize = require('ip-anonymize')
anonymize(ip [, v4MaskLength, v6MaskLength])
```
- `ip`: `String`, The IP address to anonymize
- `v4MaskLength`: `Number`, Number of bits to keep at the beginning of an IPv4 address or IPv4 part of IPv4-compatible/mapped IPv6 address (default: `24`)
- `v6MaskLength`: `Number`, Number of bits to keep at the beginning of an IPv6 address (default: `24`)

Returns `null` if the IP address is invalid.

## References
1. IPv6 representation: [RFC3513](https://tools.ietf.org/html/rfc3513#section-2.2)
2. [IPv6 validator](https://www.helpsystems.com/intermapper/ipv6-test-address-validation)
3. [IPv4-compatible and IPv4-mapped IPv6 addresses](https://web.archive.org/web/20181019071947/http://www.tcpipguide.com/free/t_IPv6IPv4AddressEmbedding-2.htm)
