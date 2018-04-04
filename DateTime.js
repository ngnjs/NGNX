(function () {
  /**
   * @class NGNX.DATE.DateIterator
   * A special iterator that will generate dates based on a pattern.
   * This acts more like a doubly linked list, allowing `next` and
   * `previous` iterations.
   */
  class DateIterator {
    constructor (pattern) {
      console.log(pattern, 'pattern example')
      let interval = NGN.privateconst(NGNX.DATE.parseInterval(pattern, false))

      Object.defineProperties(this, {
        pattern: NGN.const(pattern),
        interval,
        currentDate: NGN.private(null),
        totalIntervals: NGN.private(0),
        maxIntervals: NGN.private(0)
      })
console.log(this.interval, 'interval example')
      if (!this.interval.valid){
        throw new Error('Invalid ISO-8601 syntax.')
      }

console.log(this.interval.start)
      if (NGN.typeof(this.interval.start) !== 'date') {

        throw new Error('Invalid start date.')
      }

      if (isNaN(this.maxIntervals)) {
        throw new Error('Invalid maximum intervals.')
      }

      this.currentDate = this.interval.start
      this.maxIntervals = NGN.coalesce(this.interval.intervalCount, -1)
    }

    /**
     * @property {Date} date
     * The date is used to calculate new iterations.
     */
    set date (date) {
      if (NGN.typeof(date) !== 'date') {
        throw new Error('Invalid date.')
      }

      this.currentDate = value
    }

    get date () {
      return this.currentDate
    }

    /**
     * Retrieves the next date.
     * @param  {number} [count=null]
     * By specifying a number, the iterator will run repeatedly for the
     * specified number of times. The result will be an array containing
     * each date in the iteration.
     * @return {Date|Array}
     * If `count` is unspecified, a date is returned. If `count` is specified,
     * an array of dates is returned.
     */
    next (count = null) {
      if (!isNaN(count) && count !== 0) {
        if (count < 0) {
          return this.previous(Math.abs(count))
        }

        let diff = this.maxIntervals - this.totalIntervals
        if (diff <= 0) {
          return []
        }

        count = diff < count ? diff : count

        let result = []
        for (let i = 0; i < count; i++) {
          result.push(this.next())
        }

        return result
      }

      if (this.maxIntervals >= 0 && this.totalIntervals > this.maxIntervals) {
        NGN.WARN(`Maximum interval threshhold exceeded (${this.maxIntervals}).`)
        return this.currentDate
      }

      this.totalIntervals++
      this.currentDate = NGNX.DATE.addDuration(this.currentDate, this.interval)
      return this.currentDate
    }

    /**
     * Retrieves the previous date.
     * @param  {number} [count=null]
     * By specifying a number, the iterator will run repeatedly for the
     * specified number of times. The result will be an array containing
     * each date in the iteration.
     * @return {Date|Array}
     * If `count` is unspecified, a date is returned. If `count` is specified,
     * an array of dates is returned.
     */
    previous (count) {
      if (!isNaN(count) && count !== 0) {
        if (count < 0) {
          return this.next(Math.abs(count))
        }

        let diff = this.maxIntervals - this.totalIntervals
        if (diff <= 0) {
          return []
        }

        count = diff < count ? diff : count

        let result = []
        for (let i = 0; i < count; i++) {
          result.push(this.previous())
        }

        return result
      }

      if (this.maxIntervals >= 0 && this.totalIntervals === 0) {
        NGN.WARN('No prior itervals available.')
        return this.currentDate
      }

      this.totalIntervals--
      this.currentDate = NGNX.DATE.subtractDuration(this.currentDate, this.interval)
      return this.currentDate
    }

    /**
     * Reset the iterator to it's original state.
     */
    reset () {
      this.currentDate = this.interval.start
      this.totalIntervals = 0
    }
  }

  /**
   * @class NGNX.DateTime
   * A utility library for date and time manipulation.
   * @fires locale.modified
   * Triggered when the locale has changed. An object containing `new` and `old`
   * keys identifies the new and old locale.
   */
  class DateTime extends NGN.EventEmitter {
    constructor () {
      super(...arguments)

      // Identify the date separator by browser
      let DateSeparator = '-'

      try {
        let dt = new Date('01-01-3500 00:00:00')

        if (dt.indexOf('Invalid')) {
          DateSeparator = '/'
        } else {
          // This will fail in some browsers using slash-based syntax.
          dt = dt.getTime()
        }
      } catch (e) {
        DateSeparator = '/'
      }

      Object.defineProperties(this, {
        METADATA: NGN.privateconst({
          // locale: NGN.coalesce(NGN.global.navigator.language, 'en-US'),
          locale: 'en-US',

          separator: DateSeparator,

          getDayNames: (locale) => {
            /** TJ NOTES:
                if
                  let date = new Date(Date.UTC(2017, 0, 2))
                is changed to
                  let date = new Date(Date.UTC(2018, 0, 2))
                then getNames works with index -= 1 commented out
              */
            let date = new Date(Date.UTC(2017, 0, 2)) // A Monday
            let names = []

            for (let i = 0; i < 7; i++) {
              names.push(date.toLocaleDateString(NGN.coalesce(locale, this.METADATA.locale), { weekday: 'long' }))
              date.setDate(date.getDate() + 1)
            }

            return names
          },

          getMonthNames: (locale) => {
            let date = new Date(Date.UTC(2017, 0, 2)) // A Monday
            let names = []

            for (let i = 0; i < 12; i++) {
              names.push(date.toLocaleDateString(NGN.coalesce(locale, this.METADATA.locale), { month: 'long' }))
              date.setMonth(date.getMonth() + 1)
            }

            return names
          },

          changeDuration: (date, period, add = true) => {
            let duration = period

            if (typeof period === 'string') {
              duration = this.parseDuration(period)

              if (!duration.valid) {
                throw new Error(`${period} is an invalid duration.`)
              }
            }

            let interval = (
              (duration.years * this.METADATA.YEAR) +
              (duration.weeks * this.METADATA.WEEK) +
              (duration.days * this.METADATA.DAY) +
              (duration.hours * this.METADATA.HOUR) +
              (duration.minutes * this.METADATA.MINUTE) +
              (duration.seconds * this.METADATA.SECOND)
            )

            // Forcibly guarantee a month attribute exists.
            if (!duration.hasOwnProperty('months')) {
              duration.months = 0
            }

            let newdate
            if (add) {
              newdate = this.addMonth(this.addMillisecond(date, interval), duration.months)
            } else {
              newdate = this.addMonth(this.addMillisecond(date, 0 - interval), 0 - duration.months)
            }

            return newdate
          },

          SECOND: 1000,
          MINUTE: 60000,
          HOUR: 3600000,
          DAY: 86400000,
          WEEK: 604800000,
          YEAR: 3153600000,

          PATTERN: {
            /** TJ NOTES:
              There was an error looking for an item in an array for these items.
              I placed [] around them and it cleared that error.  If these brackets are
              not to be around the items, please delete.
            */
            // Rn/PnYnMnDTnHnMnS
            ISO8601R: /^R(\d*){0,10}\/(\d{4}(?:-\d{2}){2})T(\d{2}(?::\d{2}){2}(?:\.\d*)?([A-Za-z]*)?)\/(P(?=.)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=.)(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)$/,
            // PnYnMnDTnHnMnS
            ISO8601P: /^P((\d*)Y)?((\d*)M)?((\d*)W)?((\d*)D)?T?((\d*)H)?((\d*)M)?((\d*)S)?$/
          }
        })
      })
    }

    get locale () {
      return this.METADATA.locale
    }

    set locale (value) {
      if (value !== this.METADATA.locale) {
        let old = this.METADATA.locale

        this.METADATA.locale = value

        this.emit('locale.modified', {
          old,
          new: value
        })
      }
    }

    /**
     * @property {string} currentTime
     * The current time in a string format.
     */
    get currentTime () {
      let dt = (new Date()).toLocaleTimeString()
      dt = dt.split(':')

      return `${dt[0]}:${dt[1]} ${dt.pop().replace(/[^A-Z]/gi, '')}`
    }

    /**
     * @property {Number} localOffset
     * The local timezone offset represented in milliseconds.
     */
    get localOffset () {
      return (new Date().getTimezoneOffset()) * 60 * 1000
    }

    /**
     * @property {string} localTimezoneAbbreviation
     * The local timezone abbreviation, such as `CST`, `EST`, `GMT`.
     */
    get localTimezoneAbbreviation () {
      return this.timezoneAbbreviation(new Date())
    }

    /**
     * @property {string} localTimezone
     * The local timezone, such as `America/Chicago`.
     */
    get localTimezone () {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    get now () {
      return new Date()
    }

    /**
     * Retrieve the timezone abbreviation of the date, such as `CST`, `EST`, etc.
     * @param  {Date} date
     * The date to extract the timezone from.
     * @return {string}
     */
    timezoneAbbreviation (date) {
      date = date + ''

      let abbr = NGN.coalesce(date.match(/\(([^]+)\)$/), date.match(/([A-Z]+) [\d]{4}$/))

      if (abbr[1]) {
        abbr = abbr[1].match(/[A-Z]/g).join('')
      } else if (/(GMT\W*\d{4})/.test(date)) {
        return RegExp.$1
      }

      return abbr
    }

    /**
     * Format time by hours and minutes (ex: 3:45 AM)
     * @param  {Date} date
     * The date to format.
     * @return {String}
     */
    formatTime (date) {
      const inputDate = new Date(date.getTime())

      let time = inputDate.toLocaleTimeString()
      let tt = time.split(/\s/).pop()

      time = time.split(/\s/)[0].split(':')

      time.pop()

      return `${time.join(':')} ${tt}`
    }

    /**
     * Add milliseconds to a date (supports negative values for substraction)
     * @param {Date} date
     * @param {Number} milliseconds
     * The number of milliseconds to add to the date.
     * @return {Date}
     */
    addMillisecond (date, milliseconds) {
      return new Date(date.getTime() + milliseconds)
    }

    /**
     * Add seconds to a date (supports negative values for substraction)
     * @param {Date} date
     * @param {Number} seconds
     * The number of seconds to add to the date.
     * @return {Date}
     */
    addSecond (date, seconds) {
      return new Date(date.getTime() + (seconds * this.METADATA.SECOND))
    }

    /**
     * Add minutes to a date (supports negative values for substraction)
     * @param {Date} date
     * @param {Number} minutes
     * The number of minutes to add to the date.
     * @return {Date}
     */
    addMinute (date, minutes) {
      return new Date(date.getTime() + (minutes * this.METADATA.MINUTE))
    }

    /**
     * Add hours to a date (supports negative values for subtraction).
     * @param {Date} date
     * @param {Number} hours
     * The number of hours to add to the date.
     * @return {Date}
     */
    addHour (date, hours) {
      return new Date(date.getTime() + (hours * this.METADATA.HOUR))
    }

    /**
     * Add day(s) to a date (supports negative values for substraction).
     * @param {Date} date
     * @param {Number} days
     * The number of days to add to the date.
     * @return {Date}
     */
    addDay (date, days) {
      return new Date(date.getTime() + (days * this.METADATA.DAY))
    }

    /**
     * Add week(s) to a date (supports negative values for substraction).
     * @param {Date} date
     * @param {Number} weeks
     * The number of weeks to add to the date.
     * @return {Date}
     */
    addWeek (date, weeks) {
      return new Date(date.getTime() + (weeks * this.METADATA.WEEK))
    }

    /**
     * Add month(s) to a date (supports negative values for substraction).
     * @param {Date} date
     * @param {Number} months
     * The number of months to add to the date.
     * @return {Date}
     */

    /** TJ NOTES:
         The 'months' input is not adding the actual number input to the months in 'date'
         the test unit is as follows:
          test('Add Month', (t) => {
          let startDate = new Date('2018-01-01T00:00:00.000Z')
          console.log(startDate, 'input')
          console.log(NGNX.DATE.addMonth(startDate, 12), 'output')
          let expectedDate = new Date('2019-01-01T00:00:00.000Z')
          console.log(expectedDate, 'expected')
          t.ok(NGNX.DATE.addMonth(startDate, 12).getTime() === expectedDate.getTime(), 'Date is adding MONTHS correctly')
          t.end()
          })
          and the console output is as follows:
            Add Month
          2018-01-01T00:00:00.000Z 'input'
          2018-01-01T00:00:00.000Z 'TEST0'
          12 'TEST1'
          23 'TEST2'
          12 'TEST3'
          2019-01-01T00:00:00.000Z 'output'
          2019-01-01T00:00:00.000Z 'expected'
          2017-12-01T06:00:00.000Z 'TEST0'
          12 'TEST1'
          23 'TEST2'
          12 'TEST3'
          ✖ Date is adding MONTHS correctly
          ----------------------------------
            operator: ok
            expected: true
            actual:   false
            at: Test.test (/Users/TheTeejers/work_practice/index.js:95:5)
            stack: |-
            */

    addMonth (date, months) {
      const inputDate = new Date(date.getTime())

      if (months === 0) {
        return inputDate
      }

      let workingDate = this.firstOfMonth(date)
      let diff = this.diffMinutes(workingDate, inputDate)

      // If the total adjustment is over a year, update the working
      // date by the specified number of years and reduce the month count
      // to a number between 1-12 (or -1 to -12).
      if (months >= 12) {
        workingDate = this.addYear(workingDate, Math.floor(months / 12))
      } else if (months <= -12) {
        workingDate = this.addYear(workingDate, Math.ceil(months / 12))
      }

      // Strip years
      months = months % 12

      // If there are still months to add/remove, apply the appropriate adjustment.
      if (months > 0) {
        // console.log(months, 'months logged')
        // console.log(workingDate, 'before 500')
        workingDate.setUTCMonth(workingDate.getUTCMonth() + months)
        // console.log(workingDate, 'after 500')
      } else if (months < 0) {
        months = Math.abs(months) // Convert to a number to make the math easy.

        let workingMonth = (workingDate.getUTCMonth() + 1) // Get the active working month on a 1-12 scale.

        if (months > workingMonth) {
          // If the number of months to subtract are greater than the current
          // working month, the date will fall in the prior year.
          workingDate = this.addYear(workingDate, -1)
          months = 12 - (workingMonth - months)
        } else {
          // If the number of months to subtract is less than the current
          // working month, the date will fall earlier in the same year.
          months = workingMonth - months
        }

        workingDate.setUTCMonth(months - 1)
      }
      // console.log(diff, 'diff before return')
      // console.log(this.addMinute(workingDate, diff))
      return diff !== 0 ? this.addMinute(workingDate, diff) : workingDate
      // return new Date((diff !== 0 ? this.addMinute(workingDate, diff) : workingDate).getTime())
    }

    /**
     * Add year(s) to a date (supports negative values for substraction).
     * @param {Date} date
     * @param {Number} years
     * The number of years to add to the date.
     * @return {Date}
     */
    addYear (date, years) {
      let newdate = new Date(date.getTime())
      newdate.setFullYear(newdate.getFullYear() + years)

      return newdate
    }

    /** TJ NOTES:
      I am having just a little trouble wrapping my head around the
      'period' part of the function.  Full disclosure, I have not visited the Wiki page
      I have been simply going to the next one is I do not understand.  This is true of
      addDuration and subtractDuration
      */

    /**
     * Add a [ISO-8601:2004 duration interval](https://en.wikipedia.org/wiki/ISO_8601#Durations)
     * to a date.
     * @param {Date} date
     * The date to apply the interval to.
     * @param {string|object} duration
     * This can be the ISO-8601:2004 period pattern (PnYnMnDTnHnMnS or PnW) or
     * an object containing the following attributes:
     *
     * ```
     * {
     *   years: 0,
     *   months: 0,
     *   weeks: 0,
     *   days: 0,
     *   hours: 0,
     *   minutes: 0,
     *   seconds: 0
     * }
     * ```
     *
     * Using an object is *more efficient* since the duration parser does not
     * need to be invoked.
     * @return {Date}
     * Returns the new date after the duration has been applied (added).
     */
    addDuration (date, period) {
      return this.METADATA.changeDuration(date, period)
    }

    /** TJ NOTES:
      I am having just a little trouble wrapping my head around the
      'period' part of the function.  Full disclosure, I have not visited the Wiki page
      I have been simply going to the next one is I do not understand.  This is true of
      addDuration and subtractDuration
      */

    /**
     * Subtract a [ISO-8601:2004 duration interval](https://en.wikipedia.org/wiki/ISO_8601#Durations)
     * from a date.
     * @param {Date} date
     * The date to apply the interval to.
     * @param {string|object} duration
     * This can be the ISO-8601:2004 period pattern (PnYnMnDTnHnMnS or PnW) or
     * an object containing the following attributes:
     *
     * ```
     * {
     *   years: 0,
     *   months: 0,
     *   weeks: 0,
     *   days: 0,
     *   hours: 0,
     *   minutes: 0,
     *   seconds: 0
     * }
     * ```
     *
     * Using an object is *more efficient* since the duration parser does not
     * need to be invoked.
     * @return {Date}
     * Returns the new date after the duration has been applied (subtracted).
     */
    subtractDuration (date, period) {
      return this.METADATA.changeDuration(date, period, false)
    }

    /**
     * Calculates the number of milliseconds between two dates (from start to end).
     * The result will be the number of milliseconds that, when added to the start
     * date, equal the end date. If the start date is after the end date, this
     * will be a negative number.
     * @param  {Date} start
     * @param  {Date} end
     * @return {Number}
     * The total number of milliseconds from the start date to the end date.
     */
    diff (start, end) {
      return (end.getTime() - start.getTime())
    }

    /**
     * Calculates the number of minutes between two dates (from start to end).
     * The result will be the number of minutes that, when added to the start
     * date, equal the end date. If the start date is after the end date, this
     * will be a negative number.
     * @param  {Date} start
     * @param  {Date} end
     * @return {Number}
     * The total number of minutes from the start date to the end date.
     */
    diffMinutes (start, end) {
      return (end.getTime() - start.getTime()) / this.METADATA.MINUTE
    }

    /**
     * Calculates the number of hours between two dates (from start to end).
     * The result will be the number of hours that, when added to the start
     * date, equal the end date. If the start date is after the end date, this
     * will be a negative number.
     * @param  {Date} start
     * @param  {Date} end
     * @return {Number}
     * The total number of hours from the start date to the end date.
     */
    diffHours (start, end) {
      return (end.getTime() - start.getTime()) / this.METADATA.HOUR
    }

    /**
     * Calculates the number of days between two dates (from start to end).
     * The result will be the number of days that, when added to the start
     * date, equal the end date. If the start date is after the end date, this
     * will be a negative number.
     * @param  {Date} start
     * @param  {Date} end
     * @return {Number}
     * The total number of days from the start date to the end date.
     */
    diffDays (start, end) {
      return (end.getTime() - start.getTime()) / this.METADATA.DAY
    }

    /**
     * Calculates the number of weeks between two dates (from start to end).
     * The result will be the number of weeks that, when added to the start
     * date, equal the end date. If the start date is after the end date, this
     * will be a negative number.
     * @param  {Date} start
     * @param  {Date} end
     * @return {Number}
     * The total number of weeks from the start date to the end date.
     */
    diffWeeks (start, end) {
      return (end.getTime() - start.getTime()) / this.METADATA.WEEK
    }

    /** TJ NOTES:
      Not sure how to get the expected to be a rounded-to value with out
      simply calling the nearestMinute function, but then that would be
      comparing the function to itself, which would always be true.
      EDIT: I SIMPLY HARD CODED THE VALUES INTO EXPECTED AND CAME BACK
      WITH PASSING TESTS
      */

    /**
     * Rounds a time to the next nearest minute increment.
     * For example, 6:07 PM would be rounded up to 6:15 PM,
     * 5:57 AM would be rounded up to 6:00 AM.
     * @param {Date} datetime
     * The date time to round.
     * @param {Array} [minutes=[0, 15, 30, 45]]
     * An optional parameter to specify the minute to round up to.
     * @return {Date}
     * Returns the updated date object.
     */
    nearestMinute (datetime, minutes = [0, 15, 30, 45]) {
      let minute = datetime.getMinutes()

      if (minutes.indexOf(minute) >= 0) {
        return datetime
      }

      while (minute > minutes[0]) {
        minutes.shift()
      }

      let diff

      if (minutes.length === 0) {
        diff = 60 - minute
      } else {
        diff = minutes[0] - minute
      }

      return this.addMinute(datetime, diff)
    }

    /** TJ NOTES:
          With the line of code 'index -= 1' active, the guideline
          'The day of the week (1 = Sunday, 7 = Saturday)' is inaccurate and becomes
          'The day of the week (0 = Sunday, 6 = Saturday)' and the test fail
          */

    /**
     * Get the full name of a day by day number. Specify the locale to change
     * the language.
     * @param {number} dayNumber
     * The day of the week (1 = Sunday, 7 = Saturday).
     * @param {string} locale
     * Specify the locale. If unspecified, an attempt will be made to auto-determine
     * the locale.
     */
    dayName (index, locale) {
      if (typeof index !== 'number') {
        index = index.getUTCDay()
      } else {
        index -= 1
      }

      locale = NGN.coalesce(locale, this.METADATA.locale)

      if (!this.METADATA.CACHE_DAYNAME || !this.METADATA.CACHE_DAYNAME[locale]) {
        this.METADATA.CACHE_DAYNAME = NGN.coalesce(this.METADATA.CACHE_DAYNAME, {})
        this.METADATA.CACHE_DAYNAME[locale] = this.METADATA.getDayNames(locale)
      }

      // console.log(this.METADATA.CACHE_DAYNAME)
      return this.METADATA.CACHE_DAYNAME[locale][index]
    }

    /** TJ NOTES:
          Giving an output of two months prior to the expected month,
          except when the expected is February.  The function should
          output December but it comes back undefined.  December is never
          an output as the code sits now.
             Month Name

              11 'start input'
              2018-01-01T00:00:00.000Z 'start input'
              January expected
              November function output

              ✖ Date is returning NAME OF MONTH FOR JANUARY correctly
              --------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:410:5)
                stack: |-

              0 'start input'
              2018-02-01T00:00:00.000Z 'start input'
              February expected
              undefined 'function output'

              ✖ Date is returning NAME OF MONTH FOR FEBRUARY correctly
              ---------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:416:5)
                stack: |-

              1 'start input'
              2018-03-01T00:00:00.000Z 'start input'
              March expected
              January function output

              ✖ Date is returning NAME OF MONTH FOR MARCH correctly
              ------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:422:5)
                stack: |-

              2 'start input'
              2018-04-01T00:00:00.000Z 'start input'
              April expected
              February function output

              ✖ Date is returning NAME OF MONTH FOR APRIL correctly
              ------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:428:5)
                stack: |-

              3 'start input'
              2018-05-01T00:00:00.000Z 'start input'
              May expected
              March function output

              ✖ Date is returning NAME OF MONTH FOR MAY correctly
              ----------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:434:5)
                stack: |-

              4 'start input'
              2018-06-01T00:00:00.000Z 'start input'
              June expected
              April function output

              ✖ Date is returning NAME OF MONTH FOR JUNE correctly
              -----------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:440:5)
                stack: |-

              5 'start input'
              2018-07-01T00:00:00.000Z 'start input'
              July expected
              May function output

              ✖ Date is returning NAME OF MONTH FOR JULY correctly
              -----------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:446:5)
                stack: |-

              6 'start input'
              2018-08-01T00:00:00.000Z 'start input'
              August expected
              June function output

              ✖ Date is returning NAME OF MONTH FOR AUGUST correctly
              -------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:452:5)
                stack: |-

              7 'start input'
              2018-09-01T00:00:00.000Z 'start input'
              September expected
              July function output

              ✖ Date is returning NAME OF MONTH FOR SEPTEMBER correctly
              ----------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:458:5)
                stack: |-

              8 'start input'
              2018-10-01T00:00:00.000Z 'start input'
              October expected
              August function output

              ✖ Date is returning NAME OF MONTH FOR OCTOBER correctly
              --------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:464:5)
                stack: |-

              9 'start input'
              2018-11-01T00:00:00.000Z 'start input'
              November expected
              September function output

              ✖ Date is returning NAME OF MONTH FOR NOVEMBER correctly
              ---------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:470:5)
                stack: |-

              10 'start input'
              2018-12-01T00:00:00.000Z 'start input'
              December expected
              October function output

              ✖ Date is returning NAME OF MONTH FOR DECEMBER correctly
              ---------------------------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:476:5)
                stack: |-
          */

    /**
     * Get the full name of the month by month number. Specify the locale to change
     * the language.
     * @param {number} monthNumber
     * The month of year (1 = January, 12 = December).
     * @param {string} locale
     * Specify the locale. If unspecified, an attempt will be made to auto-determine
     * the locale.
     */
    monthName (index, locale) {
      if (typeof index !== 'number') {
        index = index.getUTCMonth()
      } else {
        index -= 1
      }

      if (!this.METADATA.CACHE_MONTHNAME || !this.METADATA.CACHE_MONTHNAME[locale]) {
        this.METADATA.CACHE_MONTHNAME = NGN.coalesce(this.METADATA.CACHE_MONTHNAME, {})
        this.METADATA.CACHE_MONTHNAME[locale] = this.METADATA.getMonthNames(locale)
      }

      return this.METADATA.CACHE_MONTHNAME[locale][index]
    }

    /**
     * Formats the date as `yyyy/mm/dd`, which is compatible with the HTML date
     * input element.
     * @param {Date} date
     */
    dateInputFormat (date) {
      let yr = date.getFullYear()
      let mo = date.getMonth() + 1
      let day = date.getDate()

      if (mo < 10) {
        mo = `0${mo}`
      }

      if (day < 10) {
        day = `0${day}`
      }

      return `${yr}-${mo}-${day}`
    }

    /** TJ NOTES:
      The input vs the output are off by 5 hours:
        Input Date

            2018-07-20T05:00:00.000Z 'input'
            2018-07-20T00:00:00.000Z expected
            2018-07-20T05:00:00.000Z 'function output'

            ✖ Date is returning INPUT DATE correctly
            -----------------------------------------
              operator: ok
              expected: true
              actual:   false
              at: Test.test (/Users/TheTeejers/work_practice/index.js:519:5)
              stack: |-
      */

    /**
     * Converts a string input date `yyyy/mm/dd` to a valid JS date.
     * @param {String} date
     */
    inputDate (date) {
      if (date instanceof Date) {
        return date
      }

      date = date.split(/\/|-/)

      return new Date(date[0], date[1], date[2], 0, 0, 0, 0)
    }

    /** TJ NOTES:
      If the input date is or is not the same date as the expected date,
      the test fails:
        Today

              2018-01-01T06:00:00.000Z 'input'
              2019-02-02T00:00:00.000Z expected

              ✖ Date is returning NOT TODAY correctly
              ----------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:532:5)
                stack: |-

              2018-03-27T00:00:00.000Z 'input of today actual date'
              2018-03-27T00:00:00.000Z expected

              ✖ Date is returning TODAY correctly
              ------------------------------------
                operator: ok
                expected: true
                actual:   false
                at: Test.test (/Users/TheTeejers/work_practice/index.js:536:5)
                stack: |-

      */

    /**
     * Determines if a date is "today".
     * @param  {Date} date
     * @return {Boolean}
     */
    today (date) {
      let now = new Date()

      return date.getUTCDate() === now.getUTCDate() &&
        date.getUTCMonth() === now.getUTCMonth() &&
        date.getUTCFullYear() === now.getUTCFullYear()
    }

    /**
     * @method intersection
     * Determines whether two time ranges overlap each other.
     *
     * ```
     *   First Range
*        |------=== |
     *        Second Range
     *        | === ------|
     * ```
     *
     * This method attempts to determine if two time ranges overlap.
     * @param  {date}  firstRangeStart
     * The start of the first range.
     * @param  {date}  firstRangeEnd
     * The end of the first range.
     * @param  {date}  secondRangeStart
     * The start of the second range.
     * @param  {date}  secondRangeEnd
     * The end of the second range.
     * @return {array}
     * Returns the overlapping range (intersection of two ranges).
     * If there is no overlap, the array is empty.
     */
    intersection (starta, enda, startb, endb) {
      // The ranges are the same
      if (starta.getTime() === startb.getTime() && enda.getTime() === endb.getTime()) {
        return [starta, endb]
      }

      // No overlap
      if (enda < startb || starta > endb) {
        return []
      }

      // Determine overlap

      // The second range is entirely within the first
      if (starta < startb && enda > endb) {
        return [startb, endb]
      }

      // The first range is entirely within the second
      if (startb < starta && endb > enda) {
        return [starta, enda]
      }

      // The first range begins before the second
      if (starta < startb) {
        return [startb, enda]
      }

      // The first range begins after the second
      return [starta, endb]
    }

    /** TJ NOTES:
      There is a 6 hour difference in the function output:
        Last of Month

            2018-01-15T09:45:30.999Z 'input'
            2018-01-31T23:59:59.999Z 'expected'
            2018-02-01T05:59:59.999Z 'function output'

            ✖ Date is returning LAST MOMENT OF MONTH correctly
            ---------------------------------------------------
              operator: ok
              expected: true
              actual:   false
              at: Test.test (/Users/TheTeejers/work_practice/index.js:593:5)
              stack: |-
      */

    /**
     * Generate the last moment of the month.
     * This is specific to the locale/timezone offset (i.e. NOT UTC).
     *
     * For example, `lastOfMonth(new Date(2017, 1, 17))` returns January 31, 2017
     * 11:59:59 PM (999 milliseconds).
     * @param  {Date} date
     * @return {Date}
     */
    lastOfMonth (date = null) {
      let newdate = new Date(NGN.coalesce(date, new Date()).getTime())
      newdate = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0)

      return this.lastMoment(newdate)
    }

    /** TJ NOTES:
      There is a 6 hour difference in the function output:
        Last Moment of the Day

          2018-01-01T09:45:30.999Z 'input'
          2018-01-01T23:59:59.999Z 'expected'
          2018-01-02T05:59:59.999Z 'function output'

          ✖ Date is returning LAST MOMENT OF DAY correctly
          -------------------------------------------------
            operator: ok
            expected: true
            actual:   false
            at: Test.test (/Users/TheTeejers/work_practice/index.js:604:5)
            stack: |-

      ALSO I believe that the description of the function needs to be revised to:
      For example, `lastOfMonth(new Date(2017, 1, 17))` returns January 1, 2017
      11:59:59.999 PM.
      */

    /**
     * Return the last moment of the day (11:59:59 PM).
     *
     * For example, `lastOfMonth(new Date(2017, 1, 17))` returns January 1, 2017
     * 12:00:00 AM.
     * @param  {Date} date
     * @return {Date}
     */
    lastMoment (date) {
      let newdate = new Date(NGN.coalesce(date, new Date()).getTime())
      newdate.setUTCHours(23)
      newdate.setUTCMinutes(59)
      newdate.setUTCSeconds(59)
      newdate.setUTCMilliseconds(999)

      return newdate
    }

    /** TJ NOTES:
      There is a 6 hour difference in the function output:
        First Moment of the Month

          2018-01-29T09:45:30.999Z 'input'
          2018-01-01T00:00:00.000Z 'expected'
          2018-01-01T06:00:00.000Z 'function output'

          ✖ Date is returning FIRST MOMENT OF MONTH correctly
          ----------------------------------------------------
            operator: ok
            expected: true
            actual:   false
            at: Test.test (/Users/TheTeejers/work_practice/index.js:616:5)
            stack: |-
      */

    /**
     * Returns a date set to the first moment of the month.
     * This is specific to the locale/timezone offset (i.e. NOT UTC).
     * @param  {[type]} date
     * @return {Date}
     */
    firstOfMonth (date = null) {
      let newdate = new Date(NGN.coalesce(date, new Date()).getTime())
      newdate.setUTCDate(1)
      newdate = this.firstMoment(newdate)

      return newdate
    }

    /** TJ NOTES:
        First Moment of the Day

            2018-01-01T09:45:30.999Z 'input'
            2018-01-01T00:00:00.000Z 'expected'
            2018-01-01T06:00:00.000Z 'function output'

            ✖ Date is returning FIRST MOMENT OF DAY correctly
            --------------------------------------------------
              operator: ok
              expected: true
              actual:   false
              at: Test.test (/Users/TheTeejers/work_practice/index.js:628:5)
              stack: |-
        */

    /**
     * Return the first moment of the day (12:00:00 AM).
     * @param  {Date} date
     * @return {Date}
     */
    firstMoment (date) {
      let newdate = new Date((NGN.coalesce(date, new Date())).getTime())
      newdate.setUTCHours(0)
      newdate.setUTCMinutes(0)
      newdate.setUTCSeconds(0)
      newdate.setUTCMilliseconds(0)

      return newdate
    }

    /**
     * Convert standard time (12hr) to military time (24hr).
     * @param  {string} time
     * @return {string}
     */
    convertStandardToMilitaryTime (time) {
      if (!time || time.trim().length === 0) {
        return '00:00:00'
      }

      time = time.split(' ')

      let tt = time.pop()
      tt = tt.replace(/[^A-Za-z]/gi, '').toUpperCase()

      time = time[0].split(':')

      let hours = parseInt(time[0].toString().replace(/[^0-9]/gi, ''), 10)
      let min = time[1].replace(/[^0-9]/gi, '')

      if (tt === 'PM' && hours < 12) {
        hours = hours + 12
      }

      hours = hours.toString()

      if (hours.length < 2) {
        hours = `0${hours}`
      }

      return `${hours}:${min}:00`
    }

    /**
     * Convert military to standard time.
     * @param  {String} time
     * The time string, such as 18:00 (returns '06:00 PM').
     */
    convertMilitaryToStandardTime (time) {
      const input = time

      time = time.split(/\s{1,10}/)[0] // Make sure no "AM" or "PM" are provided.
      time = time.split(':')

      if (time.length !== 2) {
        throw new Error(`Invalid military time string: ${input}`)
      }

      let hours = parseInt(time[0].replace(/[^0-9]/gi, ''), 10)
      let minutes = parseInt(time[1].replace(/[^0-9]/gi, ''), 10)
      let tt = 'AM'

      if (minutes > 59 || minutes < 0 || hours < 0 || hours > 23) {
        throw new Error(`Invalid military time string: ${input}`)
      }

      if (hours > 11) {
        tt = 'PM'
        hours = hours - 12
      }

      if (hours < 10) {
        hours = `0${hours}`
      }

      if (minutes < 10) {
        minutes = `0${minutes}`
      }

      return `${hours}:${minutes} ${tt}`
    }

    /** TJ NOTES:
      Time is off by 6
          Clean Date Format

            2018-01-01T00:00:00.000Z 'input'
            2018/01/01T00:00:00Z expected
            2017/12/31T00:00:00Z function output

            ✖ Date is returning CLEAN FORMAT correctly
            -------------------------------------------
              operator: ok
              expected: true
              actual:   false
              at: Test.test (/Users/TheTeejers/work_practice/index.js:690:5)
              stack: |-
        EDIT:  Fixed using UTC times and updating cleanDateStringFormat
        */

    /**
     * Force a clean date format (supports IE11 date formats).
     * @param  {string}  date
     * @param  {Boolean} [useIsoFormat=false]
     * @return {date}
     */
    cleanDateFormat (date, useIsoFormat = false) {
      if (typeof date === 'string') {
        let time = date.split(' ')
        date = time.shift()
        date = date.replace(/\/|\\/gi, '-').split(' ')
        date = date[0]
        date = date.split(/\/|/)

        time = time.join(' ').trim()

        let yyyy = date[0].toString().replace(/[^0-9]/gi, '')
        let mm = parseInt(date[1].toString().replace(/[^0-9]/gi, ''), 10)
        let dd = parseInt(date[2].toString().replace(/[^0-9]/gi, ''), 10)

        if (mm < 10) {
          mm = `0${mm}`
        }
        mm = mm.toString()

        if (dd < 10) {
          dd = `0${d}`
        }
        dd = dd.toString()

        if (time.length === 0) {
          return `${yyyy}${this.METADATA.separator}${mm}${this.METADATA.separator}${dd}${useIsoFormat ? 'T' : ' '}00:00:00${useIsoFormat ? 'Z' : ''}`
        }

        return `${yyyy}${this.METADATA.separator}${mm}${this.METADATA.separator}${dd}${useIsoFormat ? 'T' : ' '}${this.cleanTimeStringFormat(time)}${useIsoFormat ? 'Z' : ''}`
      }

      let hr = date.getUTCHours()
      let min = date.getUTCMinutes()

      return this.cleanDateStringFormat(date, `${hr}:${min}:00`)
    }

    /** TJ NOTES:
      Although it passes, the input time is off by 6 hours:

            Clean Date String Format

              2018-01-01T06:00:00.000Z 'date input'
              13:00:00 time input
              2018/01/01T13:00:00Z expected
              2018/01/01T13:00:00Z function output
              ✔ Date is returning CLEAN STRING FORMAT correctly

      EDIT:  Fixed using UTC times
        */

    /**
     * Force a clean date string. Supports IE11 formats.
     * @param  {string} date
     * @param  {string} time
     * @return {date}
     */
    cleanDateStringFormat (date, time) {
      let yr = date.getUTCFullYear()
      let mo = date.getUTCMonth() + 1
      let day = date.getUTCDate()

      if (mo < 10) {
        mo = `0${mo}`
      }

      if (day < 10) {
        day = `0${day}`
      }

      return `${yr}${this.METADATA.separator}${mo}${this.METADATA.separator}${day}T${this.cleanTimeStringFormat(time)}Z`
    }

    /**
     * Force a clean time string. Supports IE11 formats.
     * @param  {string} time
     * @return {string}
     */
    cleanTimeStringFormat (time) {
      time = time.split(' ')[0]
      time = time.split(':')

      let hr = parseInt(time[0].replace(/[^0-9]/gi, ''), 10)
      let min = parseInt(time.length > 1 ? time[1].replace(/[^0-9]/gi, '') : 0, 10)
      let sec = parseInt(time.length > 2 ? time[2].replace(/[^0-9]/gi, '') : 0, 10)

      if (hr < 10) {
        hr = `0${hr}`
      }
      hr = hr.toString()

      if (min < 10) {
        min = `0${min}`
      }
      min = min.toString()

      if (sec < 10) {
        sec = `0${sec}`
      }
      sec = sec.toString()

      return `${hr}:${min}:${sec}`
    }

    /** TJ NOTES:
      Although it passes, the input time is off by 6 hours:

            Set Time

              2018-01-01T06:00:00.000Z 'date input'
              5:15:10 time input
              1514805310000 'expected'
              2018-01-01T11:15:10.000Z 'expected'
              1514805310000 'function output'
              2018-01-01T11:15:10.000Z 'function output'
              ✔ Date is returning SET TIME correctly
        */

    /**
     * Create a proper JS date from a date/time string.
     * @param {string} date
     * The date to specify the time for.
     * @param {string} time
     */
    setTime (date, time) {
      time = this.cleanTimeStringFormat(time)
      time = time.split(':')

      date.setHours(parseInt(time[0].replace(/[^0-9]/gi, '')))
      date.setMinutes(parseInt(time[1].replace(/[^0-9]/gi, '')))
      date.setSeconds(parseInt(time[2].replace(/[^0-9]/gi, '')))

      return date
    }

    /** TJ NOTES:
      Working correctly with:
        - 12HR LEADING 0 TIME TABLE
        - 12HR NO LEADING 0 TIME TABLE
      Working as long as you have a ' ' after midnight
      (i.e. '00:00 ' passes whilst '00:00' fails):
        - 24HR NO LEADING 0 TIME TABLE
      Not Working even though output from function seems to match expected
      (same issue with midnight as above):
        - 24HR LEADING 0 TIME TABLE

      The way the code was originally, there was always a space
      following the 24 hour format times.  I added the portion of the code
      below 'if (tt === 'AM' || tt === 'PM') {...}' to the existing code
      to remove the space but the issue with midnight (i.e. 00:00) remains.
      I believe this is due to the portion of the code:
      '`${hour === 12 ? hour : '00'}:00 ${tt}`'
      */
    /**
     * Generate a time table.
     * @param  {Number} [interval=15]
     * The number of minutes between each interval.
     * @param  {Number} [format=12]
     * 12 or 24 hour format.
     * @param  {Boolean} [enforceFormat=true]
     * Enforce the `0` before single digit hours.
     * @return {Array}
     * Returns an array of times (hh:mm tt).
     */
    createTimeTable (interval = 15, format = 12, enforceFormat = true) {
      // Generate based on interval
      let intervals = Math.ceil((24 * 60) / interval)
      let hour = format === 12 ? 12 : 0
      let tt = format === 12 ? 'AM' : ''
      let minute = 0
      let results = [
        `${hour === 12 ? hour : '00'}:00 ${tt}`
      ]

      for (let i = 1; i < intervals; i++) {
        minute += interval

        let hr = Math.floor(minute / 60) + hour
        let min = minute % 60

        if (format === 12 && hr > 12) {
          hr = hr % 12
          hr = hr === 0 ? 12 : hr

          if (minute / (12 * 60) >= 1) {
            tt = 'PM'
          }
        }

        if (min < 10) {
          min = `0${min.toString()}`
        }

        if (enforceFormat && hr < 10) {
          hr = `0${hr}`
        }

        if (tt === 'AM' || tt === 'PM') {
          results.push(`${hr}:${min} ${tt}`)
        } else {
          results.push(`${hr}:${min}`)
        }

        // results.push(`${hr}:${min} ${tt}`)
      }
      return results
    }

    /**
     * Determines whether the specified date falls on a weekday.
     * @param  {Date} date
     * @return {Boolean}
     */
    isWeekday (date) {
      let day = date.getUTCDay()
      return day > 0 && day < 6
    }

    /**
     * Determines whether the specified date falls on a weekend.
     * @param  {Date} date
     * @return {Boolean}
     */
    isWeekend (date) {
      let day = date.getUTCDay()
      return day === 0 || day === 6
    }

    /**
     * Determines whether the date falls within a leap year.
     * @param  {Date} date
     */
    isLeapYear (date) {
      let year = date.getUTCFullYear()

      return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
    }

    /** TJ NOTES:
      The quarters are not showing Q1-Q4.
      They are showing Q2-Q5 with no Q1.
      Outputs are as follow with start month and day set to 1:
       Feb, Mar, Apr => Q2
       May, Jun, Jul => Q3
       Aug, Sep, Oct => Q4
       Nov, Dec, Jan => Q5
      */

    /**
     * Determines what quarter the date falls within. By default, a
     * standard calendar year is used, starting January 1. The calendar
     * month and day may be specified for a custom quarter system (such
     * as a fiscal calendar).
     * @param  {Date} date
     * @param  {Number} [calendarYearStartMonth=1]
     * The month of the year when the quarter system begins.
     * @param  {Number} [calendarYearStartDay=1]
     * The day of the month when the quarter system begins.
     * @return {Number}
     * Returns the quarter (1-4).
     */
    quarter (date, calendarYearStartMonth = 1, calendarYearStartDay = 1) {
      if (calendarYearStartMonth < 1 || calendarYearStartMonth > 12) {
        throw new Error('Invalid calendar year start month. Must be 1-12.')
      }

      if (calendarYearStartDay < 1 || calendarYearStartDay > 31) {
        throw new Error('Invalid calendar year start day. Must be 1-31 (or up to the last day of the month).')
      }

      let start = new Date(date.getUTCFullYear(), calendarYearStartMonth, calendarYearStartDay)

      while (start > date) {
        start = this.addYear(start, -1)
      }

      let quarter = 1
      while (start < date) {
        quarter++
        // TJ NOTES: changed this.addMonth(start, 3) to this.addMonth(start, 4)
        // and quarters are now only showing Q1-Q4 rather than Q2-Q5
        start = this.addMonth(start, 3)
      }

      return quarter
    }

    /** TJ NOTES:
      The test will not run because of an error.  I was not able to
      discover the cause of the error but I did note that the error would
      appear at random locations in the console log of 'value' in the terminal

      The following error appears when running the test:

        Interval

                { source: 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M',
                  period: 'P1Y2M10DT2H30M',
                  valid: true,
                  years: 1,
                  months: 2,
                  weeks: 0,
                  days: 10,
                  hours: 2,
                  minutes: 30,
                  seconds: 0,
                  start: '2008-03-01',
                  end: '2014-02-23T01:30:00Z',
                  intervalCount: 5,
                  intervals: [ 1 ] }
                /^R(\d*){0,10}\/(\d{4}(?:-\d{2}){2}T\d{2}(?::\d{2}){2}([A-Za-z]*)?)\/(P(?=.)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=.)(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)$/ 'LOOK!!!'
            /Users/TheTeejers/work_practice/DateTime.js:1659
                    intervalCount: match[1] === undefined ? -1 : match[1],
                                        ^

            TypeError: Cannot read property '1' of null
                at DateTime.parseInterval (/Users/TheTeejers/work_practice/DateTime.js:1659:29)
                at Test.test (/Users/TheTeejers/work_practice/index.js:1341:25)
                at Test.bound [as _cb] (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:77:32)
                at Test.run (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:96:10)
                at Test.bound [as run] (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:77:32)
                at Immediate.next [as _onImmediate] (/Users/TheTeejers/work_practice/node_modules/tape/lib/results.js:71:15)
                at runCallback (timers.js:781:20)
                at tryOnImmediate (timers.js:743:5)
                at processImmediate [as _immediateCallback] (timers.js:714:5)
      */
    /**
     * Parse an ISO-8601:2004 repeating interval (recurrence) pattern to a usable object.
     * @param {string} datestring
     * The date/recurrence string, which should follow the [Rn/YYYY-MM-DDTHH:NN:SSZ/PnYnMnWnDTnHnMnS pattern](https://en.wikipedia.org/wiki/ISO_8601#Durations).
     * For example, `R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M` indicates the
     * pattern should be repeated 5 times, starting on March 1, 2008 at 1:00PM UTC. It should be repeated every 1 year, 2 months, 10 days, 2 hours, and 30 minutes.
     * @param {boolean} [calculateIntervals=false]
     * Set this to `true` to add an array of intervals. Using the `R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M` example,
     * the recurrence pattern would start on March 1, 2008 at 1:00PM UTC, yielding the following interval dates:
     *
     * ```
     * [
     *   2009-05-11T15:30:00Z, // Occurrence 1
     *   2010-07-21T18:00:00Z, // Occurrence 2
     *   2011-10-02T20:30:00Z, // Occurrence 3
     *   2012-12-12T23:00:00Z, // Occurrence 4
     *   2014-02-23T01:30:00Z, // Occurrence 5 (Last Occurrence)
     * ]
     * ```
     * @return {object}
     * Returns an object like:
     * ```
     * {
     *   source: 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M',
     *   period: 'P1Y2M10DT2H30M',
     *   valid: true, // Indicates input is a valid recurrence duration pattern.
     *   years: 1,
     *   months: 2,
     *   weeks: 0,
     *   days: 10,
     *   hours: 2,
     *   minutes: 30,
     *   seconds: 0,
     *   start: Date, // 2008-03-01
     *   end: Date, // 2014-02-23T01:30:00Z
     *   intervalCount: 5, // This will be -1 if the interval is indefinite (forever).
     *   intervals: [ // OPTIONAL (only if calculateIntervals is true)
     *     ...
     *   ]
     * }
     * ```
     */
    parseInterval (value, calculateIntervals = false) {
      if (!this.METADATA.PATTERN.ISO8601R.test(value)) {
        return {
          source: value,
          valid: false,
          years: 0,
          months: 0,
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          start: null,
          end: null,
          timezone: null,
          intervalCount: 0
        }
      }

      let match = this.METADATA.PATTERN.ISO8601R.exec(value)

      // Populate base results
console.log('MATCH[2]', match)
      let result = {
        source: value,
        valid: true,
        intervalCount: match[1] === undefined ? -1 : parseInt(match[1]),
        start: new Date(`${match[2]}T${NGN.coalesce(match[3], '00:00:00Z')}`),
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        timezone: NGN.coalesce(match[4])
      }

      let period
      if (match[4]) {
        period = this.parseDuration(match[5])
      }

      // Parse the period pattern
      if (match[4]) {
        result.period = period.source
        result.years = period.years
        result.months = period.months
        result.weeks = period.weeks
        result.days = period.days
        result.hours = period.hours
        result.minutes = period.minutes
        result.seconds = period.seconds
        result.valid = period.valid
      }

      // Generate the intervals
      if (calculateIntervals && match[1] && match[5]) {
        result.intervals = []

        let currentDate = result.start

        for (let i = 0; i < result.intervalCount; i++) {
          currentDate = this.addDuration(currentDate, period)

          result.intervals.push(toString(currentDate))
        }

        result.end = currentDate
      } else if (match[1] !== null) {
        let futurePeriod = {
          years: result.years * result.intervalCount,
          months: result.months * result.intervalCount,
          weeks: result.weeks * result.intervalCount,
          days: result.days * result.intervalCount,
          hours: result.hours * result.intervalCount,
          minutes: result.minutes * result.intervalCount,
          seconds: result.seconds * result.intervalCount,
          valid: true
        }

        result.end = new Date(result.start.getTime())
console.log(period)
        for (let i = 0; i < result.intervalCount; i++) {
          result.end = this.addDuration(result.end, period)
        }
// console.log('FUTURE', futurePeriod)
//         result.end = this.addDuration(result.start, futurePeriod)
console.log('NEW DATE', result.start, result.end)
      } else {
        result.end = null
      }

      return result
    }

    /**
     * Parse an ISO-8601 [PnYnMnWnDTnHnMnS duration](https://en.wikipedia.org/wiki/ISO_8601#Durations).
     * @param  {string} value
     * For example, `P1Y2M10DT2H30M` indicates the duration period is 1 year, 2 months,
     * 10 days, 2 hours, and 30 minutes.
     * @return {object}
     * Returns an object like:
     * ```
     * {
     *   source: 'P1Y2M10DT2H30M',
     *   valid: true, // Indicates input is a valid period pattern.
     *   years: 1,
     *   months: 2,
     *   weeks: 0,
     *   days: 10,
     *   hours: 2,
     *   minutes: 30,
     *   seconds: 0
     * }
     * ```
     */
    parseDuration (value) {
      if (!this.METADATA.PATTERN.ISO8601P.test(value)) {
        return {
          source: value,
          valid: false,
          years: 0,
          months: 0,
          weeks: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      }

      let match = this.METADATA.PATTERN.ISO8601P.exec(value)

      return {
        source: value,
        valid: true,
        years: parseInt(match[2]) || 0,
        months: parseInt(match[4]) || 0,
        weeks: parseInt(match[6]) || 0,
        days: parseInt(match[8]) || 0,
        hours: parseInt(match[10]) || 0,
        minutes: parseInt(match[12]) || 0,
        seconds: parseInt(match[14]) || 0
      }
    }

    /** TJ NOTES:
      If you put ANY value in for 'weeks' the you will only get the
      return P${weeks}W regardless of any other input for the
      other time periods.
      EDIT:  Fixed.  See notes within the createDurationString function code.
      */
    /**
     * Create an [ISO-8601 duration string](https://en.wikipedia.org/wiki/ISO_8601#Durations).
     * @warn Only integers may be supplied as arguments. If a decimal/float value is
     * supplied, it will be rounded down to the nearest integer.
     * @param  {Number} [years=0]
     * @param  {Number} [months=0]
     * @param  {Number} [weeks=0]
     * @param  {Number} [days=0]
     * @param  {Number} [hours=0]
     * @param  {Number} [minutes=0]
     * @param  {Number} [seconds=0]
     * @return {string}
     * Returns a string like `P1Y2M3DT5H30M1S`, which translates to a duration of
     * 1 year, 2 months, 3 days, 5 hours, 30 minutes, and 1 second.
     */
    createDurationString (years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0) {
      // Only allow integers
      years = Math.floor(years)
      months = Math.floor(months)
      weeks = Math.floor(weeks)
      days = Math.floor(days)
      hours = Math.floor(hours)
      minutes = Math.floor(minutes)
      seconds = Math.floor(seconds)

      // Disallow negative values
      if (years < 0) {
        throw new Error('Negative year values are not allowed.')
      }

      if (months < 0) {
        throw new Error('Negative month values are not allowed.')
      }

      if (weeks < 0) {
        throw new Error('Negative week values are not allowed.')
      }

      if (days < 0) {
        throw new Error('Negative day values are not allowed.')
      }

      if (hours < 0) {
        throw new Error('Negative hour values are not allowed.')
      }

      if (minutes < 0) {
        throw new Error('Negative minute values are not allowed.')
      }

      if (seconds < 0) {
        throw new Error('Negative second values are not allowed.')
      }

      // Make sure values are provided
      if ((years + months + weeks + days + hours + minutes + seconds) === 0) {
        throw new Error('Must specify at least one of the following values: years, months, weeks, days, hours, minutes, or seconds.')
      }

      // Weeks are treated specially
      if (((years + months + days + hours + minutes + seconds) === 0) && weeks > 0) {
        if (weeks > 51) {
          throw new Error(`${weeks} is an invalid week value. Choose a number from 0-51.`)
        }

        return `P${weeks}W`
        /** TJ NOTES: I added an 'else' statement containing the rest
        of the cose for this function.  This is to make sure that if user
        inputs 'weeks' as well as other time periods, the function does
        not only return 'P${weeks}W'.  I also added the if(weeks >0) {...}
        statement found below to convert the number of weeks to days.
        This also 'fixes' the issue with createRepeatingIntervalString
        */
      } else {
        // Sanitze inputs by moduli. The order in which these are executed is important.
        if (months > 12) {
          years += Math.floor(months / 12)
          months = months % 12
        }

        if (weeks > 0) {
          days += Math.floor(weeks * 7)
          weeks = weeks % 52
        }

        if (seconds > 59) {
          minutes += Math.floor(seconds % 60)
          seconds = seconds % 60
        }

        if (minutes > 59) {
          hours += Math.floor(minutes % 60)
          minutes = minutes % 60
        }

        if (hours > 23) {
          days += Math.floor(hours / 24)
          hours = hours % 24
        }

        // Start the string
        let str = 'P'

        // If a date range is specified, apply it.
        if (years >= 0 || months > 0 || days > 0) {
          if (years >= 0) {
            str = `${str}${years}Y`
          }

          if (months >= 0) {
            str = `${str}${months}M`
          }

          if (days >= 0) {
            str = `${str}${days}D`
          }
        }

        // If a time range is specified, apply it.
        if (hours > 0 || minutes > 0 || seconds > 0) {
          str = `${str}T`

          if (hours > 0) {
            str = `${str}${hours}H`
          }

          if (minutes > 0) {
            str = `${str}${minutes}M`
          }

          if (seconds > 0) {
            str = `${str}${seconds}S`
          }
        }

        return str
      }
    }
    /** TJ NOTES:
      If you put ANY value in for 'weeks' the you will only get the
      return P${weeks}W regardless of any other input for the
      other time periods.
      EDIT:  Fixed.  See notes within the createDurationString function code.
      */
    /**
     * Create an [ISO-8601 repeating interval string](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals).
     * @warn Only integers may be supplied as arguments. If a decimal/float value is
     * supplied, it will be rounded down to the nearest integer.
     * @param  {Date} [start=null]
     * The date when the interval starts.
     * @param  {Number} [interval=0]
     * The number of intervals. To secify an unending interval (i.e. forever),
     * this can be set to `null` or a value less than or equal to `0`.
     * @param  {Number} [years=0]
     * @param  {Number} [months=0]
     * @param  {Number} [weeks=0]
     * @param  {Number} [days=0]
     * @param  {Number} [hours=0]
     * @param  {Number} [minutes=0]
     * @param  {Number} [seconds=0]
     * Returns a string like `R3/2018-03-01T15:00:00Z/P1Y2M3DT5H30M1S`, which
     * says "Starting on March 3, 2018 at 2:00PM UTC, repeat every 1 year,
     * 2 months, 3 days, 5 hours, 30 minutes, and 1 second until the interval
     * has been executed 3 times."
     */
    createRepeatingIntervalString (start = null, interval = 0, years = 0, months = 0, weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0) {
      let str = 'R'
      let duration = this.createDurationString(years, months, weeks, days, hours, minutes, seconds)

      if (typeof interval === 'number' && interval >= 0) {
        str = `R${interval}`
      }

      return `${str}/${start.toISOString()}/${duration}`
    }

    /** TJ NOTES:
      This throws an error of the following:
         Repeating Interval Iterator

            2018-03-01T15:00:00.000Z 'input'
        /Users/TheTeejers/work_practice/DateTime.js:10
              if (NGN.typeof(date) !== 'date') {
                             ^

        ReferenceError: date is not defined
            at new DateIterator (/Users/TheTeejers/work_practice/DateTime.js:10:22)
            at DateTime.createRepeatingIntervalIterator (/Users/TheTeejers/work_practice/DateTime.js:1984:14)
            at Test.test (/Users/TheTeejers/work_practice/index.js:1500:25)
            at Test.bound [as _cb] (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:77:32)
            at Test.run (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:96:10)
            at Test.bound [as run] (/Users/TheTeejers/work_practice/node_modules/tape/lib/test.js:77:32)
            at Immediate.next [as _onImmediate] (/Users/TheTeejers/work_practice/node_modules/tape/lib/results.js:71:15)
            at runCallback (timers.js:781:20)
            at tryOnImmediate (timers.js:743:5)
            at processImmediate [as _immediateCallback] (timers.js:714:5)

    */
    /**
     * Create a NGNX.DATE.DateIterator using an [ISO-8601 repeating interval string](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals).
     * @param  {Date} interval
     * The ISO-8601 repeating interval/duration. This will be in `Rn/YYYY-MM-DDTHH:NN:SSZPnYnMnDTnHnMnS` format.
     * This type of duration can be generated using the #createRepeatingIntervalString method.
     * @return {[type]}                    [description]
     */
    createRepeatingIntervalIterator (intervalString) {
      return new DateIterator(intervalString)
    }
  }

  NGNX.DATE = new DateTime()
})()
