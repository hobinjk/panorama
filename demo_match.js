var sourceA = document.getElementById('source-a');
var sourceB = document.getElementById('source-b');

var canvasA = document.getElementById('canvas-a');
var canvasB = document.getElementById('canvas-b');
var canvasMatch = document.getElementById('canvas-match');

var width;
var height;

width = sourceA.width;
height = sourceA.height;

function getGray(ctx) {
  var imageData = ctx.getImageData(0, 0, width, height);
  return convertToGray(imageData);
}

function setupCanvas(canvas) {
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d');
}

function run() {
  var ctxA = setupCanvas(canvasA);
  var ctxB = setupCanvas(canvasB);
  var ctxMatch = setupCanvas(canvasMatch);

  ctxA.drawImage(sourceA, 0, 0);
  ctxB.drawImage(sourceB, 0, 0);

  var imageA = getGray(ctxA);
  var imageB = getGray(ctxB);

  var pointsA = getPoints(ctxA, imageA);
  var pointsB = getPoints(ctxB, imageB);

  var matchedPointsAB = matchPoints(imageA, imageB, pointsA, pointsB);
  var matchedPointsA = matchedPointsAB[0];
  var matchedPointsB = matchedPointsAB[1];

  ctxMatch.strokeStyle = '#ffa400';
  for (var i = 0; i < matchedPointsA.rows; i++) {
    var pointA = matchedPointsA.data[i];
    var pointB = matchedPointsB.data[i];
    ctxMatch.beginPath();
    ctxMatch.moveTo(pointA[1], pointA[0]);
    ctxMatch.lineTo(pointB[1], pointB[0]);
    ctxMatch.stroke();
  }

  var transform = transformRANSAC(matchedPointsA, matchedPointsB);
  console.log(transform);
}

var debug = true;

function getPoints(ctx, image) {
  var harris = detectHarrisFeatures(image);
  var points = maxSupress(harris);
  if (debug) {
    ctx.fillStyle = '#ffa400';
    for (var i = 0; i < points.rows; i++) {
      var x = points.data[i][1];
      var y = points.data[i][0];
      ctx.fillRect(x - 5, y - 5, 11, 11);
    }
  }
  return points;
}

run();
