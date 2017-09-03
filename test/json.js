import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('should parse JSON', async t => {
  const app = new Engine()
  const parse = bodyParser.json()

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'post',
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: {
      user: 'tobi'
    }
  })
  t.deepEqual(res, { user: 'tobi' })
})

test('should fail gracefully', async t => {
  const app = new Engine()
  const parse = bodyParser.json()

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  app.on('error', err => {
    t.true(err !== null)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'post',
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: '{"user"',
    simple: false,
    resolveWithFullResponse: true
  })

  t.is(res.statusCode, 400)
  t.true(/Invalid JSON/.test(res.body))
})

test('should handle Content-Length: 0', async t => {
  const app = new Engine()
  const parse = bodyParser.json()

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'content-length': '0'
    }
  })

  t.is(res, '{}')
})

test('should 400 on malformed JSON', async t => {
  const app = new Engine()
  const parse = bodyParser.json()

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  app.on('error', err => {
    t.true(err !== null)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    json: true,
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: '{:',
    simple: false,
    resolveWithFullResponse: true
  })

  t.is(res.statusCode, 400)
  t.true(/Invalid JSON/.test(res.body))
})

test('should 400 when invalid content-length', async t => {
  const app = new Engine()
  const parse = bodyParser.json()

  app.use(({ req }, next) => {
    req.headers['content-length'] = 20 // Bad length
    return next()
  })

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  app.on('error', err => {
    t.true(err !== null)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    json: true,
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: '{"str":',
    simple: false,
    resolveWithFullResponse: true
  })

  t.is(res.statusCode, 400)
  t.true(/content length/.test(res.body))
})

test('should json body reach the limit size', async t => {
  const app = new Engine()
  const parse = bodyParser.json({
    limit: 10
  })

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
  })

  app.on('error', err => {
    t.true(err !== null)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    json: true,
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: '{"foo": "bar"}',
    simple: false,
    resolveWithFullResponse: true
  })

  t.is(res.statusCode, 413)
  t.true(/request entity too large/.test(res.body))
})

test('should return raw when empty and not strict', async t => {
  const app = new Engine()
  const parse = bodyParser.json({
    strict: false
  })

  app.use(async (ctx, next) => {
    ctx.req.body = await parse(ctx.req)
    return next()
  })

  app.use(({ req, res }) => {
    res.body = req.body
    t.is(res.body, '')
  })

  app.on('error', err => {
    t.true(err !== null)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    json: true,
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: undefined,
    simple: false,
    resolveWithFullResponse: true
  })

  t.is(res.statusCode, 200)
  t.is(res.headers['content-length'], '0')
})
