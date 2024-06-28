let lastClickMillisMap = {};
let timeExpiredCallbackMap = {};

function addReclickListener(element, firstClickCallback, secondClickCallback, waitTimeMillis, timeExpiredCallback) {
    const lastClickMillisMapKey = hashCode(JSON.stringify(element));
    element.addEventListener("click", () => {
        const currentTimeMillis = new Date().getTime();
        if (lastClickMillisMap.hasOwnProperty(lastClickMillisMapKey)) {
            const timeSinceLastClickMillis = currentTimeMillis - lastClickMillisMap[lastClickMillisMapKey];
            if (timeSinceLastClickMillis < waitTimeMillis) {
                secondClickCallback();
                timeExpiredCallback();
                return;
            }
        }
        lastClickMillisMap[lastClickMillisMapKey] = currentTimeMillis;
        firstClickCallback();
        if (timeExpiredCallbackMap.hasOwnProperty(lastClickMillisMapKey)) {
            clearTimeout(timeExpiredCallbackMap[lastClickMillisMapKey]);
        }
        timeExpiredCallbackMap[lastClickMillisMapKey] = setTimeout(timeExpiredCallback, waitTimeMillis);
    });
}

function hashCode(string){
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
        var code = string.charCodeAt(i);
        hash = ((hash<<5)-hash)+code;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export { addReclickListener }