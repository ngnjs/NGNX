import Duration from './Duration'
import Interval from './Interval'
import Iterator from './Iterator'

/**
 * @class NGNX.DATE
 * A utility library for date and time manipulation.
 * @fires locale.modified
 * Triggered when the locale has changed. An object containing `new` and `old`
 * keys identifies the new and old locale.
 * @todo Add a fiscal calendar generator
 * @todo Add 5/4/4 pattern to quarters (and other valid calendar patterns)
 * @todo Add ability to reverse recurrence pattern (count back from origin date instead of forward from origin date.)
 */
export default class DateTime extends NGN.EventEmitter {
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
      Iterator: NGN.const(Iterator),
      Duration: NGN.const(Duration),
      Interval: NGN.const(Interval),

      METADATA: NGN.privateconst({
        // locale: NGN.coalesce(NGN.global.navigator.language, 'en-US'),
        locale: 'en-US',

        separator: DateSeparator,

        getDayNames: (locale) => {
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

        changeDuration: (date, period, multiplier = 1, add = true) => {
          let duration = period

          multiplier = multiplier > 0 ? Math.floor(multiplier) : Math.ceiling(multiplier)

          if (typeof period === 'string') {
            duration = this.parseDuration(period)

            if (!duration.valid) {
              throw new Error(`${period} is an invalid duration.`)
            }
          }

          if (duration instanceof Duration) {
            if (!duration.valid) {
              throw new Error(`${duration.toString()} is an invalid duration.`)
            }

            duration = duration.JSON
          }

          let interval = (
            // Do not include years by millisecond to account for leap years.
            (duration.weeks * this.METADATA.WEEK) +
            (duration.days * this.METADATA.DAY) +
            (duration.hours * this.METADATA.HOUR) +
            (duration.minutes * this.METADATA.MINUTE) +
            (duration.seconds * this.METADATA.SECOND)
          ) * multiplier

          // Forcibly guarantee a month attribute exists.
          if (!duration.hasOwnProperty('months')) {
            duration.months = 0
          }

          let newdate

          if (add) {
            newdate = this.addMonth(this.addMillisecond(this.addYear(date, (duration.years || 0) * multiplier), interval), duration.months * multiplier)
          } else {
            newdate = this.addMonth(this.addMillisecond(this.addYear(date, 0 - ((duration.years || 0) * multiplier)), 0 - interval), 0 - (duration.months * multiplier))
          }

          // Support leap year when days are part of the duration.
          if (duration.days > 0) {
            let leapYears = this.getLeapYears(date, newdate)

            if (leapYears.length > 0) {
              newdate = this.addDay(newdate, leapYears.length)
            }
          }

          return newdate
        },

        SECOND: 1000,
        MINUTE: 60000,
        HOUR: 3600000,
        DAY: 86400000,
        WEEK: 604800000,
        YEAR: 31536000000,

        PATTERN: {
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
  addMillisecond (date, milliseconds = 1) {
    return new Date(date.getTime() + milliseconds)
  }

  /**
   * Add seconds to a date (supports negative values for substraction)
   * @param {Date} date
   * @param {Number} seconds
   * The number of seconds to add to the date.
   * @return {Date}
   */
  addSecond (date, seconds = 1) {
    return new Date(date.getTime() + (seconds * this.METADATA.SECOND))
  }

  /**
   * Add minutes to a date (supports negative values for substraction)
   * @param {Date} date
   * @param {Number} minutes
   * The number of minutes to add to the date.
   * @return {Date}
   */
  addMinute (date, minutes = 1) {
    return new Date(date.getTime() + (minutes * this.METADATA.MINUTE))
  }

  /**
   * Add hours to a date (supports negative values for subtraction).
   * @param {Date} date
   * @param {Number} hours
   * The number of hours to add to the date.
   * @return {Date}
   */
  addHour (date, hours = 1) {
    return new Date(date.getTime() + (hours * this.METADATA.HOUR))
  }

  /**
   * Add day(s) to a date (supports negative values for substraction).
   * @param {Date} date
   * @param {Number} days
   * The number of days to add to the date.
   * @return {Date}
   */
  addDay (date, days = 1) {
    return new Date(date.getTime() + (days * this.METADATA.DAY))
  }

  /**
   * Add week(s) to a date (supports negative values for substraction).
   * @param {Date} date
   * @param {Number} weeks
   * The number of weeks to add to the date.
   * @return {Date}
   */
  addWeek (date, weeks = 1) {
    return new Date(date.getTime() + (weeks * this.METADATA.WEEK))
  }

  /**
   * Add month(s) to a date (supports negative values for substraction).
   * @param {Date} date
   * @param {Number} months
   * The number of months to add to the date.
   * @return {Date}
   */
  addMonth (date, months = 1) {
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
      workingDate.setUTCMonth(workingDate.getUTCMonth() + months)
    } else if (months < 0) {
      months = Math.abs(months) // Convert to a positive number to make the math easy.

      let workingMonth = (workingDate.getUTCMonth() + 1) // Get the active working month on a 1-12 scale.

      if (months > workingMonth) {
        // If the number of months to subtract are greater than the current
        // working month, the date will fall in the prior year.
        workingDate = this.addYear(workingDate, -1)
        months = 12 - months

        workingDate.setUTCMonth(workingDate.getUTCMonth() + months)
      } else {
        // If the number of months to subtract is less than the current
        // working month, the date will fall earlier in the same year.
        months = workingMonth - months

        workingDate.setUTCMonth(months - 1)
      }
    }

    return diff !== 0 ? this.addMinute(workingDate, diff) : workingDate
  }

  /**
   * Add year(s) to a date (supports negative values for substraction).
   * @param {Date} date
   * @param {Number} years
   * The number of years to add to the date.
   * @return {Date}
   */
  addYear (date, years = 1) {
    let newdate = new Date(date.getTime())
    newdate.setFullYear(newdate.getFullYear() + years)

    return newdate
  }

  /**
   * Add a [ISO-8601:2004 duration interval](https://en.wikipedia.org/wiki/ISO_8601#Durations)
   * to a date.
   * @param {Date} date
   * The date to apply the interval to.
   * @param {string|object|NGNX.DATE.Duration} duration
   * This can be the ISO-8601:2004 period pattern (PnYnMnDTnHnMnS or PnW), an
   * NGNX.DATE.Duration intance, or an object containing the following attributes:
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
   * @param {Number} [multiplier=1]
   * A whole number specifiying how many times the duration should be added.
   * By default this is `1` (add one duration). The multiplier is most useful
   * when a specific interval value neds to be obtained, such as the 7th period
   * in an interval (7 durations).
   * @return {Date}
   * Returns the new date after the duration has been applied (added).
   */
  addDuration (date, period, multiplier = 1) {
    return this.METADATA.changeDuration(date, period, multiplier)
  }

  /**
   * Subtract a [ISO-8601:2004 duration interval](https://en.wikipedia.org/wiki/ISO_8601#Durations)
   * from a date.
   * @param {Date} date
   * The date to apply the interval to.
   * @param {string|object|NGNX.DATE.Duration} duration
   * This can be the ISO-8601:2004 period pattern (PnYnMnDTnHnMnS or PnW), an
   * NGNX.DATE.Duration intance, or an object containing the following attributes:
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
   * @param {Number} [multiplier=1]
   * A whole number specifiying how many times the duration should be subtracted.
   * By default this is `1` (subtract one duration). The multiplier is most useful
   * when a specific interval value neds to be obtained, such as the 7th period
   * in an interval (7 durations from start).
   * @return {Date}
   * Returns the new date after the duration has been applied (subtracted).
   */
  subtractDuration (date, period, multiplier = 1) {
    return this.METADATA.changeDuration(date, period, multiplier, false)
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
        dd = `0${dd}`
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
   * @param  {Date|Number} date
   * This is the date to check for a leap year or a year number to determine if
   * it's a leap year
   */
  isLeapYear (date) {
    let year = date instanceof Date ? date.getUTCFullYear() : date

    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
  }

  /**
   * Retrieve the known leap years between two dates/years.
   * @param  {Date|Number} begin
   * The start date or year.
   * @param  {Date|Number} end
   * The end date or year.
   * @param {Boolean} [ignoreDays=false]
   * Includes leap year values even if the start date
   * has not yet reached Feb 29 or the end date is before Feb 28.
   * @return {Array}
   * Returns an array of the leap years found between the beginning and end.
   * The beginning and end years are included in the search. However; dates are
   * more specific. If the start date is on or after March 1, the year is ignored
   * (since the leap year additional day, Feb 29, has already occurred). If the end date
   * is on or before Feb 28, the leap year additional daya has ot already occurred.
   * This functionality can be ignored by setting the `ignoreDays` argument to `true`.
   */
  getLeapYears (begin, end) {
    let leapYears = []

    // Short circuit simple calculation
    if (typeof begin === 'number' && typeof end === 'number') {
      for (let yr = begin; yr <= end; yr++) {
        if (this.isLeapYear(yr)) {
          leapYears.push(yr)
        }
      }

      return leapYears
    }

    // Handle specific date sequences
    begin = typeof begin === 'number' ? new Date(`${begin}-01-01T00:00:000.Z`) : begin
    end = typeof end === 'number' ? new Date(`${end}-01-01T00:00:000.Z`) : end

    // Force correct order
    if (begin > end) {
      NGN.INFO(`#getLeapYears() returned 0 because the start date (${begin.toISOString()}) is after the end date (${end.toISOString()}) `)
      return 0
    }

    let start = begin.getFullYear()
    let finish = end.getFullYear()

    if (begin.getTime() >= (new Date(`${begin.getFullYear()}-03-01T00:00:00Z`)).getTime()) {
      start++
    }

    if (end.getTime() <= (new Date(`${end.getFullYear()}-02-28T23:59:59Z`)).getTime()) {
      finish--
    }

    for (let yr = start; yr <= finish; yr++) {
      if (this.isLeapYear(yr)) {
        leapYears.push(yr)
      }
    }

    return leapYears
  }

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
   * @todo: Create tests for calendars that start on a different month.
   * @todo: Add support for quarters using a 5/4/4 pattern (or other valid patterns)
   */
  quarter (date, calendarYearStartMonth = 1, calendarYearStartDay = 1) {
    if (calendarYearStartMonth < 1 || calendarYearStartMonth > 12) {
      throw new Error('Invalid calendar year start month. Must be 1-12.')
    }

    if (calendarYearStartDay < 1 || calendarYearStartDay > 31) {
      throw new Error('Invalid calendar year start day. Must be 1-31 (or up to the last day of the month).')
    }

    let start = new Date(date.getUTCFullYear(), calendarYearStartMonth - 1, calendarYearStartDay)

    while (start > date) {
      start = this.addYear(start, -1)
    }

    let quarter = 0
    while (start < date) {
      quarter++
      start = this.addMonth(start, 3)
    }

    return quarter
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
    let duration = new Duration(value)
    return duration.JSON
  }

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
    let duration = new Duration()

    // Only allow integers
    duration.years = Math.floor(years)
    duration.months = Math.floor(months)
    duration.weeks = Math.floor(weeks)
    duration.days = Math.floor(days)
    duration.hours = Math.floor(hours)
    duration.minutes = Math.floor(minutes)
    duration.seconds = Math.floor(seconds)

    return duration.toString()
  }

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
   *   2011-10-01T20:30:00Z, // Occurrence 3
   *   2012-12-11T23:00:00Z, // Occurrence 4
   *   2014-02-22T01:30:00Z, // Occurrence 5 (Last Occurrence)
   * ]
   * ```
   * @param {number} [maxRepetitionCount=25]
   * The maximum number of records to retrieve when calculating an interval time table with no end (infinite).
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
   *   order: 'ASC', // ASC or DESC based on whether the interval goes forwards or backwards in time.
   *   intervalCount: 5, // This will be -1 if the interval is indefinite (forever).
   *   intervals: [ // OPTIONAL (only if calculateIntervals is true)
   *     ...
   *   ]
   * }
   * ```
   */
  parseInterval (value, calculateIntervals = false, maxRepetitionCount = 25) {
    let interval = new this.Interval(value)
    let data = interval.JSON

    if (calculateIntervals) {
      data.intervals = interval.toTimeTable(maxRepetitionCount)
    }

    return data
  }

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

  /**
   * Create a NGNX.DATE.Iterator using an [ISO-8601 repeating interval string](https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals).
   * @param  {Date} interval
   * The ISO-8601 repeating interval/duration. This will be in `Rn/YYYY-MM-DDTHH:NN:SSZPnYnMnDTnHnMnS` format.
   * This type of duration can be generated using the #createRepeatingIntervalString method.
   * @return {[type]}                    [description]
   */
  createRepeatingIntervalIterator (intervalString) {
    return new this.Iterator(intervalString)
  }
}
