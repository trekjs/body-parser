'use strict'

const get = require('raw-body')
const inflate = require('inflation')

module.exports = parser

const defaults = {
  limit: '1mb',
  encoding: 'utf-8',
  verify: false,
  type: 'text/plain',
  detect: false
}

function parser (options) {
  options = Object.assign({}, defaults, options)

  const { limit, encoding, verify, type, detect } = options

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function')
  }

  if (detect !== false && typeof detect !== 'function') {
    throw new TypeError('option detect must be function')
  }

  return function text ({ req, res }) {
    if ((detect && detect(req)) || req.is(type)) {
      const contentEncoding = req.get('content-encoding') || 'identity'
      let length = req.get('content-length')
      if (length && contentEncoding === 'identity') length = ~~length

      return get(
        inflate(req.raw, { encoding: contentEncoding }),
        { limit, length, encoding: req.charset || encoding }
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

Reflect.defineProperty(parser, 'defaults', {
  configurable: true,
  enumerable: true,
  get: () => defaults
})
