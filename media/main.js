const LINE_DRAW_TIME = 600;
const HEXAGRAM_LINES = 6;

const YinYang = Object.freeze({
    OLD_YIN: Symbol("old yin (6)"),
    YOUNG_YIN: Symbol("young yin (8)"),
    OLD_YANG: Symbol("old yang (9)"),
    YOUNG_YANG: Symbol("young yang (7)"),
});

const YinYangInvert = Object.freeze({
    [YinYang.OLD_YIN]: YinYang.OLD_YANG,
    [YinYang.OLD_YANG]: YinYang.OLD_YIN,
    [YinYang.YOUNG_YIN]: YinYang.YOUNG_YANG,
    [YinYang.YOUNG_YANG]: YinYang.YOUNG_YIN,
});

const KING_WEN_SEQ = Object.freeze([
    "111111", "000000", "100010", "010001",
    "111010", "010111", "010000", "000010",
    "111011", "110111", "111000", "000111",
    "101111", "111101", "001000", "000100",
    "100110", "011001", "110000", "000011",
    "100101", "101001", "000001", "100000",
    "100111", "111001", "100001", "011110",
    "010010", "101101", "001110", "011100",
    "001111", "111100", "000101", "101000",
    "101011", "110101", "001010", "010100",
    "110001", "100011", "111110", "011111",
    "000110", "011000", "010110", "011010",
    "101110", "011101", "100100", "001001",
    "001011", "110100", "101100", "001101",
    "011011", "110110", "010011", "110010",
    "110011", "001100", "101010", "010101"
]);

const YARROW_STALK_TABLE = Object.freeze({
    0b0000: YinYang.OLD_YIN,
    0b0001: YinYang.OLD_YANG,
    0b0010: YinYang.OLD_YANG,
    0b0011: YinYang.OLD_YANG,
    0b0100: YinYang.YOUNG_YANG,
    0b0101: YinYang.YOUNG_YANG,
    0b0110: YinYang.YOUNG_YANG,
    0b0111: YinYang.YOUNG_YANG,
    0b1000: YinYang.YOUNG_YANG,
    0b1001: YinYang.YOUNG_YIN,
    0b1010: YinYang.YOUNG_YIN,
    0b1011: YinYang.YOUNG_YIN,
    0b1100: YinYang.YOUNG_YIN,
    0b1101: YinYang.YOUNG_YIN,
    0b1110: YinYang.YOUNG_YIN,
    0b1111: YinYang.YOUNG_YIN,
});

var castHexagram = undefined;
var altHexagram = undefined;

