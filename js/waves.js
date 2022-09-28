let waveCount = 0;
let waves = [];
let waveZIndices = [20, 20 + 32]
function makeWaves(amplitude, width, posX, posY, waveCol, waterCol, flipY, zIndRatio) {
  let hsv = rgb2HSV(waveCol);
  let widthT = Math.ceil(width * Math.min(window.innerWidth, window.innerHeight));
  let pxT = posX % widthT;
  let htmlContent = "<div id=\"waves" + waves.length + "-C2" + "\" style=\"position:fixed;top:" + posY + "px\">";
  let count = Math.ceil(window.innerWidth / widthT);
  let height = Math.ceil(widthT * amplitude);
  let zIndex = Math.floor(waveZIndices[1] * zIndRatio + waveZIndices[0] * (1-zIndRatio));
  let style = "";
  if(flipY) {
    style += ";transform: scaleY(-1)"
  }
  for (let i = -1; i <= count; i++) {
    htmlContent += "<img class = \"sinWave\" id = \"sinWave" + waves.length + "-" + (i + 1) + "\" src = \"Images/sinGraph.png\" style=\"width:" + (widthT + 1) + "px; left:" + Math.floor(widthT * i + pxT) + "px; height: " + height + "px;filter:hue-rotate(" + hsv[0] * 180/Math.PI + "deg) saturate(" + hsv[1] + ") brightness(" + (hsv[2] * 3) + ")" + style + "\">";
  }
  let bodyTop = height + posY;
  
        if(flipY) {
          bodyTop = posY - window.innerHeight;
        }
  htmlContent += "</div><div id=\"waveBody" + waves.length + "\" style=\"position:fixed;display:block;height:" + window.innerHeight + "px;background:" + waterCol + ";width:100%;top:" + bodyTop + "px\"></div>";
  backgroundContainer.insertAdjacentHTML("beforeend", "<div id=\"waves" + waves.length + "\" style=\"z-index:" + zIndex + ";position:fixed;height:100%;width:100%\">" + htmlContent + "</div>");
  let wave = document.getElementById("waves" + waves.length);
  let wave2 = document.getElementById("waves" + waves.length + "-C2");
  let imgs = [];
  for (let i = 0; i <= count+1; i++) {
    imgs.push(document.getElementById("sinWave" + waves.length + '-' + i));
  }
  let ret = { "container": wave, "container2": wave2, "segments": imgs, "width": width, "amplitude": amplitude, "id": waves.length, "body": document.getElementById("waveBody" + waves.length), "widthT": widthT, "heightT": height, "posX": posX, "posY": posY, "waveCol": waveCol, "waterCol": waterCol, "flipY": flipY};
  waves.push(ret);
  return ret;
}
async function waveResizer() {
  let oldSize = window.innerWidth
  let oldSize2 = window.innerHeight
  while (true) {
    await delay(1)
    if (oldSize != window.innerWidth || oldSize2 != window.innerHeight) {
      oldSize = window.innerWidth;
      oldSize2 = window.innerHeight;
      for (let i = 0; i < waves.length; i++) {
        let wave = waves[i];
        let widthT = Math.ceil(wave.width * Math.min(window.innerWidth, window.innerHeight));
        let count = Math.ceil(window.innerWidth / widthT);
        let height = Math.ceil(widthT * wave.amplitude);
        let pxT = wave.posX % widthT;
        wave.heightT = height;
        wave.widthT = widthT;
        for (let i2 = 0; i2 < wave.segments.length; i2++) {
          let img = wave.segments[i2];
          img.style.height = height + "px";
          img.style.width = widthT + 1 + "px";
          img.style.left = Math.floor(widthT * (i2 - 1) + pxT) + "px";
        }
        let style = "";
        if(wave.flipY) {
          wave.body.style.top = wave.posY - window.innerHeight + "px"
          style += ";transform: scaleY(-1)"
        } else {
          wave.body.style.top = height + wave.posY + "px"
        }
        wave.body.style.height = window.innerHeight
        let hsv = rgb2HSV(wave.waveCol);
        for (let i2 = wave.segments.length; i2 <= count+1; i2++) {
          let id = wave.id + "-" + wave.segments.length;
          wave.segments[wave.segments.length - 1].insertAdjacentHTML("afterend", "<img class = \"sinWave\" id = \"sinWave" + id + "\" src = \"Images/sinGraph.png\" style=\"width:" + widthT + "px; left:" + Math.floor(widthT * (wave.segments.length - 1)) + "px;filter:hue-rotate(" + hsv[0] * 180/Math.PI + "deg) saturate(" + hsv[1] + ") brightness(" + (hsv[2] * 3) + "); height: " + height + "px" + style + "\">");
          wave.segments.push(document.getElementById("sinWave" + id))
        }
        for (let i2 = wave.segments.length - 1; i2 > count; i2--) {
          wave.segments[wave.segments.length - 1].remove();
          wave.segments.pop();
        }
      }
    }
  }
}
function updateWavePos(wave) {
  for (let i2 = 0; i2 < wave.segments.length; i2++) {
    let img = wave.segments[i2];
    img.style.left = Math.floor(wave.widthT * (i2 - 1) + wave.posX % wave.widthT) + "px";
    wave.container2.style.top = wave.posY + "px"
  }
  if(wave.flipY) {
    wave.body.style.top = wave.posY - window.innerHeight + "px"
  } else {
    wave.body.style.top = wave.heightT + wave.posY + "px"
  }
}
async function waveScript() {
  //waveZIndices max - min should be multiple of all wave counts
  waveResizer();
  let seas = [];
  let seasB = [];
  let seaCount = 8;
  for(let i = 0; i < seaCount; i++) {
    let col = getGradient(i / (seaCount - 1), [80/255, 117/255, 117/255], [20/255, 56/255, 122/255]);
    let cGrad = "linear-gradient(to bottom, rgba(" + col[0]*255 + ", " + col[1]*255 + ", " + col[2]*255 + ", 1), rgba(0, 0, 0, 0) 30%)";
    seasB.push(makeWaves(0.15, 0.4, 10, 40, [0, 0, 0], "rgb(0, 0, 0)", false, i / seaCount));
    seas.push([makeWaves(0.15, 0.4, 10, 40, col, cGrad, false, i / seaCount), Math.random()]);
  }
  let clouds = [];
  let cloudsB = [];
  let cloudCount = 4;
  for(let i = 0; i < cloudCount; i++) {
    let col = getGradient(i / (seaCount - 1), [255/255, 255/255, 255/255], [200/255, 200/255, 200/255]);
    let cM = 0.6;
    let cGrad = "linear-gradient(to top, rgba(" + col[0]*255*cM + ", " + col[1]*255*cM + ", " + col[2]*255*cM + ", 1), rgba(255, 255, 255, 0) 30%)";
    let posY = (cloudCount - i - 1) * Math.min(window.innerHeight, window.innerWidth) / 20;
    cloudsB.push(makeWaves(0.15, 0.4, 10, posY+4, [0, 0, 0], "rgb(0, 0, 0)", true, i / cloudCount));
    clouds.push([makeWaves(0.15, 0.4, 10, posY, col, cGrad, true, i / cloudCount), Math.random()]);
  }
  let seaC = 1 / 100;
  let seaSpeed = 0.5;
  let seaOff = 0.5;
  let seaOffY = 0.5;
  let seaDrift = 0.05;
  let seaDifDrift = 0.2;
  let cloudDrift = 0.005;
  let cloudDifDrift = 0.4;
  while(true) {
    let minWH = Math.min(window.innerHeight, window.innerWidth);
    let time = new Date().getTime() - startTime;
    let angle = (time / 1000) * 2 * Math.PI * seaSpeed;
    for(let i = 0; i < seaCount; i++) {
      let sea = seas[i][0];
      let seaB = seasB[i];
      let aOff = i/seaCount * 2 * Math.PI * seaOff;
      sea.posX = (Math.cos(angle + aOff) * seaC + seas[i][1] + seaDrift * time / 1000 * (i * seaDifDrift + 1)) * minWH;
      sea.posY = (Math.sin(angle + aOff) * seaC + seaOffY * i/seaCount) * minWH + window.innerHeight/2;
      seaB.posX = sea.posX;
      seaB.posY = sea.posY - Math.floor(sea.heightT/30);
      updateWavePos(sea)
      updateWavePos(seaB)
    }
    for(let i = 0; i < cloudCount; i++) {
      let cloud = clouds[i][0];
      let cloudB = cloudsB[i];
      cloud.posX = (clouds[i][1] + cloudDrift * time / 1000 * (i * cloudDifDrift + 1)) * minWH;
      cloudB.posX = cloud.posX;
      updateWavePos(cloud)
      updateWavePos(cloudB)
    }
    await delay(1)
  }
}