'use strict'

const qs = require('qs')
const make = require('./make')

const defaults = {
  detect: false,
  encoding: 'utf8',
  limit: '56k',
  parse: qs.parse,
  type: 'application/x-www-form-urlencoded',
  next(raw, { parse }) {
    return parse(raw)
  }
}

module.exports = make(defaults)
