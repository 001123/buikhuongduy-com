import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { categorySlugs } from "./data/categories";

/**
 * Blog posts live in `src/content/blog/<lang>/<slug>.md`.
 * The file name becomes the URL slug; the folder sets the language.
 *
 * Slugs are shared across languages and always written in English:
 * a post and its translation use the same file name, e.g.
 * `vi/why-i-chose-astro.md` and `en/why-i-chose-astro.md`.
 */
const blog = defineCollection({
  loader: glob({ pattern: "{vi,en}/**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** One topic from `src/data/categories.ts`; a typo fails the build. */
    category: z.enum(categorySlugs).optional(),
    tags: z.array(z.string()).default([]),
    /** Drafts are visible in `astro dev` only. */
    draft: z.boolean().default(false),
    /** Override for linking translations; normally unneeded since slugs are shared. */
    translationKey: z.string().optional(),
  }),
});

export const collections = { blog };
