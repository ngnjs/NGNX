require('../../node_modules/ngn/ngn') // TODO: Remove this when NGN 2 is ready
require('../lib/ngnx')
require('../lib/ngnx-date')

var test = require('tap').test

test('Millisecond', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedTime0 = new Date('2018-01-01T00:00:00.001Z')
  var expectedTimeNeg0 = new Date('2017-12-31T23:59:59.999Z')
  var expectedTime1 = new Date('2018-01-01T00:00:01.000Z')
  var expectedTimeNeg1 = new Date('2017-12-31T23:59:59.000Z')

  t.ok(NGNX.DATE.addMillisecond(startDate, 1).getTime() === expectedTime0.getTime(), 'Date is adding 1 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDateNeg, -1).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting 1 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDate, 1000).getTime() === expectedTime1.getTime(), 'Date is adding 1000 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDateNeg, -1000).getTime() === expectedTimeNeg1.getTime(), 'Date is subtracting 1000 MILLISECONDS correctly')

  t.end()
})

test('Second', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedTime = new Date('2018-01-01T00:00:01.000Z')
  var expectedTimeNeg = new Date('2017-12-31T23:59:59.000Z')
  var expectedTime0 = new Date('2018-01-01T00:01:00.000Z')
  var expectedTimeNeg0 = new Date('2017-12-31T23:59:00.000Z')

  t.ok(NGNX.DATE.addSecond(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDate, 60).getTime() === expectedTime0.getTime(), 'Date is adding SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDateNeg, -60).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting SECONDS correctly')

  t.end()
})

test('Minute', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedTime = new Date('2018-01-01T00:01:00.000Z')
  var expectedTimeNeg = new Date('2017-12-31T23:59:00.000Z')
  var expectedTime0 = new Date('2018-01-01T01:00:00.000Z')
  var expectedTimeNeg0 = new Date('2017-12-31T23:00:00.000Z')

  t.ok(NGNX.DATE.addMinute(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDate, 60).getTime() === expectedTime0.getTime(), 'Date is adding MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDateNeg, -60).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting MINUTES correctly')

  t.end()
})

test('Hour', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedTime = new Date('2018-01-01T01:00:00.000Z')
  var expectedTimeNeg = new Date('2017-12-31T23:00:00.000Z')
  var expectedTime0 = new Date('2018-01-02T00:00:00.000Z')
  var expectedTimeNeg0 = new Date('2017-12-31T00:00:00.000Z')

  t.ok(NGNX.DATE.addHour(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDate, 24).getTime() === expectedTime0.getTime(), 'Date is adding HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDateNeg, -24).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting HOURS correctly')

  t.end()
})

test('Day', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate = new Date('2018-01-02T00:00:00.000Z')
  var expectedDateNeg = new Date('2017-12-31T00:00:00.000Z')
  var expectedDate0 = new Date('2018-02-01T00:00:00.000Z')
  var expectedDateNeg0 = new Date('2017-12-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addDay(startDate, 1).getTime() === expectedDate.getTime(), 'Date is adding DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDateNeg, -1).getTime() === expectedDateNeg.getTime(), 'Date is Subtracting DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDate, 31).getTime() === expectedDate0.getTime(), 'Date is adding DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDateNeg, -31).getTime() === expectedDateNeg0.getTime(), 'Date is Subtracting DAYS correctly')

  t.end()
})

test('Week', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate = new Date('2018-01-08')
  var expectedDateNeg = new Date('2017-12-25T00:00:00.000Z')
  var expectedDate0 = new Date('2018-12-31')
  var expectedDateNeg0 = new Date('2017-01-02T00:00:00.000Z')

  t.ok(NGNX.DATE.addWeek(startDate, 1).getTime() === expectedDate.getTime(), 'Date is ADDING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDateNeg, -1).getTime() === expectedDateNeg.getTime(), 'Date is SUBTRACTING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDate, 52).getTime() === expectedDate0.getTime(), 'Date is ADDING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDateNeg, -52).getTime() === expectedDateNeg0.getTime(), 'Date is SUBTRACTING WEEKS correctly')

  t.end()
})

