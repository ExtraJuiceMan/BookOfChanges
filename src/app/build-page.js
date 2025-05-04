import Hexagram from "./hexagram";
import { SVG } from "@svgdotjs/svg.js";
import { TemplateBookEntry, TemplateIndexEntry } from "../components/iching-template";
import { toTitleCase } from "./utility";

export function runBuildPageWorker() {
    const worker = new Worker(new URL("../build-page-worker.js", import.meta.url), {
        type: "module"
    });

    let scrollId = window.location.hash.substring(1);

    worker.addEventListener("message", e => {
        //injectBookEntries(e.data.entries);
        //injectIndexEntries(e.data.index);

        if (e.data.type === "index") {
            injectIndexEntry(e.data.entry);
        }

        if (e.data.type === "book") {
            injectBookEntry(e.data.entry);

            if (scrollId !== "" && scrollToId(scrollId)) {
                scrollId = "";
            }
        }
    });

    worker.postMessage(null);
}

export function buildBookIndex(book, callback) {
    let indexEntries = [];

    for (const k in book) {
        const entry = book[k];

        let value = { html: TemplateIndexEntry(entry), svgId: `index-hexagram-svg-${entry.hex}`, binary: entry.binary };

        if (callback === undefined) {
            indexEntries.push(value);
        } else {
            callback(value);
        }
    }

    return indexEntries;
}

export function buildBookEntries(book, callback) {
    let entries = [];

    for (const k in book) {
        let entry = structuredClone(book[k]);

        entry.pinyin = toTitleCase(entry.pinyin);
        entry.wilhelm_above.chinese = toTitleCase(entry.wilhelm_above.chinese).replace(",", "");
        entry.wilhelm_below.chinese = toTitleCase(entry.wilhelm_below.chinese).replace(",", "");
        entry.wilhelm_above.alchemical = toTitleCase(entry.wilhelm_above.alchemical);
        entry.wilhelm_below.alchemical = toTitleCase(entry.wilhelm_below.alchemical);

        for (const [k, v] of Object.entries(entry.wilhelm_lines)) {
            v.text = v.text.replace(/\n/g, "<br />");
            v.comments = v.comments.replace(/\n/g, "<br />");
            entry.wilhelm_lines[k] = v;
        }

        entry.wilhelm_judgment.text = entry.wilhelm_judgment.text.replace(/\n\s*\n/g, "\n").replace(/\n/g, "<br />");
        entry.wilhelm_judgment.comments = entry.wilhelm_judgment.comments.replace(/\n/g, "<br />");

        entry.wilhelm_image.text = entry.wilhelm_image.text.replace(/\n\s*\n/g, "\n").replace(/\n/g, "<br />");
        entry.wilhelm_image.comments = entry.wilhelm_image.comments.replace(/\n/g, "<br />");

        entry.wilhelm_symbolic = entry.wilhelm_symbolic.replace(/\n/g, "<br />");

        let text_class = "iching-heading-char-text";
        if (entry.trad_chinese.length > 1) {
            text_class += "-2";
            entry.trad_chinese = `${entry.trad_chinese[0]}<br/>${entry.trad_chinese[1]}`;
        }

        entry.binary = entry.binary.toString();

        let value = { html: TemplateBookEntry(entry, { text_class }), svgId: `hexagram-svg-${entry.hex}`, binary: entry.binary };

        if (callback === undefined) {
            entries.push(value);
        } else {
            callback(value);
        }
    }

    return entries;
}

function makeHexagramFromEntry(entry) {
    new Hexagram(SVG(document.getElementById(entry.svgId))
        .size(120, 120)
        .viewbox(0, 0, 120, 120),
        entry.binary
    );
}

export function injectAllBookEntries(entries) {
    document.getElementById("iching-entries").innerHTML = entries.map(e => e.html).join("");
    entries.forEach((entry) => makeHexagramFromEntry(entry));
}

export function injectAllIndexEntries(entries) {
    document.getElementById("iching-index").innerHTML = entries.map(e => e.html).join("");
    entries.forEach((entry) => makeHexagramFromEntry(entry));
}

export function injectBookEntry(entry) {
    document.getElementById("iching-entries").insertAdjacentHTML("beforeend", entry.html);
    makeHexagramFromEntry(entry);
}

export function injectIndexEntry(entry) {
    document.getElementById("iching-index").insertAdjacentHTML("beforeend", entry.html);
    makeHexagramFromEntry(entry);
}