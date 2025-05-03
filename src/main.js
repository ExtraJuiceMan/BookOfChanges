/* eslint-disable no-unused-vars */
import "./fonts/normal.woff2";
import "./fonts/italic.woff2";
import "./css/style.css";

import Hexagram from "./hexagram";
import { SVG, Timeline } from "@svgdotjs/svg.js";
import { castHexagramNumber, getUrlParams, getRandomInt, hex2bin, scrollToId } from "./utility";
import { YinYang, YinYangInvert, YARROW_STALK_TABLE, KING_WEN_SEQ } from "./constants";
import { injectBookEntry, injectIndexEntry } from "./build-page";
import { chainInfo as fetchChainInfo, fetchBeacon } from "./drand";

var castHexagram = undefined;
var altHexagram = undefined;
var binaryString = "";
var beaconInfo = null;
var beaconIndex = 0;

function getHexagramQuery() {
    let url = `?code=${binaryString}`;
    if (beaconInfo !== null) {
        url += `&time=${beaconInfo.time}&index=${beaconIndex}`;
    }
    return url;
}

function copyHexagramUrl() {
    navigator.clipboard.writeText(`${document.location.origin}/${getHexagramQuery()}`);
}

function ensureHexagramInitialized() {
    if (castHexagram === undefined) {
        let draw = SVG(document.getElementById("cast"))
            .size(240, 240)
            .viewbox(0, 0, 240, 240);

        castHexagram = new Hexagram(draw);

        let draw2 = SVG(document.getElementById("cast-alt"))
            .size(240, 240)
            .viewbox(0, 0, 240, 240);

        altHexagram = new Hexagram(draw2);

        document.getElementById("cast-log").innerText = "";
    }
}

function updateHexagramNumbers() {
    if (!castHexagram || !castHexagram.isComplete()) {
        document.getElementById("present-num").innerText = "「 ? 」";
        document.getElementById("future-num").innerHTML = "「 ? 」";

        document.getElementById("present-view").style = "display: none";
        document.getElementById("future-view").style = "display: none";
        return;
    }

    let castNum = KING_WEN_SEQ.indexOf(castHexagram.getBinaryCode()) + 1;
    let altNum = KING_WEN_SEQ.indexOf(altHexagram.getBinaryCode()) + 1;
    document.getElementById("present-num").innerText = castNum;
    document.getElementById("future-num").innerText = altNum;

    document.getElementById("present-view").style = "";
    document.getElementById("present-view").href = `#hexagram-${castNum}`;
    document.getElementById("future-view").style = "";
    document.getElementById("future-view").href = `#hexagram-${altNum}`;

    document.getElementById("build").disabled = true;
    document.getElementById("cast-btn").disabled = true;
    document.getElementById("copy-url").disabled = false;
    document.getElementById("get-beacon").disabled = true;
    document.getElementById("get-beacon").innerText = `Get Latest Beacon`;
    document.getElementById("choose-beacon-bits").disabled = true;
    stopBeaconCountdown();
}

