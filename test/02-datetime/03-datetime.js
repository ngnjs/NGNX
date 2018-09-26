require('../../node_modules/ngn/ngn') // TODO: Remove this when NGN 2 is ready
require('../lib/ngnx')
require('../lib/ngnx-date')

const test = require('tap').test

test('Millisecond', t => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedTime0 = new Date('2018-01-01T00:00:00.001Z')
  let expectedTimeNeg0 = new Date('2017-12-31T23:59:59.999Z')
  let expectedTime1 = new Date('2018-01-01T00:00:01.000Z')
  let expectedTimeNeg1 = new Date('2017-12-31T23:59:59.000Z')

  t.ok(NGNX.DATE.addMillisecond(startDate, 1).getTime() === expectedTime0.getTime(), 'Date is adding 1 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDateNeg, -1).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting 1 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDate, 1000).getTime() === expectedTime1.getTime(), 'Date is adding 1000 MILLISECONDS correctly')
  t.ok(NGNX.DATE.addMillisecond(startDateNeg, -1000).getTime() === expectedTimeNeg1.getTime(), 'Date is subtracting 1000 MILLISECONDS correctly')

  t.end()
})

test('Second', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedTime = new Date('2018-01-01T00:00:01.000Z')
  let expectedTimeNeg = new Date('2017-12-31T23:59:59.000Z')
  let expectedTime0 = new Date('2018-01-01T00:01:00.000Z')
  let expectedTimeNeg0 = new Date('2017-12-31T23:59:00.000Z')

  t.ok(NGNX.DATE.addSecond(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDate, 60).getTime() === expectedTime0.getTime(), 'Date is adding SECONDS correctly')
  t.ok(NGNX.DATE.addSecond(startDateNeg, -60).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting SECONDS correctly')

  t.end()
})

test('Minute', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedTime = new Date('2018-01-01T00:01:00.000Z')
  let expectedTimeNeg = new Date('2017-12-31T23:59:00.000Z')
  let expectedTime0 = new Date('2018-01-01T01:00:00.000Z')
  let expectedTimeNeg0 = new Date('2017-12-31T23:00:00.000Z')

  t.ok(NGNX.DATE.addMinute(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDate, 60).getTime() === expectedTime0.getTime(), 'Date is adding MINUTES correctly')
  t.ok(NGNX.DATE.addMinute(startDateNeg, -60).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting MINUTES correctly')

  t.end()
})

test('Hour', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedTime = new Date('2018-01-01T01:00:00.000Z')
  let expectedTimeNeg = new Date('2017-12-31T23:00:00.000Z')
  let expectedTime0 = new Date('2018-01-02T00:00:00.000Z')
  let expectedTimeNeg0 = new Date('2017-12-31T00:00:00.000Z')

  t.ok(NGNX.DATE.addHour(startDate, 1).getTime() === expectedTime.getTime(), 'Date is adding HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDateNeg, -1).getTime() === expectedTimeNeg.getTime(), 'Date is subtracting HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDate, 24).getTime() === expectedTime0.getTime(), 'Date is adding HOURS correctly')
  t.ok(NGNX.DATE.addHour(startDateNeg, -24).getTime() === expectedTimeNeg0.getTime(), 'Date is subtracting HOURS correctly')

  t.end()
})

test('Day', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate = new Date('2018-01-02T00:00:00.000Z')
  let expectedDateNeg = new Date('2017-12-31T00:00:00.000Z')
  let expectedDate0 = new Date('2018-02-01T00:00:00.000Z')
  let expectedDateNeg0 = new Date('2017-12-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addDay(startDate, 1).getTime() === expectedDate.getTime(), 'Date is adding DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDateNeg, -1).getTime() === expectedDateNeg.getTime(), 'Date is Subtracting DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDate, 31).getTime() === expectedDate0.getTime(), 'Date is adding DAYS correctly')
  t.ok(NGNX.DATE.addDay(startDateNeg, -31).getTime() === expectedDateNeg0.getTime(), 'Date is Subtracting DAYS correctly')

  t.end()
})

test('Week', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate = new Date('2018-01-08')
  let expectedDateNeg = new Date('2017-12-25T00:00:00.000Z')
  let expectedDate0 = new Date('2018-12-31')
  let expectedDateNeg0 = new Date('2017-01-02T00:00:00.000Z')

  t.ok(NGNX.DATE.addWeek(startDate, 1).getTime() === expectedDate.getTime(), 'Date is ADDING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDateNeg, -1).getTime() === expectedDateNeg.getTime(), 'Date is SUBTRACTING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDate, 52).getTime() === expectedDate0.getTime(), 'Date is ADDING WEEKS correctly')
  t.ok(NGNX.DATE.addWeek(startDateNeg, -52).getTime() === expectedDateNeg0.getTime(), 'Date is SUBTRACTING WEEKS correctly')

  t.end()
})

