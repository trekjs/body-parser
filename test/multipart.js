import fs from 'fs'
import path from 'path'
import test from 'ava'
import request from 'request-promise'
import Engine from 'trek-engine'
import bodyParser from '..'
import listen from './helpers/listen'

test('should parse multipart', async t => {
  const app = new Engine()
  const multipart = bodyParser.multipart()
  const pkg = path.join(__dirname, '../package.json')

  app.use(multipart.single('avatar'))

  app.use(({ req, res }) => {
    t.deepEqual(req.body, { user: 'tobi' })
    res.send(200, req.file.stream)
  })

  const uri = await listen(app)
  const res = await request({
    uri,
    method: 'post',
    json: true,
    formData: {
      user: 'tobi',
      avatar: fs.createReadStream(pkg)
    }
  })
  t.deepEqual(res, require(pkg))
})
