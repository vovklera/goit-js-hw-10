import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const datetime = document.querySelector('#datetime-picker');
const secondsEL = document.querySelector('[data-seconds]');
const minutesEl = document.querySelector('[data-minutes]');
const hoursEl = document.querySelector('[data-hours]');
const daysEl = document.querySelector('[data-days]');

startBtn.disabled = true;
let userSelectedDate = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    
    onClose(selectedDates) {
        console.log(selectedDates[0]);
        
        userSelectedDate = selectedDates[0];
        if (userSelectedDate <= Date.now()) {
            iziToast.show({
                message: 'Please choose a date in the future'
            });
            startBtn.disabled = true;
            return;
        };
        startBtn.disabled = false;
    },
};



flatpickr('#datetime-picker', options);

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    datetime.disabled = true;

    const timer = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = userSelectedDate - currentTime;
        const ms = convertMs(deltaTime);

        if (deltaTime <= 0) {
            clearInterval(timer);
            datetime.disabled = false;
            return;
        }

        updateClockface(ms);
    }, 1000);
})

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
};

function addLeadingZero(value){
    return String(value).padStart(2, "0");
};

function updateClockface({ days, hours, minutes, seconds }) {
    secondsEL.textContent = seconds;
    minutesEl.textContent = minutes;
    hoursEl.textContent = hours;
    daysEl.textContent = days;
}


