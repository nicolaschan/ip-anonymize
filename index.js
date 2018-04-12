var isIPv4 = function (ipString) {
  if (!ipString.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
    return false
  }
  var octets = ipString.split('.')
  for (let octet of octets) {
    var number = Number(octet)
    if (number > 255) {
      return false
    }
  }
  return true
}

var isIPv6 = function (ipString, chunks = 8) {
  ipString = ipString.toLowerCase()
  if (ipString === '::') {
    return true
  }
  if (!ipString.match(/^([0-9a-f]{0,4}\:){2,7}[0-9a-f]{1,4}$/)) {
    return false
  }

  // No more than one double colon
  if (ipString.split('::').length > 2) {
    return false
  }

  // If no double colon, then exactly `chunks` chunks
  if (ipString.split('::').length === 1) {
    if (ipString.split(':').length !== chunks) {
      return false
    }
  }

  if (ipString.split('::').length === 2) {
    var [left, right] = ipString.split('::')
    var left = left.split(':')
    var right = right.split(':')
    for (let i = 0; i < right.length - 1; i++) {
      if (right[i] === '') {
        return false
      }
    }
  }

  return true
}

var isIPv6_4 = function (ipString) {
  var parts = ipString.split(':')
  var v6 = parts.slice(0, parts.length - 1).join(':')
  var v4 = parts[parts.length - 1]
  return isIPv6(v6, 6) && isIPv4(v4)
}

var ipType = function (ipString) {
  if (isIPv4(ipString)) {
    return 'IPv4'
  }
  if (isIPv6(ipString)) {
    return 'IPv6'
  }
  if (isIPv6_4(ipString)) {
    return 'IPv6_4'
  }
  return 'None'
}

var padRight = function (str, length, char = '0') {
  while (str.length < length) {
    str += char
  }
  return str
}

var padLeft = function (str, length, char = '0') {
  while (str.length < length) {
    str = char + str
  }
  return str
}

var split = function (str, length) {
  var chunks = []
  while (str.length > 0) {
    var chunk = str.substring(0, length)
    chunks.push(chunk)
    str = str.substring(length)
  }
  return chunks
}

var toBinary = function (n) {
  return Number(n).toString(2)
}

var fromBinary = function (binaryString) {
  return parseInt(binaryString, 2)
}

var binaryIPv4 = function (ipString) {
  var octetStrings = ipString.split('.')
  return octetStrings.map(str => padLeft(toBinary(str), 8)).join('')
}

var toHex = function (n) {
  return n.toString(16)
}

var binaryIPv6 = function (ipString) {
  var [left, right] = ipString.split('::')

  left = left.split(':')
  if (right !== undefined) {
    right = right.split(':')
  } else {
    right = []
  }

  while ((left.length + right.length) < 8) {
    left.push('0')
  }
  var chunkStrings = left.concat(right)

  for (let i = 0; i < chunkStrings.length; i++) {
    if (chunkStrings[i].length === 0) {
      chunkStrings[i] = '0'
    }
  }

  var chunks = chunkStrings.map(str => parseInt(str, 16))

  var binaryChunks = chunks.map(n => padLeft(toBinary(n), 16))
  return binaryChunks.join('')
}

var binaryIPv6_4 = function (ipString) {
  var parts = ipString.split(':')
  var v6 = parts.slice(0, parts.length - 1).join(':')
  var v4 = parts[parts.length - 1]

  var [left, right] = v6.split('::')
  left = left.split(':')
  if (right !== undefined) {
    right = right.split(':')
  } else {
    right = []
  }

  while ((left.length + right.length) < 6) {
    left.push('0')
  }
  var chunkStrings = left.concat(right)

  for (let i = 0; i < chunkStrings.length; i++) {
    if (chunkStrings[i].length === 0) {
      chunkStrings[i] = '0'
    }
  }

  var chunks = chunkStrings.map(str => parseInt(str, 16))

  var binaryChunks = chunks.map(n => padLeft(toBinary(n), 16))
  return binaryChunks.join('') + binaryIPv4(v4)
}

var fromBinaryIPv4 = function (binaryString) {
  var octets = split(binaryString, 8)
  return octets.map(fromBinary).join('.')
}

var compressIPv6 = function (ipString) {
  var chunks = ipString.split(':')

  var bestRunLength = 0
  var bestRunStart = null

  var currentlyRun = false
  var runLength = 0
  var runStart = null

  for (let i = 0; i < chunks.length; i++) {
    if (currentlyRun) {
      if (chunks[i] === '0') {
        runLength++
      } else {
        if (runLength > bestRunLength) {
          bestRunLength = runLength
          bestRunStart = runStart
        }
        currentlyRun = false
        runLength = 0
        runStart = null
      }
    } else {
      if (chunks[i] === '0') {
        currentlyRun = true
        runLength = 1
        runStart = i
      }
    }
  }
  if (runStart !== null && runLength > bestRunLength) {
    bestRunLength = runLength
    bestRunStart = runStart
  }

  var left = chunks.slice(0, bestRunStart).join(':')
  var right = chunks.slice(bestRunStart + bestRunLength).join(':')
  var result = left + '::' + right
  return result
}

var fromBinaryIPv6 = function (binaryString) {
  var chunks = split(binaryString, 16)
  var hexChunks = chunks.map(fromBinary).map(toHex)
  var compressedChunks = compressIPv6(hexChunks.join(':'))
  return compressedChunks
}

var fromBinaryIPv6_4 = function (binaryString) {
  var v6 = binaryString.substring(0, 96)
  var v4 = binaryString.substring(96)

  var left = fromBinaryIPv6(v6)
  var right = fromBinaryIPv4(v4)

  var compressedChunks = left
  if (compressedChunks[compressedChunks.length - 1] !== ':') {
    compressedChunks += ':'
  }
  return compressedChunks + right
}

var anonymizeIPv4 = function (ipString, maskLength = 24) {
  var binary = binaryIPv4(ipString)
  var segment = binary.substring(0, maskLength)
  var anonymizedBinary = padRight(segment, 32)
  return fromBinaryIPv4(anonymizedBinary)
}

var anonymizeIPv6 = function (ipString, maskLength = 24) {
  var binary = binaryIPv6(ipString)
  var segment = binary.substring(0, maskLength)
  var anonymizedBinary = padRight(segment, 128)
  return fromBinaryIPv6(anonymizedBinary)
}

var anonymizeIPv6_4 = function (ipString, maskLength = 24) {
  var binary = binaryIPv6_4(ipString)
  var segment = binary.substring(0, maskLength)
  var anonymizedBinary = padRight(segment, 128)
  return fromBinaryIPv6_4(anonymizedBinary)
}

var anonymizeIP = function (ipString, v4MaskLength, v6MaskLength) {
  if (typeof ipString !== 'string') {
    return null
  }
  ipString = ipString.trim().toLowerCase()

  var type = ipType(ipString)
  if (type === 'IPv4') {
    return anonymizeIPv4(ipString, v4MaskLength)
  }
  if (type === 'IPv6') {
    return anonymizeIPv6(ipString, v6MaskLength)
  }
  if (type === 'IPv6_4') {
    return anonymizeIPv6_4(ipString, v6MaskLength)
  }
  return null
}

module.exports = anonymizeIP