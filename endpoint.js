var Endpoint = (function() {

  function createEndpoint(id, result, isFinal) {
    var position = result.position;
    var inRotation = result.rotation;
    var outRotation = (inRotation + 180) % 360;

    if (isFinal) {
      outRotation = result.rotation;
      inRotation = (outRotation + 180) % 360;
    }

    return {
      id: id,
      result: result,
      position: position,
      isFinal: isFinal,
      inRotation: inRotation,
      outRotation: outRotation
    };
  }

  return {
    createEndpoint: createEndpoint
  }
})();