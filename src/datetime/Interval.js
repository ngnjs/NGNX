import Duration from './Duration'

/**
 * @class NGNX.DATE.Interval
 * Represents an ISO-8601:2004 interval (optionally repeating).
 * This class handles recurrence patterns, making them
 * accessible as a usable object.
 */
export default class DateInterval {
  /**
   * @param {String} interval
   * The date/recurrence string, which should follow the [Rn/YYYY-MM-DDTHH:NN:SSZ/PnYnMnWnDTnHnMnS pattern](https://en.wikipedia.org/wiki/ISO_8601#Durations).
   * For example, `R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M` indicates the
   * pattern should be repeated 5 times, starting on March 1, 2008 at 1:00PM UTC. It should be repeated every 1 year, 2 months, 10 days, 2 hours, and 30 minutes.
   */
  constructor (interval) {
    Object.defineProperties(this, {
      METADATA: NGN.private({
        source: interval,
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
        repetitionCount: 0,
        duration: null
      }),

      PRIVATE: NGN.privateconst({
        DATE: /(\d{4}(?:-\d{2}){2})T(\d{2}(?::\d{2}){2}(?:\.\d*)?([A-Za-z]*)?)/i,
        PERIOD: /(P(?=.)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=.)(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)/i
        // ISO8601R: /^(R(\d*){0,10}\/)?(\d{4}(?:-\d{2}){2})T(\d{2}(?::\d{2}){2}(?:\.\d*)?([A-Za-z]*)?)\/(P(?=.)(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?=.)(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)$/ // Rn/PnYnMnDTnHnMnS
      })
    })

    NGN.BUS.on(NGN.WARNING_EVENT, m => console.log(m))

    // Process each section of the interval
    interval.split('/').forEach((element, i) => {
      // Identify repeating interval
      if (i === 0 && /^R[0-9]?/i.test(element)) {
        this.repetitionCount = parseInt(NGN.coalesceb(element.replace(/^R/i, ''), '-1'), 10)
      } else {
        // Identify duration, start/end dates
        if (this.PRIVATE.PERIOD.test(element)) {
          this.METADATA.duration = new Duration(element)
        } else {
          if (this.METADATA.duration === null && this.METADATA.start === null) {
            this.METADATA.start = new Date(element)
          } else {
            // Per ISO 8601:2004, any elements not identified in the end date should use the start date values.
            try {
              this.METADATA.end = Date.parse(element)

              if (isNaN(this.METADATA.end) === false) {
                this.METADATA.end = new Date(element)
              } else {
                throw new Error('Invalid Date Format')
              }

              if (element.indexOf('T') < 0 && this.METADATA.start !== null) {
                this.METADATA.end.setUTCHours(this.METADATA.start.getUTCHours())
                this.METADATA.end.setUTCMinutes(this.METADATA.start.getUTCMinutes())
                this.METADATA.end.getUTCSeconds(this.METADATA.start.getUTCSeconds())
              }
            } catch (e) {
              if (this.METADATA.start === null) {
                throw new Error('Could not set end date (missing value or invalid format).')
              }

              let date = new Date(this.METADATA.start.getTime())
              let datepart = null
              let timepart = null

              if (element.indexOf('T') >= 0) {
                datepart = element.split('T')[0]
                timepart = element.splt('T').pop()
              } else if (element.indexOf('-') >= 0) {
                datepart = element
              } else {
                timepart = element
              }

              if (datepart !== null) {
                datepart.split('-').forEach((part, i) => {
                  if (part.length >= 4) {
                    date.setFullYear(parseInt(part, 10))
                  } else if (i < datepart.length) {
                    date.setUTCMonth(parseInt(part, 10))
                  } else {
                    date.setUTCDate(part)
                  }
                })
              }

              if (timepart !== null) {
                timepart.split(':').forEach((part, i) => {
                  switch (i) {
                    case 0:
                      date.setUTCHours(parseInt(part, 10))
                      break

                    case 1:
                      date.setUTCMinutes(parseInt(part, 10))
                      break

                    case 2:
                      date.setUTCSeconds(parseInt(part, 10))
                      break
                  }
                })
              }

              this.METADATA.end = new Date(date.getTime())
            }
          }
        }
      }
    })

    if (this.METADATA.start !== null || this.METADATA.end !== null) {
      let date = this.PRIVATE.DATE.exec(NGN.coalesce(this.METADATA.start, this.METADATA.end).toISOString())

      this.METADATA.timezone = date[3]
    }
  }

  get source () {
    return this.METADATA.source
  }

  set source (value) {
    this.METADATA.source = value
  }

  get valid () {
    if (this.METADATA.start !== null && this.METADATA.end !== null && this.METADATA.duration !== null) {
      NGN.WARN(`Interval ${this.toString()} contains a start date, end date, and duration. Only two of these may be present in a valid ISO 8601 interval.`)
      return false
    }

    if (this.METADATA.start !== null && this.METADATA.end !== null && this.METADATA.start.getTime() === this.METADATA.end.getTime()) {
      NGN.WARN(`Interval ${this.toString()} is invalid because the start and end dates are the same.`)
      return false
    }

    if ((this.METADATA.years + this.METADATA.months + this.METADATA.weeks + this.METADATA.days + this.METADATA.hours + this.METADATA.minutes + this.METADATA.seconds) === 0 && this.METADATA.start === null && this.METADATA.end === null) {
      NGN.WARN(`Interval "${this.toString()}" is invalid because all time periods are zero. To fix, specify at least one of the following values: years, months, weeks, days, hours, minutes, or seconds.`)
      return false
    }

    return true
  }

