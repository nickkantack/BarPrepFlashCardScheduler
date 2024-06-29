import { GROUP_POPULATIONS } from "./algorithm.js";
import { addReclickListener } from "./reclickListener.js";
import { switchDay } from "./dayControls.js";

const addNewCardButton = document.getElementById(`addNewCardButton`);
const cardDivTemplate = document.getElementById(`cardTemplate`);

addNewCardButton.addEventListener(`click`, () => {
    const cardDiv = generateNewCardDiv();
    const newCardsForDayDiv = document.querySelector(`div.dayPanel`).querySelector(`.newCardsForDayDiv`);
    newCardsForDayDiv.appendChild(cardDiv);
});

function generateNewCardDiv() {
    const cardDiv = cardDivTemplate.content.cloneNode(true).querySelector(`div`);
    const groupSelect = cardDiv.querySelector(`select.groupSelect`);
    [...Object.keys(GROUP_POPULATIONS)].forEach(group => {
        const option = document.createElement(`option`);
        option.value = group;
        option.innerHTML = group;
        groupSelect.appendChild(option);
    });
    const indexSelect = groupSelect.closest(`table`).querySelector(`select.indexSelect`);
    groupSelect.addEventListener(`change`, (e) => {
        updateIndexSelectBasedOnGroupSelect(indexSelect, e.target.value);
        removeNewCardDuplicates(cardDiv);
    });
    indexSelect.addEventListener(`change`, (e) => {
        removeNewCardDuplicates(cardDiv);
        if (groupSelect.selectedIndex >= 0) switchDay();
    });

    // Dispatch a change event to initialize the index select
    // const starterEvent = new Event(`change`);
    // groupSelect.dispatchEvent(starterEvent);
    groupSelect.selectedIndex = -1;
    indexSelect.selectedIndex = -1;

    // Configure the reclick listener for the delete button
    const deleteButton = cardDiv.querySelector(`button.deleteCardButton`); 
    addReclickListener(deleteButton, () => {
        deleteButton.classList.add(`deleteCardButtonIsHot`);
    }, () => {
        cardDiv.remove();
        switchDay();
    }, 1000, () => {
        deleteButton.classList.remove(`deleteCardButtonIsHot`);
    });

    return cardDiv;
}

function updateIndexSelectBasedOnGroupSelect(indexSelect, newGroupSelected) {
    const selectedIndex = indexSelect.selectedIndex;
    indexSelect.innerHTML = ``;
    for (let i = 1; i <= GROUP_POPULATIONS[newGroupSelected]; i++) {
        const option = document.createElement(`option`);
        option.value = i;
        option.innerHTML = i;
        indexSelect.appendChild(option);
    }
    if (selectedIndex >= 0 && selectedIndex < GROUP_POPULATIONS[selectedGroup]) {
        indexSelect.selectedIndex = selectedIndex;
        switchDay();
    } else {
        indexSelect.selectedIndex = -1;
    }
}

function removeNewCardDuplicates(cardDiv) {
    const newCardsForDayDiv = document.querySelector(`div.newCardsForDayDiv`);
    const groupSelect = cardDiv.querySelector(`select.groupSelect`);
    const indexSelect = cardDiv.querySelector(`select.indexSelect`);
    [...newCardsForDayDiv.querySelectorAll(`.cardDiv`)].forEach(otherCardDiv => {
        if (otherCardDiv === cardDiv) return;
        const otherGroupSelect = otherCardDiv.querySelector(`select.groupSelect`);
        const otherIndexSelect = otherCardDiv.querySelector(`select.indexSelect`);
        // If either the group or index selects are not on a valid option yet,
        // don't bother removing them now. If the user flips to a different day
        // then any such cardDiv will be removed.
        if (otherGroupSelect.selectedIndex === -1 || otherIndexSelect.selectedIndex === -1) return;
        const otherGroup = otherGroupSelect.options[otherGroupSelect.selectedIndex].value;
        const otherIndex = otherIndexSelect.options[otherIndexSelect.selectedIndex].value;
        if (groupSelect.selectedIndex < 0 || indexSelect.selectedIndex < 0) return;
        const thisGroup = groupSelect.options[groupSelect.selectedIndex].value;
        const thisIndex = indexSelect.options[indexSelect.selectedIndex].value;
        if (otherGroup === thisGroup && otherIndex === thisIndex) {
            otherCardDiv.remove();
        }
    });
}

export { generateNewCardDiv, updateIndexSelectBasedOnGroupSelect }