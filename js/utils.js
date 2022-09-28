const startTime = new Date().getTime();
const backgroundContainer = document.getElementById("backgroundContainer")
function getGradient(ratio, start, end) {
    return [(1 - (1 - start[0]/255 * (1 - ratio)) * (1 - end[0]/255 * ratio)) * 255, (1 - (1 - start[1]/255 * (1 - ratio)) * (1 - end[1]/255 * ratio)) * 255, (1 - (1 - start[2]/255 * (1 - ratio)) * (1 - end[2]/255 * ratio)) * 255]
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
    
function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }
  return result;
}

function rgb2HSV(rgb) {
  let max = Math.max(...rgb);
  let min = Math.min(...rgb);
  let t = max - min;
  let H = Math.PI / 3;
  if(t == 0) {
    H = 0;
  } else if(max == rgb[0]) {
    H *= (rgb[1] - rgb[2])/t % 6;
  } else if(max == rgb[1]) {
    H *= (rgb[2] - rgb[0])/t + 2;
  } else
  {
    H *= (rgb[0] - rgb[1])/t + 4;
  }
  let S = 0;
  if(max != 0) {
    S = t/max;
  }
  return [H, S, max];
}