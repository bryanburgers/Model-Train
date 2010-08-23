var Part = (function() {
  var TRACK_SIZE = 248;
  var HALF_SIZE = TRACK_SIZE / 2;

  function endpointFromId(id) {
    if (id == "1") { return this.endpoints[0]; }
    if (id == "2") { return this.endpoints[1]; }
    return undefined;
  }

  function createPart(id, name, svgIdentifier, length, f) {
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
      endpointFromId: endpointFromId
    };
  }

  function straight248Function(t) {
   return Utility.createResult(0, - (t - 0.5) * 248, 0);
  }

  function c45_249Function(t) {
   var h = 249;
   var theta = t * (Math.PI / 4);
   var x = - h * Math.cos(theta);
   var y = - h * Math.sin(theta);
   var r = t * 45;
   return Utility.createResult(x, y, r);
  }

  function r90Function(t) {
   var theta = t * (Math.PI / 2);
   var x = - HALF_SIZE * Math.cos(theta) + HALF_SIZE;
   var y = - HALF_SIZE * Math.sin(theta) + HALF_SIZE;
   var r = t * 90;
   return Utility.createResult(x, y, r);
  }

  var parts = {
    straight248: createPart("straight248", "248mm Straight Track", "#straight248", 248, straight248Function),
    r90: createPart("r90", "90 degree curve to the right", "#r90", Math.PI * TRACK_SIZE / 4, r90Function),
    "curve45-249": createPart("curve45-249", "249mm radius 45 degree Curve Track", "#curve45_249", Math.PI * 249 / 4, c45_249Function)
  }

  function allParts() {
    return [
      parts.straight248,
      parts.r90,
      parts.curve45_249
    ];
  }

  function fromId(id) {
    return parts[id];
  }

  function flip(part) {
    return createPart(part.id, part.name, part.svgIdentifier, part.length, function(t) {
      var result = part.f(1 - t);
      return Utility.createResult(result.position.x, result.position.y, result.rotation + 180);
    });
  }

  return {
    allParts: allParts,
    fromId: fromId,
    flip: flip,

    straight248: parts.straight248,
    r90: parts.r90,
    c45_249: parts["curve45-249"],
    curve45_249: parts["curve45-249"],
    "curve45-249": parts["curve45-249"]
  }
})();