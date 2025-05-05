import "./assets/fonts/normal.woff2";
import "./assets/fonts/italic.woff2";
import "./assets/css/style.css";

import Hexagram from "./app/hexagram";
import { castedNumbersToBitString, castHexagramNumber, getRandomInt } from "./app/utility";
import { YinYang, YinYangInvert, KING_WEN_SEQ, AppStates, ICHING_COMPACT } from "./app/constants";
import { runBuildPageWorker } from "./app/build-page";
import { castTop } from "./components/cast-top";
import { castBottom } from "./components/cast-bottom";
import { castBeacon } from "./components/cast-beacon";
import { castBits } from "./components/cast-bits";
import { castLog } from "./components/cast-log";
import { appData, beaconState, resetAppData, resetBeaconState, resetCastInfo, setCastInfo, castState, getSecretShare, setSecretShare } from "./app/state";
import { stopBeaconBitsChoice, stopBeaconCountdown } from "./components/cast-beacon";
import { create, SVG } from "@svgdotjs/svg.js";
import { lookup, lookupInfo } from "./components/lookup";

export function getHexagramQuery() {
    let url = `?code=${castedNumbersToBitString(appData.castNumbers)}`;
    if (beaconState.beaconTime !== 0) {
        url += `&time=${beaconState.beaconTime}&index=${beaconState.beaconIndex}`;
    }
    return url;
}

export function copyHexagramUrl() {
    if (getSecretShare()) {
        navigator.clipboard.writeText(getShareURL());
        return;
    }
    navigator.clipboard.writeText(`${document.location.origin}/${getHexagramQuery()}`);
}

function setHexagramUrl() {
    window.history.replaceState(null, "", `${document.location.origin}/${getHexagramQuery()}`);
}

export function expandEntryLines() {
    let hexNum = document.getElementById("present-num");
    let ichingEntry = document.getElementById(`hexagram-${hexNum.innerText}`);
    let linesDiv = ichingEntry.querySelector(".line-changes");
    let linesDivChildren = linesDiv.querySelectorAll("details");
    let hexagramLines = castState.presentHexagram().lines;
    let changeFound = false;

    for (let i = 0; i < linesDivChildren.length; i++) {
        let child = linesDivChildren[i];
        let line = hexagramLines[i];

        if (line === YinYang.OLD_YANG || line == YinYang.OLD_YIN) {
            changeFound = true;
            child.setAttribute("open", "");
        } else {
            child.removeAttribute("open");
        }
    }

    if (changeFound) {
        // Change found, expand Line Changes <detail>
        linesDiv.setAttribute("open", "");
    } else {
        // No change found, expand all Line Changes inside.
        for (let i = 0; i < linesDivChildren.length; i++) {
            let child = linesDivChildren[i];
            child.setAttribute("open", "");
        }
    }
}

function pushCast(number) {
    if (castState.isComplete()) {
        return;
    }

    appData.castNumbers.push(number);
    castState.addCast(number, 250);
}

export function reset() {
    stopBeaconBitsChoice();
    stopBeaconCountdown();
    resetAppData();
    resetBeaconState();
    resetCastInfo();

    window.history.replaceState(null, "", document.location.origin);

    appData.appState = AppStates.RESETTING;
    const undrawTime = castState.resetHexagrams(150);

    setTimeout(function () {
        appData.appState = AppStates.READY;
    }, undrawTime);
}

export function cast() {
    if (castState.isComplete()) {
        return;
    }

    appData.appState = AppStates.CASTING_RNG;

    stopBeaconCountdown();
    stopBeaconBitsChoice();
    resetBeaconState();
    pushCast(castHexagramNumber());

    if (castState.isComplete()) {
        appData.appState = AppStates.CAST_FINISH;
        setCastInfo(KING_WEN_SEQ.indexOf(castState.presentHexagram().getBinaryCode()) + 1,
            KING_WEN_SEQ.indexOf(castState.futureHexagram().getBinaryCode()) + 1);
        setHexagramUrl();
    }
}

