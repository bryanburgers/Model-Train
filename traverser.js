var Traverser = (function() {

  function createTraverser(f, length, trackPiece, initialEndpoint) {
    return {
      get length() { return length; },
      get evaluate() { return f; },
      get trackPiece() { return trackPiece; },
      get initialEndpoint() { return initialEndpoint; }
    };
  }

  return {
    createTraverser: createTraverser
  }
})();