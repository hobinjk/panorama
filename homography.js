function fitHomography(x1, x2) {
  // Reference to the slides from Lecture 15.
  // takes as input two M × 2 matrices x1 and x2
  // with the x and y coordinates of matching 2D points in the two images,
  // and computes the 3 × 3 homography H that maps x1 to x2.

  // declare A, an (2*M)x9 matrix
  var A = new Matrix(2 * x1.rows, 9);
  var index = 0;
  for (var i = 0; i < x1.rows; i++) {
    A.set(index, 0, x1.get(i, 0));
    A.set(index, 1, x1.get(i, 1));
    A.set(index, 2, 1);
    A.set(index, 6, -x2.get(i, 0) * x1.get(i, 0));
    A.set(index, 7, -x2.get(i, 0) * x1.get(i, 1));
    A.set(index, 8, -x2.get(i, 0));
    index += 1;

    A.set(index, 3, x1.get(i, 0));
    A.set(index, 4, x1.get(i, 1));
    A.set(index, 5, 1);
    A.set(index, 6, -x2.get(i, 1) * x1.get(i, 0));
    A.set(index, 7, -x2.get(i, 1) * x1.get(i, 1));
    A.set(index, 8, -x2.get(i, 1));
    index += 1;
  }

  // Uses http://www.akiti.ca/EigR12Solver.html
  // var eigVecs = new Matrix(9, 9);
  // var eigValuesReal = new Array(9);
  // var eigValuesImag = new Array(9);
  // var output = {};
  // calcEigSysReal(9, mul(transpose(A), A).data, eigVecs.data,
  //                eigValuesReal, eigValuesImag, output);

  // var minEigValue = eigValuesReal[1];
  // var minEigIdx = 1;
  // for (var eigIdx = 2; eigIdx < eigValuesReal.length; eigIdx++) {

  var eigA = numeric.eig(mul(transpose(A), A).data);
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
    // Weirdo reversal because ?????
    minVector.data[vecI][0] = eigA.E.x[vecI][minEigIdx];
  }

  // reshape to 3 x 3 then transpose
  // unrolled out of laziness
  var hTransform = new Matrix(3, 3);
  hTransform.set(0, 0, minVector.get(0, 0));
  hTransform.set(0, 1, minVector.get(1, 0));
  hTransform.set(0, 2, minVector.get(2, 0));
  hTransform.set(1, 0, minVector.get(3, 0));
  hTransform.set(1, 1, minVector.get(4, 0));
  hTransform.set(1, 2, minVector.get(5, 0));
  hTransform.set(2, 0, minVector.get(6, 0));
  hTransform.set(2, 1, minVector.get(7, 0));
  hTransform.set(2, 2, minVector.get(8, 0));
  // hTransform.set(0, 0, eigVecs.get(0, minEigIdx));
  // hTransform.set(0, 1, eigVecs.get(1, minEigIdx));
  // hTransform.set(0, 2, eigVecs.get(2, minEigIdx));
  // hTransform.set(1, 0, eigVecs.get(3, minEigIdx));
  // hTransform.set(1, 1, eigVecs.get(4, minEigIdx));
  // hTransform.set(1, 2, eigVecs.get(5, minEigIdx));
  // hTransform.set(2, 0, eigVecs.get(6, minEigIdx));
  // hTransform.set(2, 1, eigVecs.get(7, minEigIdx));
  // hTransform.set(2, 2, eigVecs.get(8, minEigIdx));
  return hTransform;
}
