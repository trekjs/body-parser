# body-parser

Body parsing middleware, supports `json` `text` `raw` `urlencoded` `multipart`.

Based on [raw-body](https://github.com/stream-utils/raw-body), [busboy](https://github.com/mscdex/busboy), [multer](https://github.com/expressjs/multer/tree/explore-new-api), [qs](https://github.com/ljharb/qs).


## Installation

```
$ npm install trek-body-parser --save
```


## Examples

```js
'use strict'

const Engine = require('trek-engine')
const bodyParser = require('..')

async function start () {
  const app = new Engine()

  app.use(bodyParser())

  app.use(({req, res}) => {
    res.body = req.body
  })

  app.on('error', (err, ctx) => {
    console.log(err)
  })

  app.run(3000)
}

start().catch(err => console.log(err))
```


## API

* `bodyParser(options)`

  `json` `urlencoded` is enabled by default.

  ```js
  {
    json: true,
    urlencoded: true,
    skip: false,
    // custom
    text: {
      ...
    },
    ...
  }
  ```

* `.json(options)`

  ```js
  {
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
    transform(raw, { parse, reviver, strict }) {
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
  ```

* `.text(options)`

  ```js
  {
    detect: false,
    encoding: 'utf8',
    limit: '1mb',
    type: 'text/plain'
  }
  ```

* `.raw(options)`

  ```js
  {
    detect: false,
    encoding: null,
    limit: '1mb',
    type: 'application/octet-stream'
  }
  ```

* `.urlencoded(options)`

  ```js
  {
    detect: false,
    encoding: 'utf8',
    limit: '56k',
    parse: qs.parse,
    type: 'application/x-www-form-urlencoded',
    transform(raw, { parse }) {
      return parse(raw)
    }
  }
  ```

* `.multipart(options)`

    Creates [multer](https://github.com/expressjs/multer/tree/explore-new-api) instance.

    - `.any()`

    - `.array(fieldname[, maxCount])`

    - `.fields(fields)`

      `fields`:
      ```js
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 8 }
      ]
      ```

    - `.none()`

    - `.single(fieldname)`

* `.busboy`


## Badges

[![Build Status](https://travis-ci.org/trekjs/body-parser.svg?branch=master)](https://travis-ci.org/trekjs/body-parser)
[![codecov](https://codecov.io/gh/trekjs/body-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/body-parser)
![](https://img.shields.io/badge/license-MIT-blue.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
