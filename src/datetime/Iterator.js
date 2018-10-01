import Interval from './Interval'
/**
 * @class NGNX.DATE.Iterator
 * A special iterator that will generate dates based on a pattern.
 * This acts more like a doubly linked list, allowing `next` and
 * `previous` iterations.
 *
 * Iterations are all based on ISO-8601:2004 standards, using a 1-day
 * interval unless otherwise specified.
 * @fires {curerntDate:Date} iterate
 * Fired when the current date changes (any iteration).
 * @fires {currentDate:Date} outofbounds
 * Fired when the current date of the iterator exceeds the bounds of its
 * interval. For example, if an interval specifies the last date to be Dec 31
 * and the iterator reaches Jan 1, this event will be triggered. This event
 * will fire _every time_ the current date is outside the bounds of its interval.
 */
export default class DateIterator extends NGN.EventEmitter {
  /**
   * Create a new date iterator based on a duration.
   * @param {Date|String|NGNX.DATE.Interval} [interval='R/<current_Date>/P1D']
   * This can be a date, NGNX.DATE.Interval, or an ISO-8601:2004 repeating interval
   * string.
   *
   * **Date**
   * Specifying a date will seed the iterator with a specific start date.
   * Operations like #next and #previous will start with this date. By default,
   * a duration of `P1D` (period of one day) is used as the standard iterator.
   * This can be overridden by specifying a duration argument.
   *
   * _Example:_
   *
   * ```js
   * let Iterator = new NGNX.DATE.Iterator(new Date())
   * console.log(Iterator.next) // Outputs tomorrow's date.
   * ```
   *
   * ```
   * let Iterator = new NGNX.DATE.Iterator(new Date(), 'P1Y10DT2H')
   * console.log(Iterator.next) // Outputs a date one year, 10 days and two hours from now.
   * ```
   * **String**
   * If an ISO-8601:2004 interval string is specified, it will automatically
   * configure the iterator.
   *
   * ```js
   * let Iterator = new NGNX.DATE.Iterator('R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M')
   * console.log(Iterator.next) // Outputs 2009-05-11T15:30:00
   * ```
   *
   * **NGNX.DATE.Interval**
   * Specifying this type of interval will automatically configure the iterator.
   *
   * _Example:_
   * ```js
   * let Interval = new NGNX.DATE.Interval('2009-05-11T15:30:00')
   * let Iterator = new NGNX.DATE.Iterator(Interval)
   *
   * console.log(Iterator.next) // Outputs Outputs 2009-05-11T15:30:00
   * ```
   * @param {String|NGNX.DATE.Duration} [duration=P1D]
   * _This argument is ignored when an interval is specified._
   *
   * The ISO-8601 duration pattern or an NGNX.DATE.Duration object.
   * By default, this is `P1D` (Period of 1 day). This duration is
   * used for the next() and previous() methods.
   */
  constructor (date = null, duration = 'P1D') {
    super()

    let interval

    if (date instanceof Interval) {
      interval = date
    } else if (typeof date === 'string') {
      interval = new Interval(date)
    } else {
      interval = new Interval(`R/${date.replace(/\.0+/)}/${duration}`)
    }

    Object.defineProperties(this, {
      seed: NGN.privateconst(NGN.coalesce(date, new Date())),
      interval: NGN.private(interval),
      done: NGN.private(false),
      begin: NGN.private(NGN.coalesce(this.interval.end, this.interval.start)),
      end: NGN.private(null),
      METADATA: NGN.privateconst({
        currentDate: null
      })
    })

    if (!this.interval.valid) {
      throw new Error('Invalid ISO-8601 interval syntax.')
    }

    this.METADATA.currentDate = this.begin

    if (this.interval.repeating && (this.interval.repetitionCount === Infinity || this.interval.repetitionCount >= 0)) {
      this.end = this.interval.lastDate
    }
  }

  /**
   * @property {Date} currentDate
   * An internal date holder.
   * @private
   */
  set currentDate (date) {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }

    this.METADATA.currentDate = date

    if (this.end !== null && ((this.interval.order === 'ASC' && date > this.end) || (this.interval.order === 'DESC' && date < this.end))) {
      this.emit('outofbounds', date)
    }