test('Month', function (t) {
  var startDateAddLessThanYear = new Date('2018-01-11T00:00:00.000Z')
  var startDateSubtractLessThanYear = new Date('2018-06-02T00:00:00.000Z')
  var startDateAddMoreThanYear = new Date('2018-01-02T00:00:00.000Z')
  var startDateSubtractMoreThanYear = new Date('2019-09-02T00:00:00.000Z')
  var expectedDateAddLessThanYear = new Date('2018-02-11T00:00:00.000Z')
  var expectedDateSubtractLessThanYear = new Date('2018-04-02T00:00:00.000Z')
  var expectedDateAddMoreTHanYear = new Date('2019-09-02T00:00:00.000Z')
  var expectedDateSubtractMoreThanYear = new Date('2018-01-02T00:00:00.000Z')

  t.ok(NGNX.DATE.addMonth(startDateAddLessThanYear, 1).getTime() === expectedDateAddLessThanYear.getTime(), 'Date is ADDING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateSubtractLessThanYear, -2).getTime() === expectedDateSubtractLessThanYear.getTime(), 'Date is SUBTRACTING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateAddMoreThanYear, 20).getTime() === expectedDateAddMoreTHanYear.getTime(), 'Date is ADDING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateSubtractMoreThanYear, -20).getTime() === expectedDateSubtractMoreThanYear.getTime(), 'Date is SUBTRACTING MONTHS LESS THAN A YEAR correctly')

  t.end()
})

test('Add Year', function (t) {
  // if the global var is used the test shows a start date of 2019-09-01T05:00:00.000Z
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate = new Date('2023-01-01')

  t.ok(NGNX.DATE.addYear(startDate, 5).getTime() === expectedDate.getTime(), 'Date is adding YEARS correctly')

  var startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  var expectedDateNeg = new Date('1918-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addYear(startDateNeg, -100).getTime() === expectedDateNeg.getTime(), 'Date is subtracting YEARS correctly')
  t.end()
})

function createPeriod (obj) {
  var period = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  Object.keys(obj).forEach(key => period[key] = obj[key])

  return period
}

test('Add Duration', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var periodSeconds = createPeriod({ seconds: 30 })
  var periodMinutes = createPeriod({ minutes: 30 })
  var periodHours = createPeriod({ hours: 13 })
  var periodDays = createPeriod({ days: 10 })
  var periodWeeks = createPeriod({ weeks: 2 })
  var periodMonths = createPeriod({ months: 13 })
  var periodYears = createPeriod({ years: 20 })
  var expectedDateSeconds = new Date('2018-01-01T00:00:30.000Z')
  var expectedDateMinutes = new Date('2018-01-01T00:30:00.000Z')
  var expectedDateHours = new Date('2018-01-01T13:00:00.000Z')
  var expectedDateDays = new Date('2018-01-11T00:00:00.000Z')
  var expectedDateWeeks = new Date('2018-01-15T00:00:00.000Z')
  var expectedDateMonths = new Date('2019-02-01T00:00:00.000Z')
  var expectedDateYears = new Date('2038-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addDuration(startDate, periodSeconds).getTime() === expectedDateSeconds.getTime(), 'Date is returning ADD DURATION SECONDS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodMinutes).getTime() === expectedDateMinutes.getTime(), 'Date is returning ADD DURATION MINUTES correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodHours).getTime() === expectedDateHours.getTime(), 'Date is returning ADD DURATION HOURS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodDays).getTime() === expectedDateDays.getTime(), 'Date is returning ADD DURATION DAYS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodWeeks).getTime() === expectedDateWeeks.getTime(), 'Date is returning ADD DURATION WEEKS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodMonths).getTime() === expectedDateMonths.getTime(), 'Date is returning ADD DURATION MONTHS correctly')
console.log(startDate, periodYears)
  t.ok(NGNX.DATE.addDuration(startDate, periodYears).getTime() === expectedDateYears.getTime(), 'Date is returning ADD DURATION YEARS correctly')

  t.end()
})

