import { html } from "@arrow-js/core";
import { disabledIf } from "../app/utility";
import { AppStates } from "../app/constants";
import { appData } from "../app/state";
import { cast } from "../main";

export const castBottom = html`<button disabled="${() => ![AppStates.CASTING_RNG, AppStates.READY].includes(appData.appState)}" 
id="cast-btn" autocomplete="false" @click="${cast}">Cast</button>`;