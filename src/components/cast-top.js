import { html } from "@arrow-js/core";
import { displayNoneIf } from "../app/utility";
import { appData, castInfo, getSecretShare } from "../app/state";
import { AppStates } from "../app/constants";
import { copyHexagramUrl, expandEntryLines, reset } from "../main";

const finishedStates = [AppStates.FROM_BEACON_URL, AppStates.CAST_FINISH, AppStates.CAST_VERIFY, AppStates.CAST_FINISH_BEACON];
const unknownText = "「 ? 」";

function isFinished() {
    return finishedStates.includes(appData.appState);
}

function viewVisible() {
    return displayNoneIf(!isFinished());
}

export const castTop = html`
<p>◄ Present</p>
<p>
    <a id="present-view" style="${() => viewVisible()}" href="${() => "#hexagram-" + castInfo.presentHexagramNumber}" @click="${() => expandEntryLines()}">[View]</a> 
    Hexagram <span id="present-num">${() => castInfo.presentHexagramNumber ?? unknownText}</span>
</p>
<p>► Future</p>
<p>
    <a id="future-view" style="${() => viewVisible()}" href="${() => "#hexagram-" + castInfo.futureHexagramNumber}">[View]</a> 
    Hexagram <span id="future-num">${() => castInfo.futureHexagramNumber ?? unknownText}</span>
</p>
<button disabled="${() => !isFinished() && appData.appState !== AppStates.CASTING_RNG}" @click="${reset}" autocomplete="false" id="reset">Reset</button>
<button disabled="${() => !isFinished()}" @click="${copyHexagramUrl}"autocomplete="false" id="copy-url"
onMouseOver="${() => getSecretShare() ? "this.style['background-color'] = 'red';" : ""}"
onMouseOut="${() => getSecretShare() ? "this.style['background-color'] = null;" : ""}">Copy URL</button>`;