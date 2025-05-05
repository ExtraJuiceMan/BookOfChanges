import { html, reactive } from "@arrow-js/core";
import { ICHING_COMPACT } from "../app/constants";

export const lookupInfo = new reactive({
    hexagram: ICHING_COMPACT["1"],
    binary: "111111",
});

function getChineseCharactersText(string) {
    const text = string.length > 1 ? html`${() => string[0]}<br/>${() => string[1]}` : html`${() => string}`;
    let className = "iching-heading-char-text";
    if (string.length > 1) {
        className += "-2";
    }
    return html`<p class="${() => className}">${() => text}</p>`;
}

export const lookup = html`
<div style="height:100%">
    <svg id="lookup-hexagram-svg"></svg>
</div>
<div class="lookup-heading" style="width:60%">
    <div class="iching-heading-char" style="background-color: white;">
        ${() => getChineseCharactersText(lookupInfo.hexagram.trad_chinese)}
    </div>
    <div class="iching-heading-details flex-col">
        <div class="iching-hexagram-name">
            <a style="font-size: 2rem;" href="${() => "#hexagram-" + lookupInfo.hexagram.hex}">Hexagram ${() => lookupInfo.hexagram.hex}</a> <br/>
            <span style="font-size: 2rem;"><i>${() => lookupInfo.hexagram.english}</i></span>
        </div>
    </div>
</div>
`;