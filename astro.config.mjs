// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { sectionPaths } from './src/i18n/ui.ts';
import { categoryIndexMinPosts } from './src/data/categories.ts';

const SITE = 'https://buikhuongduy.com';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkReadingModes from './src/lib/remark-reading-modes.mjs';
import remarkMermaid from './src/lib/remark-mermaid.mjs';

/**
 * Category pages that are `noindex` (fewer than `categoryIndexMinPosts` published posts in that language).
 * The sitemap filter runs before content collections are available, so this reads frontmatter directly;
 * it must match the `noindex` rule in `getCategoryPaths` (src/lib/blog.ts).
 */
function noindexCategoryPaths() {
  const paths = new Set();
  for (const lang of /** @type {const} */ (['vi', 'en'])) {
    const dir = new URL(`./src/content/blog/${lang}/`, import.meta.url);
    /** @type {Record<string, number>} */
    const counts = {};
    for (const file of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
      const fm = readFileSync(new URL(file, dir), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      if (/^draft:\s*true\s*$/m.test(fm)) continue;
      const category = fm.match(/^category:\s*["']?([a-z0-9-]+)/m)?.[1];
      if (category) counts[category] = (counts[category] ?? 0) + 1;
    }
    for (const [category, n] of Object.entries(counts)) {
      if (n < categoryIndexMinPosts) paths.add(`${sectionPaths.blog[lang]}category/${category}/`);
    }
  }
  return paths;
}
const noindexPaths = noindexCategoryPaths();

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
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'vi',
        locales: { vi: 'vi-VN', en: 'en-US' },
      },
      filter: (page) => !noindexPaths.has(new URL(page).pathname),
      // Pair sections whose slugs differ between languages.
      serialize(item) {
        const path = new URL(item.url).pathname;
        const pair = Object.values(sectionPaths).find((p) => p.vi === path || p.en === path);
        if (pair) {
          item.links = [
            { lang: 'vi-VN', url: new URL(pair.vi, SITE).href },
            { lang: 'en-US', url: new URL(pair.en, SITE).href },
          ];
        }
        return item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDirective, remarkReadingModes, remarkMermaid],
    }),
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