test('Month', (t) => {
  let startDateAddLessThanYear = new Date('2018-01-11T00:00:00.000Z')
  let startDateSubtractLessThanYear = new Date('2018-06-02T00:00:00.000Z')
  let startDateAddMoreThanYear = new Date('2018-01-02T00:00:00.000Z')
  let startDateSubtractMoreThanYear = new Date('2019-09-02T00:00:00.000Z')
  let expectedDateAddLessThanYear = new Date('2018-02-11T00:00:00.000Z')
  let expectedDateSubtractLessThanYear = new Date('2018-04-02T00:00:00.000Z')
  let expectedDateAddMoreTHanYear = new Date('2019-09-02T00:00:00.000Z')
  let expectedDateSubtractMoreThanYear = new Date('2018-01-02T00:00:00.000Z')

  t.ok(NGNX.DATE.addMonth(startDateAddLessThanYear, 1).getTime() === expectedDateAddLessThanYear.getTime(), 'Date is ADDING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateSubtractLessThanYear, -2).getTime() === expectedDateSubtractLessThanYear.getTime(), 'Date is SUBTRACTING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateAddMoreThanYear, 20).getTime() === expectedDateAddMoreTHanYear.getTime(), 'Date is ADDING MONTHS LESS THAN A YEAR correctly')
  t.ok(NGNX.DATE.addMonth(startDateSubtractMoreThanYear, -20).getTime() === expectedDateSubtractMoreThanYear.getTime(), 'Date is SUBTRACTING MONTHS LESS THAN A YEAR correctly')

  t.end()
})

test('Add Year', (t) => {
  // if the global var is used the test shows a start date of 2019-09-01T05:00:00.000Z
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate = new Date('2023-01-01')

  t.ok(NGNX.DATE.addYear(startDate, 5).getTime() === expectedDate.getTime(), 'Date is adding YEARS correctly')

  let startDateNeg = new Date('2018-01-01T00:00:00.000Z')
  let expectedDateNeg = new Date('1918-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addYear(startDateNeg, -100).getTime() === expectedDateNeg.getTime(), 'Date is subtracting YEARS correctly')
  t.end()
})

test('Add Duration', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let periodSeconds = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 30
  }
  let periodMinutes = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 30,
    seconds: 0
  }
  let periodHours = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 13,
    minutes: 0,
    seconds: 0
  }
  let periodDays = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  let periodWeeks = {
    years: 0,
    months: 0,
    weeks: 2,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  let periodMonths = {
    years: 0,
    months: 13,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  let periodYears = {
    years: 20,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }

  let expectedDateSeconds = new Date('2018-01-01T00:00:30.000Z')
  let expectedDateMinutes = new Date('2018-01-01T00:30:00.000Z')
  let expectedDateHours = new Date('2018-01-01T13:00:00.000Z')
  let expectedDateDays = new Date('2018-01-11T00:00:00.000Z')
  let expectedDateWeeks = new Date('2018-01-15T00:00:00.000Z')
  let expectedDateMonths = new Date('2019-02-01T00:00:00.000Z')
  let expectedDateYears = new Date('2038-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.addDuration(startDate, periodSeconds).getTime() === expectedDateSeconds.getTime(), 'Date is returning ADD DURATION SECONDS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodMinutes).getTime() === expectedDateMinutes.getTime(), 'Date is returning ADD DURATION MINUTES correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodHours).getTime() === expectedDateHours.getTime(), 'Date is returning ADD DURATION HOURS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodDays).getTime() === expectedDateDays.getTime(), 'Date is returning ADD DURATION DAYS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodWeeks).getTime() === expectedDateWeeks.getTime(), 'Date is returning ADD DURATION WEEKS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodMonths).getTime() === expectedDateMonths.getTime(), 'Date is returning ADD DURATION MONTHS correctly')
  t.ok(NGNX.DATE.addDuration(startDate, periodYears).getTime() === expectedDateYears.getTime(), 'Date is returning ADD DURATION YEARS correctly')

  t.end()
})

