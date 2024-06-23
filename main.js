
import { Card } from "./card.js";
import { shuffle, numberOfDaysBetween, daysAfter } from "./utils.js";

const GROUP_POPULATIONS = {
    "Torts": 44,
    "Evidence": 42,
    "Constracts": 42,
    "ConstitutionalLaw": 52,
    "CivilProcedure": 64,
    "CriminalLawAndProcedure": 70,
    "Property": 65
}

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
shuffle(cardIdsInRandomOrder);

const studyPlanStartDay = Date.parse("23 Jun 2024");
const lastDayForNewCards = Date.parse("26 Jul 2024");
const daysInStudyPlan = numberOfDaysBetween(studyPlanStartDay, lastDayForNewCards);
const newCardsPerDay = Math.ceil(TOTAL_NUMBER_OF_CARDS / daysInStudyPlan);
console.log(`There are ${daysInStudyPlan} days to learn new cards.`);

let cardsToStudyByDay = [];
for (let i = 0; i < daysInStudyPlan; i++) cardsToStudyByDay.push([]);

// Create a "new card" bucket for each day. These are equally filled and their
// contents do not change. Each bucket will have a sampling counter that grows
// each day but at a diminishing rate in time.
let newCardBuckets = [];
let newCardBucketSampleCounters = [];
// TODO Don't randomly create the new card buckets. Manually make them based on
// user input. Also, allow future new card buckets to be empty. This means this
// tool only prescribes how to study old cards but does not dictate which new
// cards to add to the study rotation (user gets to do that later).
for (let i = 0; i < daysInStudyPlan; i++) newCardBuckets.push([]);
for (let i = 0; i < TOTAL_NUMBER_OF_CARDS; i++) {
    const bucketIndex = Math.floor(i / newCardsPerDay);
    newCardBuckets[bucketIndex].push(idToCardMap[cardIdsInRandomOrder[i]]);
    newCardBucketSampleCounters.push(0);
}

// Fill the study buckets which are the inner lists of cardsToStudyByDay
for (let i = 0; i < daysInStudyPlan; i++) {

    // Give it all of the cards from the corresponding new card bucket and the
    // previous new card bucket, if one exists
    newCardBuckets[i].forEach(card => {
        cardsToStudyByDay[i].push(card);
    });

    // Sample cards from previous new card buckets
    for (let stepsBack = 1; stepsBack <= i; stepsBack++) {
        const sampleCounterIncrement = newCardsPerDay * Math.pow(.6, stepsBack - 1);
        const oldBucketIndex = i - stepsBack;
        if (oldBucketIndex >= newCardBuckets.length) continue;
        newCardBucketSampleCounters[oldBucketIndex] += sampleCounterIncrement;
        const cardsToSample = Math.floor(newCardBucketSampleCounters[oldBucketIndex]);
        newCardBucketSampleCounters[oldBucketIndex] -= cardsToSample;
        for (let k = 0; k < cardsToSample; k++) {
            // Find the card in the old card bucket that is tied for being the
            // least practiced and add it to the bucket
            let fewestTimesPracticed = null;
            let leastPracticedCard = null;
            newCardBuckets[oldBucketIndex].forEach(card => {
                const timesThisCardWasPracticed = card.days.length;
                if (fewestTimesPracticed == null || (timesThisCardWasPracticed < fewestTimesPracticed)) {
                    leastPracticedCard = card;
                    fewestTimesPracticed = timesThisCardWasPracticed;
                }
            });

            // The old card bucket is allowed to be empty for some days and this
            // manifests here as a null leastPracticedCard. Just don't sample the
            // bucket in this case.
            if (leastPracticedCard) {
                leastPracticedCard.days.push(daysAfter(studyPlanStartDay, i));
                cardsToStudyByDay[i].push(leastPracticedCard);
            }
        }
    }
}

console.log(cardsToStudyByDay);