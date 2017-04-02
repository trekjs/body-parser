import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('with valid form body should parse', async t => {
  const app = new Engine()

  app.use(bodyParser.urlencoded())

  app.use(({ req, res }) => {
    res.body = req.body
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'POST',
    json: true,
    form: 'a[b]=1&a[c]=2'
  })
  t.deepEqual(res, { a: { b: '1', c: '2' } })
})
