// Based on problem set 2
function transformRANSAC(points1, points2) {
  var bestScore = 0;
  var bestMatch1 = [];
  var bestMatch2 = [];
  var numIteration = 1000;
  var threshold = 1;

  for (var iter = 0; iter < numIteration; iter++) {
    // estimate homography using the selected points
    var choices = randomChoices(points1.rows, 4);
    var subsetPoints1 = subset(points1, choices);
    var subsetPoints2 = subset(points2, choices);
    var H = fitHomography(subsetPoints1, subsetPoints2);

    // homography score = counting # of points within threshold
    var currentScore = 0;
    var match1 = [];
    var match2 = [];

    for (var i = 0; i < points1.length; i++) {
      // transform points1 to points2
      var tpoints2 = mult(H, transpose(xyToXyz(points1)));

      // normalize tpoints2 in (x, y) coordinates
      // [ tpoints2(1)/tpoints2(3), tpoints2(2)/tpoints2(3) ];
      tpoints2 = xyzToXy(tpoints2);
      var dist = norm(sub(tpoints2, points2));

      if (dist < threshold) {
        currentScore += 1;
        match1.push(points1[i]);
        match2.push(points2[i]);
      }
    }

    // store only the higher scoring homography
    if (currentScore > bestScore) {
      bestScore = currentScore;
      bestMatch1 = match1;
      bestMatch2 = match2;
    }
  }

  // compute the homography using the best matches
  return fitHomography(bestMatch1, bestMatch2);
}
