import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('should default to empty string', async t => {
  const app = new Engine()

  app.use(bodyParser())

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({ uri, method: 'post' })
  t.is(res, '')
})

test('should parse JSON', async t => {
  const app = new Engine()

  app.use(bodyParser())

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

test('should parse x-www-form-urlencoded', async t => {
  const app = new Engine()

  app.use(bodyParser())

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'post',
    json: true,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      user: 'tobi'
    }
  })
  t.deepEqual(res, { user: 'tobi' })
})
