
import { Card } from "./card.js";
import { shuffle, numberOfDaysBetween, daysAfter } from "./utils.js";

const TORTS = "Torts";
const EVIDENCE = "Evidence";
const CONTRACTS = "Contracts";
const CONSTITUTIONAL_LAW = "ConstitutionalLaw";
const CIVIL_PROCEDURE = "CivilProcedure";
const CRIMINAL_LAW_AND_PROCEDURE = "CriminalLawAndProcedure";
const PROPERTY = "Property";
const PERSONAL_JURISDICTION = "PersonalJurisdiction";
const SUBJECT_MATTER_JURISDICTION = "SubjectMatterJurisdiction";

const GROUP_POPULATIONS = {
    "Torts": 44,
    "Evidence": 42,
    "Contracts": 42,
    "ConstitutionalLaw": 52,
    "CivilProcedure": 64,
    "CriminalLawAndProcedure": 70,
    "Property": 65,
    "PersonalJurisdiction": 1,
    "SubjectMatterJurisdiction": 1,
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

const dayOfBar = Date.parse("30 Jul 2024");
const studyPlanStartDay = Date.parse("22 Jun 2024");
const lastDayForNewCards = Date.parse("25 Jul 2024");
const daysInStudyPlan = numberOfDaysBetween(studyPlanStartDay, dayOfBar);
const daysForNewCards = numberOfDaysBetween(studyPlanStartDay, lastDayForNewCards);
const newCardsPerDay = Math.ceil(TOTAL_NUMBER_OF_CARDS / daysForNewCards);
console.log(`There are ${daysForNewCards} days to learn new cards.`);

let cardsToStudyByDay = [];
// For now, we can hard code new card buckets to align with studying done
// before this tool existed
let newCardBuckets = [
    // Virtual 22 Jun 2024
    [
        idToCardMap[`${CONTRACTS}_${3}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${3}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${1}`],
        idToCardMap[`${CONTRACTS}_${1}`],
        idToCardMap[`${CONTRACTS}_${2}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${5}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${2}`],
        idToCardMap[`${EVIDENCE}_${14}`],
        idToCardMap[`${CIVIL_PROCEDURE}_${20}`],
        idToCardMap[`${PROPERTY}_${1}`],
        idToCardMap[`${EVIDENCE}_${5}`],
    ],
    // Virtual 23 Jun 2024
    [
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${4}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${1}`],
        idToCardMap[`${EVIDENCE}_${3}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${4}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${2}`],
        idToCardMap[`${EVIDENCE}_${1}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${6}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${44}`],
        idToCardMap[`${CIVIL_PROCEDURE}_${22}`],
        idToCardMap[`${EVIDENCE}_${2}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${42}`],
    ],
    // Virtual 24 Jun 2024
    [
        idToCardMap[`${CIVIL_PROCEDURE}_${21}`],
        idToCardMap[`${CIVIL_PROCEDURE}_${18}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${41}`],
        idToCardMap[`${PERSONAL_JURISDICTION}_${1}`],
        idToCardMap[`${EVIDENCE}_${10}`],
        idToCardMap[`${EVIDENCE}_${12}`],
        idToCardMap[`${EVIDENCE}_${6}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${47}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${48}`],
        idToCardMap[`${EVIDENCE}_${13}`],
        idToCardMap[`${PROPERTY}_${7}`],
        idToCardMap[`${EVIDENCE}_${9}`],
    ],
    // Virtual 25 Jun 2024
    [
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${45}`],
        idToCardMap[`${PROPERTY}_${8}`],
        idToCardMap[`${PROPERTY}_${6}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${43}`],
        idToCardMap[`${PROPERTY}_${5}`],
        idToCardMap[`${CIVIL_PROCEDURE}_${19}`],
        idToCardMap[`${EVIDENCE}_${8}`],
        idToCardMap[`${SUBJECT_MATTER_JURISDICTION}_${1}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${46}`],
        idToCardMap[`${CRIMINAL_LAW_AND_PROCEDURE}_${3}`],
        idToCardMap[`${PROPERTY}_${9}`],
        idToCardMap[`${EVIDENCE}_${4}`],
    ],
    // 26 Jun 2024
    [
        idToCardMap[`${TORTS}_${1}`],
        idToCardMap[`${TORTS}_${2}`],
        idToCardMap[`${TORTS}_${3}`],
        idToCardMap[`${TORTS}_${4}`],
        idToCardMap[`${TORTS}_${5}`],
        idToCardMap[`${TORTS}_${6}`],
        idToCardMap[`${CONTRACTS}_${4}`],
        idToCardMap[`${CONTRACTS}_${5}`],
        idToCardMap[`${CONTRACTS}_${6}`],
        idToCardMap[`${CONTRACTS}_${7}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${7}`],
    ],
    // 27 Jun 2024
    [
        idToCardMap[`${CONSTITUTIONAL_LAW}_${8}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${9}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${10}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${11}`],
        idToCardMap[`${CONSTITUTIONAL_LAW}_${12}`],
        idToCardMap[`${PROPERTY}_${11}`],
        idToCardMap[`${PROPERTY}_${12}`],
        idToCardMap[`${CONTRACTS}_${8}`],
        idToCardMap[`${CONTRACTS}_${9}`],
        idToCardMap[`${CONTRACTS}_${10}`],
    ]
];
while (newCardBuckets.length < daysInStudyPlan) {
    newCardBuckets.push([]);
}
let newCardBucketSampleCounters = [];

// If there are saved new buckets, then load those
const NEW_BUCKETS_STORAGE_KEY = `NEW_BUCKETS_STORAGE_KEY`;

// Uncomment the line below and relauch to regenerate study plan from
// the hard coded template above
// window.localStorage.removeItem(NEW_BUCKETS_STORAGE_KEY);

if (window.localStorage.getItem(NEW_BUCKETS_STORAGE_KEY)) {
    newCardBuckets = 
        [...JSON.parse(window.localStorage.getItem(NEW_BUCKETS_STORAGE_KEY))]
            .map(ob => {
                return [...ob].map(ob2 => Card.fromJsonObject(ob2));
            });
}

function generateStudyPlan() {

    cardsToStudyByDay = [];

    for (let i = 0; i < daysInStudyPlan; i++) cardsToStudyByDay.push([]);

    // TODO Don't randomly create the new card buckets. Manually make them based on
    // user input. Also, allow future new card buckets to be empty. This means this
    // tool only prescribes how to study old cards but does not dictate which new
    // cards to add to the study rotation (user gets to do that later).
    for (let i = 0; i < daysInStudyPlan; i++) {
        // Only initialize newCardBuckets if it is not yet initialized
        // (i.e. be careful not to overwrite what was read from localStorage)
        if (newCardBuckets.length === 0) newCardBuckets.push([]);
        newCardBucketSampleCounters.push(0);
    }

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

    /*
    console.log([...cardsToStudyByDay[5]].sort((a, b) => {
        if (a.id > b.id) {
            return 1;
        } else if (b.id > a.id) {
            return -1;
        }
        return 0;
    }));
    */

    // Save the new card buckets to local storage
    window.localStorage.setItem(NEW_BUCKETS_STORAGE_KEY, JSON.stringify(newCardBuckets));
}

export { GROUP_POPULATIONS, studyPlanStartDay, lastDayForNewCards, dayOfBar,
    newCardBuckets, cardsToStudyByDay, generateStudyPlan, idToCardMap,
 }