export const TemplateIndexEntry = (entry) => 
    `<div class="iching-index-entry">
        <div class="iching-index-entry-hexagram">
            <svg id="index-hexagram-svg-${entry.hex}" class="iching-index-svg"
                xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"
                width="120" height="120" viewBox="0 0 120 120">
            </svg>
        </div>
        <div class="iching-index-entry-text">
            <a href="#hexagram-${entry.hex}">${entry.hex}. ${entry.english}</a>
        </div>
    </div>`

export const TemplateBookEntry = (entry, meta) => 
    `<section class="iching-hexagram-entry" id="hexagram-${entry.hex}">
            <div class="iching-heading">
                <div class="iching-heading-char">
                    <p class="${meta.text_class}">${entry.trad_chinese}</p>
                </div>
                <div class="flex-col iching-heading-details">
                    <div class="iching-hexagram-name">
                        <span style="font-size: 2rem;">Hexagram ${entry.hex}</span> <br />
                        <span style="font-size: 2rem;">${entry.pinyin} - <i>${entry.english}</i></span>
                    </div>
                    <div class="flex-row" style="column-gap: 2rem;">
                        <svg id="hexagram-svg-${entry.hex}" class="iching-hexagram-svg"
                            xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"
                            width="120" height="120" viewBox="0 0 120 120">
                        </svg>
                        <div class="flex-col">
                            <div class="iching-trigram-info" style="border-bottom: 1px solid;">
                                <span>↑ ${entry.wilhelm_above.chinese} - ${entry.wilhelm_above.alchemical}</span>
                            </div>
                            <div class="iching-trigram-info" style="border-top: 1px solid;">
                                <span>↓ ${entry.wilhelm_below.chinese} - ${entry.wilhelm_below.alchemical}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Hexagram
                </summary>
                ${entry.wilhelm_symbolic}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Judgment
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_judgment.text}</b>
                </div>
                <br/>
                ${entry.wilhelm_judgment.comments}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Image
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_image.text}</b>
                </div>
                <br/>
                ${entry.wilhelm_image.comments}
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
                    <b class="iching-text">${entry.wilhelm_lines["1"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["1"].comments}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Line 2
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_lines["2"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["2"].comments}
            </details>
            <details class="iching-entry-details" open="">
                <summary class="iching-entry-summary">
                    Line 3
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_lines["3"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["3"].comments}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 4
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_lines["4"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["4"].comments}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 5
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_lines["5"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["5"].comments}
            </details>
            <details class="iching-entry-details" open="">
            <summary class="iching-entry-summary">
                    Line 6
                </summary>
                <div class="iching-text-outer">
                    <b class="iching-text">${entry.wilhelm_lines["6"].text}</b>
                </div>
                <br/>
                ${entry.wilhelm_lines["6"].comments}
            </details>
            </details>
            <a target="_blank" href="https://jamesdekorne.com/GBCh/hex${entry.hex}.htm">The Gnostic Book of Changes: Hexagram ${entry.hex}</a>
            </br>
            <a href="#">Jump to Top</a>
        </section>`;