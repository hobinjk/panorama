function calcSSD(matA, matB, pointA, pointB) {
  var winSize = 3;
  var diff = 0;

  for (var row = -winSize; row <= winSize; row++) {
    for (var col = -winSize; col <= winSize; col++) {
      var valueA = matA.data[pointA[0] + row][pointA[1] + col];
      var valueB = matB.data[pointB[0] + row][pointB[1] + col];
      diff += (valueA - valueB) * (valueA - valueB);
    }
  }

  return diff;
}

function matchPoints(imageA, imageB, pointsA, pointsB) {
  // Calculate pointsA -> pointsB and pointsB -> pointsA
  // Matches are those that agree

  var pointsAMatches = indexMatchPoints(imageA, imageB, pointsA, pointsB);
  var pointsBMatches = indexMatchPoints(imageB, imageA, pointsB, pointsA);

  // First array is pointsA, second is pointsB because
  // multiple return and this is already matlab-flavored
  var matches = [[], []];
  for (var i = 0; i < pointsAMatches.length; i++) {
    var pointBIdx = pointsAMatches[i];
    var pointAIdx = pointsBMatches[pointBIdx];
    if (i === pointAIdx) {
      matches[0].push(pointsA.data[i]);
      matches[1].push(pointsB.data[pointBIdx]);
    }
  }
  return [
    Matrix.of(matches[0]),
    Matrix.of(matches[1])
  ];
}

function indexMatchPoints(imageA, imageB, pointsA, pointsB) {
  var indices = [];
  for (var i = 0; i < pointsA.rows; i++) {
    var index = indexMatchPoint(imageA, imageB, pointsA.data[i], pointsB);
    indices.push(index);
  }
  return indices;
}

function indexMatchPoint(imageA, imageB, pointA, pointsB) {
  var bestIdx = 0;
  var bestSSD = calcSSD(imageA, imageB, pointA, pointsB.data[0]);

  for (var i = 1; i < pointsB.rows; i++) {
    var ssd = calcSSD(imageA, imageB, pointA, pointsB.data[i]);
    if (ssd > bestSSD) {
      continue;
    }
    bestSSD = ssd;
    bestIdx = i;
  }
  return bestIdx;
}
