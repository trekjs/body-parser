import test from 'ava'
import make from '../lib/make'

test('should throw TypeError on options.detect', t => {
  const parser = make({
    detect: false,
    transform: false
  })
  const error = t.throws(() => {
    parser({
      detect: true
    })
  }, TypeError)

  t.is(error.message, 'option detect must be function')
})

test('should throw TypeError on options.transform', t => {
  const parser = make({
    detect: false,
    transform: false
  })
  const error = t.throws(() => {
    parser({
      transform: true
    })
  }, TypeError)

  t.is(error.message, 'option transform must be function')
})
