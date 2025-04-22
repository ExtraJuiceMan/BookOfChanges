import { Timeline } from "@svgdotjs/svg.js";
import { HEXAGRAM_LINES, YinYang } from "./constants";

export default class Hexagram {
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

    drawYin(posY, old = false, animateTime = 0, timeline = new Timeline()) {
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

    drawYang(posY, old = false, animateTime = 0, timeline = new Timeline()) {
        let lineGroup = this.svg.group();
        let line = lineGroup.rect(0, this.getLineHeight()).move(0, posY);

        if (animateTime > 0) {
            line.timeline(timeline);

            line = line.animate(animateTime, 0, "after");
        }

        line = line.size(this.getLineWidth(), this.getLineHeight()).fill(this.getLineColor(old));

        return lineGroup;
    }

    undrawYin(svgElement, animateTime = 0, timeline = new Timeline()) {
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

    undrawYang(svgElement, animateTime = 0, timeline = new Timeline()) {
        let line = svgElement.first();

        line.timeline(timeline);

        line = line.animate(animateTime, 0, "after").x(this.getLineWidth());
        line = line.size(Number.EPSILON, this.getLineHeight());
    }

    undrawAll(animateTime = 0, timeline = new Timeline()) {
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

        let timeline = new Timeline();

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
            timeline = new Timeline();
        }

        for (const type of types) {
            this.addLine(type, animationTime, timeline);
        }
    }
}