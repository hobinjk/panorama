/** prefixed getUserMedia */
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.msGetUserMedia;

function run() {
  if (!navigator.getUserMedia) {
    alert('Your browser does not support getUserMedia. Please upgrade');
    return;
  }
  navigator.getUserMedia({video: true}, onMediaStream, onPermissionDenied);
}

var video = document.getElementById('source');
var videoImage = document.getElementById('texture');
var videoTexture = new THREE.Texture(video);
var width;
var height;
var camera;
var geometry;
var material;
var videoTexture;
var mesh;
var scene;
var renderer;

function initThreeJs() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
  camera.position.z = 1000;

  geometry = new THREE.BoxGeometry(200, 200, 200);
  // Inspired by http://stemkoski.github.io/Three.js/Video.html
  videoImage.width = width;
  videoImage.height = height;
  videoImageContext = videoImage.getContext('2d');
  videoTexture = new THREE.Texture(videoImage);
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.minFilter = THREE.LinearFilter;

  material = new THREE.MeshLambertMaterial({
    color: 0xff0000 // map: videoTexture
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  document.body.appendChild(renderer.domElement);
}

function onVideoLoaded() {
  width = video.videoWidth;
  height = video.videoHeight;
  initThreeJs();
  drawVideoFrame();
}

function drawVideoFrame() {
  window.requestAnimationFrame(drawVideoFrame);
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoImageContext.drawImage(video, 0, 0);
    videoTexture.needsUpdate = true;
  }
  renderer.render(scene, camera);
}

function onMediaStream(mediaStream) {
  video.src = window.URL.createObjectURL(mediaStream);
  video.onloadedmetadata = onVideoLoaded;
}

function onPermissionDenied(e) {
  console.error('Permission denied:', e);
}

run();
