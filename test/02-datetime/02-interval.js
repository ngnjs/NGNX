require('../../node_modules/ngn/ngn') // TODO: Remove this when NGN 2 is ready
require('../lib/ngnx')
require('../lib/ngnx-date')

var test = require('tap').test

// Interval: R3/2018-03-01T15:00:00Z/P1Y2M3DT5H30M1S
// repeat 3 times starting on 03/01/2018 at 3pm UTC and find P1Y2M3DT5H30M1S 3 times
// no number after 'R' means repeat with out stop

test('Interval Duration (<duration>)', function (t) {
  var TestInterval = 'P1Y2M10DT2H30M'
  var Interval = new NGNX.DATE.Interval(TestInterval)
  var data = Interval.JSON

  t.ok(!data.valid, 'Duration alone is considered an invalid interval.')
  t.ok(Interval.toString() === TestInterval, 'Basic interval input source is the same as the output.')
  t.ok(!data.repeating, 'Basic interval is not classified as repeating.')
  t.ok(data.repetitionCount === 0, 'Basic interval repetition count is zero.')
  t.ok(Interval.order === 'DESC', 'Recognized default descending order pattern.')
  t.ok(
    data.years === 1 &&
    data.months === 2 &&
    data.weeks === 0 &&
    data.days === 10 &&
    data.hours === 2 &&
    data.minutes === 30 &&
    data.seconds === 0 &&
    data.timezone === 'Z' &&
    data.duration === TestInterval.split('/').shift() &&
    data.end === null &&
    data.start === null, 'Duration elements are extracted correctly.'
  )

  t.end()
})

test('Start and End (<start/<end>)', function (t) {
  var TestInterval = '2007-03-01T13:00:00Z/2008-05-11T15:30:00Z'
  var Interval = new NGNX.DATE.Interval(TestInterval)
  var data = Interval.JSON

  t.ok(data.valid, 'Two dates are identified as a valid interval.')
  t.ok(Interval.toString() === TestInterval, 'Basic interval input source is the same as the output.')
  t.ok(!data.repeating, 'Basic interval is not classified as repeating.')
  t.ok(data.repetitionCount === 0, 'Basic interval repetition count is zero.')

  t.end()
})

test('Start and Duration (<start>/<duration>)', function (t) {
  var TestInterval = '2007-03-01T13:00:00Z/P1Y2M10DT2H30M'
  var Interval = new NGNX.DATE.Interval(TestInterval)
  var data = Interval.JSON

  t.ok(data.valid, 'Date and duration are considered a valid interval.')
  t.ok(Interval.toString() === TestInterval, 'Basic interval input source is the same as the output.')
  t.ok(!data.repeating, 'Basic interval is not classified as repeating.')
  t.ok(data.repetitionCount === 0, 'Basic interval repetition count is zero.')
  t.ok(Interval.order === 'ASC', 'Recognized ascending pattern.')
  t.ok(
    data.years === 1 &&
    data.months === 2 &&
    data.weeks === 0 &&
    data.days === 10 &&
    data.hours === 2 &&
    data.minutes === 30 &&
    data.seconds === 0 &&
    data.timezone === 'Z' &&
    data.duration === TestInterval.split('/').pop() &&
    data.start.getTime() === new Date(TestInterval.split('/').shift()).getTime() &&
    data.end === null, 'Duration elements are extracted correctly.'
  )

  t.end()
})

test('Duration and End (<duration>/<end>)', function (t) {
  var TestInterval = 'P1Y2M10DT2H30M/2008-05-11T15:30:00Z'
  var Interval = new NGNX.DATE.Interval(TestInterval)
  var data = Interval.JSON

  t.ok(data.valid, 'Date and duration are considered a valid interval.')
  t.ok(Interval.toString() === TestInterval, 'Basic interval input source is the same as the output.')
  t.ok(!data.repeating, 'Basic interval is not classified as repeating.')
  t.ok(data.repetitionCount === 0, 'Basic interval repetition count is zero.')
  t.ok(Interval.order === 'DESC', 'Recognized descending pattern.')
  t.ok(
    data.years === 1 &&
    data.months === 2 &&
    data.weeks === 0 &&
    data.days === 10 &&
    data.hours === 2 &&
    data.minutes === 30 &&
    data.seconds === 0 &&
    data.timezone === 'Z' &&
    data.duration === TestInterval.split('/').shift() &&
    data.end.getTime() === new Date(TestInterval.split('/').pop()).getTime() &&
    data.start === null, 'Duration elements are extracted correctly.'
  )

  t.end()
})

// TODO: Add more abbreviation tests (from list below)
// 2007-12-14T13:30/HH:MM:SS
// 2007-12-14T13:30/HH:MM
// 2007-12-14T13:30/HH
test('Abbreviated Interval Formatting', function (t) {
  var TestInterval = '2007-12-14T13:30/15:30'
  var Interval = new NGNX.DATE.Interval(TestInterval)
  var data = Interval.JSON

  t.ok(
    data.end.getFullYear() === 2007 &&
    data.end.getUTCMonth() === 11 &&
    data.end.getUTCDate() === 14 &&
    data.end.getUTCHours() === 15 &&
    data.end.getUTCMinutes() === 30
    , 'Duration elements are extracted correctly.'
  )

  t.end()
})

