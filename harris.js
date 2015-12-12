function convertToGray(image) {
  var out = new Matrix(image.height, image.width);
  for (var row = 0; row < image.height; row++) {
    for (var col = 0; col < image.width; col++) {
      var r = image.data[((row * image.width + col) << 2) + 0];
      var g = image.data[((row * image.width + col) << 2) + 1];
      var b = image.data[((row * image.width + col) << 2) + 2];
      // NTSC conversion
      out.data[row][col] = r * 0.2989 + g * 0.587 + b * 0.114;
    }
  }
  return out;
}

function convolve(image, kernel) {
  var out = new Matrix(image.rows, image.columns);
  var win = Math.floor(kernel.rows / 2);
  for (var row = win; row < out.rows - win; row++) {
    for (var col = win; col < out.columns - win; col++) {
      for (var rowI = -win; rowI <= win; rowI++) {
        for (var colI = -win; colI <= win; colI++) {
          out.data[row][col] += kernel.data[rowI + win][colI + win] *
                                image.data[row + rowI][col + colI];
        }
      }
    }
  }
  return out;
}

function detectHarrisFeatures(imageRGB) {
  var image = convertToGray(imageRGB);
  var win = 2;
  var k = 0.004; // opencv default?
  var sobelX = Matrix.of([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]);
  var sobelY = Matrix.of([[1, 2, 1], [0, 0, 0], [-1, -2, -1]]);
  var xDeriv = convolve(image, sobelX);
  var yDeriv = convolve(image, sobelY);

  var xxDeriv = mulDot(xDeriv, xDeriv);
  var xyDeriv = mulDot(xDeriv, yDeriv);
  var yyDeriv = mulDot(yDeriv, yDeriv);

  var harris = new Matrix(image.height, image.width);
  for (var row = win; row < harris.rows - win; row++) {
    for (var col = win; col < harris.columns - win; col++) {
      var c = new Matrix(2, 2);
      for (var rowI = -win; rowI <= win; rowI++) {
        for (var colI = -win; colI <= win; colI++) {
          c.data[0][0] += xxDeriv.data[row + rowI][col + colI];
          c.data[0][1] += xyDeriv.data[row + rowI][col + colI];
          c.data[1][0] += xyDeriv.data[row + rowI][col + colI];
          c.data[1][1] += yyDeriv.data[row + rowI][col + colI];
        }
      }
      var traceC = c.data[0][0] + c.data[1][1];
      harris.data[row][col] = numeric.det(c.data) - k * traceC * traceC;
    }
  }

  return harris;
}

function maxSupress(harris) {
  var points = [];
  var win = 4;
  for (var row = win; row < harris.rows - win; row++) {
    for (var col = win; col < harris.columns - win; col++) {
      var max = true;
      var value = harris.data[row][col];

      for (var rowI = -win; rowI <= win; rowI++) {
        for (var colI = -win; colI <= win; colI++) {
          if (harris.data[row + rowI][col + colI] < value) {
            continue;
          }
          max = false;
          break;
        }
        if (!max) {
          break;
        }
      }
      if (max) {
        // Create what is effectively a matrix
        points.push([row, col]);
      }
    }
  }
  return points;
}
