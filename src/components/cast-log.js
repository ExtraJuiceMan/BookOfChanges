import { html } from "@arrow-js/core";
import { appData } from "../app/state";
import { YARROW_STALK_TABLE } from "../app/constants";

export const castLog = html`<ol>${() => appData.castNumbers.map(x => html`<li>Cast ${() => x}: ${() => YARROW_STALK_TABLE[x].description}</li>`)}</ol>`;