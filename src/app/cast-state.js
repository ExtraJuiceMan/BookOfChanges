import Hexagram from "./hexagram";
import { Timeline } from "@svgdotjs/svg.js";
import { YinYang } from "./constants";
import { YARROW_STALK_TABLE } from "./constants";

export class CastState {
    constructor() {
        this.hexagrams = null;
    }

    isInitialized() {
        return this.hexagrams !== null;
    }

    presentHexagram() {
        return this.hexagrams[0];
    }

    futureHexagram() {
        return this.hexagrams[1];
    }

    isComplete() {
        return this.isInitialized() ? this.presentHexagram().isComplete() : false;
    }

    initializeHexagrams(presentNode, futureNode, sizeX, sizeY) {
        if (this.isInitialized()) {
            return;
        }

        this.hexagrams = [];

        this.hexagrams.push(Hexagram.createFromNode(presentNode, sizeX, sizeY));
        this.hexagrams.push(Hexagram.createFromNode(futureNode, sizeX, sizeY));
    }

    resetHexagrams(animationTime = 150) {
        if (!this.isInitialized()) {
            return;
        }

        const undrawTime = this.presentHexagram().undrawAll(animationTime, new Timeline());
        this.futureHexagram().undrawAll(animationTime, new Timeline());

        setTimeout(() => {
            this.presentHexagram().svg.node.innerHTML = "";
            this.futureHexagram().svg.node.innerHTML = "";
            this.presentHexagram().resetLines();
            this.futureHexagram().resetLines();
        }, undrawTime);

        return undrawTime;
    }

    clearHexagrams() {
        this.hexagrams = null;
    }

    addCast(number, animationTime = 250) {
        if (!this.isInitialized()) {
            return;
        }

        let value = YARROW_STALK_TABLE[number];

        this.presentHexagram().addLine(value, animationTime);

        if (value === YinYang.OLD_YANG) {
            value = YinYang.YOUNG_YIN;
        } else if (value === YinYang.OLD_YIN) {
            value = YinYang.YOUNG_YANG;
        }

        this.futureHexagram().addLine(value, animationTime);
    }
}