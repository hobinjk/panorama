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

var width;
var height;

function onVideoLoaded() {
  width = video.videoWidth;
  height = video.videoHeight;
  videoImage.width = width;
  videoImage.height = height;
  videoImageContext = videoImage.getContext('2d');
  drawVideoFrame();
}

function drawVideoFrame() {
  window.requestAnimationFrame(drawVideoFrame);
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoImageContext.drawImage(video, 0, 0);
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
