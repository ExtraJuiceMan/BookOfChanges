import { HttpChainClient, HttpCachingChain, fetchBeaconByTime } from "drand-client/index";

const chainHash = "8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce"; // (hex encoded)
const publicKey = "868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31"; // (hex encoded)

const options = {
    disableBeaconVerification: false, // `true` disables checking of signatures on beacons - faster but insecure!!!
    noCache: false, // `true` disables caching when retrieving beacons for some providers
    chainVerificationParams: { chainHash, publicKey }  // these are optional, but recommended! They are compared for parity against the `/info` output of a given node
};

const chain = new HttpCachingChain("https://drand.cloudflare.com", options);
const client = new HttpChainClient(chain, options, { userAgent: null, headers: null });

export function beaconInfo(unixMs, callback) {
    fetchBeaconByTime(client, unixMs).then((value) => callback(value));
}

export function chainInfo(callback) {
    chain.info().then((value) => callback(value));
}