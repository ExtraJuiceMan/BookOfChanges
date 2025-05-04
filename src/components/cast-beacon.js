import { html } from "@arrow-js/core";
import { castedNumbersToBitString, displayNoneIf, hex2bin } from "../app/utility";
import { appData, beaconState } from "../app/state";
import { AppStates } from "../app/constants";
import { castFromBitString, getHexagramQuery } from "../main";
import { chainInfo, beaconInfo } from "../app/drand";
import { getRandomInt } from "../app/utility";

let beaconBitsChoiceIntervalId = null;
let beaconCountdownIntervalId = null;

export function stopBeaconCountdown() {
    if (beaconCountdownIntervalId !== null) {
        clearInterval(beaconCountdownIntervalId);
        beaconCountdownIntervalId = null;
        beaconState.beaconFetchTime = 0;
    }
}

export function stopBeaconBitsChoice() {
    if (beaconBitsChoiceIntervalId !== null) {
        clearInterval(beaconBitsChoiceIntervalId);
        beaconBitsChoiceIntervalId = null;
    }
}

function getBeacon() {
    const nowMs = Date.now();
    beaconState.beaconFetchTime = -1;

    chainInfo((chainInfo) => {
        beaconInfo(nowMs, (beacon) => {
            beaconState.chainInfo = chainInfo;
            beaconState.beaconTime = nowMs;
            beaconState.currentBeacon = beacon;

            const untilNextAvailable = (chainInfo.genesis_time * 1000) + (beacon.round) * (chainInfo.period * 1000);
            const untilNextDelta = untilNextAvailable - Date.now();
            const randomBin = hex2bin(beacon.randomness);

            setBeaconBits(randomBin);

            startBeaconBitsChoice();

            if (untilNextDelta > 0) {
                beaconState.beaconFetchTime = untilNextDelta;
                beaconCountdownIntervalId = setInterval(() => {
                    let nextDelta = untilNextAvailable - Date.now();
                    if (nextDelta > 0) {
                        beaconState.beaconFetchTime = nextDelta;
                    } else {
                        beaconState.beaconFetchTime = 0;
                        clearInterval(beaconCountdownIntervalId);
                    }
                }, 1000);
            } else {
                beaconState.beaconFetchTime = 0;
            }
        });
    });
}

function startBeaconBitsChoice() {
    stopBeaconBitsChoice();

    beaconState.beaconIndex = getRandomInt(256);

    beaconBitsChoiceIntervalId = setInterval(() => {
        beaconState.beaconIndex = (beaconState.beaconIndex + 1) % 256;
        let bits = document.getElementById("beacon-random-bits").querySelectorAll("span");
        for (let i = 0; i < bits.length; i++) {
            bits[i].removeAttribute("selected");
            bits[i].style = "";
        }

        highlightBeaconBitsAt(bits, beaconState.beaconIndex, "yellow");
    }, 4);
}

function chooseBeaconBits() {
    stopBeaconBitsChoice();
    const string = getBeaconBitsAt(document.getElementById("beacon-random-bits").querySelectorAll("span"),
        beaconState.beaconIndex);
    castFromBitString(string);
    appData.appState = AppStates.CAST_FINISH_BEACON;
}

function verifyBeaconHexagram() {
    document.getElementById("verify-beacon").disabled = true;

    chainInfo((chainInfo) => {
        beaconInfo(beaconState.beaconTime, (beacon) => {
            beaconState.chainInfo = chainInfo;
            beaconState.currentBeacon = beacon;

            setBeaconBits(hex2bin(beacon.randomness));

            const bits = document.getElementById("beacon-random-bits").querySelectorAll("span");
            const bitsAtIndex = getBeaconBitsAt(bits, beaconState.beaconIndex);
            const color = bitsAtIndex === castedNumbersToBitString(appData.castNums) ? "lime" : "red";
            highlightBeaconBitsAt(bits, beaconState.beaconIndex, color);
        });
    });
}

