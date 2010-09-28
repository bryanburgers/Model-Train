var Part = (function() {
  var TRACK_SIZE = 248;
  var HALF_SIZE = TRACK_SIZE / 2;

  function endpointFromId(id) {
    if (id == "1") { return this.endpoints[0]; }
    if (id == "2") { return this.endpoints[1]; }
    return undefined;
  }

  function createPart(id, name, svgIdentifier, length, f, draw) {
    var endpoints =
	[ Endpoint.createEndpoint("1", f(0), false)
	, Endpoint.createEndpoint("2", f(1), true)
	];

    return {
      id: id,
      name: name,
      length: length,
      f: f,
      svgIdentifier: svgIdentifier,
      endpoints: endpoints,
      endpointFromId: endpointFromId,
      draw: draw
    };
  }

  function createPartFromBezier(id, name, svgIdentifier, bezier) {
    var length = bezier.calculateLength(1024);

    var f = function(t) {
      var p = bezier.getPoint(t);
      var r = bezier.getDegrees(t) + 90;
      return Utility.createResult(p.x, p.y, r);
    }

    var endpoints =
	[ Endpoint.createEndpoint("1", f(0), false)
	, Endpoint.createEndpoint("2", f(1), true)
	];        

    return {
      id: id,
      name: name,
      length: length,
      f: f,
      bezier: bezier,
      svgIdentifier: svgIdentifier,
      endpoints: endpoints,
      endpointFromId: endpointFromId,
      draw: function() {}
    };
  }

  function straight248Function(t) {
   return Utility.createResult(0, - (t - 0.5) * 248, 0);
  }

  function straight248DrawFunction(ctx) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "1px";

    ctx.beginPath();
    ctx.moveTo(-4.5,  124);
    ctx.lineTo(-4.5, -124);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo( 4.5,  124);
    ctx.lineTo( 4.5, -124);
    ctx.stroke();

    ctx.restore();
  }

  function c45_248Function(t) {
   var h = 248;
   var theta = t * (Math.PI / 4);
   var x = - h * Math.cos(theta);
   var y = - h * Math.sin(theta);
   var r = t * 45;
   return Utility.createResult(x, y, r);
  }

  function c45_248DrawFunction(ctx) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "1px";

    ctx.beginPath();
    ctx.arc(0,0,252.5, Math.PI, - 3 * Math.PI / 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0,0,243.5, Math.PI, - 3 * Math.PI / 4);
    ctx.stroke();

    ctx.restore();
  }

  var parts = {
    straight248: createPart("straight248", "248mm Straight Track", "#straight248", 248, straight248Function, straight248DrawFunction),
    "curve45-248": createPart("curve45-248", "248mm radius 45 degree Curve Track", "#curve45_248", Math.PI * 248 / 4, c45_248Function, c45_248DrawFunction)    
  }

  function allParts() {
    return [
      parts.straight248,
      parts.curve45_248
    ];
  }

  function fromId(id) {
    return parts[id];
  }

  return {
    allParts: allParts,
    fromId: fromId,

    createPartFromBezier: createPartFromBezier,

    straight248: parts.straight248,
    curve45_248: parts["curve45-248"],
    "curve45-248": parts["curve45-248"]
  }
})();