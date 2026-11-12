#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Seznam, Naver, ...) about changed URLs. Google does not support IndexNow.
//
// Usage:
//   node scripts/indexnow.mjs snapshot <file>       Save the live sitemap (url -> lastmod) to <file>. Run before deploying.
//   node scripts/indexnow.mjs submit <file>         Submit URLs that are new, removed, or have a new lastmod in dist/ vs <file>.
//   node scripts/indexnow.mjs submit --all          Submit every URL in dist/ sitemaps.
//   add --dry-run to `submit` to print the URLs without sending them.
//
// The key is public by design: IndexNow verifies ownership by fetching https://<host>/<key>.txt (public/<key>.txt).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = 'https://buikhuongduy.com';
const KEY = 'dd2e044c33d8aebc895e5dac2b30c754';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DIST = new URL('../dist/', import.meta.url);
const BATCH = 10_000; // IndexNow limit per request.

/** @param {string} xml */
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

/**
 * `<url>` entries of one urlset: url -> lastmod ('' when absent).
 * @param {string} xml
 */
function parseUrlset(xml) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const [, body] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
    if (loc) out[loc] = body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() ?? '';
  }
  return out;
}

/** @param {(name: string) => Promise<string>} read reads a sitemap file by name, e.g. `sitemap-0.xml`. */
async function readSitemaps(read) {
  const index = await read('sitemap-index.xml');
  /** @type {Record<string, string>} */
  const urls = {};
  for (const loc of locs(index)) Object.assign(urls, parseUrlset(await read(new URL(loc).pathname.slice(1))));
  return urls;
}

const readLocal = async (/** @type {string} */ name) => readFileSync(new URL(name, DIST), 'utf8');
const readLive = async (/** @type {string} */ name) => {
  const res = await fetch(`${SITE}/${name}`);
  if (!res.ok) throw new Error(`GET ${SITE}/${name}: ${res.status}`);
  return res.text();
};

/** @param {string[]} urlList */
async function submit(urlList) {
  for (let i = 0; i < urlList.length; i += BATCH) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE).host,
        key: KEY,
        keyLocation: `${SITE}/${KEY}.txt`,
        urlList: urlList.slice(i, i + BATCH),
      }),
    });
    // 200 = accepted, 202 = accepted, key validation pending. Anything else is an error.
    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`IndexNow ${res.status}: ${await res.text()}`);
    }
    console.log(`IndexNow ${res.status}: submitted ${Math.min(BATCH, urlList.length - i)} URL(s).`);
  }
}

const [command, ...args] = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const file = args.find((a) => !a.startsWith('--'));

if (command === 'snapshot' && file) {
  let urls = {};
  try {
    urls = await readSitemaps(readLive);
  } catch (err) {
    // First deploy or site down: an empty snapshot means every URL counts as new.
    console.warn(`Could not read live sitemap, saving empty snapshot: ${err}`);
  }
  writeFileSync(file, JSON.stringify(urls, null, 2));
  console.log(`Saved ${Object.keys(urls).length} live URL(s) to ${file}.`);
} else if (command === 'submit' && (file || args.includes('--all'))) {
  const current = await readSitemaps(readLocal);
  let changed;
  if (args.includes('--all')) {
    changed = Object.keys(current);
  } else {
    if (!existsSync(file)) throw new Error(`Snapshot not found: ${file}`);
    /** @type {Record<string, string>} */
    const previous = JSON.parse(readFileSync(file, 'utf8'));
    const added = Object.keys(current).filter((u) => !(u in previous) || previous[u] !== current[u]);
    // Removed URLs are submitted too, so search engines recrawl them and drop the 404s.
    const removed = Object.keys(previous).filter((u) => !(u in current));
    changed = [...added, ...removed];
  }

  if (changed.length === 0) {
    console.log('No changed URLs, nothing to submit.');
  } else {
    console.log(changed.join('\n'));
    if (dryRun) console.log(`Dry run: ${changed.length} URL(s) not submitted.`);
    else await submit(changed);
  }
} else {
  console.error('Usage: indexnow.mjs snapshot <file> | submit <file> | submit --all [--dry-run]');
  process.exit(1);
}
