async function styleScript() {
    let timerBack = document.getElementById("timerBack")
    while(true) {
    await delay(1);
    timerBack.style.left = (window.innerWidth - timerBack.offsetWidth)/2+'px';
    }
}