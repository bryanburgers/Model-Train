// Depends on: angle.js, part.js, bezier-curve.js

var SVG_NS = "http://www.w3.org/2000/svg";
var XLINK_NS = "http://www.w3.org/1999/xlink";

function TransformedTraverser(traverser, position, degrees, trackPiece) {
  this.length = traverser.length;
  this.traverser = traverser;
  this.position = position;
  this.degrees = degrees;
  this.radians = degrees * Math.PI / 180;
  this.trackPiece = trackPiece;
}

TransformedTraverser.prototype.getPoint = function(t) {
  var svgRotation = Utility.createSVGTransform();
  var result = null;
  var newPoint = null;

  var rotation = this.degrees;
  var position = this.position;
  var traverser = this.traverser;

  if (svgRotation) {
    svgRotation.setRotate(rotation, position.x, position.y);

    result = traverser.getPoint(t);
    var translatedPosition = Utility.createPosition(position.x + result.x, position.y + result.y);
    var svgPoint = Utility.createSVGPoint(translatedPosition);
    newPoint = svgPoint.matrixTransform(svgRotation.matrix);
  }

  return {
    x: newPoint.x,
    y: newPoint.y
  }
}

TransformedTraverser.prototype.getDegrees = function(t) {
  return Angle.constrainDegrees(this.traverser.getDegrees(t) + this.degrees);
}

TransformedTraverser.prototype.getRadians = function(t) {
  return Angle.constrainRadians(this.traverser.getRadians(t) + this.radians);
}

function TrackPiece(part, position, degrees) {
  this.part = part;
  this.position = position;
  this.degrees = degrees;
  this.radians = degrees * Math.PI / 180;
}

TrackPiece.prototype.getForwardTraversers = function() {
  var a = [];
  var partTraversers = this.part.getForwardTraversers();
  for (var i = 0; i < partTraversers.length; i++) {
    a[i] = new TransformedTraverser(partTraversers[i], this.position, this.degrees, this);
  }
  return a;
}

TrackPiece.prototype.getBackwardTraversers = function() {
  var a = [];
  var partTraversers = this.part.getBackwardTraversers();
  for (var i = 0; i < partTraversers.length; i++) {
    a[i] = new TransformedTraverser(partTraversers[i], this.position, this.degrees, this);
  }
  return a;
}

TrackPiece.prototype.getEndpoints = Part.prototype.getEndpoints;

TrackPiece.prototype.drawSVG = function(parent) {
  var document = parent.ownerDocument;

  var use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("x", this.position.x);
  use.setAttribute("y", this.position.y);
  use.setAttributeNS(XLINK_NS, "href", "#" + this.part.svgIdentifier);
  use.setAttribute("transform", "rotate(" + this.degrees.toString() + ", " + this.position.x.toString() + ", " + this.position.y.toString() + ")");

  parent.appendChild(use);
}

function createTrack(initialPosition, initialDegrees, parts) {
  var currentPosition = initialPosition;
  var currentDegrees = initialDegrees;
  var arr = [];
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].x;
    var endpointId = parts[i].e || 0;
    var endpoint = part.getEndpoints()[endpointId];

    var svgPartPoint = Utility.createSVGPoint(endpoint.position);
    var svgTransform = Utility.createSVGTransform();

    svgTransform.setRotate(currentDegrees - (endpoint.isFinal ? 180 + endpoint.degrees : 0), 0, 0);
    var svgTransformedPoint = svgPartPoint.matrixTransform(svgTransform.matrix);

    var newPosition = {x:currentPosition.x - svgTransformedPoint.x, y:currentPosition.y - svgTransformedPoint.y};
    console.log(newPosition);

    var pieceRotation = currentDegrees;

    if (endpoint.isFinal) {
      pieceRotation = currentDegrees + 180 - endpoint.degrees;
    }

    var trackPiece = new TrackPiece(part, newPosition, pieceRotation);
    arr.push(trackPiece);

    var t = trackPiece.getEndpoints()[endpointId].getFirstTraverser();
    currentPosition = t.getPoint(t.length);
    currentDegrees = t.getDegrees(t.length);    
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