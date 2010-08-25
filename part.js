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

  function c45_249Function(t) {
   var h = 249;
   var theta = t * (Math.PI / 4);
   var x = - h * Math.cos(theta);
   var y = - h * Math.sin(theta);
   var r = t * 45;
   return Utility.createResult(x, y, r);
  }

  function c45_249DrawFunction(ctx) {
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = "1px";

    ctx.beginPath();
    ctx.moveTo(-253.5, 0);
    ctx.arcTo(-253.5, 0, -179.25, -177.25, 45);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-244.5, 0);
    ctx.arcTo(-244.5, 0, -172.89, -172.89, 45);
    ctx.stroke();

    ctx.restore();
  }

  var parts = {
    straight248: createPart("straight248", "248mm Straight Track", "#straight248", 248, straight248Function, straight248DrawFunction),
    "curve45-249": createPart("curve45-249", "249mm radius 45 degree Curve Track", "#curve45_249", Math.PI * 249 / 4, c45_249Function, c45_249DrawFunction)
  }

  function allParts() {
    return [
      parts.straight248,
      parts.curve45_249
    ];
  }

  function fromId(id) {
    return parts[id];
  }

  return {
    allParts: allParts,
    fromId: fromId,

    straight248: parts.straight248,
    curve45_249: parts["curve45-249"],
    "curve45-249": parts["curve45-249"]
  }
})();