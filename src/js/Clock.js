class Clock {
  constructor () {
    this.duration = 0
  }

  initClock (then, cb) {
    this.then = Date.now()
    this.clock = setInterval(() => {
      var sec, min, hour
      this.duration = (Date.now() - this.then) / 1000 + (then || 0)
      if (this.duration < 60) return cb('00:00:' + ('0' + Math.floor(this.duration)).slice(-2))
      if (this.duration / 60 < 60) {
        sec = ('0' + Math.floor(this.duration % 60)).slice(-2)
        min = ('0' + Math.floor(this.duration / 60)).slice(-2)
        return cb('00:' + min + ':' + sec)
      }
      if (this.duration / 60 >= 60) {
        sec = ('0' + Math.floor(this.duration % 60)).slice(-2)
        min = ('0' + Math.floor(this.duration / 60) % 60).slice(-2)
        hour = ('0' + '0' + Math.floor(this.duration / 60 / 60)).slice(-2)
        return cb(hour + ':' + min + ':' + sec)
      }
    }, 1200)
    return this
  }

  initTimer (secs, cb) {
    this.timer = setInterval(() => {
      secs--
      cb(secs)
      console.log(secs)
      if (secs <= 0) {
        clearInterval(this.timer)
      }
    }, 1200)
    return this
  }

  cancel (inter, cb) {
    clearInterval(inter || this.clock)
    if (typeof cb === 'function') cb()
  }
}

export default Clock
