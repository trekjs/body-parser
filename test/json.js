import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('should parse JSON', async t => {
  const app = new Engine()

  app.use(bodyParser.json())

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

  app.use(bodyParser.json())

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

  app.use(bodyParser.json())

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

  app.use(bodyParser.json())

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

  app.use(({ req }, next) => {
    req.headers['content-length'] = 20 // bad length
    return next()
  })

  app.use(bodyParser.json())

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
