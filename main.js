import { GROUP_POPULATIONS } from "./algorithm.js";

const addNewCardButton = document.getElementById(`addNewCardButton`);
const cardDivTemplate = document.getElementById(`cardTemplate`);

addNewCardButton.addEventListener(`click`, () => {
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
        const selectedGroup = e.target.value;
        const selectedIndex = indexSelect.selectedIndex;
        indexSelect.innerHTML = ``;
        for (let i = 1; i <= GROUP_POPULATIONS[selectedGroup]; i++) {
            const option = document.createElement(`option`);
            option.value = i;
            option.innerHTML = i;
            indexSelect.appendChild(option);
        }
        if (selectedIndex >= 0 && selectedIndex < GROUP_POPULATIONS[selectedGroup]) {
            indexSelect.selectedIndex = selectedIndex;
        } else {
            indexSelect.selectedIndex = -1;
        }
        // TODO maybe trigger an update of the study plan if the index is also
        // populated
        removeNewCardDuplicates(cardDiv);
    });
    indexSelect.addEventListener(`change`, (e) => {
        // TODO maybe trigger an update of the study plan if the group is also
        // populated
        removeNewCardDuplicates(cardDiv);
    });

    // Dispatch a change event to initialize the index select
    // const starterEvent = new Event(`change`);
    // groupSelect.dispatchEvent(starterEvent);
    groupSelect.selectedIndex = -1;
    indexSelect.selectedIndex = -1;

    const newCardsForDayDiv = document.querySelector(`div.dayPanel`).querySelector(`.newCardsForDayDiv`);
    newCardsForDayDiv.appendChild(cardDiv);
});

function removeNewCardDuplicates(cardDiv) {
    const newCardsForDayDiv = document.querySelector(`div.newCardsForDayDiv`);
    const groupSelect = cardDiv.querySelector(`select.groupSelect`);
    const indexSelect = cardDiv.querySelector(`select.indexSelect`);
    [...newCardsForDayDiv.querySelectorAll(`.cardDiv`)].forEach(otherCardDiv => {
        if (otherCardDiv === cardDiv) return;
        const otherGroupSelect = otherCardDiv.querySelector(`select.groupSelect`);
        const otherIndexSelect = otherCardDiv.querySelector(`select.indexSelect`);
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