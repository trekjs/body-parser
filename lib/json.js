'use strict'

const make = require('./make')

// Allowed whitespace is defined in RFC 7159
// http://www.rfc-editor.org/rfc/rfc7159.txt
/* eslint no-control-regex: 0 */
const STRICT_JSON_REG = /^[\x20\x09\x0a\x0d]*(\[|\{)/

const defaults = {
  detect: false,
  encoding: 'utf8',
  limit: '1mb',
  parse: JSON.parse,
  reviver: undefined,
  strict: true,
  type: [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report'
  ],
  next(raw, { parse, reviver, strict }) {
    const empty = raw.length === 0
    if (strict) {
      if (empty) return {}
      if (!STRICT_JSON_REG.test(raw)) {
        const err = new Error('Invalid JSON, only supports object and array')
        err.status = 400
        throw err
      }
    }
    if (empty) return raw
    return parse(raw, reviver)
  }
}

module.exports = make(defaults)
