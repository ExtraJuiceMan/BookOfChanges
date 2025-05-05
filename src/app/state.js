import { reactive } from "@arrow-js/core";
import { AppStates, ICHING_COMPACT } from "./constants";
import { CastState } from "./cast-state";

let secretShare = reactive({value: false});

export function setSecretShare(val) {
    secretShare.value = val;
}

export function getSecretShare() {
    return secretShare.value;
}

export const castState = new CastState();

export const castInfo = new reactive({
    presentHexagramNumber: null,
    futureHexagramNumber: null,
});

export function setCastInfo(presentNum, futureNum) {
    castInfo.presentHexagramNumber = presentNum;
    castInfo.futureHexagramNumber = futureNum;
}

export function resetCastInfo() {
    castInfo.presentHexagramNumber = null;
    castInfo.futureHexagramNumber = null;
}

export const appData = reactive({
    appState: AppStates.READY,
    castNumbers: [],
});

export function resetAppData() {
    appData.appState = AppStates.READY;
    appData.castNumbers = [];
}

export const beaconState = reactive({
    chainInfo: null,
    currentBeacon: null,
    beaconTime: 0,
    beaconFetchTime: 0,
    beaconIndex: 0,
});

export function resetBeaconState() {
    beaconState.chainInfo = null;
    beaconState.currentBeacon = null;
    beaconState.beaconTime = 0;
    beaconState.beaconFetchTime = 0;
    beaconState.beaconIndex = 0;
}