test('Subtract Duration', (t) => {
  let defaultPeriod = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  let periodSeconds = Object.assign({}, defaultPeriod)
  let periodMinutes = Object.assign({}, defaultPeriod)
  let periodHours = Object.assign({}, defaultPeriod)
  let periodDays = Object.assign({}, defaultPeriod)
  let periodWeeks = Object.assign({}, defaultPeriod)
  let periodMonths = Object.assign({}, defaultPeriod)
  let periodYears = Object.assign({}, defaultPeriod)

  periodSeconds.seconds = 30
  periodMinutes.minutes = 30
  periodHours.hours = 13
  periodDays.days = 10
  periodWeeks.weeks = 2
  periodMonths.months = 11
  periodYears.years = 20

  let startDate = new Date('2018-02-01T00:00:00.000Z')
  let expectedDateSeconds = new Date('2018-01-31T23:59:30.000Z')
  let expectedDateMinutes = new Date('2018-01-31T23:30:00.000Z')
  let expectedDateHours = new Date('2018-01-31T11:00:00.000Z')
  let expectedDateDays = new Date('2018-01-22T00:00:00.000Z')
  let expectedDateWeeks = new Date('2018-01-18T00:00:00.000Z')
  let expectedDateMonths = new Date('2017-03-01T00:00:00.000Z')
  let expectedDateYears = new Date('1998-02-01T00:00:00.000Z')

  t.ok(NGNX.DATE.subtractDuration(startDate, periodSeconds).getTime() === expectedDateSeconds.getTime(), 'Date is returning SUBTRACTING DURATION SECONDS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodMinutes).getTime() === expectedDateMinutes.getTime(), 'Date is returning SUBTRACTING DURATION MINUTES correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodHours).getTime() === expectedDateHours.getTime(), 'Date is returning SUBTRACTING DURATION HOURS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodDays).getTime() === expectedDateDays.getTime(), 'Date is returning SUBTRACTING DURATION DAYS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodWeeks).getTime() === expectedDateWeeks.getTime(), 'Date is returning SUBTRACTING DURATION WEEKS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodMonths).getTime() === expectedDateMonths.getTime(), 'Date is returning SUBTRACTING DURATION MONTHS correctly')
  t.ok(NGNX.DATE.subtractDuration(startDate, periodYears).getTime() === expectedDateYears.getTime(), 'Date is returning SUBTRACTING DURATION YEARS correctly')

  t.end()
})

test('Diff Milliseconds (Default)', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let endDate = new Date('2018-01-01T00:00:03.000Z')
  let expectedDate = 3000

  t.ok(NGNX.DATE.diff(startDate, endDate) === expectedDate, 'Date is returning DIFFERENCE IN MILLISECONDS correctly')
  t.end()
})

test('Diff Minutes', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let endDate = new Date('2018-01-01T00:10:00.000Z')
  let expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffMinutes(startDate, endDate) === (expectedDate.getTime()) / 60000, 'Date is returning DIFFERENCE IN MINUTES correctly')
  t.end()
})

test('Diff Hours', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let endDate = new Date('2018-01-01T01:00:00.000Z')
  let expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffHours(startDate, endDate) === (expectedDate.getTime()) / 3600000, 'Date is returning DIFFERENCE IN HOURS correctly')
  t.end()
})

test('Diff Days', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let endDate = new Date('2018-01-01T01:00:00.000Z')
  let expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffDays(startDate, endDate) === (expectedDate.getTime()) / 86400000, 'Date is returning DIFFERENCE IN DAYS correctly')
  t.end()
})

test('Diff Weeks', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let endDate = new Date('2018-01-21T00:00:00.000Z')
  let expectedDate = new Date(endDate - startDate)

  t.ok(NGNX.DATE.diffWeeks(startDate, endDate) === (expectedDate.getTime()) / 604800000, 'Date is returning DIFFERENCE IN WEEKS correctly')
  t.end()
})

test('Nearest Minute', (t) => {
  let startDate0 = new Date('2018-01-01T05:58:00.000Z')
  let expectedDate0 = 0
  let startDate15 = new Date('2018-01-01T05:10:00.000Z')
  let expectedDate15 = 15
  let startDate30 = new Date('2018-01-01T05:28:00.000Z')
  let expectedDate30 = 30
  let startDate45 = new Date('2018-01-01T05:38:00.000Z')
  let expectedDate45 = 45

  t.ok(NGNX.DATE.nearestMinute(startDate0).getMinutes() === (expectedDate0), 'Date is returning NEAREST MINUTES (0) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate15).getMinutes() === (expectedDate15), 'Date is returning NEAREST MINUTES (15) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate30).getMinutes() === (expectedDate30), 'Date is returning NEAREST MINUTES (30) correctly')
  t.ok(NGNX.DATE.nearestMinute(startDate45).getMinutes() === (expectedDate45), 'Date is returning NEAREST MINUTES (45) correctly')

  t.end()
})

