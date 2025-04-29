import "./fonts/normal.woff2";
import "./fonts/italic.woff2";
import "./css/style.css";

import Hexagram from "./hexagram";
import { SVG, Timeline } from "@svgdotjs/svg.js";
import { castHexagramNumber, getRandomInt } from "./utility";
import { YinYang, YinYangInvert, YARROW_STALK_TABLE, KING_WEN_SEQ } from "./constants";
import { injectBookEntry, injectIndexEntry } from "./build-page";

var castHexagram = undefined;
var altHexagram = undefined;
var binaryString = "";

function copyHexagramUrl() {
    navigator.clipboard.writeText(document.location.origin + "/?code=" + binaryString);
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

    document.getElementById("cast-btn").disabled = true;
    document.getElementById("copy-url").disabled = true;
    document.getElementById("build").disabled = true;
    document.getElementById("reset").disabled = true;

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
    console.log(binaryString);
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

function bindEventHandlers() {
    document.getElementById("present-view").addEventListener("click", () => expandEntryLines());
    document.getElementById("reset").addEventListener("click", () => reset());
    document.getElementById("copy-url").addEventListener("click", () => copyHexagramUrl());
    document.getElementById("cast-btn").addEventListener("click", () => cast());
    document.getElementById("build").addEventListener("click", () => castFromBits(document.getElementById('hex-bits').value));
}

function runBuildPageWorker() {
    const worker = new Worker(new URL("./build-page-worker.js", import.meta.url), {
        type: "module"
    });

    let scrollId = window.location.hash;

    worker.addEventListener("message", e => {
        //injectBookEntries(e.data.entries);
        //injectIndexEntries(e.data.index);

        if (e.data.type === "index") {
            injectIndexEntry(e.data.entry);
        }

        if (e.data.type === "book") {
            injectBookEntry(e.data.entry);

            if (scrollId !== "") {
                let el = document.getElementById(scrollId.substring(1));

                if (el !== null) {
                    scrollId = "";
                    
                    el.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        }
    });

    worker.postMessage(null);
}

function getHexagramBitsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    return code ?? code.toString();
}


document.addEventListener('DOMContentLoaded', function () {
    reset(false);
    initializeHeaderHexagrams();
    bindEventHandlers();
    runBuildPageWorker();
    
    const code = getHexagramBitsFromUrl();
    if (code !== null) {
        castFromBits(code);
    }
}, false);
