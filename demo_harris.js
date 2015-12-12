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
  navigator.getUserMedia({video: {width: 640, height: 360}},
                         onMediaStream, onPermissionDenied);
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
  videoImageContext.drawImage(video, 0, 0);
  var imageData = videoImageContext.getImageData(0, 0, width, height);
  var harris = detectHarrisFeatures(imageData);
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
      imageData.data[((row * width + col) << 2) + 0] = harris.data[row][col];
      imageData.data[((row * width + col) << 2) + 1] = harris.data[row][col];
      imageData.data[((row * width + col) << 2) + 2] = harris.data[row][col];
    }
  }
  videoImageContext.putImageData(imageData, 0, 0);
}

function onMediaStream(mediaStream) {
  video.src = window.URL.createObjectURL(mediaStream);
  video.onloadedmetadata = onVideoLoaded;
}

function onPermissionDenied(e) {
  console.error('Permission denied:', e);
}

run();
