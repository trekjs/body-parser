'use strict'

const get = require('raw-body')
const inflate = require('inflation')

module.exports = raw

const defaults = {
  limit: '1mb',
  encoding: null,
  verify: false,
  type: 'application/octet-stream',
  detect: false
}

function raw (options) {
  options = Object.assign({}, defaults, options)

  const { limit, encoding, verify, type, detect } = options

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function')
  }

  if (detect !== false && typeof detect !== 'function') {
    throw new TypeError('option detect must be function')
  }

  return function parse ({ req, res }) {
    if ((detect && detect(req)) || req.is(type)) {
      const contentEncoding = req.get('content-encoding') || 'identity'
      let length = req.get('content-length')
      if (length && contentEncoding === 'identity') length = ~~length

      return get(
        inflate(req.raw, { encoding: contentEncoding }),
        { limit, length, encoding }
      )
        .then(body => {
          if (verify) verify(req, res, body, encoding)
          req.body = body
        })
        .catch(err => {
          if ('entity.too.large' === err.type) {
            err.message = `Body exceeded ${limit} limit`
          }
          throw err
        })
    }
  }
}

Reflect.defineProperty(raw, 'defaults', {
  configurable: true,
  enumerable: true,
  get: () => defaults
})