test('Subtract Duration', function (t) {
  var periodSeconds = createPeriod({ seconds: 30})
  var periodMinutes = createPeriod({ minutes : 30 })
  var periodHours = createPeriod({ hours : 13 })
  var periodDays = createPeriod({ days : 10 })
  var periodWeeks = createPeriod({ weeks : 2 })
  var periodMonths = createPeriod({ months : 11 })
  var periodYears = createPeriod({ years : 20 })
  var startDate = new Date('2018-02-01T00:00:00.000Z')
  var expectedDateSeconds = new Date('2018-01-31T23:59:30.000Z')
  var expectedDateMinutes = new Date('2018-01-31T23:30:00.000Z')
  var expectedDateHours = new Date('2018-01-31T11:00:00.000Z')
  var expectedDateDays = new Date('2018-01-22T00:00:00.000Z')
  var expectedDateWeeks = new Date('2018-01-18T00:00:00.000Z')
  var expectedDateMonths = new Date('2017-03-01T00:00:00.000Z')
  var expectedDateYears = new Date('1998-02-01T00:00:00.000Z')

  t.ok(NGNX.DATE.subtractDuration(startDate, periodSeconds).getTime() === expectedDateSeconds.getTime(), 'Date is returning SUBTRACTING DURATION SECONDS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodMinutes).getTime() === expectedDateMinutes.getTime(), 'Date is returning SUBTRACTING DURATION MINUTES correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodHours).getTime() === expectedDateHours.getTime(), 'Date is returning SUBTRACTING DURATION HOURS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodDays).getTime() === expectedDateDays.getTime(), 'Date is returning SUBTRACTING DURATION DAYS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodWeeks).getTime() === expectedDateWeeks.getTime(), 'Date is returning SUBTRACTING DURATION WEEKS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodMonths).getTime() === expectedDateMonths.getTime(), 'Date is returning SUBTRACTING DURATION MONTHS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodYears).getTime() === expectedDateYears.getTime(), 'Date is returning SUBTRACTING DURATION YEARS correctly')

  t.end()
})

test('Diff Milliseconds (Default)', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var endDate = new Date('2018-01-01T00:00:03.000Z')
  var expectedDate = 3000

  t.ok(NGNX.DATE.diff(startDate, endDate) === expectedDate, 'Date is returning DIFFERENCE IN MILLISECONDS correctly')
  t.end()
})

test('Diff Minutes', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var endDate = new Date('2018-01-01T00:10:00.000Z')
  var expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffMinutes(startDate, endDate) === (expectedDate.getTime()) / 60000, 'Date is returning DIFFERENCE IN MINUTES correctly')
  t.end()
})

test('Diff Hours', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var endDate = new Date('2018-01-01T01:00:00.000Z')
  var expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffHours(startDate, endDate) === (expectedDate.getTime()) / 3600000, 'Date is returning DIFFERENCE IN HOURS correctly')
  t.end()
})

test('Diff Days', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var endDate = new Date('2018-01-01T01:00:00.000Z')
  var expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffDays(startDate, endDate) === (expectedDate.getTime()) / 86400000, 'Date is returning DIFFERENCE IN DAYS correctly')
  t.end()
})

test('Diff Weeks', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var endDate = new Date('2018-01-21T00:00:00.000Z')
  var expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffWeeks(startDate, endDate) === (expectedDate.getTime()) / 604800000, 'Date is returning DIFFERENCE IN WEEKS correctly')
  t.end()
})

test('Nearest Minute', function (t) {
  var startDate0 = new Date('2018-01-01T05:58:00.000Z')
  var expectedDate0 = 0
  var startDate15 = new Date('2018-01-01T05:10:00.000Z')
  var expectedDate15 = 15
  var startDate30 = new Date('2018-01-01T05:28:00.000Z')
  var expectedDate30 = 30
  var startDate45 = new Date('2018-01-01T05:38:00.000Z')
  var expectedDate45 = 45

  t.ok(NGNX.DATE.nearestMinute(startDate0).getMinutes() === (expectedDate0), 'Date is returning NEAREST MINUTES (0) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate15).getMinutes() === (expectedDate15), 'Date is returning NEAREST MINUTES (15) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate30).getMinutes() === (expectedDate30), 'Date is returning NEAREST MINUTES (30) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate45).getMinutes() === (expectedDate45), 'Date is returning NEAREST MINUTES (45) correctly')

  t.end()
})