  get repeating () {
    return this.METADATA.repetitionCount === Infinity || this.METADATA.repetitionCount !== 0
  }

  get duration () {
    return this.METADATA.duration ? this.METADATA.duration.toString() : null
  }

  get years () {
    return NGN.coalesce(this.METADATA.duration, { years: 0 }).years
  }

  set years (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.years = value
  }

  get months () {
    return NGN.coalesce(this.METADATA.duration, { months: 0 }).months
  }

  set months (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.months = value
  }

  get weeks () {
    return NGN.coalesce(this.METADATA.duration, { weeks: 0 }).weeks
  }

  set weeks (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.weeks = value
  }

  get days () {
    return NGN.coalesce(this.METADATA.duration, { days: 0 }).days
  }

  set days (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.days = value
  }

  get hours () {
    return NGN.coalesce(this.METADATA.duration, { hours: 0 }).hours
  }

  set hours (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.hours = value
  }

  get minutes () {
    return NGN.coalesce(this.METADATA.duration, { minutes: 0 }).minutes
  }

  set minutes (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.minutes = value
  }

  get seconds () {
    return NGN.coalesce(this.METADATA.duration, { seconds: 0 }).seconds
  }

  set seconds (value) {
    if (this.METADATA.duration === null) {
      this.METADATA.duration = new Duration()
    }

    this.METADATA.duration.seconds = value
  }

  get start () {
    return this.METADATA.start
  }

  set start (value) {
    this.METADATA.start = value
  }

  get end () {
    return this.METADATA.end
  }

  set end (value) {
    this.METADATA.end = value
  }

  get timezone () {
    return NGN.coalesce(this.METADATA.timezone, 'Z')
  }

  set timezone (value) {
    this.METADATA.timezone = value
  }

  get repetitionCount () {
    return this.METADATA.repetitionCount
  }

  set repetitionCount (value) {
    this.METADATA.repetitionCount = value
  }

  /**
   * The order determines whether the interval
   * counts forward in time (ASC/ascending order) or
   * backwards (DESC/descending).
   * @return {string}
   * Returns either `ASC` or `DESC`.
   */
  get order () {
    if (this.METADATA.start !== null && this.METADATA.end !== null) {
      return this.METADATA.start < this.METADATA.end ? 'ASC' : 'DESC'
    }

    return this.METADATA.start !== null ? 'ASC' : 'DESC'
  }

  get JSON () {
    return {
      source: this.toString(),
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      timezone: this.timezone,
      duration: this.duration,
      start: this.METADATA.start,
      end: this.METADATA.end,
      repeating: this.repeating,
      repetitionCount: this.METADATA.repetitionCount,
      valid: this.valid
    }
  }

  /**
   * The last date of the interval.
   * @return {Date|null}
   * This will always be `null` for unbounded
   * repeating intervals (i.e. no end).
   */
  get lastDate () {
    if (this.repeating) {
      if (this.repetitionCount === Infinity || this.repetitionCount < 0) {
        // Unbounded
        return null
      }

      return NGNX.DATE.METADATA.changeDuration(NGN.coalesce(this.METADATA.end, this.METADATA.start), this.duration, this.repetitionCount, this.order === 'ASC')
    }

    return this.METADATA.end
  }

  /**
   * @param {number} [maxRepetitionCount=25]
   * The maximum number of records to retrieve when calculating an interval time table with no end (infinite).
   * @return {Array}
   * Returns and array of dates.
   */
  toTimeTable (maxRepetitionCount = 25) {
    if (!this.repeating) {
      return []
    }

    let results = []
    let currentDate = NGN.coalesce(this.start, this.end)
    let max = NGN.coalesce(NGN.nullIf(this.repetitionCount, -1), maxRepetitionCount)
    let order = this.order
    let period = this.duration.toString()

    for (let i = 0; i < max; i++) {
      currentDate = NGNX.DATE.METADATA.changeDuration(currentDate, period, 1, order === 'ASC')
      results.push(currentDate)
    }

    return results
  }

  toString () {
    let str = []

    // Identify repeating interval
    if (this.repeating) {
      str[0] = 'R'
      if (this.METADATA.repetitionCount !== Infinity && typeof this.METADATA.repetitionCount === 'number' && this.METADATA.repetitionCount > 0) {
        str[0] += this.METADATA.repetitionCount
      }
    }

    if (this.METADATA.start !== null && (this.METADATA.end === null || this.METADATA.duration === null)) {
      str.push(this.METADATA.start.toISOString().split('.')[0] + NGN.coalesce(this.METADATA.timezone, 'Z'))
    }

    if (this.METADATA.duration !== null) {
      str.push(this.METADATA.duration.toString())
    }

    if (this.METADATA.end !== null && (this.METADATA.start === null || this.METADATA.duration === null)) {
      str.push(this.METADATA.end.toISOString().split('.')[0] + NGN.coalesce(this.METADATA.timezone, 'Z'))
    }

    return str.join('/')
  }
}
