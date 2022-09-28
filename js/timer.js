async function timerScript() { 
    const timer = document.getElementById("timer")
    const piDay = new Date(2023, 3, 14, 18, 28).getTime()
    let startTimerCount = 5;
    let timerNames = ["Days", "Hours", "Minutes", "Seconds", "Milliseconds", "Microseconds", "Nanoseconds", "Picoseconds", "Femtoseconds", "Attoseconds", "Zeptoseconds", "Yoctoseconds"]
    let timerSizes = [3, 2, 2, 2, 3]
    let timerObjects = []
    let timerAdditions = [10000, 20000, 30000, 30500, 31000, 36000, 38000]
    let gradient = [[[0, 210, 255], 0], [[58, 123, 213], startTimerCount], [[255, 78, 80], startTimerCount + 4], [[249, 212, 35], startTimerCount + 6]]
    
    function appendTimer(i) {
        let htmlContent = ""
        if(i != 0) {
        htmlContent += "<span style = \"font-size:75px; height: 10px\">:</span>"
        }
        let color = gradient[gradient.length - 1][0]
        for(let gInt = 1; gInt < gradient.length; gInt++) {
            let eInd = gradient[gInt][1];
            let sInd = gradient[gInt- 1][1];
            if(eInd > i) {
                color = getGradient((i - sInd) / (eInd - sInd), gradient[gInt- 1][0], gradient[gInt][0]);
                break
            }
        }
        let width = 38 * timerSizes[Math.min(i, startTimerCount - 1)];
        htmlContent += "<div style=\"display:inline-block\">"
        htmlContent += "<p id= \"u" + i + "\" style=\"margin: 0; padding-bottom:0\">days</p>"
        htmlContent += "<svg width=\"" + width + "\" height=\"3\" style=\"margin-top:0; display:block; margin: 0; padding-bottom:0\">"
        htmlContent += "<rect width=\"" + width + "\" height=\"3\" style=\"fill:rgb(" + color[0] + "," + color[1] + "," + color[2] + ")\" />"
        htmlContent += "</svg>"
        htmlContent += "<p id= \"t" + i + "\" style=\"margin: 0; padding-top:0; font-size:75px; font-family: 'Timer'; line-height: 56px\">000</p>"
        htmlContent += "</div>"
        timer.insertAdjacentHTML('beforeend', htmlContent);
        timerObjects.push(document.getElementById("t" + i))
        document.getElementById("u" + i).textContent = timerNames[i]
    }
    
    for(let i = 0; i < startTimerCount; i++) {
        appendTimer(i)
    }
    
    
    while(true) {
        await delay(1);
        const d = new Date();
        let time = piDay - d.getTime()
        let runTime = d.getTime() - startTime;
        //
        let milliseconds = time % 1000
        let seconds = Math.floor(time / 1000) % 60
        let minutes = Math.floor(time / 60000) % 60
        let hours = Math.floor(time / 3600000) % 24
        let days = Math.floor(time / 86400000)
        timerObjects[0].textContent = addLeadingZeros(days, 3);
        timerObjects[1].textContent = addLeadingZeros(hours, 2);
        timerObjects[2].textContent = addLeadingZeros(minutes, 2);
        timerObjects[3].textContent = addLeadingZeros(seconds, 2);
        timerObjects[4].textContent = addLeadingZeros(milliseconds, 3);
        //
        if(timerAdditions.length != 0 && (timerAdditions[0] < runTime/* || true*/)) {
            timerAdditions.shift()
            appendTimer(timerObjects.length)
        }
        for(let i = startTimerCount; i < timerObjects.length; i++) {
            timerObjects[i].textContent = Math.floor(Math.random() * 1000)
        }
    }
}