test('Day Name', function (t) {
  t.ok(NGNX.DATE.dayName(1) === 'Sunday', 'Identified Sunday by Day Number')
  t.ok(NGNX.DATE.dayName(2) === 'Monday', 'Identified Monday by Day Number')
  t.ok(NGNX.DATE.dayName(3) === 'Tuesday', 'Identified Tuesday by Day Number')
  t.ok(NGNX.DATE.dayName(4) === 'Wednesday', 'Identified Wednesday by Day Number')
  t.ok(NGNX.DATE.dayName(5) === 'Thursday', 'Identified Thursday by Day Number')
  t.ok(NGNX.DATE.dayName(6) === 'Friday', 'Identified Friday by Day Number')
  t.ok(NGNX.DATE.dayName(7) === 'Saturday', 'Identified Saturday by Day Number')

  var startDate0 = new Date('2018-01-07T20:00:00.000Z')
  var expectedDate0 = 'Sunday'
  var startDate1 = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate1 = 'Monday'
  var startDate2 = new Date('2018-01-02T00:00:00.000Z')
  var expectedDate2 = 'Tuesday'
  var startDate3 = new Date('2018-01-03T00:00:00.000Z')
  var expectedDate3 = 'Wednesday'
  var startDate4 = new Date('2018-01-04T00:00:00.000Z')
  var expectedDate4 = 'Thursday'
  var startDate5 = new Date('2018-01-05T00:00:00.000Z')
  var expectedDate5 = 'Friday'
  var startDate6 = new Date('2018-01-06T00:00:00.000Z')
  var expectedDate6 = 'Saturday'

  t.ok(NGNX.DATE.dayName(startDate0) === (expectedDate0), 'Date is returning NAME OF DAY FOR SUNDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate1) === (expectedDate1), 'Date is returning NAME OF DAY FOR MONDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate2) === (expectedDate2), 'Date is returning NAME OF DAY FOR TUESDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate3) === (expectedDate3), 'Date is returning NAME OF DAY FOR WEDNESDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate4) === (expectedDate4), 'Date is returning NAME OF DAY FOR THURSDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate5) === (expectedDate5), 'Date is returning NAME OF DAY FOR FRIDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate6) === (expectedDate6), 'Date is returning NAME OF DAY FOR SATURDAY correctly')

  t.end()
})

test('Month Name', function (t) {
  var startDate0 = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate0 = 'January'
  var startDate1 = new Date('2018-02-01T00:00:00.000Z')
  var expectedDate1 = 'February'
  var startDate2 = new Date('2018-03-01T00:00:00.000Z')
  var expectedDate2 = 'March'
  var startDate3 = new Date('2018-04-01T00:00:00.000Z')
  var expectedDate3 = 'April'
  var startDate4 = new Date('2018-05-01T00:00:00.000Z')
  var expectedDate4 = 'May'
  var startDate5 = new Date('2018-06-01T00:00:00.000Z')
  var expectedDate5 = 'June'
  var startDate6 = new Date('2018-07-01T00:00:00.000Z')
  var expectedDate6 = 'July'
  var startDate7 = new Date('2018-08-01T00:00:00.000Z')
  var expectedDate7 = 'August'
  var startDate8 = new Date('2018-09-01T00:00:00.000Z')
  var expectedDate8 = 'September'
  var startDate9 = new Date('2018-10-01T00:00:00.000Z')
  var expectedDate9 = 'October'
  var startDate10 = new Date('2018-11-01T00:00:00.000Z')
  var expectedDate10 = 'November'
  var startDate11 = new Date('2018-12-01T00:00:00.000Z')
  var expectedDate11 = 'December'

  t.ok(NGNX.DATE.monthName(startDate0) === (expectedDate0), 'Date is returning NAME OF MONTH FOR JANUARY correctly')
  t.ok(NGNX.DATE.monthName(startDate1) === (expectedDate1), 'Date is returning NAME OF MONTH FOR FEBRUARY correctly')
  t.ok(NGNX.DATE.monthName(startDate2) === (expectedDate2), 'Date is returning NAME OF MONTH FOR MARCH correctly')
  t.ok(NGNX.DATE.monthName(startDate3) === (expectedDate3), 'Date is returning NAME OF MONTH FOR APRIL correctly')
  t.ok(NGNX.DATE.monthName(startDate4) === (expectedDate4), 'Date is returning NAME OF MONTH FOR MAY correctly')
  t.ok(NGNX.DATE.monthName(startDate5) === (expectedDate5), 'Date is returning NAME OF MONTH FOR JUNE correctly')
  t.ok(NGNX.DATE.monthName(startDate6) === (expectedDate6), 'Date is returning NAME OF MONTH FOR JULY correctly')
  t.ok(NGNX.DATE.monthName(startDate7) === (expectedDate7), 'Date is returning NAME OF MONTH FOR AUGUST correctly')
  t.ok(NGNX.DATE.monthName(startDate8) === (expectedDate8), 'Date is returning NAME OF MONTH FOR SEPTEMBER correctly')
  t.ok(NGNX.DATE.monthName(startDate9) === (expectedDate9), 'Date is returning NAME OF MONTH FOR OCTOBER correctly')
  t.ok(NGNX.DATE.monthName(startDate10) === (expectedDate10), 'Date is returning NAME OF MONTH FOR NOVEMBER correctly')
  t.ok(NGNX.DATE.monthName(startDate11) === (expectedDate11), 'Date is returning NAME OF MONTH FOR DECEMBER correctly')

  t.end()
})

