// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import { readdirSync, readFileSync } from 'node:fs';
import { sectionPaths } from './src/i18n/ui.ts';
import { categoryIndexMinPosts } from './src/data/categories.ts';

const SITE = 'https://buikhuongduy.com';
/** Remote hosts whose images are downloaded and optimized at build time (Markdown `![](https://...)`). */
const IMAGE_DOMAINS = ['developer.chrome.com'];
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkReadingModes from './src/lib/remark-reading-modes.mjs';
import remarkMermaid from './src/lib/remark-mermaid.mjs';
import rehypePostImages from './src/lib/rehype-post-images.mjs';

/**
 * Published posts read straight from frontmatter: the sitemap hooks run before content collections are available.
 * @typedef {{ lang: 'vi' | 'en', slug: string, category?: string, lastmod: Date }} PostMeta
 * @returns {PostMeta[]}
 */
function readPublishedPosts() {
  /** @type {PostMeta[]} */
  const posts = [];
  for (const lang of /** @type {const} */ (['vi', 'en'])) {
    const dir = new URL(`./src/content/blog/${lang}/`, import.meta.url);
    for (const file of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
      const fm = readFileSync(new URL(file, dir), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      if (/^draft:\s*true\s*$/m.test(fm)) continue;
      const date = (/** @type {string} */ key) => fm.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1];
      const lastmod = new Date(date('updatedDate') ?? date('pubDate') ?? NaN);
      if (Number.isNaN(lastmod.getTime())) throw new Error(`Missing or invalid pubDate in blog/${lang}/${file}`);
      posts.push({
        lang,
        slug: file.replace(/\.mdx?$/, ''),
        category: fm.match(/^category:\s*["']?([a-z0-9-]+)/m)?.[1],
        lastmod,
      });
    }
  }
  return posts;
}
const posts = readPublishedPosts();

/** @param {PostMeta[]} list */
const newest = (list) => (list.length ? new Date(Math.max(...list.map((p) => p.lastmod.getTime()))) : undefined);

/**
 * Category pages that are `noindex` (fewer than `categoryIndexMinPosts` published posts in that language).
 * Must match the `noindex` rule in `getCategoryPaths` (src/lib/blog.ts).
 */
const noindexPaths = new Set();
/**
 * `<lastmod>` per path: a post's `updatedDate ?? pubDate`; home and blog listings (index, pages, categories) take their
 * newest post. About and contact get none: there is no reliable date for them, and a wrong lastmod is worse than none.
 * @type {Map<string, Date>}
 */
const lastmodByPath = new Map();
for (const lang of /** @type {const} */ (['vi', 'en'])) {
  const blogPath = sectionPaths.blog[lang];
  const langPosts = posts.filter((p) => p.lang === lang);
  for (const p of langPosts) lastmodByPath.set(`${blogPath}${p.slug}/`, p.lastmod);
  const latest = newest(langPosts);
  if (latest) {
    lastmodByPath.set(blogPath, latest);
    // Home lists the latest posts, so it changes whenever a post is published or updated.
    lastmodByPath.set(lang === 'vi' ? '/' : '/en/', latest);
  }
  for (const category of new Set(langPosts.map((p) => p.category).filter(Boolean))) {
    const inCategory = langPosts.filter((p) => p.category === category);
    const path = `${blogPath}category/${category}/`;
    if (inCategory.length < categoryIndexMinPosts) noindexPaths.add(path);
    lastmodByPath.set(path, /** @type {Date} */ (newest(inCategory)));
  }
}
// Internal search results pages are `noindex, follow`.
for (const path of Object.values(sectionPaths.search)) noindexPaths.add(path);

/** @param {string} path */
function lastmodFor(path) {
  const exact = lastmodByPath.get(path);
  if (exact) return exact;
  // Paginated listings (`/blog/page/2/`, `/blog/category/x/page/2/`) shift whenever their parent listing gets a post.
  const parent = path.replace(/page\/\d+\/$/, '');
  return parent !== path ? lastmodByPath.get(parent) : undefined;
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // Self-hosted fonts with preloads and metric-matched fallbacks, so the swap causes no layout shift.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Be Vietnam Pro',
      cssVariable: '--font-be-vietnam-pro',
      weights: [400, 500],
      subsets: ['latin', 'latin-ext', 'vietnamese'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      // Static weights actually used (400 body/quotes, 600 headings, 700 404 seal); the variable file is ~120 KB per subset.
      weights: [400, 600, 700],
      subsets: ['latin', 'latin-ext', 'vietnamese'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
  // The site CSS is small; inlining it removes the render-blocking request.
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    domains: IMAGE_DOMAINS,
  },
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    // GA4 runs in a web worker; see src/components/Analytics.astro.
    partytown(),
    // hreflang lives only in the HTML head (Layout.astro), so the sitemap carries no alternates.
    sitemap({
      filter: (page) => !noindexPaths.has(new URL(page).pathname),
      serialize(item) {
        const lastmod = lastmodFor(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod.toISOString();
        return item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkReadingModes, remarkMermaid],
      rehypePlugins: [[rehypePostImages, { domains: IMAGE_DOMAINS }]],
    }),
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
