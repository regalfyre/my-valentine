import { ATLAS } from "./config.js";

export async function fetchAllItems(prefix = ATLAS.PREFIX) {
  let cursor = null;
  let items = [];

  while (true) {
    const url = new URL(ATLAS.WORKER);
    url.searchParams.set("prefix", prefix);
    url.searchParams.set("limit", String(ATLAS.PAGE_LIMIT));
    if (cursor) url.searchParams.set("cursor", cursor);
    url.searchParams.set("t", crypto.randomUUID());

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Worker error: ${res.status}`);
    const data = await res.json();

    items = items.concat(data.items || []);
    if (!data.truncated || !data.cursor) break;
    cursor = data.cursor;
  }

  return items;
}
