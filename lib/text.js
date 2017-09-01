'use strict'

const make = require('./make')

const defaults = {
  detect: false,
  encoding: 'utf8',
  limit: '1mb',
  type: 'text/plain'
}

module.exports = make(defaults)
