#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Seznam, Naver, ...) about changed URLs. Google does not support IndexNow.
//
// Usage:
//   node scripts/indexnow.mjs state                 Write dist/indexnow.json (url -> version) after `astro build`.
//   node scripts/indexnow.mjs snapshot <file>       Save the live site's state to <file>. Run before deploying.
//   node scripts/indexnow.mjs submit <file>         Submit URLs that are new, removed or changed in dist/ vs <file>.
//   node scripts/indexnow.mjs submit --all          Submit every URL in dist/ sitemaps.
//   add --dry-run to `submit` to print the URLs without sending them.
//
// A URL's version is its sitemap <lastmod>. Pages without one (home, about, contact) get a hash of their <main>
// content instead, so editing them or their content still triggers a submission. The state is computed from dist/
// and deployed as /indexnow.json, so the next deploy compares build output with build output: HTML served by the
// Cloudflare zone (e.g. email obfuscation) would make a hash of the live page differ on every run.
//
// The key is public by design: IndexNow verifies ownership by fetching https://<host>/<key>.txt (public/<key>.txt).

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SITE = 'https://buikhuongduy.com';
const KEY = 'dd2e044c33d8aebc895e5dac2b30c754';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DIST = new URL('../dist/', import.meta.url);
const STATE_FILE = 'indexnow.json';
const BATCH = 10_000; // IndexNow limit per request.

/** @typedef {Record<string, string>} State url -> lastmod, `sha256:<hash>`, or '' when unknown. */

/** @param {string} xml */
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

/**
 * `<url>` entries of one urlset: url -> lastmod ('' when absent).
 * @param {string} xml
 */
function parseUrlset(xml) {
  /** @type {State} */
  const out = {};
  for (const [, body] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1].trim();
    if (loc) out[loc] = body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim() ?? '';
  }
  return out;
}

/** @param {(name: string) => Promise<string>} read reads a site file by name, e.g. `sitemap-0.xml`. */
async function readSitemaps(read) {
  const index = await read('sitemap-index.xml');
  /** @type {State} */
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

/**
 * Hash of what a reader sees: title, description and `<main>`, ignoring build noise
 * (hashed asset names, scoped-style ids, scripts and styles).
 * @param {string} html
 */
function contentHash(html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const main = (html.match(/<main[\s>][\s\S]*<\/main>/)?.[0] ?? html)
    .replace(/<(script|style)[\s>][\s\S]*?<\/\1>/g, '')
    .replace(/\sdata-astro-cid-[\w-]+(="[^"]*")?/g, '')
    .replace(/(\/_astro\/[^"'\s./]+)\.[\w-]+(\.\w+)/g, '$1$2')
    .replace(/\s+/g, ' ');
  return `sha256:${createHash('sha256').update(`${title}\n${description}\n${main}`).digest('hex')}`;
}

/** @param {string} url */
function distHtml(url) {
  const path = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
  for (const file of [path.endsWith('/') || path === '' ? `${path}index.html` : `${path}/index.html`, `${path}.html`]) {
    const fileUrl = new URL(file, DIST);
    if (existsSync(fileUrl)) return readFileSync(fileUrl, 'utf8');
  }
  throw new Error(`No built HTML for ${url}`);
}

async function buildState() {
  const state = await readSitemaps(readLocal);
  for (const [url, lastmod] of Object.entries(state)) if (!lastmod) state[url] = contentHash(distHtml(url));
  return state;
}

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

if (command === 'state') {
  const state = await buildState();
  writeFileSync(new URL(STATE_FILE, DIST), JSON.stringify(state));
  console.log(`IndexNow: wrote dist/${STATE_FILE} (${Object.keys(state).length} URLs).`);
} else if (command === 'snapshot' && file) {
  /** @type {State} */
  let state = {};
  try {
    state = JSON.parse(await readLive(STATE_FILE));
  } catch (err) {
    // Not deployed yet: fall back to sitemap lastmods. Pages without one then count as changed once.
    console.warn(`No live ${STATE_FILE} (${err}), falling back to the live sitemap.`);
    try {
      state = await readSitemaps(readLive);
    } catch (err) {
      // First deploy or site down: an empty snapshot means every URL counts as new.
      console.warn(`Could not read live sitemap, saving empty snapshot: ${err}`);
    }
  }
  writeFileSync(file, JSON.stringify(state, null, 2));
  console.log(`Saved ${Object.keys(state).length} live URL(s) to ${file}.`);
} else if (command === 'submit' && (file || args.includes('--all'))) {
  const stateUrl = new URL(STATE_FILE, DIST);
  /** @type {State} */
  const current = existsSync(stateUrl) ? JSON.parse(readFileSync(stateUrl, 'utf8')) : await buildState();
  let changed;
  if (args.includes('--all')) {
    changed = Object.keys(current);
  } else {
    if (!file || !existsSync(file)) throw new Error(`Snapshot not found: ${file}`);
    /** @type {State} */
    const previous = JSON.parse(readFileSync(file, 'utf8'));
    const updated = Object.keys(current).filter((u) => previous[u] !== current[u]);
    // Removed URLs are submitted too, so search engines recrawl them and drop the 404s.
    const removed = Object.keys(previous).filter((u) => !(u in current));
    changed = [...updated, ...removed];
  }

  if (changed.length === 0) {
    console.log('No changed URLs, nothing to submit.');
  } else {
    console.log(changed.join('\n'));
    if (dryRun) console.log(`Dry run: ${changed.length} URL(s) not submitted.`);
    else await submit(changed);
  }
} else {
  console.error('Usage: indexnow.mjs state | snapshot <file> | submit <file> | submit --all [--dry-run]');
  process.exit(1);
}
