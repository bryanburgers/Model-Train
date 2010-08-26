var Track = (function() {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var XLINK_NS = "http://www.w3.org/1999/xlink";

  function createTrackPiece(part, position, rotation) {

    function newF(t) {
      var newT = t / part.length;
      var svgRotation = Utility.createSVGTransform();
      var result = null;
      var newPoint = null;
      if (svgRotation) {
        svgRotation.setRotate(rotation, position.x, position.y);

        result = part.f(newT);
        var translatedPosition = Utility.createPosition(position.x + result.position.x, position.y + result.position.y);
        var svgPoint = Utility.createSVGPoint(translatedPosition);
        newPoint = svgPoint.matrixTransform(svgRotation.matrix);
      }
      else {
        // AH! What can we do with an SVGRotation!?
        newPoint = position;
        result = Utility.createResult(position.x, position.y, rotation);
      }

      var result = Utility.createResult(newPoint.x, newPoint.y, result.rotation + rotation);
      return result;
    }

    var initialResult = newF(0);
    var initialPosition = initialResult.position;

    var finalResult = newF(part.length);
    var finalPosition = finalResult.position;

    var endpoints =
	[ Endpoint.createEndpoint("1", initialResult, false)
	, Endpoint.createEndpoint("2", finalResult, true)
	];

    function traverserFromEndpoint(endpoint) {
      var traverserF = newF;
      if (endpoint.isFinal) {
        traverserF = function(t) {
          var result = newF(part.length - t);
          return Utility.createResult(result.position.x, result.position.y, result.rotation + 180);
        };
      }
      return Traverser.createTraverser(traverserF, part.length, this, endpoint);
    }

    return {
      get part() { return part; },
      get position() { return position; },
      get rotation() { return rotation; },
      get initialResult() { return initialResult; },
      get initialPosition() { return initialPosition; },
      get finalResult() { return finalResult; },
      get finalPosition() { return finalPosition; },
      get endpoints() { return endpoints; },
      get f() { return newF; },
      get traverserFromEndpoint() { return traverserFromEndpoint; }
    };
  }

  function drawTrackPiece(document, parent, trackPiece) {
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("x", trackPiece.position.x);
    use.setAttribute("y", trackPiece.position.y);
    use.setAttributeNS(XLINK_NS, "href", trackPiece.part.svgIdentifier);
    use.setAttribute("transform", "rotate(" + trackPiece.rotation.toString() + ", " + trackPiece.position.x.toString() + ", " + trackPiece.position.y.toString() + ")");   

    parent.appendChild(use);
  }

  function drawTrackPieceCanvas(ctx, trackPiece) {
    ctx.save();
    ctx.translate(trackPiece.position.x, trackPiece.position.y);
    ctx.rotate(trackPiece.rotation * Math.PI / 180);
    trackPiece.part.draw(ctx);
    ctx.restore();
  }

  function createTrack(initialResult, parts) {
    var currentResult = initialResult;
    var arr = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].x;
      var endpointId = parts[i].e || "1";
      var endpoint = part.endpointFromId(endpointId);
      var partResult = endpoint.result;
      var svgPartPoint = Utility.createSVGPoint(partResult.position);
      var svgTransform = Utility.createSVGTransform();
      svgTransform.setRotate(currentResult.rotation - (endpoint.isFinal ? 180 + partResult.rotation : 0), 0, 0);
      var svgTransformedPoint = svgPartPoint.matrixTransform(svgTransform.matrix);

      var newPosition = Utility.createPosition(currentResult.position.x - svgTransformedPoint.x, currentResult.position.y - svgTransformedPoint.y);

      var pieceRotation = currentResult.rotation;

      if (endpoint.isFinal) {
        pieceRotation = currentResult.rotation + 180 - partResult.rotation;
      }

      var trackPiece = createTrackPiece(part, newPosition, pieceRotation);
      arr.push(trackPiece);

      if (endpoint.isFinal) {
        currentResult = Utility.createResult(trackPiece.initialResult.position.x, trackPiece.initialResult.position.y, trackPiece.initialResult.rotation + 180);
      }
      else {
        currentResult = trackPiece.finalResult;
      }

    }
    return arr;
  }

  function loadTrack(trackJson) {
    var pieces = trackJson.pieces;
    var arr = [];
    for (var i = 0; i < pieces.length; i++) {
      var pieceDef = pieces[i];
      var part = Part.fromId(pieceDef.pieceID);
      var trackPiece = createTrackPiece(part, Utility.createPosition(pieceDef.x, pieceDef.y), pieceDef.rotation);
      arr.push(trackPiece);
    }
    return arr;
  }

  return {
    createTrackPiece: createTrackPiece,
    drawTrackPiece: drawTrackPiece,
    drawTrackPieceCanvas: drawTrackPieceCanvas,
    createTrack: createTrack,
    loadTrack: loadTrack
  }
})();