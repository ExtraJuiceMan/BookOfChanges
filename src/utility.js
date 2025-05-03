export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}

export function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    if (code !== null) {
        code = code.toString();
    }

    let time = urlParams.get("time");

    if (time !== null) {
        time = parseInt(time);
    }
    
    let index = urlParams.get("index");

    if (index !== null) {
        index = parseInt(index);
    }

    return { code, time, index };
}

export function scrollToId(id) {
    let el = document.getElementById(id);

    if (el !== null) {
        el.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return true;
    }

    return false;
}

//https://stackoverflow.com/a/64235212
export function hex2bin(hex) {
    hex = hex.replace("0x", "").toLowerCase();
    var out = "";
    for (var c of hex) {
        switch (c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }

    return out;
}

export function castHexagramNumber() {
    let num;

    if (window.crypto !== undefined && typeof (window.crypto.getRandomValues) === "function") {
        let nums = new Uint8Array(1);
        window.crypto.getRandomValues(nums);
        num = nums[0] & 0b1111;
    } else {
        console.log("window.Crypto is not available; falling back to Math.random() for casting");
        num = getRandomInt(16);
    }

    return num;
}