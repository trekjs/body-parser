'use strict'

const make = require('./make')

const defaults = {
  detect: false,
  encoding: null,
  limit: '1mb',
  type: 'application/octet-stream'
}

module.exports = make(defaults)
