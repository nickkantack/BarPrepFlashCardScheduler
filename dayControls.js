import { studyPlanStartDay, lastDayForNewCards } from "./algorithm.js";
import { daysAfter, numberOfDaysBetween } from "./utils.js";

const dayOfBar = Date.parse("30 Jul 2024");

const dayHeader = document.getElementById(`dayHeader`);
let currentShowingDate = new Date();
dayHeader.innerHTML = currentShowingDate.toLocaleDateString();

const dateBackButton = document.getElementById(`dateBackButton`);
const dateForwardButton = document.getElementById(`dateForwardButton`);

dateBackButton.addEventListener(`click`, () => {
    if (numberOfDaysBetween(currentShowingDate, studyPlanStartDay) === 0) {
        return;
    }
    dateForwardButton.disabled = false;
    currentShowingDate = daysAfter(currentShowingDate, -1);
    if (numberOfDaysBetween(currentShowingDate, studyPlanStartDay) === 0) {
        dateBackButton.disabled = true;
    }
    dayHeader.innerHTML = currentShowingDate.toLocaleDateString();
    // TODO regenerate the day div to show the correct cards
});

dateForwardButton.addEventListener(`click`, () => {
    if (numberOfDaysBetween(currentShowingDate, dayOfBar) === 0) {
        return;
    }
    dateBackButton.disabled = false;
    currentShowingDate = daysAfter(currentShowingDate, 1);
    if (numberOfDaysBetween(currentShowingDate, dayOfBar) === 0) {
        dateForwardButton.disabled = true;
    }
    dayHeader.innerHTML = currentShowingDate.toLocaleDateString();
    // TODO regenerate the day div to show the correct cards
});