test('Parse Repeating Interval (Defined Repetitions)', function (t) {
  var value = 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  var expected = {
    source: value,
    period: 'P1Y2M10DT2H30M',
    valid: true,
    repetitionCount: 5,
    years: 1,
    months: 2,
    weeks: 0,
    days: 10,
    hours: 2,
    minutes: 30,
    seconds: 0,
    start: new Date('2008-03-01T13:00:00.000Z'),
    end: null,
    lastPeriod: new Date('2014-02-22T01:30:00Z'),
    intervals: []
  }

  // Origin: 2008-03-01T13:00:00
  // Period 1: 2009-05-11T15:30:00
  // Period 2: 2010-07-21T18:00:00
  // Period 3: 2011-10-01T20:30:00
  // Period 4: 2012-12-11T23:00:00
  // Period 5: 2014-02-22T01:30:00

  var result = NGNX.DATE.parseInterval(value, false)

  t.ok(
    result.repeating === true &&
    result.source === expected.source &&
    result.duration === expected.period &&
    result.valid === expected.valid &&
    result.years === expected.years &&
    result.months === expected.months &&
    result.weeks === expected.weeks &&
    result.days === expected.days &&
    result.hours === expected.hours &&
    result.minutes === expected.minutes &&
    result.seconds === expected.seconds &&
    result.start.getTime() === expected.start.getTime() &&
    // result.lastPeriod.getTime() === expected.lastPeriod.getTime() &&
    result.repetitionCount === expected.repetitionCount,
    'Parse a repeating interval with a bounded end.'
  )

  t.end()
})

test('Parse Repeating Interval (Infinite Repetitions)', function (t) {
  var value = 'R/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  var expected = {
    source: value,
    duration: 'P1Y2M10DT2H30M',
    valid: true,
    repetitionCount: -1,
    years: 1,
    months: 2,
    weeks: 0,
    days: 10,
    hours: 2,
    minutes: 30,
    seconds: 0,
    start: new Date('2008-03-01T13:00:00.000Z'),
    end: null,
    intervals: []
  }

  // Origin: 2008-03-01T13:00:00
  // Period 1: 2009-05-11T15:30:00
  // Period 2: 2010-07-21T18:00:00
  // Period 3: 2011-10-01T20:30:00
  // Period 4: 2012-12-11T23:00:00
  // Period 5: 2014-02-22T01:30:00

  var result = NGNX.DATE.parseInterval(value)

  t.ok(
    result.source === expected.source &&
    result.duration === expected.duration &&
    result.valid === expected.valid &&
    result.years === expected.years &&
    result.months === expected.months &&
    result.weeks === expected.weeks &&
    result.days === expected.days &&
    result.hours === expected.hours &&
    result.minutes === expected.minutes &&
    result.seconds === expected.seconds &&
    result.start.getTime() === expected.start.getTime() &&
    result.end === null &&
    result.repetitionCount === expected.repetitionCount,
    'Parse an infinitely repeating interval.'
  )

  // TODO: check for syntax
  t.end()
})

test('Create Repeating Interval String', function (t) {
  var startDate0 = new Date('2018-01-01T00:00:00.000Z')
  var interval0 = 3
  var year0 = 1
  var months0 = 2
  var weeks0 = 0
  var days0 = 3
  var hours0 = 5
  var minutes0 = 30
  var seconds0 = 1
  var expectedDate0 = 'R3/2018-01-01T00:00:00.000Z/P1Y2M3DT5H30M1S'
  var startDate1 = new Date('2018-02-15T20:15:30.000Z')
  var interval1 = 0
  var year1 = 2
  var months1 = 4
  var weeks1 = 0
  var days1 = 8
  var hours1 = 5
  var minutes1 = 46
  var seconds1 = 45
  var expectedDate1 = 'R0/2018-02-15T20:15:30.000Z/P2Y4M8DT5H46M45S'
  var startDate2 = new Date('2019-02-28T20:15:30.000Z')
  var interval2 = 5
  var year2 = 0
  var months2 = 0
  var weeks2 = 20
  var days2 = 0
  var hours2 = 0
  var minutes2 = 0
  var seconds2 = 0
  var expectedDate2 = 'R5/2019-02-28T20:15:30.000Z/P20W'
  var startDate3 = new Date('2018-02-15T20:15:30.000Z')
  var interval3 = 10
  var year3 = 10
  var months3 = 10
  var weeks3 = 1
  var days3 = 0
  var hours3 = 12
  var minutes3 = 45
  var seconds3 = 15
  var expectedDate3 = 'R10/2018-02-15T20:15:30.000Z/P10Y10M7DT12H45M15S'

  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate0, interval0, year0, months0, weeks0, days0, hours0, minutes0, seconds0) === expectedDate0, 'Defined interval respected.')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate1, interval1, year1, months1, weeks1, days1, hours1, minutes1, seconds1) === expectedDate1, 'Zero value interval recognized as ifinite.')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate2, interval2, year2, months2, weeks2, days2, hours2, minutes2, seconds2) === expectedDate2, 'Recognizes repeating week format.')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate3, interval3, year3, months3, weeks3, days3, hours3, minutes3, seconds3) === expectedDate3, 'Standard repeating interval understood.')

  t.end()
})

test('Repeating Interval Last Date', function (t) {
  var TestInterval = 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  // Origin: 2008-03-01T13:00:00
  // Period 1: 2009-05-11T15:30:00
  // Period 2: 2010-07-21T18:00:00
  // Period 3: 2011-10-01T20:30:00
  // Period 4: 2012-12-11T23:00:00
  // Period 5: 2014-02-22T01:30:00

  var interval = new NGNX.DATE.Interval(TestInterval)
  t.ok(interval.lastDate.getTime() === (new Date('2014-02-22T01:30:00Z')).getTime(), 'Last date of a bounded repeating interval is correct.')

  TestInterval = 'R/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  interval = new NGNX.DATE.Interval(TestInterval)
  t.ok(interval.lastDate === null, 'Last date of an unbounded repeating interval is null.')

  t.end()
})
