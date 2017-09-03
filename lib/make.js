'use strict'

const get = require('raw-body')
const inflate = require('inflation')

module.exports = make

function make(defaults) {
  return parser

  function parser(options) {
    options = Object.assign(
      {
        transform(raw) {
          return raw
        }
      },
      defaults,
      options
    )

    const { detect, encoding, limit, type, transform } = options

    if (detect !== false && typeof detect !== 'function') {
      throw new TypeError('option detect must be function')
    }

    if (transform !== false && typeof transform !== 'function') {
      throw new TypeError('option transform must be function')
    }

    return parse

    async function parse(req) {
      if (!((detect && detect(req)) || req.is(type))) return

      const raw = await get(inflate(req.raw), {
        limit,
        length: req.length,
        encoding: req.charset || encoding
      })

      req.bodyParsed = true

      return transform(raw, options, req)
    }
  }
}
