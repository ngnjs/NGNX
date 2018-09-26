require('../../node_modules/ngn/ngn') // TODO: Remove this when NGN 2 is ready
require('../lib/ngnx')
require('../lib/ngnx-date')

const test = require('tap').test

test('Parse Duration', (t) => {
  let startDate = ('P5Y5M5W5DT5H5M5S')
  // let value = {
  //   years: 5,
  //   months: 5,
  //   weeks: 5,
  //   days: 5,
  //   hours: 5,
  //   minutes: 5,
  //   seconds: 5
  // }

  let expectedDate = {
    valid: true,
    years: 5,
    months: 5,
    weeks: 5,
    days: 5,
    hours: 5,
    minutes: 5,
    seconds: 5
  }

  let result = NGNX.DATE.parseDuration(startDate)

  t.ok(
    result.valid === expectedDate.valid &&
    result.years === expectedDate.years &&
    result.months === expectedDate.months &&
    result.weeks === expectedDate.weeks &&
    result.days === expectedDate.days &&
    result.hours === expectedDate.hours &&
    result.minutes === expectedDate.minutes &&
    result.seconds === expectedDate.seconds,
    'Date is returning PARSE DURATION SOURCE correctly'
  )

  t.end()
})

test('Create Duration String', (t) => {
  let year0 = 1
  let months0 = 2
  let weeks0 = 0
  let days0 = 3
  let hours0 = 5
  let minutes0 = 30
  let seconds0 = 1
  let expectedDate0 = 'P1Y2M3DT5H30M1S'
  let year1 = 10
  let months1 = 10
  let weeks1 = 0
  let days1 = 6
  let hours1 = 12
  let minutes1 = 45
  let seconds1 = 15
  let expectedDate1 = 'P10Y10M6DT12H45M15S'
  let year2 = 0
  let months2 = 0
  let weeks2 = 20
  let days2 = 0
  let hours2 = 0
  let minutes2 = 0
  let seconds2 = 0
  let expectedDate2 = 'P20W'
  let year3 = 10
  let months3 = 10
  let weeks3 = 1
  let days3 = 0
  let hours3 = 12
  let minutes3 = 45
  let seconds3 = 15
  let expectedDate3 = 'P10Y10M7DT12H45M15S'

  t.ok(NGNX.DATE.createDurationString(year0, months0, weeks0, days0, hours0, minutes0, seconds0) === expectedDate0, 'Date is returning standard DURATION STRING correctly')
  t.ok(NGNX.DATE.createDurationString(year1, months1, weeks1, days1, hours1, minutes1, seconds1) === expectedDate1, 'Date is returning complete DURATION STRING correctly')
  t.ok(NGNX.DATE.createDurationString(year2, months2, weeks2, days2, hours2, minutes2, seconds2) === expectedDate2, 'Date is returning week DURATION STRING correctly')
  t.ok(NGNX.DATE.createDurationString(year3, months3, weeks3, days3, hours3, minutes3, seconds3) === expectedDate3, 'Date is returning full DURATION STRING correctly')

  t.end()
})
