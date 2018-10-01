require('../../node_modules/ngn/ngn') // TODO: Remove this when NGN 2 is ready
require('../lib/ngnx')
require('../lib/ngnx-date')

var test = require('tap').test

test('Iterator Sanity Check', function (t) {
  t.ok(typeof NGNX.DATE.Iterator === 'function', 'NGNX.DATE.Iterator class available.')
  t.end()
})

test('Basic Date Iterator (no interval)', function (t) {
  t.fail('No tests.')

  t.end()
})

test('Basic Date Iterator (w/ interval)', function (t) {
  t.fail('No tests.')

  t.end()
})

test('Basic Date Iterator (w/ interval pattern)', function (t) {
  t.fail('No tests.')

  t.end()
})

test('Repeating Interval Iterator', function (t) {
  // var startDate = new Date('2018-01-01T00:00:00Z')
  // var startDateFull =
  // console.log(startDate, 'input')
  //
  // console.log(NGNX.DATE.createRepeatingIntervalIterator('R3/2018-01-01T00:00:00.000Z/P1Y2M3DT5H30M1S'), 'function output')
  // console.log(NGNX.DATE.createRepeatingIntervalIterator(startDate), 'function output')
  t.fail('No tests')
  t.end()
})
