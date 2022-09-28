let rainCount = 0;
async function individualRainScript(rain, velA, posX) {
  let velY = 900;
  let velX = Math.tan(velA/180*Math.PI) * velY;
  let xMin = 0;
  let xMax = window.innerWidth;
  if(velA < 0) {
    xMax -= window.innerHeight * velX/velY;
  } else {
    xMin -= window.innerHeight * velX/velY;
  }
  let rPosX = xMax * posX + xMin * (1 - posX);
  const startTime = new Date().getTime();
  let t = 0;
  while(velY * t < window.innerHeight) {
    await delay(10);
    rain.style.left = rPosX + velX * t + "px"
    rain.style.top = velY * t + "px"
    t = (new Date().getTime() - startTime) / 1000;
  }
  rain.remove();
}
function createRain(zInd, posX, velA, col, transparency) {
  let width = 2;
  let height = 20;
  let zIndex = Math.floor(waveZIndices[1] * zInd + waveZIndices[0] * (1 - zInd));
  let htmlContent = "<div id=\"rain" + rainCount + "\" style=\"position:fixed;transform: rotate(" + (-velA) + "deg);background-color:rgba(" + col[0] * 255 + ", " + col[1] * 255 + ", " + col[2] * 255 + ", " + transparency + ");z-index:" + zIndex + ";top:0px" + ";left:" + (posX * 100) + "%;width:" + width + "px;height:" + height + "px; mix-blend-mode: overlay\"></div>"   
  backgroundContainer.insertAdjacentHTML("beforeend", htmlContent);
  individualRainScript(document.getElementById("rain" + rainCount), velA, posX);
  rainCount = (rainCount + 1) % 10000;//10000 is safegaurd
}
async function rainScript() {
  let rainDensity = 0.01;
  while(true) {
    let velA = 45;
    let area = window.innerWidth + Math.abs(window.innerHeight * Math.tan(velA/180*Math.PI));
    
    let spawnCount = area * rainDensity;
    for(let i = 0; i < spawnCount; i++) {
      createRain(Math.random(), Math.random(), velA, [0, 190/255, 1], 0.4)
    }
    await delay(100)
  }
}