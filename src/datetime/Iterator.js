/**
 * @class NGNX.DATE.Iterator
 * A special iterator that will generate dates based on a pattern.
 * This acts more like a doubly linked list, allowing `next` and
 * `previous` iterations.
 */
export default class DateIterator {
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

    if (!this.interval.valid) {
      throw new Error('Invalid ISO-8601 syntax.')
    }

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

    this.currentDate = date
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
