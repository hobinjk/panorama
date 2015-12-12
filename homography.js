function fitHomography(x1, x2) {
  // Reference to the slides from Lecture 15.
  // takes as input two M × 2 matrices x1 and x2
  // with the x and y coordinates of matching 2D points in the two images,
  // and computes the 3 × 3 homography H that maps x1 to x2.

  // declare A, an (2*M)x9 matrix
  var A = new Matrix(2 * x1.rows, 9);
  var index = 0;
  for (var i = 0; i < x1.rows; i++) {
    A[index][0] = x1[i][0];
    A[index][1] = x1[i][1];
    A[index][2] = 1;
    A[index][6] = -x2[i][0] * x1[i][0];
    A[index][7] = -x2[i][0] * x1[i][1];
    A[index][8] = -x2[i][0];
    index += 1;

    A[index][3] = x1[i][0];
    A[index][4] = x1[i][1];
    A[index][5] = 1;
    A[index][6] = -x2[i][1] * x1[i][0];
    A[index][7] = -x2[i][1] * x1[i][1];
    A[index][8] = -x2[i][1];
    index += 1;
  }

  var eigValuesReal = eigA.lambda.x;
  var minEigValue = eigValuesReal[0];
  var minEigIdx = 0;
  for (var eigIdx = 1; eigIdx < eigValuesReal.length; eigIdx++) {
    var eigValue = eigValuesReal[eigIdx];
    if (minEigValue < eigValue) {
      continue;
    }
    minEigIdx = eigIdx;
    minEigValue = eigValue;
  }

  var minVector = new Matrix(eigA.E.x.length, 1);
  for (var vecI = 0; vecI < eigA.E.x.length; vecI++) {
    minVector.data[vecI][0] = eigA.E.x[vecI][0];
  }

  // reshape to 3 x 3 then transpose
  // unrolled out of laziness
  var hTransform = new Matrix(3, 3);
  hTransform.data[0][0] = minVector.data[0][0];
  hTransform.data[0][1] = minVector.data[1][0];
  hTransform.data[0][2] = minVector.data[2][0];
  hTransform.data[1][0] = minVector.data[3][0];
  hTransform.data[1][1] = minVector.data[4][0];
  hTransform.data[1][2] = minVector.data[5][0];
  hTransform.data[2][0] = minVector.data[6][0];
  hTransform.data[2][1] = minVector.data[7][0];
  hTransform.data[2][2] = minVector.data[8][0];
  return hTransform;
}
