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
        intervalCount: 0,
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
        this.intervalCount = parseInt(NGN.coalesceb(element.replace(/^\R/i, ''), '-1'), 10)
      } else {

        // Identify duration, start/end dates
        if (this.PRIVATE.PERIOD.test(element)) {
          this.METADATA.duration = new Duration(element)
        } else {
          if (this.METADATA.duration === null && this.METADATA.start === null) {
            this.METADATA.start = new Date(element)
          } else {
            this.METADATA.end = new Date(element)
          }
        }
      }
    })

    if (this.METADATA.start !== null || this.METADATA.end !== null) {
console.log(NGN.coalesce(this.METADATA.start, this.METADATA.end));
      let date = this.PRIVATE.DATE.exec(NGN.coalesce(this.METADATA.start, this.METADATA.end).toISOString())

      this.METADATA.timezone = date[3]
    }

    console.log(this.JSON)
    console.log(this.toString())
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
    return this.METADATA.intervalCount === Infinity || this.METADATA.intervalCount !== 0
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
    return this.METADATA.timezone
  }

  set timezone (value) {
    this.METADATA.timezone = value
  }

  get intervalCount () {
    return this.METADATA.intervalCount
  }

  set intervalCount (value) {
    this.METADATA.intervalCount = value
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
      timezone: this.METADATA.timezone,
      duration: this.duration,
      start: this.METADATA.start,
      end: this.METADATA.end,
      repeating: this.repeating,
      intervalCount: this.METADATA.intervalCount,
      valid: this.valid
    }
  }

  get lastPeriod () {
    return 'COMPLETE ME'
  }

  toString () {
    let str = []

    // Identify repeating interval
    if (this.repeating) {
      str[0] = 'R'
      if (this.METADATA.intervalCount !== Infinity && typeof this.METADATA.intervalCount === 'number' && this.METADATA.intervalCount > 0) {
        str[0] += this.METADATA.intervalCount
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
