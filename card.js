
class Card {

    currentDensity = 1;
    days = [];
    daysOfSuccess = [];
    group;
    index;
    id;

    constructor(group, index) {
        this.id = `${group}_${index}`;
        this.index = index;
        this.group = group;
    }

}

export { Card }