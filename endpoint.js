function Endpoint(position, degrees) {
  this.position = position;
  this.degrees = degrees;
  this.radians = degrees * Math.PI / 180;
  this.traversers = [];
}

Endpoint.prototype.getFirstTraverser = function() {
  return this.traversers[0];
}

Endpoint.prototype.getRandomTraverser = function() {
  var t = this.traversers;
  return t[Math.floor(Math.random() * t.length)]
}