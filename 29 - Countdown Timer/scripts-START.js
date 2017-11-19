let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds) {
    //clear any existing timers
    clearInterval(countdown);

    const now = Date.now(); //current time in miliseconds
    const then = now + seconds * 1000;
    diplayTimeLeft(seconds);
    displayEndTime(then);
    //console.log({ now, then });  //vypis ako objekt (console.log(now, then); - iny sposob vypisu)

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft <= 0) {
            clearInterval(countdown); //sposob ukoncenia intervalu
            return;
        }
        diplayTimeLeft(secondsLeft);
    }, 1000);
    //setInterval(function () { seconds--; }, 1000); //inner fnc volana kazdych 1000ms //alt1 - rozne problemy (pr. pri zmene tabu v prehliadaci)
}

function diplayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display; //update title daneho tabu webstranky
    timerDisplay.textContent = display;
    //console.log({ minutes, remainderSeconds});
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes} ${hour > 12 ? 'PM' : 'AM'}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time); //konvertuje hodnotu z data-time na integer
    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function (e) { //handlovanie submitnutia custom formularu
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
});