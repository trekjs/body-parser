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
    limit: '1mb',
    encoding: 'utf-8',
    verify: false,
    type: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report'
    ],
    detect: false,
    strict: true,
    reviver: undefined
  }
  ```

* `.text(options)`

  ```js
  {
    limit: '1mb',
    encoding: 'utf-8',
    verify: false,
    type: 'text/plain',
    detect: false
  }
  ```

* `.raw(options)`

  ```js
  {
    limit: '1mb',
    encoding: null,
    verify: false,
    type: 'application/octet-stream',
    detect: false
  }
  ```

* `.urlencoded(options)`

  ```js
  {
    limit: '56k',
    encoding: 'utf-8',
    verify: false,
    type: 'application/x-www-form-urlencoded',
    detect: false,
    parse
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