test('Day Name', (t) => {
  t.ok(NGNX.DATE.dayName(1) === 'Sunday', 'Identified Sunday by Day Number')
  t.ok(NGNX.DATE.dayName(2) === 'Monday', 'Identified Monday by Day Number')
  t.ok(NGNX.DATE.dayName(3) === 'Tuesday', 'Identified Tuesday by Day Number')
  t.ok(NGNX.DATE.dayName(4) === 'Wednesday', 'Identified Wednesday by Day Number')
  t.ok(NGNX.DATE.dayName(5) === 'Thursday', 'Identified Thursday by Day Number')
  t.ok(NGNX.DATE.dayName(6) === 'Friday', 'Identified Friday by Day Number')
  t.ok(NGNX.DATE.dayName(7) === 'Saturday', 'Identified Saturday by Day Number')

  let startDate0 = new Date('2018-01-07T20:00:00.000Z')
  let expectedDate0 = 'Sunday'
  let startDate1 = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate1 = 'Monday'
  let startDate2 = new Date('2018-01-02T00:00:00.000Z')
  let expectedDate2 = 'Tuesday'
  let startDate3 = new Date('2018-01-03T00:00:00.000Z')
  let expectedDate3 = 'Wednesday'
  let startDate4 = new Date('2018-01-04T00:00:00.000Z')
  let expectedDate4 = 'Thursday'
  let startDate5 = new Date('2018-01-05T00:00:00.000Z')
  let expectedDate5 = 'Friday'
  let startDate6 = new Date('2018-01-06T00:00:00.000Z')
  let expectedDate6 = 'Saturday'

  t.ok(NGNX.DATE.dayName(startDate0) === (expectedDate0), 'Date is returning NAME OF DAY FOR SUNDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate1) === (expectedDate1), 'Date is returning NAME OF DAY FOR MONDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate2) === (expectedDate2), 'Date is returning NAME OF DAY FOR TUESDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate3) === (expectedDate3), 'Date is returning NAME OF DAY FOR WEDNESDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate4) === (expectedDate4), 'Date is returning NAME OF DAY FOR THURSDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate5) === (expectedDate5), 'Date is returning NAME OF DAY FOR FRIDAY correctly')
  t.ok(NGNX.DATE.dayName(startDate6) === (expectedDate6), 'Date is returning NAME OF DAY FOR SATURDAY correctly')

  t.end()
})

