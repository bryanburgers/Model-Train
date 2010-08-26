var Timing = (function() {

  function addEventListener(eventName, fn, capture) {
    if (eventName == "fpschange") {
      this.listeners.push(fn);
    }
  }

  function frameRendered() {
    var now = new Date();
    this.count++;
    if (this.count > this.upto) {
      var fps = (this.count * 1000) / (now - this.last);
      this.framesPerSecond = fps;

      if (now - this.last < 500) {
        this.upto = this.upto * 1.2;
      }

      if (now - this.last > 2000) {
        this.upto = this.upto * 0.8;
      }      

      this.count = 0;
      this.last = now;

      for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i]({ target: this, fps: fps });
      }
    }
  }

  function createFPSMonitor() {
    return {
      listeners: [],
      framesPerSecond: 0,
      count: 0,
      upto: 2,
      last: new Date(),
      addEventListener: addEventListener,
      frameRendered: frameRendered
    };
  }

  return {
    createFPSMonitor: createFPSMonitor
  }
})();