    this.emit('iterate', this.METADATA.currentDate)
  }

  /**
   * @property {Date} date
   * The date is used to calculate new iterations.
   */
  set date (date) {
    if (NGN.typeof(date) !== 'date') {
      throw new Error('Invalid date.')
    }

    this.currentDate = date
    this.begin = date

    if (this.interval.order === 'ASC') {
      this.interval.start = date
    } else {
      this.interval.end = date
    }

    if (this.interval.repeating && (this.interval.repetitionCount === Infinity || this.interval.repetitionCount >= 0)) {
      this.end = this.interval.lastDate
    }
  }

  get date () {
    return this.METADATA.currentDate
  }

  /**
   * Retrieves the next date in the interval.
   * @warning If the interval is counting backwards (descending order),
   * the "next" date will be _before_ the current date (i.e. going backwards in time).
   * @info To forcibly advance the iterator forward into the future, use #forward.
   * @return {Date}
   */
  get next () {
    return this.advance(1)
  }

  /**
   * Retrieves the previous date in the interval.
   * @warning If the interval is counting backwards (descending order),
   * the "next" date will be _after_ the current date (i.e. going forwards in time).
   * To forcibly advance the iterator backwards into the past, use #back.
   * @return {Date}
   */
  get previous () {
    return this.recede(1)
  }

  /**
   * The NGNX.DATE.Interval used to determine the timeline.
   */
  get interval () {
    return this.interval
  }

  /**
   * The original date supplied to the iterator (cfg.date).
   * @return {Date}
   */
  get originalDate () {
    return this.seed
  }

  /**
   * Advance to the next day.
   * @return {Date} currentDate
   * The new date.
   */
  get nextDay () {
    this.currentDate = NGNX.DATE.addDay(this.METADATA.currentDate)

    return this.METADATA.currentDate
  }

  /**
   * Advance to the next business day. A business day is defined
   * as a non-weekend day. This does **not** account for holidays.
   * @return {Date} currentDate
   * The new date.
   */
  get nextBusinessDay () {
    let date = NGNX.DATE.addDay(this.METADATA.currentDate)

    while (NGNX.DATE.isWeekend(date)) {
      date = NGNX.DATE.addDay(this.METADATA.currentDate)
    }

    this.currentDate = date

    return this.METADATA.currentDate
  }

  /**
   * Advance to the next weekend day.
   * @return {Date} currentDate
   * The new date.
   */
  get nextWeekendDay () {
    let date = NGNX.DATE.addDay(this.METADATA.currentDate)

    while (!NGNX.DATE.isWeekend(date)) {
      date = NGNX.DATE.addDay(this.METADATA.currentDate)
    }

    this.currentDate = date

    return this.METADATA.currentDate
  }

  /**
   * Advance by a week.
   * @return {Date} currentDate
   * The new date.
   */
  get nextWeek () {
    this.currentDate = NGNX.DATE.addWeek(this.METADATA.currentDate)

    return this.METADATA.currentDate
  }

  /**
   * Advance by a month.
   * @return {Date} currentDate
   * The new date.
   */
  get nextMonth () {
    this.currentDate = NGNX.DATE.addMonth(this.METADATA.currentDate)

    return this.METADATA.currentDate
  }

  /**
   * Advance by a year.
   * @return {Date} currentDate
   * The new date.
   */
  get nextYear () {
    this.currentDate = NGNX.DATE.addYear(this.METADATA.currentDate)

    return this.METADATA.currentDate
  }

  /**
   * Recede to the next day.
   * @return {Date} currentDate
   * The new date.
   */
  get previousDay () {
    this.currentDate = NGNX.DATE.addDay(this.METADATA.currentDate, -1)

    return this.METADATA.currentDate
  }

  /**
   * Recede to the preview business day. A business day is defined
   * as a non-weekend day. This does **not** account for holidays.
   * @return {Date} currentDate
   * The new date.
   */
  get previousBusinessDay () {
    let date = NGNX.DATE.addDay(this.METADATA.currentDate, -1)

    while (NGNX.DATE.isWeekend(date)) {
      date = NGNX.DATE.addDay(this.METADATA.currentDate, -1)
    }

    this.currentDate = date

    return this.METADATA.currentDate
  }

  /**
   * Recede to the previous weekend day.
   * @return {Date} currentDate
   * The new date.
   */
  get previousWeekendDay () {
    let date = NGNX.DATE.addDay(this.METADATA.currentDate, -1)

    while (!NGNX.DATE.isWeekend(date)) {
      date = NGNX.DATE.addDay(this.METADATA.currentDate, -1)
    }

    this.currentDate = date

    return this.METADATA.currentDate
  }

  /**
   * Recede by a week.
   * @return {Date} currentDate
   * The new date.
   */
  get previousWeek () {
    this.currentDate = NGNX.DATE.addWeek(this.METADATA.currentDate, -1)

    return this.METADATA.currentDate
  }

  /**
   * Recede by a month.
   * @return {Date} currentDate
   * The new date.
   */
  get previousMonth () {
    this.currentDate = NGNX.DATE.addMonth(this.METADATA.currentDate, -1)

    return this.METADATA.currentDate
  }

  /**
   * Recede by a year.
   * @return {Date} currentDate
   * The new date.
   */
  get previousYear () {
    this.currentDate = NGNX.DATE.addYear(this.METADATA.currentDate, -1)

    return this.METADATA.currentDate
  }

  /**
   * Retrieves the next date in the interval.
   * @warning If the interval is counting backwards (descending order),
   * the "next" date will be _before_ the current date (i.e. going backwards in time).
   * To forcibly advance the iterator forward into the future, use #forward.
   * @param  {number} [count=1]
   * By specifying a number other than `1`, the iterator will advance the date
   * for the specified number of durations.
   * @return {Date}
   */
  advance (count = 1) {
    if (count < 0) {
      return this.recede(...arguments)
    }

    this.currentDate = NGNX.DATE.METADATA.changeDuration(this.currentDate, this.interval.duration, count, this.interval.order === 'ASC')

    return this.METADATA.currentDate
  }

  /**
   * Retrieves the previous date in the interval.
   * @warning If the interval is counting backwards (descending order),
   * the "next" date will be _after_ the current date (i.e. going forwards in time).
   * To forcibly advance the iterator backwards into the past, use #back.
   * @param {number} [count=1]
   * By specifying a number other than `1`, the iterator will decrement the date
   * for the specified number of durations.
   * @return {Date}
   */
  recede (count = 1) {
    this.currentDate = NGNX.DATE.METADATA.changeDuration(this.currentDate, this.interval.duration, count, this.interval.order !== 'ASC')

    return this.METADATA.currentDate
  }

  /**
   * Retrieves the next date in the timeline.
   * @warning If the interval is counting backwards (descending order),
   * the "forward" date will _still be after_ the current date (i.e. going forwards
   * in time).
   * To respect the order of the interval, use #next instead.
   * @param {number} [count=1]
   * By specifying a number other than `1`, the iterator will advance the date
   * for the specified number of durations.
   * @return {Date}
   */
  forward (count = 1) {
    this.currentDate = NGNX.DATE.addDuration(this.currentDate, this.interval.duration, count)

    return this.METADATA.currentDate
  }

  /**
   * Retrieves the previous date in the timeline.
   * @warning If the interval is counting forwards (descending order),
   * the "back" date will _still be before_ the current date (i.e. going backwards
   * in time).
   * To respect the order of the interval, use #previous instead.
   * @param {number} [count=1]
   * By specifying a number other than `1`, the iterator will recede/decrement the date
   * for the specified number of durations.
   * @return {Date}
   */
  back (count = 1) {
    this.currentDate = NGNX.DATE.addDuration(this.currentDate, this.interval.duration, count, false)

    return this.METADATA.currentDate
  }

  /**
   * Reset the iterator to it's original state/date.
   */
  clear () {
    this.currentDate = this.seed
    this.emit('clear', this.METADATA.currentDate)

    return this.METADATA.currentDate
  }

  /**
   * Reset the iterator to the interval start date.
   */
  reset () {
    this.currentDate = this.interval.start
    this.emit('reset', this.METADATA.currentDate)

    return this.METADATA.currentDate
  }
}
