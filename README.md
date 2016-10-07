# body-parser

Body parser for Trek.js.

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

* `bodyParser.json(options)`

* `bodyParser.text(options)`

* `bodyParser.raw(options)`

* `bodyParser.urlencoded(options)`

* `bodyParser.multipart(options)`


## Badges

[![Build Status](https://travis-ci.org/trekjs/body-parser.svg?branch=master)](https://travis-ci.org/trekjs/body-parser)
[![codecov](https://codecov.io/gh/trekjs/body-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/body-parser)
![](https://img.shields.io/badge/license-MIT-blue.svg)

---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
