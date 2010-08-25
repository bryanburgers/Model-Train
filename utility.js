var Utility = (function() {

  function createPosition(x, y) {
    return {
      x: x,
      y: y
    };
  }

  function createSVGPoint(position) {
    if (document.documentElement.createSVGPoint) {
      var p = document.documentElement.createSVGPoint();
      p.x = position.x;
      p.y = position.y;
      return p;
    }
  }

  function createSVGTransform() {
    if (document.documentElement.createSVGTransform) {
      return document.documentElement.createSVGTransform();
    }
  }

  function createResult(x, y, rotation) {    
    var position = createPosition(x, y);
    return {
      position: position,
      x: x,
      y: y,
      rotation: rotation
    }
  }

  function createResult2(args) {
    var position = null;
    var x = 0;
    var y = 0;
    if (args.position) {
      position = args.position;
      x = args.position.x;
      y = args.position.y;
    }
    else {
      x = args.position.x || 0;
      y = args.position.y || 0;
      position = createPosition(x, y);
    }
    return {
      position: position,
      x: x,
      y: y,
      rotation: rotation || 0
    }
  }

  return {
    createPosition: createPosition,
    createResult: createResult,
    createSVGPoint: createSVGPoint,
    createSVGTransform: createSVGTransform
  }
})();