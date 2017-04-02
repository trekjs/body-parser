import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('with valid str should parse', async t => {
  const app = new Engine()

  app.use(bodyParser.text())

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'Hello World!'
  })
  t.is(res, 'Hello World!')
})
