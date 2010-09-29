// Depends on: angle.js, endpoint.js

function Part(svgIdentifier, beziers) {
  this.svgIdentifier = svgIdentifier;
  this.beziers = beziers || [];
}

Part.prototype.getForwardTraversers = function() {
  var a = [];
  for (var i = 0; i < this.beziers.length; i++) {
    a[i] = new BezierTraverser(this.beziers[i], false);
  }
  return a;
}

Part.prototype.getBackwardTraversers = function() {
  var a = [];
  for (var i = 0; i < this.beziers.length; i++) {
    a[i] = new BezierTraverser(this.beziers[i], true);
  }
  return a;
}

function endpointsEqual(endpoint1, endpoint2) {
  var diffx = endpoint1.position.x - endpoint2.position.x;
  var diffy = endpoint1.position.y - endpoint2.position.y;
  var locationDifference = Math.sqrt(diffx * diffx + diffy * diffy);

  return locationDifference < 1 && Angle.degreesWithin(endpoint1.degrees, endpoint2.degrees, 1);
}

Part.prototype.getEndpoints = function() {
  var a = [];
  var aindex = 0;
  var forwardTraversers = this.getForwardTraversers();
  var backwardTraversers = this.getBackwardTraversers();

  var ft = forwardTraversers[0];
  var bt = backwardTraversers[0];
  a[0] = new Endpoint(ft.getPoint(0), ft.getDegrees(0), true);
  a[0].traversers[0] = ft;
  a[1] = new Endpoint(ft.getPoint(ft.length), ft.getDegrees(ft.length), false);
  a[1].traversers[0] = bt;
  return a;
}

function BezierTraverser(bezier, reverse) {
  this.length = bezier.calculateLength(1024);
  this.bezier = bezier;
  this.reverse = reverse;
}

BezierTraverser.prototype.getPoint = function(t) {
  var tprime = t / this.length;
  if (this.reverse) {
    tprime = 1 - tprime;
  }
  return this.bezier.getPoint(tprime);
}

BezierTraverser.prototype.getRadians = function(t) {
  var tprime = t / this.length;
  var offset = Math.PI / 4;
  if (this.reverse) {
    tprime = 1 - tprime;
    offset = -offset;
  }    
  return Angle.constrainRadians(this.bezier.getRadians(tprime) + offset);
}

BezierTraverser.prototype.getDegrees = function(t) {
  var tprime = t / this.length;
  var offset = 90;
  if (this.reverse) {
    tprime = 1 - tprime;
    offset = -offset;
  }
  return Angle.constrainDegrees(this.bezier.getDegrees(tprime) + offset);
}