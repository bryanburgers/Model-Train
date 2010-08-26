var Train = (function() {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var XLINK_NS = "http://www.w3.org/1999/xlink";

  function createTrain(svgIdentifier) {
    return {
      get svgIdentifier() { return svgIdentifier; }
    };
  }

  function createTrainSVG(document, parent, train, result) {
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("x", result.position.x);
    use.setAttribute("y", result.position.y);
    use.setAttributeNS(XLINK_NS, "href", train.svgIdentifier);
    use.setAttribute("transform", "rotate(" + result.rotation.toString() + ", " + result.position.x.toString() + ", " + result.position.y.toString() + ")");   

    parent.appendChild(use);

    return use;
  }

  function updateTrain(trainSVG, result) {
    trainSVG.setAttribute("x", result.position.x);
    trainSVG.setAttribute("y", result.position.y);
    trainSVG.setAttribute("transform", "rotate(" + result.rotation.toString() + ", " + result.position.x.toString() + ", " + result.position.y.toString() + ")");   
  }

  function drawTrainCanvas(ctx, train, result) {
    ctx.save();

    ctx.translate(result.position.x, result.position.y);
    ctx.rotate(result.rotation * Math.PI / 180);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(-10,15);
    ctx.bezierCurveTo(-10,18, -8,20, -5,20);
    ctx.lineTo(5,20);
    ctx.bezierCurveTo(8,20, 10,18, 10,15);
    ctx.lineTo(10,-10);
    ctx.bezierCurveTo(10,-30, -10,-30, -10,-10);
    ctx.lineTo(-10,15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function anglesWithin(angle1, angle2, threshold) {
    var d = Math.abs(angle1 - angle2) % 360;
    return d < threshold;
  }

  function findClosestTrackPiece(trackPieces, result, currentTrackPiece) {
    var position = result.position;
    var distance = 1000000.0;
    var closestTrackPiece = undefined;
    var closestEndpoint = undefined;
    for (var i = 0; i < trackPieces.length; i++) {
      var piece = trackPieces[i];
      if (piece == currentTrackPiece) { continue; }
      for (var j = 0; j < piece.endpoints.length; j++) {
        var endpoint = piece.endpoints[j];
        var deltaX = endpoint.position.x - position.x;
        var deltaY = endpoint.position.y - position.y;
        var d = Math.sqrt( deltaX * deltaX + deltaY * deltaY );               
        if (d < distance && anglesWithin(result.rotation, endpoint.inRotation, 2)) {
          distance = d;
          closestTrackPiece = piece;
          closestEndpoint = endpoint;
        }
      }
    }

    if (distance < 10) {
      return {
        trackPiece: closestTrackPiece,
        endpoint: closestEndpoint,
        distance: distance
      };
    }
  }

  return {
    createTrain: createTrain,
    createTrainSVG: createTrainSVG,
    updateTrain: updateTrain,
    drawTrainCanvas: drawTrainCanvas,
    findClosestTrackPiece: findClosestTrackPiece
  }
})();