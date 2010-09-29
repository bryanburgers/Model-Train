var Session = (function() {

  function trackPiecesToJson(pieces) {
    var ps = [];
    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i];
      ps.push({
        x: piece.position.x,
        y: piece.position.y,
        rotation: piece.degrees,
        pieceID: piece.part.id
      });
    }

    return {
      name: "Unnamed",
      pieces: ps
    }
  }

  return {
    trackPiecesToJson: trackPiecesToJson
  }
})();