test('Date Input Format', function (t) {
  var startDate0 = new Date('2018/1/1')
  var expectedDate0 = '2018-01-01'
  var startDate1 = new Date('2018/11/1')
  var expectedDate1 = '2018-11-01'
  var startDate2 = new Date('2018/2/11')
  var expectedDate2 = '2018-02-11'

  t.ok(NGNX.DATE.dateInputFormat(startDate0) === (expectedDate0), 'Date is returning INPUT DATE FORMAT correctly')
  t.ok(NGNX.DATE.dateInputFormat(startDate1) === (expectedDate1), 'Date is returning INPUT DATE FORMAT correctly')
  t.ok(NGNX.DATE.dateInputFormat(startDate2) === (expectedDate2), 'Date is returning INPUT DATE FORMAT correctly')
  t.end()
})

test('Input Date', function (t) {
  var startDate = new Date('2018/7/20')
  var expectedDate = new Date('2018-07-20T05:00:00.000Z')

  t.ok(NGNX.DATE.inputDate(startDate).getTime() === (expectedDate).getTime(), 'Date is returning INPUT DATE correctly')
  t.end()
})

test('Today', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate = false
  var todaysDate = new Date()
  var expectedToday = true

  todaysDate.setUTCHours(0)
  todaysDate.setUTCMinutes(0)
  todaysDate.setUTCSeconds(0)
  todaysDate.setUTCMilliseconds(0)

  t.ok(NGNX.DATE.today(startDate) === (expectedDate), 'Date is returning NOT TODAY correctly')
  t.ok(NGNX.DATE.today(todaysDate) === (expectedToday), 'Date is returning TODAY correctly')

  t.end()
})

test('Intersection', function (t) {
  var firstRangeStart = new Date('2018-01-01T00:00:00.000Z')
  var firstRangeEnd = new Date('2018-03-01T00:00:00.000Z')
  var secondRangeStart = new Date('2018-02-01T00:00:00.000Z')
  var secondRangeEnd = new Date('2018-04-01T00:00:00.000Z')
  var thirdRangeStart = new Date('2018-01-15T00:00:00.000Z')
  var thirdRangeEnd = new Date('2018-01-31T00:00:00.000Z')
  var fourthRangeStart = new Date('2018-06-15T00:00:00.000Z')
  var fourthRangeEnd = new Date('2018-07-31T00:00:00.000Z')
  var firstExpectedDate = [secondRangeStart, firstRangeEnd]
  var secondExpectedDate = [thirdRangeStart, thirdRangeEnd]
  var thirdExpectedDate = []
  var firstIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, secondRangeStart, secondRangeEnd)
  var secondIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, thirdRangeStart, thirdRangeEnd)
  var thirdIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, fourthRangeStart, fourthRangeEnd)

  t.ok(firstIntersection[0].getTime() === firstExpectedDate[0].getTime() && firstIntersection[1].getTime() === firstExpectedDate[1].getTime(), 'Date is returning OVERLAP INTERSECTION correctly')
  t.ok(secondIntersection[0].getTime() === secondExpectedDate[0].getTime() && secondIntersection[1].getTime() === secondExpectedDate[1].getTime(), 'Date is returning ENCOMPASSED INTERSECTION correctly')
  t.ok(thirdIntersection[0] === thirdExpectedDate[0] && thirdIntersection[1] === thirdExpectedDate[1], 'Date is returning NO OVERLAP INTERSECTION correctly')

  t.end()
})

test('Last Moment of the Month', function (t) {
  var startDate = new Date('2018-04-15T09:45:30.999Z')
  var expectedDate = new Date('2018-04-30T23:59:59.999Z')

  t.ok(NGNX.DATE.lastOfMonth(startDate).getTime() === expectedDate.getTime(), 'Date is returning LAST MOMENT OF MONTH correctly')

  t.end()
})

test('Last Moment of the Day', function (t) {
  var startDate = new Date('2018-01-01T09:45:30.999Z')
  var expectedDate = new Date('2018-01-01T23:59:59.999Z')

  t.ok(NGNX.DATE.lastMoment(startDate).getTime() === expectedDate.getTime(), 'Date is returning LAST MOMENT OF DAY correctly')

  t.end()
})