test('Month Name', (t) => {
  let startDate0 = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate0 = 'January'
  let startDate1 = new Date('2018-02-01T00:00:00.000Z')
  let expectedDate1 = 'February'
  let startDate2 = new Date('2018-03-01T00:00:00.000Z')
  let expectedDate2 = 'March'
  let startDate3 = new Date('2018-04-01T00:00:00.000Z')
  let expectedDate3 = 'April'
  let startDate4 = new Date('2018-05-01T00:00:00.000Z')
  let expectedDate4 = 'May'
  let startDate5 = new Date('2018-06-01T00:00:00.000Z')
  let expectedDate5 = 'June'
  let startDate6 = new Date('2018-07-01T00:00:00.000Z')
  let expectedDate6 = 'July'
  let startDate7 = new Date('2018-08-01T00:00:00.000Z')
  let expectedDate7 = 'August'
  let startDate8 = new Date('2018-09-01T00:00:00.000Z')
  let expectedDate8 = 'September'
  let startDate9 = new Date('2018-10-01T00:00:00.000Z')
  let expectedDate9 = 'October'
  let startDate10 = new Date('2018-11-01T00:00:00.000Z')
  let expectedDate10 = 'November'
  let startDate11 = new Date('2018-12-01T00:00:00.000Z')
  let expectedDate11 = 'December'

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

test('Date Input Format', (t) => {
  let startDate0 = new Date('2018/1/1')
  let expectedDate0 = '2018-01-01'
  let startDate1 = new Date('2018/11/1')
  let expectedDate1 = '2018-11-01'
  let startDate2 = new Date('2018/2/11')
  let expectedDate2 = '2018-02-11'

  t.ok(NGNX.DATE.dateInputFormat(startDate0) === (expectedDate0), 'Date is returning INPUT DATE FORMAT correctly')
  t.ok(NGNX.DATE.dateInputFormat(startDate1) === (expectedDate1), 'Date is returning INPUT DATE FORMAT correctly')
  t.ok(NGNX.DATE.dateInputFormat(startDate2) === (expectedDate2), 'Date is returning INPUT DATE FORMAT correctly')
  t.end()
})

test('Input Date', (t) => {
  let startDate = new Date('2018/7/20')
  let expectedDate = new Date('2018-07-20T05:00:00.000Z')

  t.ok(NGNX.DATE.inputDate(startDate).getTime() === (expectedDate).getTime(), 'Date is returning INPUT DATE correctly')
  t.end()
})

test('Today', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate = false
  let todaysDate = new Date()
  let expectedToday = true
  todaysDate.setUTCHours(0)
  todaysDate.setUTCMinutes(0)
  todaysDate.setUTCSeconds(0)
  todaysDate.setUTCMilliseconds(0)

  t.ok(NGNX.DATE.today(startDate) === (expectedDate), 'Date is returning NOT TODAY correctly')
  t.ok(NGNX.DATE.today(todaysDate) === (expectedToday), 'Date is returning TODAY correctly')

  t.end()
})

test('Intersection', (t) => {
  let firstRangeStart = new Date('2018-01-01T00:00:00.000Z')
  let firstRangeEnd = new Date('2018-03-01T00:00:00.000Z')
  let secondRangeStart = new Date('2018-02-01T00:00:00.000Z')
  let secondRangeEnd = new Date('2018-04-01T00:00:00.000Z')
  let thirdRangeStart = new Date('2018-01-15T00:00:00.000Z')
  let thirdRangeEnd = new Date('2018-01-31T00:00:00.000Z')
  let fourthRangeStart = new Date('2018-06-15T00:00:00.000Z')
  let fourthRangeEnd = new Date('2018-07-31T00:00:00.000Z')
  let firstExpectedDate = [secondRangeStart, firstRangeEnd]
  let secondExpectedDate = [thirdRangeStart, thirdRangeEnd]
  let thirdExpectedDate = []
  let firstIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, secondRangeStart, secondRangeEnd)
  let secondIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, thirdRangeStart, thirdRangeEnd)
  let thirdIntersection = NGNX.DATE.intersection(firstRangeStart, firstRangeEnd, fourthRangeStart, fourthRangeEnd)

  t.ok(firstIntersection[0].getTime() === firstExpectedDate[0].getTime() && firstIntersection[1].getTime() === firstExpectedDate[1].getTime(), 'Date is returning OVERLAP INTERSECTION correctly')
  t.ok(secondIntersection[0].getTime() === secondExpectedDate[0].getTime() && secondIntersection[1].getTime() === secondExpectedDate[1].getTime(), 'Date is returning ENCOMPASSED INTERSECTION correctly')
  t.ok(thirdIntersection[0] === thirdExpectedDate[0] && thirdIntersection[1] === thirdExpectedDate[1], 'Date is returning NO OVERLAP INTERSECTION correctly')

  t.end()
})

test('Last Moment of the Month', (t) => {
  let startDate = new Date('2018-04-15T09:45:30.999Z')
  let expectedDate = new Date('2018-04-30T23:59:59.999Z')

  t.ok(NGNX.DATE.lastOfMonth(startDate).getTime() === expectedDate.getTime(), 'Date is returning LAST MOMENT OF MONTH correctly')

  t.end()
})

test('Last Moment of the Day', (t) => {
  let startDate = new Date('2018-01-01T09:45:30.999Z')
  let expectedDate = new Date('2018-01-01T23:59:59.999Z')

  t.ok(NGNX.DATE.lastMoment(startDate).getTime() === expectedDate.getTime(), 'Date is returning LAST MOMENT OF DAY correctly')

  t.end()
})

