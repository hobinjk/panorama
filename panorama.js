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
  navigator.getUserMedia({video: {width: 320, height: 240}},
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
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoImageContext.drawImage(video, 0, 0);
    var imageData = videoImageContext.getImageData(0, 0, width, height);
    var harris = detectHarrisFeatures(imageData);
    var points = maxSupress(harris);
    videoImageContext.fillStyle = '#ffa400';
    for (var i = 0; i < points.rows; i++) {
      var x = points.data[i][1];
      var y = points.data[i][0];
      videoImageContext.fillRect(x - 5, y - 5, 11, 11);
    }
  }
}

function onMediaStream(mediaStream) {
  video.src = window.URL.createObjectURL(mediaStream);
  video.onloadedmetadata = onVideoLoaded;
}

function onPermissionDenied(e) {
  console.error('Permission denied:', e);
}

run();