test('First Moment of the Month', function (t) {
  var startDate = new Date('2018-01-29T09:45:30.999Z')
  var expectedDate = new Date('2018-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.firstOfMonth(startDate).getTime() === expectedDate.getTime(), 'Date is returning FIRST MOMENT OF MONTH correctly')

  t.end()
})

test('First Moment of the Day', function (t) {
  var startDate = new Date('2018-01-01T09:45:30.999Z')
  var expectedDate = new Date('2018-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.firstMoment(startDate).getTime() === expectedDate.getTime(), 'Date is returning FIRST MOMENT OF DAY correctly')

  t.end()
})

test('Convert to Military Time', function (t) {
  var startDate = ('7:45 PM')
  var expectedDate = ('19:45:00')

  t.ok(NGNX.DATE.convertStandardToMilitaryTime(startDate) === expectedDate, 'Date is returning MILITARY TIME correctly')
  t.end()
})

test('Convert to Standard Time', function (t) {
  var startDate = ('19:45')
  var expectedDate = ('07:45 PM')

  t.ok(NGNX.DATE.convertMilitaryToStandardTime(startDate) === expectedDate, 'Date is returning STANDARD TIME correctly')

  t.end()
})

test('Clean Date Format', function (t) {
  var startDate = new Date('2018-01-01T00:00:00.000Z')
  var expectedDate = '2018/01/01T00:00:00Z'

  t.ok(NGNX.DATE.cleanDateFormat(startDate, false) === (expectedDate), 'Date is returning CLEAN FORMAT correctly')
  t.end()
})

test('Clean Date String Format', function (t) {
  var startDate = new Date('01/01/18')
  var startTime = ('13:00:00')
  var expectedDate = '2018/01/01T13:00:00Z'

  t.ok(NGNX.DATE.cleanDateStringFormat(startDate, startTime) === (expectedDate), 'Date is returning CLEAN STRING FORMAT correctly')
  t.end()
})

test('Clean Time String Format', function (t) {
  var startTime = ('5:15:10')
  var expectedTime = '05:15:10'

  t.ok(NGNX.DATE.cleanTimeStringFormat(startTime) === (expectedTime), 'Date is returning CLEAN TIME STRING FORMAT correctly')
  t.end()
})

test('Set Time', function (t) {
  var startDate = new Date('2018-01-01T06:00:00.000Z')
  var startTime = ('5:15:10')
  var expectedTime = new Date('2018-01-01T11:15:10.000Z')

  t.ok(NGNX.DATE.setTime(startDate, startTime).getTime() === (expectedTime.getTime()), 'Date is returning SET TIME correctly')
  t.end()
})

test('Create Time Table', function (t) {
  var interval10 = 10
  // var interval15 = 15
  // var interval30 = 30
  // var interval60 = 60
  var format24 = 24
  var format12 = 12
  var enforceFormatTrue = true
  var enforceFormatFalse = false
  var firstTest = NGNX.DATE.createTimeTable(interval10, format12, enforceFormatTrue)
  var secondTest = NGNX.DATE.createTimeTable(interval10, format12, enforceFormatFalse)
  var thirdTest = NGNX.DATE.createTimeTable(interval10, format24, enforceFormatTrue)
  var fourthTest = NGNX.DATE.createTimeTable(interval10, format24, enforceFormatFalse)

  var expectedTime0 = ['12:00 AM', '03:20 AM', '07:30 AM', '09:40 PM', '11:50 PM']
  t.ok(firstTest[0] === expectedTime0[0] && firstTest[20] === expectedTime0[1] && firstTest[45] === expectedTime0[2] && firstTest[130] === expectedTime0[3] && firstTest[143] === expectedTime0[4], 'Date is returning 12HR LEADING 0 TIME TABLE correctly')

  var expectedTime1 = ['12:00 AM', '3:20 AM', '7:30 AM', '9:40 PM', '11:50 PM']
  t.ok(secondTest[0] === expectedTime1[0] && secondTest[20] === expectedTime1[1] && secondTest[45] === expectedTime1[2] && secondTest[130] === expectedTime1[3] && secondTest[143] === expectedTime1[4], 'Date is returning 12HR NO LEADING 0 TIME TABLE correctly')

  var expectedTime2 = ['00:00 ', '03:20', '07:30', '21:40', '23:50']
  t.ok(thirdTest[0] === expectedTime2[0] && thirdTest[20] === expectedTime2[1] && thirdTest[45] === expectedTime2[2] && thirdTest[130] === expectedTime2[3] && thirdTest[143] === expectedTime2[4], 'Date is returning 24HR LEADING 0 TIME TABLE correctly')

  var expectedTime3 = ['00:00 ', '3:20', '7:30', '21:40', '23:50']
  t.ok(fourthTest[0] === expectedTime3[0] && fourthTest[20] === expectedTime3[1] && fourthTest[45] === expectedTime3[2] && fourthTest[130] === expectedTime3[3] && thirdTest[143] === expectedTime3[4], 'Date is returning 24HR NO LEADING 0 TIME TABLE correctly')

  t.end()
})

test('Weekday', function (t) {
  var startDate0 = new Date('2018-01-01T00:00:00.000Z')
  // var expectedDay0 = NGNX.DATE.dayName(startDate0)
  var startDate1 = new Date('2018-01-02T00:00:00.000Z')
  // var expectedDay1 = NGNX.DATE.dayName(startDate1)
  var startDate2 = new Date('2018-01-03T00:00:00.000Z')
  // var expectedDay2 = NGNX.DATE.dayName(startDate2)
  var startDate3 = new Date('2018-01-04T00:00:00.000Z')
  // var expectedDay3 = NGNX.DATE.dayName(startDate3)
  var startDate4 = new Date('2018-01-05T00:00:00.000Z')
  // var expectedDay4 = NGNX.DATE.dayName(startDate4)
  var startDate5 = new Date('2018-01-06T00:00:00.000Z')
  // var expectedDay5 = NGNX.DATE.dayName(startDate5)
  var startDate6 = new Date('2018-01-07T00:00:00.000Z')
  // var expectedDay6 = NGNX.DATE.dayName(startDate6)
  var expectedTrue = true
  var expectedFalse = false

  t.ok(NGNX.DATE.isWeekday(startDate0) === expectedTrue, 'MONDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate1) === expectedTrue, 'TUESDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate2) === expectedTrue, 'WEDNESDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate3) === expectedTrue, 'THURSDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate4) === expectedTrue, 'FRIDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate5) === expectedFalse, 'SATURDAY not identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate6) === expectedFalse, 'SUNDAY not identified as a weekday.')

  t.end()
})

