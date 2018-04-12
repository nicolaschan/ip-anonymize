/* global describe, it */

const anonymize = require('../index.js')

const assert = require('assert')
describe('AnonymizeTest', function () {
  describe('#anonymize()', function () {
    it('should return null when input is undefined', function () {
      assert.equal(anonymize(), null)
    })
    it('should return null when input is not a string', function () {
      assert.equal(anonymize({}), null)
      assert.equal(anonymize(8), null)
      assert.equal(anonymize(['hello']), null)
    })
    it('should return null when input string is not a valid IP', function () {
      assert.equal(anonymize('8'), null)
      assert.equal(anonymize('148'), null)
      assert.equal(anonymize('0.0.0.0.0'), null)
      assert.equal(anonymize('0.0.0.0e'), null)
      assert.equal(anonymize('0.256.0.0'), null)
      assert.equal(anonymize('::1:'), null)
      assert.equal(anonymize('::1::2'), null)
      assert.equal(anonymize('ff:ff:ff:ff:ff:ff:ff'), null)
      assert.equal(anonymize('ff:ff:ff:ff:ff:ff:ff:ff:ff'), null)
      assert.equal(anonymize('ff:::ff'), null)
      assert.equal(anonymize('ff:::f:f'), null)
      assert.equal(anonymize('::ff::192.168.0.1'), null)
      assert.equal(anonymize('a::b:0:0:0:0:0:f'), null)
    })

    it('should anonymize IPv4 correctly (default 24)', function () {
      assert.equal(anonymize('192.168.0.1'), '192.168.0.0')
      assert.equal(anonymize('192.168.0.132'), '192.168.0.0')
      assert.equal(anonymize('1.1.1.1'), '1.1.1.0')
      assert.equal(anonymize('0.0.0.0'), '0.0.0.0')
      assert.equal(anonymize('255.255.255.255'), '255.255.255.0')
      assert.equal(anonymize('172.0.0.1'), '172.0.0.0')
    })

    it('should anonymize IPv6 correctly (default 24)', function () {
      assert.equal(anonymize('::'), '::')
      assert.equal(anonymize('::1'), '::')
      assert.equal(anonymize('0:0:0:0:0:0:0:0'), '::')
      assert.equal(anonymize('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'), 'ffff:ff00::')
      assert.equal(anonymize('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', 16, 16), 'ffff::')
    })

    it('should anonymize IPv6_4 correctly (default 24)', function () {
      assert.equal(anonymize('0:0:0:0:0:0:192.168.0.1'), '::0.0.0.0')
      assert.equal(anonymize('ff::0:0:192.168.0.1'), 'ff::0.0.0.0')
      assert.equal(anonymize('::ff:0:192.168.0.1'), '::0.0.0.0')
    })

    it('should anonymize IPv4 correctly preserving all bits', function () {
      assert.equal(anonymize('172.0.0.1', 32), '172.0.0.1')
      assert.equal(anonymize('0.0.0.0', 32), '0.0.0.0')
      assert.equal(anonymize('192.168.0.1', 32), '192.168.0.1')
      assert.equal(anonymize('10.0.1.100', 32), '10.0.1.100')
    })
    it('should anonymize IPv6 correctly preserving all bits', function () {
      assert.equal(anonymize('ffff::ffff', 128, 128), 'ffff::ffff')
      assert.equal(anonymize('a:b:c:d:e:f:a:b', 128, 128), 'a:b:c:d:e:f:a:b')
      assert.equal(anonymize('0:b:c:d:e:f:a:b', 128, 128), '0:b:c:d:e:f:a:b')
      assert.equal(anonymize('0:0:c:d:e:f:a:b', 128, 128), '::c:d:e:f:a:b')
      assert.equal(anonymize('ffff::ff:ff', 128, 128), 'ffff::ff:ff')
      assert.equal(anonymize('::ff:0', 128, 128), '::ff:0')
      assert.equal(anonymize('0:0:ff:0::ff:0', 128, 128), '0:0:ff::ff:0')
      assert.equal(anonymize('0::ff:0:0:ff:0', 128, 128), '::ff:0:0:ff:0')
      assert.equal(anonymize('f:f::', 128, 128), 'f:f::')
      assert.equal(anonymize('::f:f', 128, 128), '::f:f')
      assert.equal(anonymize('::a:b', 128, 128), '::a:b')
      assert.equal(anonymize('a::b:0:0:0:0:f', 128, 128), 'a:0:b::f')
    })
    it('should anonymize IPv6_4 correctly preserving all bits', function () {
      assert.equal(anonymize('::ff:0:192.168.0.1', 128, 128), '::ff:0:192.168.0.1')
      assert.equal(anonymize('a:b:c:d:e:f:192.168.0.1', 128, 128), 'a:b:c:d:e:f:192.168.0.1')
      assert.equal(anonymize('0:b:c:d:e:f:192.168.0.1', 128, 128), '0:b:c:d:e:f:192.168.0.1')
      assert.equal(anonymize('0:0:c:d:e:f:192.168.0.1', 128, 128), '::c:d:e:f:192.168.0.1')
      assert.equal(anonymize('f:f::192.168.0.1', 128, 128), 'f:f::192.168.0.1')
    })
  })
})