function setBeaconBits(bin) {
    let lines = [];
    for (let i = 0; i < 8; i++) {
        lines.push([...bin.substring(i * 32, i * 32 + 32)].map(x => `<span>${x}</span>`).join(""));
    }
    document.getElementById("beacon-random-bits").innerHTML = lines.join("<br/>");
}

function getBeaconBitsAt(bits, index) {
    let string = "";
    for (let i = 0; i < 24; i++) {
        string += bits[(index + i) % 256].innerText;
    }
    return string;
}

function highlightBeaconBitsAt(bits, index, color) {
    for (let i = 0; i < 24; i++) {
        bits[(index + i) % 256].setAttribute("selected", "true");
        bits[(index + i) % 256].style = `background-color: ${color}`;
    }
}

function getBeaconFetchText() {
    if (beaconState.beaconFetchTime > 0) {
        return `(${(beaconState.beaconFetchTime / 1000).toFixed()}s)`;
    } else if (beaconState.beaconFetchTime < 0) {
        return "(Fetching)";
    } else {
        return "";
    }
}

function getBeaconInfoText() {
    if (beaconState.currentBeacon === null || beaconState.chainInfo === null) {
        return "";
    }
    const roundUrl = `https://drand.cloudflare.com/public/${beaconState.currentBeacon.round}`;
    const beaconGenerated = new Date((beaconState.chainInfo.genesis_time * 1000) + (beaconState.currentBeacon.round - 1) * (beaconState.chainInfo.period * 1000));
    return html`<p style="margin-top: 0rem; margin-bottom: 0rem;" id="beacon-info-details">
        Round Generated: ${() => beaconGenerated}<br/>Round URL: <a href="${() => roundUrl}">${() => roundUrl}</a>
    </p>`;
}

function getVerifyInfoText() {
    return html`<p style="margin-top: 0rem; margin-bottom: 0rem;" id="beacon-url-details">
    URL: <a href="${() => document.location.origin + "/" + getHexagramQuery()}">${() => getHexagramQuery()}</a><br/>
                Unverified Bits: ${() => castedNumbersToBitString(appData.castNums)}<br/>
                Bits Selected: bit ${() => beaconState.beaconIndex} - bit ${() => (beaconState.beaconIndex + 24) % 256}<br/>
                Beacon Fetched: ${new Date(beaconState.beaconTime)}
    </p>`;
}

export const castBeacon = html`
<button id="get-beacon" autocomplete="false" 
    disabled="${() => appData.appState != AppStates.READY || beaconState.beaconFetchTime !== 0}"
    @click="${getBeacon}">Get Latest Beacon ${() => getBeaconFetchText()}</button>

<div id="beacon-url-verification" style="${() => displayNoneIf(![AppStates.FROM_BEACON_URL].includes(appData.appState))}">
    <hr>
    <b>Beacon Hexagram URL Verification</b>
    ${() => getVerifyInfoText()}
    <button id="verify-beacon" autocomplete="false" style="margin-top: 0.5rem;"
     disabled="${() => appData.appState !== AppStates.FROM_BEACON_URL}" @click="${verifyBeaconHexagram}">Verify Hexagram</button>
</div>

<div id="beacon-bits-container"
style="${() => displayNoneIf(![AppStates.READY, AppStates.FROM_BEACON_URL, AppStates.CAST_FINISH_BEACON].includes(appData.appState) || beaconState.currentBeacon === null)}">
    <hr>
    <b>Randomness Beacon Information</b>
    <br />
    <code id="beacon-random-bits" style="color: blue;"></code>
    <br />

    <input style="width: 50%; margin-top: 0.5rem;" disabled="true" id="beacon-bits-chosen" type="text"
        maxlength="24" minlength="24" pattern="[01]+" placeholder="" value="${() => castedNumbersToBitString(appData.castNums)}">

    <button id="choose-beacon-bits" disabled="${() => appData.appState != AppStates.READY}" @click="${() => chooseBeaconBits()}">Build</button>

    ${() => getBeaconInfoText()}
</div>`;