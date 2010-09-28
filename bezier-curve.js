function Bezier(x1,y1,x2,y2,x3,y3,x4,y4) {
  this.x1 = x1 || 0;
  this.y1 = y1 || 0;
  this.x2 = x2 || 0;
  this.y2 = y2 || 0;
  this.x3 = x3 || 0;
  this.y3 = y3 || 0;
  this.x4 = x4 || 0;
  this.y4 = y4 || 0;
}

Bezier.prototype.getPoint = function(t) {
  if (t < 0) { t = 0; }
  if (t > 1) { t = 1; }

  var omt = 1 - t; // omt = one minus t
  var x = omt * omt * omt * this.x1 + 3 * omt * omt * t * this.x2 + 3 * omt * t * t * this.x3 + t * t * t * this.x4;
  var y = omt * omt * omt * this.y1 + 3 * omt * omt * t * this.y2 + 3 * omt * t * t * this.y3 + t * t * t * this.y4;
  return {
    x: x,
    y: y
  }
}

Bezier.prototype.getRadians = function(t) {
  if (t < 0) { t = 0; }
  if (t > 1) { t = 1; }

  function interpolate(p1, p2, t) {
    var x = p1.x * (1 - t) + p2.x * t;
    var y = p1.y * (1 - t) + p2.y * t;
    return { x: x, y: y };
  }

  var p1 = interpolate({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2}, t);
  var p2 = interpolate({x: this.x2, y: this.y2}, {x: this.x3, y: this.y3}, t);
  var p3 = interpolate({x: this.x3, y: this.y3}, {x: this.x4, y: this.y4}, t);

  var q1 = interpolate(p1, p2, t);
  var q2 = interpolate(p2, p3, t);

  return Math.atan2(q2.y - q1.y, q2.x - q1.x);
}

Bezier.prototype.getDegrees = function(t) {
  return this.getRadians(t) * 180 / Math.PI;
}

Bezier.prototype.calculateLength = function(i) {
  var divisions = i || 16;
  var last = this.getPoint(0);
  var length = 0;

  for (var i = 1; i <= divisions; i++) {
    var next = this.getPoint(i / divisions);
    var xdiff = last.x - next.x;
    var ydiff = last.y - next.y;
    length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    last = next;
  }

  return length;
}