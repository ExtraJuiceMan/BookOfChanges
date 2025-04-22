export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function castHexagramNumber() {
    let num;

    if (window.crypto !== undefined && typeof(window.crypto.getRandomValues) === "function") {
        let nums = new Uint8Array(1);
        window.crypto.getRandomValues(nums);
        num = nums[0] & 0b1111;
    } else {
        console.log("window.Crypto is not available; falling back to Math.random() for casting");
        num = getRandomInt(16);
    }
    
    return num;
}