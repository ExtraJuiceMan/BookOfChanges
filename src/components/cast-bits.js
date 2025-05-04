import { html } from "@arrow-js/core";
import { castedNumbersToBitString, disabledIf } from "../app/utility";
import { appData } from "../app/state";
import { AppStates } from "../app/constants";
import { castFromBitString } from "../main";

export const castBits = html`
<input style="width: 50%" id="hex-bits" type="text" maxlength="24" minlength="24" pattern="[01]+"
    placeholder="100010001001100110001000" value="${() => castedNumbersToBitString(appData.castNums)}" disabled="${() => appData.appState !== AppStates.READY}">
<button id="build" autocomplete="false" disabled="${() => appData.appState !== AppStates.READY}" @click="${() => 
    castFromBitString(document.getElementById("hex-bits").value)}">Build</button>`