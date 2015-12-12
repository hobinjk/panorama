var sourceA = document.getElementById('source-a');
var sourceB = document.getElementById('source-b');

var canvasA = document.getElementById('canvas-a');
var canvasB = document.getElementById('canvas-b');

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

  ctxA.drawImage(sourceA, 0, 0);
  ctxB.drawImage(sourceB, 0, 0);

  var imageA = getGray(ctxA);
  var imageB = getGray(ctxB);

  var pointsA = getPoints(ctxA, imageA);
  var pointsB = getPoints(ctxB, imageB);

  var matchedPointsAB = matchPoints(imageA, imageB, pointsA, pointsB);
  var matchedPointsA = matchedPointsAB[0];
  var matchedPointsB = matchedPointsAB[1];

  var transform = transformRANSAC(matchedPointsA, matchedPointsB);
  console.log(transform);

  var scene = new THREE.Scene();
  // var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // camera.zoom = 0.001;
  // camera.updateProjectionMatrix();
  var camera = new THREE.OrthographicCamera(-width, width, height, -height,
                                            0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.PlaneGeometry(width, height, 32);
  var textureA = THREE.ImageUtils.loadTexture(sourceA.src);
  var textureB = THREE.ImageUtils.loadTexture(sourceB.src);

  var materialA = new THREE.MeshBasicMaterial({map: textureA});
  var materialB = new THREE.MeshBasicMaterial({map: textureB});
  var planeA = new THREE.Mesh(geometry, materialA);
  var planeB = new THREE.Mesh(geometry, materialB);
  scene.add(planeA);
  scene.add(planeB);

  transform = transpose(transform);

  console.log(transform.data);

  for (var row = 0; row < transform.rows; row++) {
    for (var col = 0; col < transform.columns; col++) {
      transform.data[row][col] /= transform.data[2][2];
    }
  }

  window.asdf = transform;
  var transformBBase = new THREE.Matrix4();
  transformBBase.set(
    transform.get(1, 1), transform.get(1, 0), 0, transform.get(1, 2),
    transform.get(0, 1), transform.get(0, 0), 0, transform.get(0, 2),
    0, 0, 1, 0,
    transform.get(2, 1), transform.get(2, 0), 0, transform.get(2, 2)
  );
  // transformBBase.set(
  //   transform.get(1, 1), transform.get(1, 0), 0, transform.get(2, 0),
  //   transform.get(0, 1), transform.get(0, 0), 0, transform.get(2, 1),
  //   0, 0, 1, 0,
  //   transform.get(0, 2), transform.get(1, 2), 0, transform.get(2, 2)
  // );

  var transformB = new THREE.Matrix4();
  transformB.getInverse(transformBBase);
  // transformB.set(
  //   transform.get(1, 1), transform.get(1, 0), 0, -transform.get(2, 1) * 0,
  //   transform.get(0, 1), transform.get(0, 0), 0, -transform.get(2, 0) * 0,
  //   0,                   0,                   1, 0,
  //   transform.get(1, 2), transform.get(0, 2), 0, transform.get(2, 2)
  // );
  // H * [x y 1] = [x' y' z'] = [x'/z' y'/z']
  //transformB.set(
  //  1, 0, 0, transform.get(0, 2),
  //  0, 1, 0, transform.get(1, 2),
  //  0, 0, 1, 0,
  //  0, 0, 0, transform.get(2, 2)
  //);
  console.log(planeB.matrix);
  planeB.matrix = transformBBase.multiply(planeB.matrix);
  planeB.matrixAutoUpdate = false;

  window.planeB = planeB;

  camera.position.z = 5;

  window.hideA = false;
  window.hideB = false;

  function render() {
    requestAnimationFrame(render);
    planeA.visible = !window.hideA;
    planeB.visible = !window.hideB;
    renderer.render(scene, camera);
  }
  render();
}

var debug = false;

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
