// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { sectionPaths } from './src/i18n/ui.ts';

const SITE = 'https://buikhuongduy.com';
import { unified } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkReadingModes from './src/lib/remark-reading-modes.mjs';
import remarkMermaid from './src/lib/remark-mermaid.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE,
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