test('Weekend', function (t) {
  var startDate0 = new Date('2018-01-01T00:00:00.000Z')
  // var expectedDay0 = NGNX.DATE.dayName(startDate0)
  var startDate1 = new Date('2018-01-02T00:00:00.000Z')
  // var expectedDay1 = NGNX.DATE.dayName(startDate1)
  var startDate2 = new Date('2018-01-03T00:00:00.000Z')
  // var expectedDay2 = NGNX.DATE.dayName(startDate2)
  var startDate3 = new Date('2018-01-04T00:00:00.000Z')
  // var expectedDay3 = NGNX.DATE.dayName(startDate3)
  var startDate4 = new Date('2018-01-05T00:00:00.000Z')
  // var expectedDay4 = NGNX.DATE.dayName(startDate4)
  var startDate5 = new Date('2018-01-06T00:00:00.000Z')
  // var expectedDay5 = NGNX.DATE.dayName(startDate5)
  var startDate6 = new Date('2018-01-07T00:00:00.000Z')
  // var expectedDay6 = NGNX.DATE.dayName(startDate6)
  var expectedTrue = true
  var expectedFalse = false

  t.ok(NGNX.DATE.isWeekend(startDate0) === expectedFalse, 'MONDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate1) === expectedFalse, 'TUESDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate2) === expectedFalse, 'WEDNESDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate3) === expectedFalse, 'THURSDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate4) === expectedFalse, 'FRIDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate5) === expectedTrue, 'SATURDAY identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate6) === expectedTrue, 'SUNDAY identified as a weekend.')

  t.end()
})

test('Leap Year', function (t) {
  t.ok(!NGNX.DATE.isLeapYear(new Date('2018-01-01T00:00:00.000Z')) && !NGNX.DATE.isLeapYear(2018), 'Non-leap year IS NOT identified as a leap year.')
  t.ok(NGNX.DATE.isLeapYear(new Date('2020-01-02T00:00:00.000Z')) && NGNX.DATE.isLeapYear(2020), 'Leap year IS identified as a leap year.')
  t.ok(!NGNX.DATE.isLeapYear(new Date('2100-01-02T00:00:00.000Z')) && !NGNX.DATE.isLeapYear(2100), 'Far future non-leap year IS NOT identified as a leap year.')
  t.ok(NGNX.DATE.isLeapYear(new Date('2096-01-02T00:00:00.000Z')) && NGNX.DATE.isLeapYear(2096), 'Far future leap year IS identified as a leap year.')

  t.end()
})

