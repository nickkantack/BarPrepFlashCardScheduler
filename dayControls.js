import { studyPlanStartDay, dayOfBar, generateStudyPlan, 
    newCardBuckets, cardsToStudyByDay, idToCardMap } from "./algorithm.js";
import { daysAfter, numberOfDaysBetween } from "./utils.js";
import { generateNewCardDiv, updateIndexSelectBasedOnGroupSelect } from "./main.js";


const dayHeader = document.getElementById(`dayHeader`);
let currentShowingDate = new Date();
dayHeader.innerHTML = currentShowingDate.toLocaleDateString();

const dateBackButton = document.getElementById(`dateBackButton`);
const dateForwardButton = document.getElementById(`dateForwardButton`);

// TODO understand why there is some hysteresis and two study plan generations
// are needed to reach a stable state.
generateStudyPlan();
generateStudyPlan();
renderCardsForTheDay();

dateBackButton.addEventListener(`click`, () => {
    if (numberOfDaysBetween(currentShowingDate, studyPlanStartDay) === 0) {
        return;
    }
    dateForwardButton.disabled = false;
    const previousDate = currentShowingDate;
    currentShowingDate = daysAfter(currentShowingDate, -1);
    if (numberOfDaysBetween(currentShowingDate, studyPlanStartDay) === 0) {
        dateBackButton.disabled = true;
    }
    dayHeader.innerHTML = currentShowingDate.toLocaleDateString();
    switchDay(previousDate);
});

dateForwardButton.addEventListener(`click`, () => {
    if (numberOfDaysBetween(currentShowingDate, dayOfBar) === 0) {
        return;
    }
    dateBackButton.disabled = false;
    const previousDate = currentShowingDate;
    currentShowingDate = daysAfter(currentShowingDate, 1);
    if (numberOfDaysBetween(currentShowingDate, dayOfBar) === 1) {
        dateForwardButton.disabled = true;
    }
    dayHeader.innerHTML = currentShowingDate.toLocaleDateString();
    switchDay(previousDate);
});

function switchDay(previousDate) {

    if (!previousDate) previousDate = currentShowingDate;

    // Remove incomplete new cards
    const newCardsForDayDiv = document.querySelector(`div.newCardsForDayDiv`);
    [...newCardsForDayDiv.querySelectorAll(`div.cardDiv`)].forEach(cardDiv => {
        const groupSelect = cardDiv.querySelector(`select.groupSelect`);
        const indexSelect = cardDiv.querySelector(`select.indexSelect`);
        if (groupSelect.selectedIndex === -1 || indexSelect.selectedIndex === -1) {
            cardDiv.remove();
        }
    });

    // For all new cards that remain, save them to the current days bucket
    const previousDayIndex = numberOfDaysBetween(previousDate, studyPlanStartDay);
    newCardBuckets[previousDayIndex] = [...newCardsForDayDiv.querySelectorAll(`div.cardDiv`)].map(cardDiv => {
        const groupSelect = cardDiv.querySelector(`select.groupSelect`);
        const indexSelect = cardDiv.querySelector(`select.indexSelect`);
        return idToCardMap[`${groupSelect.value}_${indexSelect.value}`];
    });

    // Recalculate the entire study plan
    generateStudyPlan();

    // Update the UI to show the cards for the new current day
    renderCardsForTheDay();
}

function renderCardsForTheDay() {

    // Regenerate the day div to show the correct cards
    const dayIndex = numberOfDaysBetween(currentShowingDate, studyPlanStartDay);

    // Update all of the old cards for this day
    const oldCardsForDavDiv = document.querySelector(`div.oldCardsForDayDiv`);
    oldCardsForDavDiv.innerHTML = ``;
    let cardsDisplayedInThisDivAlready = [];
    cardsToStudyByDay[dayIndex].filter(card => !newCardBuckets[dayIndex].includes(card)).forEach(card => {
        // In some situations the study plan can mention a card more than once.
        // At the end of the day, we don't want any duplicates on the list, so
        // don't create any duplicates.
        if (cardsDisplayedInThisDivAlready.includes(card)) return;
        cardsDisplayedInThisDivAlready.push(card);
        const oldCardDiv = document.createElement(`div`);
        oldCardDiv.classList.add(`oldCardDiv`);
        oldCardDiv.innerHTML = `${card.group} - ${card.index}`;
        oldCardsForDavDiv.appendChild(oldCardDiv);
    });

    // Update all of the new cards for this day
    const newCardsForDayDiv = document.querySelector(`div.newCardsForDayDiv`);
    newCardsForDayDiv.innerHTML = ``;
    newCardBuckets[dayIndex].forEach(card => {
        const newCardDiv = generateNewCardDiv();
        newCardDiv.querySelector(`select.groupSelect`).value = card.group;
        const indexSelect = newCardDiv.querySelector(`select.indexSelect`);
        updateIndexSelectBasedOnGroupSelect(indexSelect, card.group);
        indexSelect.value = card.index;
        newCardsForDayDiv.appendChild(newCardDiv);
    });
}

export { switchDay }