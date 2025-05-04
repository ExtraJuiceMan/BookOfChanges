import { BookOfChanges } from "./iching-wilhelm";
import { buildBookEntries, buildBookIndex } from "./app/build-page";

addEventListener("message", e => {
    const entries = buildBookEntries(BookOfChanges, (entry) => {
        postMessage({type: "book", entry });
    });
    const index = buildBookIndex(BookOfChanges, (entry) => {
        postMessage({ type: "index", entry });
    });

    //postMessage({entries, index});
});