test('First Moment of the Month', (t) => {
  let startDate = new Date('2018-01-29T09:45:30.999Z')
  let expectedDate = new Date('2018-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.firstOfMonth(startDate).getTime() === expectedDate.getTime(), 'Date is returning FIRST MOMENT OF MONTH correctly')

  t.end()
})

test('First Moment of the Day', (t) => {
  let startDate = new Date('2018-01-01T09:45:30.999Z')
  let expectedDate = new Date('2018-01-01T00:00:00.000Z')

  t.ok(NGNX.DATE.firstMoment(startDate).getTime() === expectedDate.getTime(), 'Date is returning FIRST MOMENT OF DAY correctly')

  t.end()
})

test('Convert to Military Time', (t) => {
  let startDate = ('7:45 PM')
  let expectedDate = ('19:45:00')

  t.ok(NGNX.DATE.convertStandardToMilitaryTime(startDate) === expectedDate, 'Date is returning MILITARY TIME correctly')
  t.end()
})

test('Convert to Standard Time', (t) => {
  let startDate = ('19:45')
  let expectedDate = ('07:45 PM')

  t.ok(NGNX.DATE.convertMilitaryToStandardTime(startDate) === expectedDate, 'Date is returning STANDARD TIME correctly')

  t.end()
})

test('Clean Date Format', (t) => {
  let startDate = new Date('2018-01-01T00:00:00.000Z')
  let expectedDate = '2018/01/01T00:00:00Z'

  t.ok(NGNX.DATE.cleanDateFormat(startDate, false) === (expectedDate), 'Date is returning CLEAN FORMAT correctly')
  t.end()
})

test('Clean Date String Format', (t) => {
  let startDate = new Date('01/01/18')
  let startTime = ('13:00:00')
  let expectedDate = '2018/01/01T13:00:00Z'

  t.ok(NGNX.DATE.cleanDateStringFormat(startDate, startTime) === (expectedDate), 'Date is returning CLEAN STRING FORMAT correctly')
  t.end()
})

test('Clean Time String Format', (t) => {
  let startTime = ('5:15:10')
  let expectedTime = '05:15:10'

  t.ok(NGNX.DATE.cleanTimeStringFormat(startTime) === (expectedTime), 'Date is returning CLEAN TIME STRING FORMAT correctly')
  t.end()
})

test('Set Time', (t) => {
  let startDate = new Date('2018-01-01T06:00:00.000Z')
  let startTime = ('5:15:10')
  let expectedTime = new Date('2018-01-01T11:15:10.000Z')

  t.ok(NGNX.DATE.setTime(startDate, startTime).getTime() === (expectedTime.getTime()), 'Date is returning SET TIME correctly')
  t.end()
})

test('Create Time Table', (t) => {
  let interval10 = 10
  // let interval15 = 15
  // let interval30 = 30
  // let interval60 = 60
  let format24 = 24
  let format12 = 12
  let enforceFormatTrue = true
  let enforceFormatFalse = false
  let firstTest = NGNX.DATE.createTimeTable(interval10, format12, enforceFormatTrue)
  let secondTest = NGNX.DATE.createTimeTable(interval10, format12, enforceFormatFalse)
  let thirdTest = NGNX.DATE.createTimeTable(interval10, format24, enforceFormatTrue)
  let fourthTest = NGNX.DATE.createTimeTable(interval10, format24, enforceFormatFalse)

  let expectedTime0 = ['12:00 AM', '03:20 AM', '07:30 AM', '09:40 PM', '11:50 PM']
  t.ok(firstTest[0] === expectedTime0[0] && firstTest[20] === expectedTime0[1] && firstTest[45] === expectedTime0[2] && firstTest[130] === expectedTime0[3] && firstTest[143] === expectedTime0[4], 'Date is returning 12HR LEADING 0 TIME TABLE correctly')

  let expectedTime1 = ['12:00 AM', '3:20 AM', '7:30 AM', '9:40 PM', '11:50 PM']
  t.ok(secondTest[0] === expectedTime1[0] && secondTest[20] === expectedTime1[1] && secondTest[45] === expectedTime1[2] && secondTest[130] === expectedTime1[3] && secondTest[143] === expectedTime1[4], 'Date is returning 12HR NO LEADING 0 TIME TABLE correctly')

  let expectedTime2 = ['00:00 ', '03:20', '07:30', '21:40', '23:50']
  t.ok(thirdTest[0] === expectedTime2[0] && thirdTest[20] === expectedTime2[1] && thirdTest[45] === expectedTime2[2] && thirdTest[130] === expectedTime2[3] && thirdTest[143] === expectedTime2[4], 'Date is returning 24HR LEADING 0 TIME TABLE correctly')

  let expectedTime3 = ['00:00 ', '3:20', '7:30', '21:40', '23:50']
  t.ok(fourthTest[0] === expectedTime3[0] && fourthTest[20] === expectedTime3[1] && fourthTest[45] === expectedTime3[2] && fourthTest[130] === expectedTime3[3] && thirdTest[143] === expectedTime3[4], 'Date is returning 24HR NO LEADING 0 TIME TABLE correctly')

  t.end()
})

test('Weekday', (t) => {
  let startDate0 = new Date('2018-01-01T00:00:00.000Z')
  // let expectedDay0 = NGNX.DATE.dayName(startDate0)
  let startDate1 = new Date('2018-01-02T00:00:00.000Z')
  // let expectedDay1 = NGNX.DATE.dayName(startDate1)
  let startDate2 = new Date('2018-01-03T00:00:00.000Z')
  // let expectedDay2 = NGNX.DATE.dayName(startDate2)
  let startDate3 = new Date('2018-01-04T00:00:00.000Z')
  // let expectedDay3 = NGNX.DATE.dayName(startDate3)
  let startDate4 = new Date('2018-01-05T00:00:00.000Z')
  // let expectedDay4 = NGNX.DATE.dayName(startDate4)
  let startDate5 = new Date('2018-01-06T00:00:00.000Z')
  // let expectedDay5 = NGNX.DATE.dayName(startDate5)
  let startDate6 = new Date('2018-01-07T00:00:00.000Z')
  // let expectedDay6 = NGNX.DATE.dayName(startDate6)
  let expectedTrue = true
  let expectedFalse = false

  t.ok(NGNX.DATE.isWeekday(startDate0) === expectedTrue, 'MONDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate1) === expectedTrue, 'TUESDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate2) === expectedTrue, 'WEDNESDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate3) === expectedTrue, 'THURSDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate4) === expectedTrue, 'FRIDAY identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate5) === expectedFalse, 'SATURDAY not identified as a weekday.')
  t.ok(NGNX.DATE.isWeekday(startDate6) === expectedFalse, 'SUNDAY not identified as a weekday.')

  t.end()
})

