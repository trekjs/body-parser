'use strict'

module.exports = bodyParser

const defaults = {
  json: true,
  urlencoded: true
}

function bodyParser (options) {
  options = Object.assign({}, defaults, options)

  const enabled = Object.keys(options).filter(t => options[t])

  const parsers = enabled.map(type => bodyParser[type](options[type]))

  return function parseBody (ctx, next) {
    if (undefined !== ctx.req.body) return next()
    return Promise.all(parsers.map(p => p(ctx))).then(next)
  }
}

Object.defineProperties(bodyParser, {

  defaults: {
    configurable: true,
    enumerable: true,
    get: () => defaults
  },

  json: {
    configurable: true,
    enumerable: true,
    get: getter('json')
  },

  text: {
    configurable: true,
    enumerable: true,
    get: getter('text')
  },

  urlencoded: {
    configurable: true,
    enumerable: true,
    get: getter('urlencoded')
  },

  raw: {
    configurable: true,
    enumerable: true,
    get: getter('raw')
  },

  multipart: {
    configurable: true,
    enumerable: true,
    get: getter('multipart')
  }

})

function getter (type) {
  return () => require(`./lib/${type}`)
}