export function castFromBitString(bits) {
    if (bits.length !== 24 || castState.isComplete()) {
        return;
    }

    for (let i = 0; i < 24; i += 4) {
        const slice = bits.slice(i, i + 4);
        pushCast(parseInt(slice, 2));
    }

    setCastInfo(KING_WEN_SEQ.indexOf(castState.presentHexagram().getBinaryCode()) + 1,
        KING_WEN_SEQ.indexOf(castState.futureHexagram().getBinaryCode()) + 1);
    setHexagramUrl();

    stopBeaconBitsChoice();
    stopBeaconCountdown();

    appData.appState = AppStates.CAST_FINISH;
}

function createHeaderHexagrams() {
    const left = Hexagram.createFromNode(document.getElementById("hex-l"), 120, 120, 120, 120);
    const right = Hexagram.createFromNode(document.getElementById("hex-r"), 120, 120, 120, 120);

    const heavenLines = Array(6).fill(YinYang.YOUNG_YANG);
    const earthLines = heavenLines.map(x => YinYangInvert[x]);

    left.addLines(heavenLines, 250, true);
    right.addLines(earthLines, 250, true);

    setTimeout(function () {
        setInterval(function () {
            let rL = getRandomInt(6);
            let rR = getRandomInt(6);

            left.setLine(rL, YinYangInvert[left.lines[rL]], 250);
            right.setLine(rR, YinYangInvert[right.lines[rR]], 250);
        }, 1200);
    }, 1500);
}

function mountComponents() {
    // Clear dummy components on mount
    document.getElementById("cast-top-mount").innerHTML = "";
    document.getElementById("cast-bottom-mount").innerHTML = "";

    castTop(document.getElementById("cast-top-mount"));
    castBottom(document.getElementById("cast-bottom-mount"));
    castBeacon(document.getElementById("cast-beacon-mount"));
    castBits(document.getElementById("cast-bits-mount"));
    castLog(document.getElementById("cast-log-mount"));
    lookup(document.getElementById("lookup-mount"));
}

function processUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    let code = urlParams.get("code");
    let time = urlParams.get("time");
    let index = urlParams.get("index");

    if (time !== null && index !== null) {
        time = parseInt(time);
        index = parseInt(index);

        document.getElementById("section-beacon").setAttribute("open", "true");

        beaconState.beaconTime = time;
        beaconState.beaconIndex = index;
    }

    if (code !== null) {
        castFromBitString(code.toString());
    }

    if (time !== null && index !== null) {
        appData.appState = AppStates.FROM_BEACON_URL;
    }
}

let lookupHexagram = null;

function onLineClicked(hexagram, index) {
    const node = hexagram.setLine(index, YinYangInvert[hexagram.lines[index]], 120);
    setTimeout(() => {
        node.click(() => onLineClicked(hexagram, index));
        for (let value of Object.values(ICHING_COMPACT)) {
            if (value.binary === hexagram.getBinaryCode()) {
                lookupInfo.hexagram = value;
                break;
            }
        }
    }, 240);
}


function createLookupHexagram(svgNode) {
    lookupHexagram = new Hexagram(SVG(svgNode).size(240, 240).viewbox(0, 0, 240, 240), "111111", 0);
    for (let i = 0; i < lookupHexagram.linesSvg.length; i++) {
        const line = lookupHexagram.linesSvg[i];
        line.click(() => onLineClicked(lookupHexagram, i));
        console.log(line);

    } 
}

document.addEventListener("DOMContentLoaded", function () {
    runBuildPageWorker();
    mountComponents();

    castState.initializeHexagrams(
        document.getElementById("cast"),
        document.getElementById("cast-alt"),
        240, 240);

    createHeaderHexagrams();
    processUrlParams();

    createLookupHexagram(document.getElementById("lookup-hexagram-svg"));

    registerSecretKey();
}, false);

function registerSecretKey() {
    document.addEventListener("keypress", function (event) {
        if (event.key === "h") {
            console.log("Enabled secret URL share");
            setSecretShare(true);
        }
    });
}

function getShareURL () {
    let url = appData.castNumbers.map(x => x.toString(16)).join("");

    if (beaconState.beaconTime !== 0) {
        url += `${beaconState.beaconIndex.toString(16).padStart(2, "0")}${beaconState.beaconTime.toString(16)}`;
    }

    return "https://h.classicofchanges.com/" + url.toUpperCase();
}