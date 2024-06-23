
import { Card } from "./card.js";
import { shuffle, numberOfDaysBetween, daysAfter } from "./utils.js";

const GROUP_POPULATIONS = {
    "Torts": 128,
}
/*
const GROUP_POPULATIONS = {
    "Torts": 44,
    "Evidence": 42,
    "Constracts": 42,
    "ConstitutionalLaw": 52,
    "CivilProcedure": 64,
    "CriminalLawAndProcedure": 70,
    "Property": 65
}
*/

// Calculate the total number of cards across all groups
let TOTAL_NUMBER_OF_CARDS = 0;
[...Object.values(GROUP_POPULATIONS)].forEach(value => {
    TOTAL_NUMBER_OF_CARDS += value;
})

// Initialize the map of cards
const idToCardMap = {};
[...Object.keys(GROUP_POPULATIONS)].forEach(group => {
    const cardCount = GROUP_POPULATIONS[group];
    for (let i = 1; i <= cardCount; i++) {
        console.log(`The group is ${group}`);
        const card = new Card(group, i);
        idToCardMap[card.id] = card;
    }
});

// The first element in each card's days array is the start day for reviewing
// the card. We will exert loose control over this with the assumption that 
// the user likely wants to assert high control over this. Therefore, we will
// only automatically generate the study schedule for cards that already have
// a first day.

// For now, I'm going to start all of the cards on random days, but with the 
// constraint that they must be as evenly distributed as possible.
let cardIdsInRandomOrder = [...Object.keys(idToCardMap)];
// shuffle(cardIdsInRandomOrder);

const lastDayForNewCards = Date.parse("26 Jul 2024");
const daysLeftForNewCards = numberOfDaysBetween(Date.now(), lastDayForNewCards);
console.log(`There are ${daysLeftForNewCards} days left to learn new cards.`);
const newCardsPerDay = Math.ceil(TOTAL_NUMBER_OF_CARDS / daysLeftForNewCards);
for (let i = 0; i < cardIdsInRandomOrder.length; i++) {
    const currentDay = Math.floor(i / newCardsPerDay);
    const studyDay = daysAfter(Date.now(), currentDay);
    idToCardMap[cardIdsInRandomOrder[i]].days.push(studyDay);
}

// Now forceast each card's review on the basis that none get recycled.
// This amounts to iterating through all of the cards, identifying sampling
// windows, and choosing the day in the sampling window with the smallest
// number of cards. We will simultaneously start populating a temporary
// list of cards studied in each day since this will allow us to quickly 
// find days with the fewest planned cards to study.
let cardsToStudyByDay = [];
// TODO initialize differently; right now all days arrays point to the same object
for (let i = 0; i < daysLeftForNewCards; i++) cardsToStudyByDay.push([]);

// MAIN SCHEDULING ALGORITHM
// This method ingests the days arrays of all cards and computes a fresh
// study plan from today's date until the final date of introducing new
// cards.
[...Object.values(idToCardMap)].forEach(card => {

    // First, add already planned study days to the schedule
    for (let i = 0; i < card.days.length; i++) {
        // If the days is in the past, don't bother adding it to our study
        // schedule
        if (card.days[i] < Date.now() && numberOfDaysBetween(card.days[i], Date.now())) continue;

        const daysAfterToday = numberOfDaysBetween(Date.now(), card.days[i]);
        cardsToStudyByDay[daysAfterToday].push(card);
        if (daysAfterToday === 1) {
            console.log(card.days);
            console.log(Date.now());
            console.log(daysAfterToday);
        }
    }

    if (card.days.length > 0) {
        let mostFutureStudyDate = card.days[card.days.length - 1];
        let density = 1;

        if (card.days.length > 1) {
            // The separation between the last two dates implies the next density
            let nextMostFutureStudyDate = card.days[card.days.length - 2];
            density = 0.5 / numberOfDaysBetween(mostFutureStudyDate, nextMostFutureStudyDate);
        }

        let startDateForNextWindow = daysAfter(mostFutureStudyDate, 1);
        let period = Math.floor(1 / density);

        do {

            const endDateForNextWindow = daysAfter(startDateForNextWindow, period);

            // Count planned cards for all days in the next window
            let latestDateWithFewestCards = endDateForNextWindow;
            let minimumIndex = numberOfDaysBetween(Math.min(endDateForNextWindow, lastDayForNewCards), Date.now()) - 1;
            let minimumCardsPerDayFound = cardsToStudyByDay[minimumIndex].length;
            let dateCursor = Math.min(endDateForNextWindow, lastDayForNewCards);
            while (numberOfDaysBetween(dateCursor, startDateForNextWindow) > 0) {
                const index = numberOfDaysBetween(dateCursor, Date.now()) - 1;
                if (cardsToStudyByDay[index].length < minimumCardsPerDayFound) {
                    minimumIndex = index;
                    minimumCardsPerDayFound = cardsToStudyByDay[index].length;
                    latestDateWithFewestCards = dateCursor;
                }
                dateCursor = daysAfter(dateCursor, -1);
            }

            // Add this card to a day that is least filled or tied for least filled
            cardsToStudyByDay[minimumIndex].push(card);

            // Record the date of study for the card in its days array
            card.days.push(latestDateWithFewestCards);

            // Move startDateForNextWindow in preparation for the next iteration
            startDateForNextWindow = daysAfter(startDateForNextWindow, period);

            // Update the density (period is updated at top of loop)
            density /= 2;
            period = Math.floor(1 / density);

        } while (startDateForNextWindow < lastDayForNewCards);
    }

});

console.log(cardsToStudyByDay);