function expandEntryLines() {
    let hexNum = document.getElementById("present-num");
    let ichingEntry = document.getElementById(`hexagram-${hexNum.innerText}`);
    let linesDiv = ichingEntry.querySelector(".line-changes");
    let linesDivChildren = linesDiv.querySelectorAll("details");
    let hexagramLines = castHexagram.lines;
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

function reset(loaded = true) {
    if (!castHexagram || !altHexagram) {
        updateHexagramNumbers();
        return;
    }

    stopBeaconCountdown();
    document.getElementById("cast-btn").disabled = true;
    document.getElementById("copy-url").disabled = true;
    document.getElementById("build").disabled = true;
    document.getElementById("reset").disabled = true;
    document.getElementById("beacon-bits-container").style = "display:none";
    document.getElementById("beacon-url-verification").style = "display:none;";
    document.getElementById("get-beacon").disabled = true;
    document.getElementById("get-beacon").innerText = `Get Latest Beacon`;

    let undrawTime = castHexagram.undrawAll(140, new Timeline());
    altHexagram.undrawAll(140, new Timeline());

    setTimeout(function () {
        castHexagram.svg.node.innerHTML = "";
        altHexagram.svg.node.innerHTML = "";
        castHexagram = undefined;
        altHexagram = undefined;
        binaryString = "";

        if (!loaded) {
            window.location.search = new URLSearchParams();
        }

        document.getElementById("cast-log").innerText = "";
        updateHexagramNumbers();

        document.getElementById("cast-btn").disabled = false;
        document.getElementById("copy-url").disabled = true;
        document.getElementById("build").disabled = false;
        document.getElementById("reset").disabled = true;
        document.getElementById("cast-log").innerText = "";
        document.getElementById("get-beacon").disabled = false;
        document.getElementById("get-beacon").innerText = `Get Latest Beacon`;
        document.getElementById("choose-beacon-bits").disabled = false;
        document.getElementById("beacon-bits-container").style = "display:none;";
        document.getElementById("beacon-bits-chosen").value = ""; 
    }, undrawTime);
}

function insertCastLog(num) {
    document.getElementById("cast-log").innerText += `Cast ${num}: ${YARROW_STALK_TABLE[num].description} \n`;
}

function cast() {
    ensureHexagramInitialized();

    if (castHexagram.isComplete()) {
        return;
    }

    document.getElementById("build").disabled = true;
    document.getElementById("reset").disabled = false;
    document.getElementById("get-beacon").disabled = true;
    document.getElementById("get-beacon").innerText = `Get Latest Beacon`;
    document.getElementById("beacon-bits-container").style = "display:none";
    beaconInfo = null;
    stopBeaconCountdown();
    stopBeaconBitsChoice();

    let castNumber = castHexagramNumber();
    addCastNumber(castNumber);

    updateHexagramNumbers();
}

function addCastNumber(number) {
    let value = YARROW_STALK_TABLE[number];

    insertCastLog(number);

    castHexagram.addLine(value, 250);

    if (value === YinYang.OLD_YANG) {
        value = YinYang.YOUNG_YIN;
    } else if (value === YinYang.OLD_YIN) {
        value = YinYang.YOUNG_YANG;
    }

    altHexagram.addLine(value, 250);

    binaryString += number.toString(2).padStart(4, "0");
}

function castFromBits(bits) {
    if (bits.length !== 24) {
        return;
    }

    ensureHexagramInitialized();

    if (castHexagram.getLineLength() > 0 || castHexagram.isComplete()) {
        return;
    }

    document.getElementById("cast-btn").disabled = true;
    document.getElementById("reset").disabled = false;

    for (let i = 0; i < 24; i += 4) {
        let slice = bits.slice(i, i + 4);
        let num = parseInt(slice, 2);
        addCastNumber(num);
    }

    updateHexagramNumbers();
}

function fillKingWenTable() {
    let table = document.getElementById("king-wen");

    for (let i = 0; i < 64; i += 8) {
        let row = document.createElement("tr");
        table.appendChild(row);
        for (let j = 0; j < 8; j++) {
            let cell = document.createElement("td");
            let cellSvg = SVG().addTo(cell).size(60, 60);
            let hex = new Hexagram(cellSvg, KING_WEN_SEQ[i + j]);
            row.appendChild(cell);
        }
    }
}

function initializeHeaderHexagrams() {
    let headHexL = new Hexagram(
        SVG(document.getElementById("hex-l"))
            .size(120, 120)
            .viewbox(0, 0, 120, 120)
    );

    headHexL.addLines([
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
    ], 250, true);

    let headHexR = new Hexagram(
        SVG(document.getElementById("hex-r"))
            .size(120, 120)
            .viewbox(0, 0, 120, 120)
    );

    headHexR.addLines([
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
    ], 250, true);

    setTimeout(function () {
        setInterval(function () {
            let rL = getRandomInt(6);
            let rR = getRandomInt(6);

            headHexL.setLine(rL, YinYangInvert[headHexL.lines[rL]], 250);
            headHexR.setLine(rR, YinYangInvert[headHexR.lines[rR]], 250);
        }, 1200);
    }, 1500);

}

let beaconBitsChoiceIntervalId = null;
let beaconCountdownIntervalId = null;

function setBeaconBits(bin) {
    let lines = [];
    for (let i = 0; i < 8; i++) {
        lines.push([...bin.substring(i * 32, i * 32 + 32)].map(x => `<span>${x}</span>`).join(""));
    }
    document.getElementById("beacon-random-bits").innerHTML = lines.join("<br/>");
}

function getBeacon() {
    const nowMs = Date.now();
    document.getElementById("get-beacon").disabled = true;
    document.getElementById("get-beacon").innerText = `Get Latest Beacon (Fetching)`;

    fetchChainInfo((chainInfo) => {
        fetchBeacon(nowMs, (beacon) => {
            beaconInfo = { time: nowMs, beacon };
            const untilNextAvailable = (chainInfo.genesis_time * 1000) + (beacon.round) * (chainInfo.period * 1000);
            const untilNextDelta = untilNextAvailable - Date.now();
            const randomBin = hex2bin(beacon.randomness);

            setBeaconBits(randomBin);

            const roundUrl = `https://drand.cloudflare.com/public/${beacon.round}`;
            const beaconGenerated = new Date((chainInfo.genesis_time * 1000) + (beacon.round - 1) * (chainInfo.period * 1000));

            document.getElementById("beacon-bits-container").style = "";
            document.getElementById("choose-beacon-bits").disabled = false;
            document.getElementById("beacon-info-details").innerHTML = `Round Generated: ${beaconGenerated}<br/>Round URL: <a href=${roundUrl}>${roundUrl}</a>`;

            startBeaconBitsChoice();

            if (untilNextDelta > 0) {
                document.getElementById("get-beacon").innerText = `Get Latest Beacon (${(untilNextDelta / 1000).toFixed()}s)`;
                beaconCountdownIntervalId = setInterval(() => {
                    let nextDelta = untilNextAvailable - Date.now();
                    if (nextDelta > 0) {
                        document.getElementById("get-beacon").innerText = `Get Latest Beacon (${(nextDelta / 1000).toFixed()}s)`;
                    } else {
                        document.getElementById("get-beacon").disabled = false;
                        document.getElementById("get-beacon").innerText = "Get Latest Beacon";
                        clearInterval(beaconCountdownIntervalId);
                    }
                }, 1000);
            } else {
                document.getElementById("get-beacon").disabled = false;
            }
        });
    });
}

function getBeaconBitsAt(bits, index) {
    let string = "";
    for (let i = 0; i < 24; i++) {
        string += bits[(index + i) % 256].innerText;
    }
    return string;
}

function chooseBeaconBits() {
    stopBeaconBitsChoice();
    const string = getBeaconBitsAt(document.getElementById("beacon-random-bits").querySelectorAll("span"),
        beaconIndex);
    document.getElementById("choose-beacon-bits").disabled = true;
    document.getElementById("beacon-bits-chosen").value = string; 
    castFromBits(string);
}

function stopBeaconCountdown() {
    if (beaconCountdownIntervalId !== null) {
        clearInterval(beaconCountdownIntervalId);
        beaconCountdownIntervalId = null;
    }
}

function stopBeaconBitsChoice() {
    if (beaconBitsChoiceIntervalId !== null) {
        clearInterval(beaconBitsChoiceIntervalId);
        beaconBitsChoiceIntervalId = null;
    }
}

function highlightBitsAt(bits, index, color) {
    for (let i = 0; i < 24; i++) {
        bits[(index + i) % 256].setAttribute("selected", "true");
        bits[(index + i) % 256].style = `background-color: ${color}`;
    }
}

function startBeaconBitsChoice() {
    stopBeaconBitsChoice();

    beaconIndex = getRandomInt(256);

    beaconBitsChoiceIntervalId = setInterval(() => {
        beaconIndex = (beaconIndex + 1) % 256;
        let bits = document.getElementById("beacon-random-bits").querySelectorAll("span");
        for (let i = 0; i < bits.length; i++) {
            bits[i].removeAttribute("selected");
            bits[i].style = "";
        }

        highlightBitsAt(bits, beaconIndex, "yellow");
    }, 4);
}

function verifyBeaconHexagram() {
    document.getElementById("verify-beacon").disabled = true;
    
    fetchChainInfo((chainInfo) => {
        fetchBeacon(beaconInfo.time, (beacon) => {
            const roundUrl = `https://drand.cloudflare.com/public/${beacon.round}`;
            const beaconGenerated = new Date((chainInfo.genesis_time * 1000) + (beacon.round - 1) * (chainInfo.period * 1000));
            document.getElementById("beacon-info-details").innerHTML = `Round Generated: ${beaconGenerated}<br/>Round URL: <a href=${roundUrl}>${roundUrl}</a>`;
            document.getElementById("beacon-bits-container").style = "";
            setBeaconBits(hex2bin(beacon.randomness));

            const bits = document.getElementById("beacon-random-bits").querySelectorAll("span");
            const bitsAtIndex = getBeaconBitsAt(bits, beaconIndex);
            const color = bitsAtIndex === binaryString ? "lime" : "red";
            highlightBitsAt(bits, beaconIndex, color);
        });
    });
    
}

function bindEventHandlers() {
    document.getElementById("present-view").addEventListener("click", () => expandEntryLines());
    document.getElementById("reset").addEventListener("click", () => reset());
    document.getElementById("copy-url").addEventListener("click", () => copyHexagramUrl());
    document.getElementById("cast-btn").addEventListener("click", () => cast());
    document.getElementById("get-beacon").addEventListener("click", () => getBeacon());
    document.getElementById("choose-beacon-bits").addEventListener("click", () => chooseBeaconBits());
    document.getElementById("build").addEventListener("click", () => {
        beaconInfo = null;
        castFromBits(document.getElementById('hex-bits').value);
    });
    document.getElementById("verify-beacon").addEventListener("click", () => verifyBeaconHexagram());

}

function runBuildPageWorker() {
    const worker = new Worker(new URL("./build-page-worker.js", import.meta.url), {
        type: "module"
    });

    let scrollId = window.location.hash.substring(1);

    worker.addEventListener("message", e => {
        //injectBookEntries(e.data.entries);
        //injectIndexEntries(e.data.index);

        if (e.data.type === "index") {
            injectIndexEntry(e.data.entry);
        }

        if (e.data.type === "book") {
            injectBookEntry(e.data.entry);

            if (scrollId !== "" && scrollToId(scrollId)) {
                scrollId = "";
            }
        }
    });

    worker.postMessage(null);
}


document.addEventListener('DOMContentLoaded', function () {
    reset(false);
    initializeHeaderHexagrams();
    bindEventHandlers();
    runBuildPageWorker();

    const params = getUrlParams();
    if (params.code !== null) {
        castFromBits(params.code);

        if (params.time !== null && params.index !== null) {
            document.getElementById("section-beacon").setAttribute("open", "true");
            document.getElementById("beacon-url-verification").style = "";
            beaconInfo = {time: params.time};
            beaconIndex = params.index;
            document.getElementById("beacon-bits-chosen").value = params.code;
            document.getElementById("beacon-url-details").innerHTML = 
                `URL: <a href="${document.location.origin}/${getHexagramQuery()}">${getHexagramQuery()}</a><br/>
                Unverified Bits: ${params.code}<br/>
                Bits Selected: bit ${params.index} - bit ${(params.index + 24) % 256}<br/>
                Beacon Fetched: ${new Date(params.time)}`;
        }
    }
}, false);
