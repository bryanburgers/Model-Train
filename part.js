// Depends on: angle.js, endpoint.js

function Part(identifier, beziers) {
  this.identifier = identifier;
  this.svgIdentifier = identifier;
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

  var forwardTraversers = this.getForwardTraversers();
  var backwardTraversers = this.getBackwardTraversers();

  for (var i = 0; i < forwardTraversers.length; i++) {
    var ft = forwardTraversers[i];
    var bt = backwardTraversers[i];

    var ftendpoint = new Endpoint(ft.getPoint(0), ft.getDegrees(0));
    var btendpoint = new Endpoint(bt.getPoint(0), bt.getDegrees(0));

    var ftfound = false;
    var btfound = false;

    for (var j = 0; j < a.length; j++) {
      if (!ftfound && endpointsEqual(a[j], ftendpoint)) {
        ftfound = true;
        a[j].traversers.push(ft);
      }
      if (!btfound && endpointsEqual(a[j], btendpoint)) {
        btfound = true;
        a[j].traversers.push(bt);
      }
      if (ftfound && btfound) { break; }
    }

    if (!ftfound) {
      a.push(ftendpoint);
      ftendpoint.traversers[0] = ft;
    }
    if (!btfound) {
      a.push(btendpoint);
      btendpoint.traversers[0] = bt;
    }
  }

//  var ft = forwardTraversers[0];
//  var bt = backwardTraversers[0];
//  a[0] = new Endpoint(ft.getPoint(0), ft.getDegrees(0));
//  a[0].traversers[0] = ft;
//  a[1] = new Endpoint(bt.getPoint(0), bt.getDegrees(0));
//  a[1].traversers[0] = bt;
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