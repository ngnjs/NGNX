/**
 * @class NGNX.DATE.Duration
 * Represents an ISO-8601 [PnYnMnWnDTnHnMnS duration](https://en.wikipedia.org/wiki/ISO_8601#Durations)
 * as a usable object.
 */
export default class Duration {
  /**
   * @param {String} duration
   * For example, `P1Y2M10DT2H30M` indicates the duration period is 1 year, 2 months,
   * 10 days, 2 hours, and 30 minutes.
   */
  constructor (duration = null) {
    Object.defineProperties(this, {
      METADATA: NGN.private({
        source: duration,
        valid: false,
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }),

      PRIVATE: NGN.privateconst({
        ISO8601P: /^P((\d*)Y)?((\d*)M)?((\d*)W)?((\d*)D)?T?((\d*)H)?((\d*)M)?((\d*)S)?$/, // PnYnMnDTnHnMnS

        autoIncrement: (element, max, parent) => {
          if (element > max) {
            parent += Math.floor(element / (max + 1))
            element = element % (max + 1)
          }
        }
      })
    })

    if (duration !== null) {
      let match = this.PRIVATE.ISO8601P.exec(duration)

      if (match !== null) {
        this.years = parseInt(match[2]) || 0
        this.months = parseInt(match[4]) || 0
        this.weeks = parseInt(match[6]) || 0
        this.days = parseInt(match[8]) || 0
        this.hours = parseInt(match[10]) || 0
        this.minutes = parseInt(match[12]) || 0
        this.seconds = parseInt(match[14]) || 0
      }
    }
  }

  /**
   * @property {object} JSON
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
  get JSON () {
    return {
      source: this.source,
      valid: this.valid,
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds
    }
  }

  get source () {
    return this.METADATA.source
  }

  set source (value) {
    this.METADATA.source = value
  }

  get valid () {
    if (!this.PRIVATE.ISO8601P.test(this.METADATA.source)) {
      return false
    }

    if ((this.METADATA.years + this.METADATA.months + this.METADATA.weeks + this.METADATA.days + this.METADATA.hours + this.METADATA.minutes + this.METADATA.seconds) === 0) {
      NGN.WARN(`Duration "${this.source}" is invalid because all time periods are zero. To fix, specify at least one of the following values: years, months, weeks, days, hours, minutes, or seconds.`)
      return false
    }

    if (this.weeks > 51) {
      NGN.WARN(`Duration "${this.source}" is invalid because there cannot be more than 51 weeks in a duration. 52 weeks would convert to a year.`)
    }

    return true
  }

  get years () {
    return this.METADATA.years
  }

  set years (value) {
    this.METADATA.years = Math.floor(value)

    if (this.METADATA.years < 0) {
      throw new Error('Negative year values are not allowed.')
    }
  }

  get months () {
    return this.METADATA.months
  }

  set months (value) {
    this.METADATA.months = Math.floor(value)

    if (this.METADATA.months < 0) {
      throw new Error('Negative month values are not allowed.')
    }

    this.PRIVATE.autoIncrement(this.METADATA.months, 11, this.METADATA.years)
  }

  get weeks () {
    return this.METADATA.weeks
  }

  set weeks (value) {
    this.METADATA.weeks = Math.floor(value)

    if (this.METADATA.weeks < 0) {
      throw new Error('Negative week values are not allowed.')
    }

    this.PRIVATE.autoIncrement(this.METADATA.weeks, 51, this.METADATA.years)
  }

  get days () {
    return this.METADATA.days
  }

  set days (value) {
    this.METADATA.days = Math.floor(value)

    if (this.METADATA.days < 0) {
      throw new Error('Negative day values are not allowed.')
    }
  }

  get hours () {
    return this.METADATA.hours
  }

  set hours (value) {
    this.METADATA.hours = Math.floor(value)

    if (this.METADATA.hours < 0) {
      throw new Error('Negative hour values are not allowed.')
    }

    this.PRIVATE.autoIncrement(this.METADATA.hours, 23, this.METADATA.days)
  }

  get minutes () {
    return this.METADATA.minutes
  }

  set minutes (value) {
    this.METADATA.minutes = Math.floor(value)

    if (this.METADATA.minutes < 0) {
      throw new Error('Negative minute values are not allowed.')
    }

    this.PRIVATE.autoIncrement(this.METADATA.minutes, 59, this.METADATA.hours)
  }

  get seconds () {
    return this.METADATA.seconds
  }

  set seconds (value) {
    this.METADATA.seconds = Math.floor(value)

    if (this.METADATA.seconds < 0) {
      throw new Error('Negative second values are not allowed.')
    }

    this.PRIVATE.autoIncrement(this.METADATA.seconds, 59, this.METADATA.minutes)
  }

  toString () {
    let str = 'P'

    if (this.METADATA.years > 0) {
      str += `${this.METADATA.years}Y`
    }

    if (this.METADATA.months > 0) {
      str += `${this.METADATA.months}M`
    }

    if (this.METADATA.weeks > 0) {
      if (this.METADATA.hours === 0 && this.METADATA.minutes === 0 && this.METADATA.seconds === 0) {
        str += `${this.METADATA.weeks}W`
      } else {
        this.METADATA.days += Math.floor(this.METADATA.weeks * 7)
      }
    }

    if (this.METADATA.days > 0) {
      str += `${this.METADATA.days}D`
    }

    // Short circuit the operation if a week exists.
    // Weeks cannot be combined with times per ISO 8601 4.4.3 durations.
    if (str.indexOf('W') >= 0) {
      return str
    }

    if (this.METADATA.hours > 0 || this.METADATA.minutes > 0 || this.METADATA.seconds > 0) {
      str += 'T'

      if (this.METADATA.hours > 0) {
        str += `${this.METADATA.hours}H`
      }

      if (this.METADATA.minutes > 0) {
        str += `${this.METADATA.minutes}M`
      }

      if (this.METADATA.seconds > 0) {
        str += `${this.METADATA.seconds}S`
      }
    }

    return str
  }
}
