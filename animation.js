var Animation = (function() {
  var STOPPED_STATE = 0;
  var RUNNING_STATE = 1;


  function createAnimationEngine() {
    var t = null;
    var interval = null;
    var fps = {
      framesPerSecond: 0,
      count: 0,
      upto: 2,
      last: new Date()
    };
    var listeners = {
      fpschange: [],
      animateframe: []
    };

    function addEventListener(eventName, fn, capture) {
      if (eventName == "fpschange" || eventName == "animateframe") {
        listeners[eventName].push(fn);
      }
    }

    function frameRendered() {
      var now = new Date();
      fps.count++;
      if (fps.count > fps.upto) {
        var framesPerSecond = (fps.count * 1000) / (now - fps.last);
        fps.framesPerSecond = framesPerSecond;

        if (now - fps.last < 800) {
          fps.upto = Math.ceil(fps.upto * 1.2);
        }

        if (now - fps.last > 1200) {
          fps.upto = Math.ceil(fps.upto * 0.8);
        }      

        fps.count = 0;
        fps.last = now;

        for (var i = 0; i < listeners.fpschange.length; i++) {
          listeners.fpschange[i]({ target: t, type: "fpschange", fps: framesPerSecond });
        }
      }
    }

    var lastTime = new Date();
    function intervalFunction() {
      var thisTime = new Date();
      var secondsEllapsed = (thisTime - lastTime) / 1000;
      lastTime = thisTime;
      frameRendered();
      for (var i = 0; i < listeners.animateframe.length; i++) {
        listeners.animateframe[i]({ target: t, type: "animateframe", secondsEllapsed: secondsEllapsed });
      }
    }

    function startAnimation() {
      interval = setInterval(intervalFunction, 10);
      this.state = RUNNING_STATE;
    }

    function stopAnimation() {
      clearInterval(interval);
      this.state = STOPPED_STATE;
    }

    t = {
      fps: fps,
      addEventListener: addEventListener,
      startAnimation: startAnimation,
      stopAnimation: stopAnimation,
      state: STOPPED_STATE
    };
    return t;
  }

  return {
    STOPPED_STATE: STOPPED_STATE,
    RUNNING_STATE: RUNNING_STATE,
    createAnimationEngine: createAnimationEngine
  }
})();