test('Quarter', function (t) {
  var startDate0 = new Date('2018-01-30T00:00:00.000Z')
  var startDate1 = new Date('2018-02-28T00:00:00.000Z')
  var startDate2 = new Date('2018-03-30T00:00:00.000Z')
  var startDate3 = new Date('2018-04-30T00:00:00.000Z')
  var startDate4 = new Date('2018-05-30T00:00:00.000Z')
  var startDate5 = new Date('2018-06-30T00:00:00.000Z')
  var startDate6 = new Date('2018-07-30T00:00:00.000Z')
  var startDate7 = new Date('2018-08-30T00:00:00.000Z')
  var startDate8 = new Date('2018-09-30T00:00:00.000Z')
  var startDate9 = new Date('2018-10-30T00:00:00.000Z')
  var startDate10 = new Date('2018-11-30T00:00:00.000Z')
  var startDate11 = new Date('2018-12-30T00:00:00.000Z')
  var calendarYearStartMonth = 1
  var calendarYearStartDay = 1
  var quarterOneExpected = 1
  var quarterTwoExpected = 2
  var quarterThreeExpected = 3
  var quarterFourExpected = 4

  t.ok(NGNX.DATE.quarter(startDate0, calendarYearStartMonth, calendarYearStartDay) === quarterOneExpected, 'Date is returning JANUARY QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate1, calendarYearStartMonth, calendarYearStartDay) === quarterOneExpected, 'Date is returning FEBRUARY QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate2, calendarYearStartMonth, calendarYearStartDay) === quarterOneExpected, 'Date is returning MARCH QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate3, calendarYearStartMonth, calendarYearStartDay) === quarterTwoExpected, 'Date is returning APRIL QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate4, calendarYearStartMonth, calendarYearStartDay) === quarterTwoExpected, 'Date is returning MAY QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate5, calendarYearStartMonth, calendarYearStartDay) === quarterTwoExpected, 'Date is returning JUNE QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate6, calendarYearStartMonth, calendarYearStartDay) === quarterThreeExpected, 'Date is returning JULY QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate7, calendarYearStartMonth, calendarYearStartDay) === quarterThreeExpected, 'Date is returning AUGUST QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate8, calendarYearStartMonth, calendarYearStartDay) === quarterThreeExpected, 'Date is returning SEPTEMBER QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate9, calendarYearStartMonth, calendarYearStartDay) === quarterFourExpected, 'Date is returning OCTOBER QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate10, calendarYearStartMonth, calendarYearStartDay) === quarterFourExpected, 'Date is returning NOVEMBER QUARTER correctly')
  t.ok(NGNX.DATE.quarter(startDate11, calendarYearStartMonth, calendarYearStartDay) === quarterFourExpected, 'Date is returning DECEMBER QUARTER correctly')

  t.end()
})

// Interval: R3/2018-03-01T15:00:00Z/P1Y2M3DT5H30M1S
// repeat 3 times starting on 03/01/2018 at 3pm UTC and find P1Y2M3DT5H30M1S 3 times
// no number after 'R' means repeat with out stop

test('Parse Interval', function (t) {
  var value = 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  var expected = {
    source: value,
    period: 'P1Y2M10DT2H30M',
    valid: true,
    intervalCount: 5,
    years: 1,
    months: 2,
    weeks: 0,
    days: 10,
    hours: 2,
    minutes: 30,
    seconds: 0,
    start: new Date('2008-03-01T13:00:00.000Z'),
    end: new Date('2014-02-22T01:30:00Z'),
    intervals: []
  }

  // Origin: 2008-03-01T13:00:00
  // Period 1: 2009-05-11T15:30:00
  // Period 2: 2010-07-21T18:00:00
  // Period 3: 2011-10-01T20:30:00
  // Period 4: 2012-12-11T23:00:00
  // Period 5: 2014-02-22T01:30:00

  var result = NGNX.DATE.parseInterval(value, true)

  t.ok(
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
    result.end === null &&
    result.repetitionCount === expected.intervalCount,
    'Date is returning PARSE INTERVAL SOURCE correctly'
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

  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate0, interval0, year0, months0, weeks0, days0, hours0, minutes0, seconds0) === expectedDate0, 'Date is returning standard REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate1, interval1, year1, months1, weeks1, days1, hours1, minutes1, seconds1) === expectedDate1, 'Date is returning infinite REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate2, interval2, year2, months2, weeks2, days2, hours2, minutes2, seconds2) === expectedDate2, 'Date is returning defined REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate3, interval3, year3, months3, weeks3, days3, hours3, minutes3, seconds3) === expectedDate3, 'Date is returning defined (10+) REPEATING INTERVAL STRING correctly')

  t.end()
})
