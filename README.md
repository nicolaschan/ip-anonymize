# ip-anonymize
Anonymize IP addresses, works with IPv4 and IPv6
- Supports IPv4 ✔
- Supports IPv6 ✔
  - Supports `x:x:x:x:x:x:x:x` format ✔
  - Supports `x:x:x:x:x:x:d.d.d.d` format ✔
  - Automatically compresses zeros optimally

## Usage
```js
const anonymize = require('ip-anonymize')

var ipv4 = '192.168.1.16'
anonymize(ipv4) // '192.168.1.0'

// Use 16-bit mask
anonymize(ipv4, 16) // '192.168.0.0'

var ipv6 = 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'
anonymize(ipv6) // 'ffff:ff00::'

// Use 16-bit mask (second number is for IPv6)
anonymize(ipv6, 16, 16) // 'ffff::'
```

## API Documentation
```js
const anonymize = require('ip-anonymize')

anonymize(ip [, v4MaskLength, v6MaskLength])
```
`ip`: `String`, The IP address to anonymize
`v4MaskLength`: `Number`, Number of bits to keep at the beginning of an IPv4 address (default: 24)
`v6MaskLength`: `Number`, Number of bits to keep at the beginning of an IPv6 address (default: 24)


## References
1. IPv6 representation: [RFC3513](https://tools.ietf.org/html/rfc3513#section-2.2)