function ensureHexagramInitialized() {
    if (castHexagram === undefined) {
        let draw = SVG().addTo("#cast").size(240, 240).viewbox(0, 0, 240, 240).css("width", "16rem").css("height", "16rem");
        castHexagram = new Hexagram(draw);

        let draw2 = SVG().addTo("#cast-alt").size(240, 240).viewbox(0, 0, 240, 240).css("width", "16rem").css("height", "16rem");
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
    document.getElementById("present-view").href = "#hexagram-" + castNum;
    document.getElementById("future-view").style = "";
    document.getElementById("future-view").href = "#hexagram-" + altNum;



    document.getElementById("build").disabled = true;
    document.getElementById("cast-btn").disabled = true;
}

function expandEntryLines() {
    let hexNum = document.getElementById("present-num");
    let ichingEntry = document.getElementById("hexagram-" + hexNum.innerText);
    let linesDiv = ichingEntry.querySelector(".line-changes");
    let hexagramLines = castHexagram.lines;

    linesDiv.setAttribute("open", "");

    let linesDivChildren = linesDiv.querySelectorAll("details");

    for (let i = 0; i < linesDivChildren.length; i++)
    {
        let child = linesDivChildren[i];
        let line = hexagramLines[i];

        if (line === YinYang.OLD_YANG || line == YinYang.OLD_YIN) {
            child.setAttribute("open", "");
        } else {
            child.removeAttribute("open");
        }
    }
}

function reset() {
    if (!castHexagram || !altHexagram) {
        updateHexagramNumbers();
        return;
    }

    document.getElementById("cast-btn").disabled = true;
    document.getElementById("build").disabled = true;
    document.getElementById("reset").disabled = true;

    let undrawTime = castHexagram.undrawAll(140, new SVG.Timeline());
    altHexagram.undrawAll(140, new SVG.Timeline());

    setTimeout(function () {
        castHexagram.svg.remove();
        altHexagram.svg.remove();
        castHexagram = undefined;
        altHexagram = undefined;
        document.getElementById("cast-log").innerText = "";
        updateHexagramNumbers();

        document.getElementById("cast-btn").disabled = false;
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

    let nums = new Uint8Array(1);
    window.crypto.getRandomValues(nums);
    let num = nums[0] & 0b1111;
    let value = YARROW_STALK_TABLE[num];

    insertCastLog(num);

    castHexagram.addLine(value, 250);

    if (value === YinYang.OLD_YANG) {
        value = YinYang.YOUNG_YIN;
    } else if (value === YinYang.OLD_YIN) {
        value = YinYang.YOUNG_YANG;
    }

    altHexagram.addLine(value, 250);

    updateHexagramNumbers();
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
        let value = YARROW_STALK_TABLE[num];

        insertCastLog(num);

        castHexagram.addLine(value, 250);

        if (value === YinYang.OLD_YANG) {
            value = YinYang.YOUNG_YIN;
        } else if (value === YinYang.OLD_YIN) {
            value = YinYang.YOUNG_YANG;
        }

        altHexagram.addLine(value, 250);
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

function buildIChingEntries() {

}

class Hexagram {
    constructor(svg, pattern = undefined, animationTime = 0) {
        this.svg = svg;
        this.lines = [];
        this.linesSvg = [];

        if (typeof pattern === "string") {
            for (let i = 0; i < pattern.length; i++) {
                let c = pattern.charAt(i);
                if (c === "1") {
                    this.addLine(YinYang.YOUNG_YANG, animationTime);
                } else if (c === "0") {
                    this.addLine(YinYang.YOUNG_YIN, animationTime);
                }
            }
        }
    }

    getBinaryCode() {
        let code = "";

        for (let line of this.lines) {
            if (line === YinYang.OLD_YANG || line === YinYang.YOUNG_YANG) {
                code += "1";
            } else if (line === YinYang.OLD_YIN || line === YinYang.YOUNG_YIN) {
                code += "0";
            }
        }

        return code;
    }

    getLineLength() {
        return this.lines.length;
    }

    isComplete() {
        return this.getLineLength() >= 6;
    }

    getLineWidth() {
        return this.svg.width();
    }

    getLineHeight() {
        return this.svg.height() / (HEXAGRAM_LINES * 2 - 1);
    }

    getLineColor(old = false) {
        if (old) {
            return "#646464";
        } else {
            return "#000000";
        }
    }

    getDrawYPosition(lineIndex) {
        let lineHeight = this.getLineHeight();
        return this.svg.height() - lineHeight * (lineIndex + 1) - (lineHeight * lineIndex);
    }

    drawYin(posY, old = false, animateTime = 0, timeline = new SVG.Timeline()) {
        let linePartWidth = this.getLineWidth() / 8;

        var lineGroup = this.svg.group();
        let line1 = lineGroup.rect(0, this.getLineHeight()).move(0, posY);
        let line2 = lineGroup.rect(0, this.getLineHeight()).move(linePartWidth * 5, posY);

        if (animateTime > 0) {
            line1.timeline(timeline);
            line2.timeline(timeline);

            line1 = line1.animate(animateTime / 2, 0, "after");
            line2 = line2.animate(animateTime / 2, 0, "after");
        }

        line1.size(linePartWidth * 3, this.getLineHeight()).fill(this.getLineColor(old));
        line2.size(linePartWidth * 3, this.getLineHeight()).fill(this.getLineColor(old));

        return lineGroup;
    }

    drawYang(posY, old = false, animateTime = 0, timeline = new SVG.Timeline()) {
        let lineGroup = this.svg.group();
        let line = lineGroup.rect(0, this.getLineHeight()).move(0, posY);

        if (animateTime > 0) {
            line.timeline(timeline);

            line = line.animate(animateTime, 0, "after");
        }

        line = line.size(this.getLineWidth(), this.getLineHeight()).fill(this.getLineColor(old));

        return lineGroup;
    }

    undrawYin(svgElement, animateTime = 0, timeline = new SVG.Timeline()) {
        let linePartWidth = this.getLineWidth() / 8;

        let line1 = svgElement.first();
        let line2 = svgElement.last();

        line1.timeline(timeline);
        line2.timeline(timeline);

        line1 = line1.animate(animateTime / 2, 0, "after").x(linePartWidth * 3);
        line2 = line2.animate(animateTime / 2, 0, "after").x(this.getLineWidth());

        line1 = line1.size(Number.EPSILON, this.getLineHeight());
        line2 = line2.size(Number.EPSILON, this.getLineHeight());
    }

    undrawYang(svgElement, animateTime = 0, timeline = new SVG.Timeline()) {
        let line = svgElement.first();

        line.timeline(timeline);

        line = line.animate(animateTime, 0, "after").x(this.getLineWidth());
        line = line.size(Number.EPSILON, this.getLineHeight());
    }

    undrawAll(animateTime = 0, timeline = new SVG.Timeline()) {
        for (let i = 0; i < this.getLineLength(); i++) {
            let type = this.lines[i];

            if (type === YinYang.OLD_YANG || type === YinYang.YOUNG_YANG) {
                this.undrawYang(this.linesSvg[i], animateTime, timeline);
            } else if (type === YinYang.OLD_YIN || type === YinYang.YOUNG_YIN) {
                this.undrawYin(this.linesSvg[i], animateTime, timeline);
            }
        }

        return this.getLineLength() * animateTime;
    }

    drawLine(lineIndex, type, animationTime = 0, timeline = undefined) {
        let drawPosY = this.getDrawYPosition(lineIndex);

        let svgElement;

        if (type === YinYang.YOUNG_YIN) {
            svgElement = this.drawYin(drawPosY, false, animationTime, timeline);
        } else if (type === YinYang.YOUNG_YANG) {
            svgElement = this.drawYang(drawPosY, false, animationTime, timeline);
        } else if (type === YinYang.OLD_YIN) {
            svgElement = this.drawYin(drawPosY, true, animationTime, timeline);
        } else if (type === YinYang.OLD_YANG) {
            svgElement = this.drawYang(drawPosY, true, animationTime, timeline);
        }

        return svgElement;
    }

    setLine(lineIndex, type, animationTime = 0) {
        let oldSvg = this.linesSvg[lineIndex];
        let oldLine = this.lines[lineIndex];

        let timeline = new SVG.Timeline();

        if (oldLine === YinYang.OLD_YANG || oldLine === YinYang.YOUNG_YANG) {
            this.undrawYang(oldSvg, animationTime, timeline);
        } else if (oldLine === YinYang.OLD_YIN || oldLine === YinYang.YOUNG_YIN) {
            this.undrawYin(oldSvg, animationTime, timeline);
        }

        setTimeout(function () {
            oldSvg.remove();
        }, animationTime);

        this.lines[lineIndex] = type;
        this.linesSvg[lineIndex] = this.drawLine(lineIndex, type, animationTime, timeline);
    }

    addLine(type, animationTime = 0, timeline = undefined) {
        let svgElement = this.drawLine(this.getLineLength(), type, animationTime, timeline);
        this.lines.push(type);
        this.linesSvg.push(svgElement);
    }

    addLines(types, animationTime = 0, cascadingAnimation = false) {
        let timeline = undefined;

        if (cascadingAnimation) {
            timeline = new SVG.Timeline();
        }

        for (const type of types) {
            this.addLine(type, animationTime, timeline);
        }
    }
}

function initializeHeaderHexagrams() {
    let headHexL = new Hexagram(SVG().addTo("#hex-l").size(120, 120).viewbox(0, 0, 120, 120).css("width", "8rem").css("height", "8rem"));
    headHexL.addLines([
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
        YinYang.YOUNG_YANG,
    ], 250, true);

    let headHexR = new Hexagram(SVG().addTo("#hex-r").size(120, 120).viewbox(0, 0, 120, 120).css("width", "8rem").css("height", "8rem"));
    headHexR.addLines([
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
        YinYang.YOUNG_YIN,
    ], 250, true);

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    setTimeout(function () {
        setInterval(function () {
            let rL = getRandomInt(6);
            let rR = getRandomInt(6);

            headHexL.setLine(rL, YinYangInvert[headHexL.lines[rL]], 250);
            headHexR.setLine(rR, YinYangInvert[headHexR.lines[rR]], 250);
        }, 1200);
    }, 1500);

}

function templateIChingIndex() {
    let index = document.getElementById("iching-index");

    let temp = `<div class="iching-index-entry">
        <div class="iching-index-entry-hexagram">
            <svg id="iching-index-hexagram-{{w.hex}}"xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="120" height="120" viewBox="0 0 120 120" style="width: 2rem; height: 2rem;">
            </svg>
        </div>
        <div class="iching-index-entry-text">
            <a href="#hexagram-{{w.hex}}">{{w.hex}}. {{w.english}}</a>
        </div>
    </div>`;

    let template = Handlebars.compile(temp, { noEscape: true });

    for (let k in ICHING) {
        let entry = ICHING[k];

        let section = template({ w: entry });
        index.innerHTML += section;

        new Hexagram(SVG("#iching-index-hexagram-" + entry.hex).size(120, 120).viewbox(0, 0, 120, 120).css("width", "2rem").css("height", "2rem"), entry.binary.toString());
    }
}

function templateIChing() {
    let temp = `<section class="iching-hexagram-entry" id="hexagram-{{w.hex}}">
            <div class="iching-heading">
                <div class="iching-heading-char">
                    <p class="{{m.text_class}}">{{w.trad_chinese}}</p>
                </div>
                <div class="flex-col iching-heading-details">
                    <div class="iching-hexagram-name">
                        <span style="font-size: 2rem;">Hexagram {{w.hex}}</span> <br />
                        <span style="font-size: 2rem;">{{w.pinyin}} - <i>{{w.english}}</i></span>
                    </div>
                    <div class="flex-row" style="column-gap: 2rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="120" height="120" viewBox="0 0 120 120" class="iching-hexagram-svg" id="hexagram-svg-{{w.binary}}">
                        </svg>
                        <div class="flex-col">
                            <div class="iching-trigram-info" style="border-bottom: 1px solid;">
                                <span>↑ {{w.wilhelm_above.chinese}} - {{w.wilhelm_above.alchemical}}</span>
                            </div>
                            <div class="iching-trigram-info" style="border-top: 1px solid;">
                                <span>↓ {{w.wilhelm_below.chinese}} - {{w.wilhelm_below.alchemical}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Hexagram
                </summary>
                {{w.wilhelm_symbolic}}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Judgment
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_judgment.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_judgment.comments}}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Image
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_image.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_image.comments}}
            </details>
            <details class="iching-entry-details line-changes">
                <summary class="iching-entry-summary">
                    Line Changes
                </summary>
                <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Line 1
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.1.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.1.comments}}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Line 2
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.2.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.2.comments}}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Line 3
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.3.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.3.comments}}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 4
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.4.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.4.comments}}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 5
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.5.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.5.comments}}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 6
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">{{w.wilhelm_lines.6.text}}</b>
                </div>
                <br/>
                {{w.wilhelm_lines.6.comments}}
            </details>
            </details>
            <a target="_blank" href="https://jamesdekorne.com/GBCh/hex{{w.hex}}.htm">The Gnostic Book of Changes: Hexagram {{w.hex}}</a>
            </br>
            <a href="#">Jump to Top</a>
        </section>`;

    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    let template = Handlebars.compile(temp, { noEscape: true });

    for (let k in ICHING) {
        let entry = ICHING[k];

        entry.pinyin = toTitleCase(entry.pinyin);
        entry.wilhelm_above.chinese = toTitleCase(entry.wilhelm_above.chinese).replace(",", "");
        entry.wilhelm_below.chinese = toTitleCase(entry.wilhelm_below.chinese).replace(",", "");
        entry.wilhelm_above.alchemical = toTitleCase(entry.wilhelm_above.alchemical);
        entry.wilhelm_below.alchemical = toTitleCase(entry.wilhelm_below.alchemical);

        for (const [k, v] of Object.entries(entry.wilhelm_lines)) {
            v.text = v.text.replace(/\n/g, "<br />");
            v.comments = v.comments.replace(/\n/g, "<br />");
            entry.wilhelm_lines[k] = v;
        }

        entry.wilhelm_judgment.text = entry.wilhelm_judgment.text.replace(/\n\s*\n/g, "\n").replace(/\n/g, "<br />");
        entry.wilhelm_judgment.comments = entry.wilhelm_judgment.comments.replace(/\n/g, "<br />");

        entry.wilhelm_image.text = entry.wilhelm_image.text.replace(/\n\s*\n/g, "\n").replace(/\n/g, "<br />");
        entry.wilhelm_image.comments = entry.wilhelm_image.comments.replace(/\n/g, "<br />");

        entry.wilhelm_symbolic = entry.wilhelm_symbolic.replace(/\n/g, "<br />");

        let text_class = "iching-heading-char-text";
        if (entry.trad_chinese.length > 1) {
            text_class += "-2";
            entry.trad_chinese = entry.trad_chinese[0] + "<br/>" + entry.trad_chinese[1];
        }

        entry.binary = entry.binary.toString();

        let section = template({ w: entry, m: { text_class: text_class } });

        document.getElementById("iching-entries").innerHTML += section;

        let draw = SVG("#hexagram-svg-" + entry.binary).size(120, 120).viewbox(0, 0, 120, 120);
        new Hexagram(draw, entry.binary);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    reset();

    initializeHeaderHexagrams();
    // fillKingWenTable();
    templateIChingIndex();
    templateIChing();
}, false);
