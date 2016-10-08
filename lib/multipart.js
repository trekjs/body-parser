'use strict'

const multer = require('multer')

module.exports = multipart

function multipart (options) {
  const m = multer(options)

  promisify(m, 'any')
  promisify(m, 'array')
  promisify(m, 'fields')
  promisify(m, 'none')
  promisify(m, 'single')

  return m
}

function promisify (multer, name) {
  if (!multer[name]) return

  const fn = multer[name].bind(multer)

  function handle (...args) {
    const middleware = fn(...args)

    return function upload (ctx, next) {
      return new Promise((resolve, reject) => {
        const { req, rawReq, rawRes } = ctx

        middleware(rawReq, rawRes, err => {
          if (err) return reject(err)

          if (rawReq.body) req.body = rawReq.body

          Reflect.defineProperty(req, 'file', {
            configurable: true,
            enumerable: true,
            get: () => rawReq.file
          })

          Reflect.defineProperty(req, 'files', {
            configurable: true,
            enumerable: true,
            get: () => rawReq.files
          })

          resolve(ctx)
        })
      }).then(next)
    }
  }

  Reflect.defineProperty(multer, name, {
    configurable: true,
    enumerable: true,
    get: () => handle
  })
}

Reflect.defineProperty(multipart, 'diskStorage', {
  configurable: true,
  enumerable: true,
  get: () => multer.diskStorage
})

Reflect.defineProperty(multipart, 'memoryStorage', {
  configurable: true,
  enumerable: true,
  get: () => multer.memoryStorage
})
