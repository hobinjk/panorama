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

    for (var i = 0; i < points1.rows; i++) {
      // transform points1 to points2
      var point1 = Matrix.of([[points1.get(i, 0), points1.get(i, 1), 1]]);
      var point2 = Matrix.of([[points2.get(i, 0), points2.get(i, 1)]]);
      var tpoint2 = mul(H, transpose(point1));

      // normalize tpoint2 in (x, y) coordinates
      // [ tpoint2(1)/tpoint2(3), tpoint2(2)/tpoint2(3) ];
      tpoint2 = xyzToXy(transpose(tpoint2));
      var dist = norm(sub(tpoint2, point2));

      if (dist < threshold) {
        console.log('a miracle has occured');
        currentScore += 1;
        match1.push(point1.data[0]);
        match2.push(point2.data[0]);
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
