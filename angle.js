function Angle() {
}

Angle.constrainDegrees = function(degrees) {
  var d = degrees;
  while (d > 180) {
    d -= 360;
  }
  while (d <= -180) {
    d += 360;
  }
  return d;
}

Angle.constrainRadians = function(radians) {
  var r = radians;
  while (r > Math.PI) {
    r -= 360;
  }
  while (r <= -Math.PI) {
    r += 360;
  }
  return r;
}

Angle.degreesWithin = function(degrees1, degrees2, threshold) {
  var d = Math.abs(degrees1 - degrees2) % 360;
  return d < threshold;
}