test('Weekend', (t) => {
  let startDate0 = new Date('2018-01-01T00:00:00.000Z')
  // let expectedDay0 = NGNX.DATE.dayName(startDate0)
  let startDate1 = new Date('2018-01-02T00:00:00.000Z')
  // let expectedDay1 = NGNX.DATE.dayName(startDate1)
  let startDate2 = new Date('2018-01-03T00:00:00.000Z')
  // let expectedDay2 = NGNX.DATE.dayName(startDate2)
  let startDate3 = new Date('2018-01-04T00:00:00.000Z')
  // let expectedDay3 = NGNX.DATE.dayName(startDate3)
  let startDate4 = new Date('2018-01-05T00:00:00.000Z')
  // let expectedDay4 = NGNX.DATE.dayName(startDate4)
  let startDate5 = new Date('2018-01-06T00:00:00.000Z')
  // let expectedDay5 = NGNX.DATE.dayName(startDate5)
  let startDate6 = new Date('2018-01-07T00:00:00.000Z')
  // let expectedDay6 = NGNX.DATE.dayName(startDate6)
  let expectedTrue = true
  let expectedFalse = false

  t.ok(NGNX.DATE.isWeekend(startDate0) === expectedFalse, 'MONDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate1) === expectedFalse, 'TUESDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate2) === expectedFalse, 'WEDNESDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate3) === expectedFalse, 'THURSDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate4) === expectedFalse, 'FRIDAY not identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate5) === expectedTrue, 'SATURDAY identified as a weekend.')
  t.ok(NGNX.DATE.isWeekend(startDate6) === expectedTrue, 'SUNDAY identified as a weekend.')

  t.end()
})

test('Leap Year', (t) => {
  let startDate0 = new Date('2018-01-01T00:00:00.000Z')
  let startDate1 = new Date('2020-01-02T00:00:00.000Z')
  let startDate2 = new Date('2100-01-02T00:00:00.000Z')
  let expectedTrue = true
  let expectedFalse = false

  t.ok(NGNX.DATE.isLeapYear(startDate0) === expectedFalse, 'Non-leap year IS NOT identified as a leap year.')
  t.ok(NGNX.DATE.isLeapYear(startDate1) === expectedTrue, 'Leap year IS identified as a leap year.')
  t.ok(NGNX.DATE.isLeapYear(startDate2) === expectedFalse, 'Far future non-leap year IS NOT identified as a leap year.')

  t.end()
})

