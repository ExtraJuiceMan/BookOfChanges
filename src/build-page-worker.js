import { BookOfChanges } from "./iching-wilhelm";
import { buildBookEntries, buildBookIndex } from "./build-page";

addEventListener("message", e => {
    const entries = buildBookEntries(BookOfChanges);
    const index = buildBookIndex(BookOfChanges);

    postMessage({entries, index});
});