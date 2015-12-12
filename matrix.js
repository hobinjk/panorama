function Matrix(rows, columns, data) {
  this.rows = rows;
  this.columns = columns;
  this.data = new Array(rows);
  for (var r = 0; r < rows; r++) {
    this.data[r] = new Array(columns);
    for (var c = 0; c < columns; c++) {
      this.data[r][c] = 0;
    }
  }
}

/**
 * Alternate constructor
 * @param {Array<Array<number>>} data
 * @return {Matrix}
 */
Matrix.of = function(data) {
  var mat = new Matrix(data.length, data[0].length);
  mat.data = data;
  return mat;
};

/**
 * Get a value
 * @param {number} row
 * @param {number} col
 * @return {number} value
 */
Matrix.prototype.get = function(row, col) {
  return this.data[row][col];
};

/**
 * Set a value
 * @param {number} row
 * @param {number} col
 * @param {number} value
 */
Matrix.prototype.set = function(row, col, value) {
  this.data[row][col] = value;
};

function xyToXyz(points) {
  var out = new Matrix(points.rows, 3);
  for (var r = 0; r < row; r++) {
    out.data[r][0] = points[r][0];
    out.data[r][1] = points[r][1];
    out.data[r][2] = 1;
  }
  return out;
}

function xyzToXy(points) {
  var out = new Matrix(points.rows, 2);
  for (var r = 0; r < row; r++) {
    out.data[r][0] = points.data[r][0] / points.data[r][2];
    out.data[r][1] = points.data[r][1] / points.data[r][2];
  }
  return out;
}

function mul(matA, matB) {
  var out = new Matrix(matA.rows, matB.columns);
  for (var i = 0; i < matA.rows; i++) {
    for (var j = 0; j < matA.columns; j++) {
      for (var k = 0; k < matB.columns; k++) {
        out.data[i][j] += matA.data[i][k] * matB.data[k][j];
      }
    }
  }
  return out;
}

function mulDot(matA, matB) {
  var out = new Matrix(matA.rows, matA.columns);
  for (var i = 0; i < matA.rows; i++) {
    for (var j = 0; j < matA.columns; j++) {
      out.data[i][j] = matA.data[i][j] * matB.data[i][j];
    }
  }
  return out;
}

function randomChoices(max, count) {
  var choices = [];
  for (var i = 0; i < count; i++) {
    var choice = Math.floor(Math.random() * max);
    if (choices.indexOf(choice) < 0) {
      choices.push(choice);
    }
  }
  return choices;
}

function subset(points, choices) {
  var subset = new Matrix(choices.length, points.columns);
  for (var i = 0; i < choices.length; i++) {
    for (var j = 0; j < points.columns; j++) {
      subset.data[i][j] = points.data[choices[i]][j];
    }
  }
  return subset;
}

function norm(mat) {
  var norm = 0;
  for (var i = 0; i < mat.rows; i++) {
    for (var j = 0; j < mat.columns; j++) {
      norm += mat.data[i][j] * mat.data[i][j];
    }
  }
  return norm;
}

function sub(matA, matB) {
  var out = new Matrix(matA.rows, matA.columns);
  for (var i = 0; i < mat.rows; i++) {
    for (var j = 0; j < mat.columns; j++) {
      out.data[i][j] = matA.data[i][j] - matB.data[i][j];
    }
  }
  return out;
}