test('Quarter', (t) => {
  let startDate0 = new Date('2018-01-30T00:00:00.000Z')
  let startDate1 = new Date('2018-02-28T00:00:00.000Z')
  let startDate2 = new Date('2018-03-30T00:00:00.000Z')
  let startDate3 = new Date('2018-04-30T00:00:00.000Z')
  let startDate4 = new Date('2018-05-30T00:00:00.000Z')
  let startDate5 = new Date('2018-06-30T00:00:00.000Z')
  let startDate6 = new Date('2018-07-30T00:00:00.000Z')
  let startDate7 = new Date('2018-08-30T00:00:00.000Z')
  let startDate8 = new Date('2018-09-30T00:00:00.000Z')
  let startDate9 = new Date('2018-10-30T00:00:00.000Z')
  let startDate10 = new Date('2018-11-30T00:00:00.000Z')
  let startDate11 = new Date('2018-12-30T00:00:00.000Z')
  let calendarYearStartMonth = 1
  let calendarYearStartDay = 1
  let quarterOneExpected = 1
  let quarterTwoExpected = 2
  let quarterThreeExpected = 3
  let quarterFourExpected = 4

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

test('Parse Interval', (t) => {
  let value = 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'
  let expected = {
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

  let result = NGNX.DATE.parseInterval(value, false)

  t.ok(
    result.source === expected.source &&
    result.period === expected.period &&
    result.valid === expected.valid &&
    result.years === expected.years &&
    result.months === expected.months &&
    result.weeks === expected.weeks &&
    result.days === expected.days &&
    result.hours === expected.hours &&
    result.minutes === expected.minutes &&
    result.seconds === expected.seconds &&
    result.start.getTime() === expected.start.getTime() &&
    result.end.getTime() === expected.end.getTime() &&
    result.intervalCount === expected.intervalCount,
    'Date is returning PARSE INTERVAL SOURCE correctly'
  )

  // TODO: check for syntax
  t.end()
})

test('Create Repeating Interval String', (t) => {
  let startDate0 = new Date('2018-01-01T00:00:00.000Z')
  let interval0 = 3
  let year0 = 1
  let months0 = 2
  let weeks0 = 0
  let days0 = 3
  let hours0 = 5
  let minutes0 = 30
  let seconds0 = 1
  let expectedDate0 = 'R3/2018-01-01T00:00:00.000Z/P1Y2M3DT5H30M1S'
  let startDate1 = new Date('2018-02-15T20:15:30.000Z')
  let interval1 = 0
  let year1 = 2
  let months1 = 4
  let weeks1 = 0
  let days1 = 8
  let hours1 = 5
  let minutes1 = 46
  let seconds1 = 45
  let expectedDate1 = 'R0/2018-02-15T20:15:30.000Z/P2Y4M8DT5H46M45S'
  let startDate2 = new Date('2019-02-28T20:15:30.000Z')
  let interval2 = 5
  let year2 = 0
  let months2 = 0
  let weeks2 = 20
  let days2 = 0
  let hours2 = 0
  let minutes2 = 0
  let seconds2 = 0
  let expectedDate2 = 'R5/2019-02-28T20:15:30.000Z/P20W'
  let startDate3 = new Date('2018-02-15T20:15:30.000Z')
  let interval3 = 10
  let year3 = 10
  let months3 = 10
  let weeks3 = 1
  let days3 = 0
  let hours3 = 12
  let minutes3 = 45
  let seconds3 = 15
  let expectedDate3 = 'R10/2018-02-15T20:15:30.000Z/P10Y10M7DT12H45M15S'

  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate0, interval0, year0, months0, weeks0, days0, hours0, minutes0, seconds0) === expectedDate0, 'Date is returning standard REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate1, interval1, year1, months1, weeks1, days1, hours1, minutes1, seconds1) === expectedDate1, 'Date is returning infinite REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate2, interval2, year2, months2, weeks2, days2, hours2, minutes2, seconds2) === expectedDate2, 'Date is returning defined REPEATING INTERVAL STRING correctly')
  t.ok(NGNX.DATE.createRepeatingIntervalString(startDate3, interval3, year3, months3, weeks3, days3, hours3, minutes3, seconds3) === expectedDate3, 'Date is returning defined (10+) REPEATING INTERVAL STRING correctly')

  t.end()
})

test('Date Iterator', (t) => {
  t.fail('No tests yet')
  t.end()
})

test('Repeating Interval Iterator', (t) => {
  // let startDate = new Date('2018-01-01T00:00:00Z')
  // let startDateFull =
  // console.log(startDate, 'input')
  //
  // console.log(NGNX.DATE.createRepeatingIntervalIterator('R3/2018-01-01T00:00:00.000Z/P1Y2M3DT5H30M1S'), 'function output')
  // console.log(NGNX.DATE.createRepeatingIntervalIterator(startDate), 'function output')
  t.fail('No tests')
  t.end()
})
