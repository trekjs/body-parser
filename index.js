/*!
 * body-parser
 * Copyright(c) 2015-2017 Fangdun Cai
 * MIT Licensed
 */

'use strict'

module.exports = main

const defaults = {
  json: true,
  urlencoded: true
}

function main(options) {
  options = Object.assign({}, defaults, options)

  const enabled = Object.keys(options).filter(t => options[t])

  const parsers = enabled.map(type => main[type](options[type]))

  return bodyParser

  async function bodyParser({ req }, next) {
    if (undefined !== req.body) return next()

    /* eslint no-await-in-loop: 0 */
    for (const p of parsers) {
      const raw = await p(req)
      if (req.bodyParsed) {
        req.body = raw
        break
      }
    }

    return next()
  }
}

Object.defineProperties(main, {
  busboy: define(() => require('busboy')),

  defaults: define(() => defaults),

  json: define(getter('json')),

  multipart: define(getter('multipart')),

  raw: define(getter('raw')),

  text: define(getter('text')),

  urlencoded: define(getter('urlencoded'))
})

function define(get) {
  return { configurable: true, enumerable: true, get }
}

function getter(type) {
  return () => require(`./lib/${type}`)
}
