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
      assert.equal(anonymize('ffff::ffff', 128, 128), 'ffff::ffff')
      assert.equal(anonymize('ffff::ff:ff', 128, 128), 'ffff::ff:ff')
      assert.equal(anonymize('::ff:0', 128, 128), '::ff:0')
      assert.equal(anonymize('0:0:ff:0::ff:0', 128, 128), '0:0:ff::ff:0')
      assert.equal(anonymize('0::ff:0:0:ff:0', 128, 128), '::ff:0:0:ff:0')
    })

    it('should anonymize IPv6_4 correctly (default 24)', function () {
      assert.equal(anonymize('0:0:0:0:0:0:192.168.0.1'), '::0.0.0.0')
      assert.equal(anonymize('ff::0:0:192.168.0.1'), 'ff::0.0.0.0')
      assert.equal(anonymize('::ff:0:192.168.0.1'), '::0.0.0.0')
      assert.equal(anonymize('::ff:0:192.168.0.1', 128, 128), '::ff:0:192.168.0.1')
    })
  })
})