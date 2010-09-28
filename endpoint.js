function Endpoint(position, degrees, isInitial) {
  this.position = position;
  this.degrees = degrees;
  this.radians = degrees * Math.PI / 180;
  this.isInitial = isInitial;
  this.isFinal = !isInitial;
  this.traversers = [];
}

Endpoint.prototype.getFirstTraverser = function() {
  return this.traversers[0];
}

Endpoint.prototype.getRandomTraverser = function() {
  return this.traversers[0];
}