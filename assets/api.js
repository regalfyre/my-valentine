import { ATLAS } from "./config.js";

export async function fetchAllItems(prefix = ATLAS.PREFIX) {
  // Your worker base
  const WORKER = ATLAS.WORKER.replace(/\/$/, "");

  // Call: https://valentine-worker.regalfyre.workers.dev/list
  const url = new URL(WORKER + "/list");

  // optional filtering (cards/)
  if (prefix) url.searchParams.set("prefix", prefix);

  // keep your cache-buster
  url.searchParams.set("t", crypto.randomUUID());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Worker error: ${res.status}`);

  // Your worker's /list currently returns either:
  // - an array of objects like [{ key: "cards/poem (1).png", ... }]
  // - or an array of strings like ["cards/poem (1).png", ...]
  const arr = await res.json();

  // Convert each key into a URL your browser can load:
  // https://valentine-worker.regalfyre.workers.dev/file/<key>
  const baseFile = WORKER + "/file/";

  return arr
    .map(x => (typeof x === "string" ? x : x.key))
    .filter(Boolean)
    .map(key => ({
      key,
      url: baseFile + encodeURIComponent(key)
    }));
}
