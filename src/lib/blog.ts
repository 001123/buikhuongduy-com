import { getCollection, type CollectionEntry } from "astro:content";
import { categories, categoryIndexMinPosts, categorySlugs, type CategorySlug } from "../data/categories";
import { languages, locales, sectionPaths, type Lang } from "../i18n/ui";

export type Post = CollectionEntry<"blog">;

/** Language of a post, taken from its folder (`vi/…` or `en/…`). */
export function postLang(post: Post): Lang {
  return post.id.split("/")[0] as Lang;
}

/** URL slug of a post: its path without the language folder. */
export function postSlug(post: Post): string {
  return post.id.split("/").slice(1).join("/");
}

export function postUrl(post: Post): string {
  return `${sectionPaths.blog[postLang(post)]}${postSlug(post)}/`;
}

function translationKey(post: Post): string {
  return post.data.translationKey ?? postSlug(post);
}

/** Published posts (plus drafts in dev), newest first. */
export async function getPosts(lang?: Lang): Promise<Post[]> {
  const posts = await getCollection(
    "blog",
    (post) => (import.meta.env.DEV || !post.data.draft) && (!lang || postLang(post) === lang),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Path of each existing translation of a post, including the post itself. */
export async function postTranslations(post: Post): Promise<Partial<Record<Lang, string>>> {
  const key = translationKey(post);
  const all = await getPosts();
  return Object.fromEntries(
    all.filter((p) => translationKey(p) === key).map((p) => [postLang(p), postUrl(p)]),
  );
}

/** Path of a post in each language; falls back to the blog index when no translation exists. */
export async function postAlternates(post: Post): Promise<Record<Lang, string>> {
  const found = await postTranslations(post);
  return Object.fromEntries(
    (Object.keys(languages) as Lang[]).map((l) => [l, found[l] ?? sectionPaths.blog[l]]),
  ) as Record<Lang, string>;
}

/** Static paths for the post pages of one language. */
export async function getPostPaths(lang: Lang) {
  const posts = await getPosts(lang);
  return posts.map((post) => ({ params: { slug: postSlug(post) }, props: { post } }));
}

/** Path of a category page, e.g. `/blog/category/react/` or `/en/blog/category/react/`. */
export function categoryPath(lang: Lang, slug: CategorySlug): string {
  return `${sectionPaths.blog[lang]}category/${slug}/`;
}

/** Posts per listing page (blog index and category pages). Even, to fill the two-column grid. */
export const postsPerPage = 12;

/** Number of listing pages for `count` posts; always at least 1. */
export function pageCount(count: number): number {
  return Math.max(1, Math.ceil(count / postsPerPage));
}

/** Path of listing page `page` under `base`: page 1 is `base` itself, later pages are `base` + `page/N/`. */
export function pagePath(base: string, page: number): string {
  return page <= 1 ? base : `${base}page/${page}/`;
}

/** Posts shown on listing page `page` (1-based). */
export function pagePosts(posts: Post[], page: number): Post[] {
  return posts.slice((page - 1) * postsPerPage, page * postsPerPage);
}

/** Listing page numbers after the first, for `getStaticPaths` of `page/[page]` routes. */
export function laterPages(count: number): number[] {
  return Array.from({ length: pageCount(count) - 1 }, (_, i) => i + 2);
}

/** Static paths for blog index pages 2…N of one language (page 1 is `blog/index.astro`). */
export async function getBlogPagePaths(lang: Lang) {
  const posts = await getPosts(lang);
  return laterPages(posts.length).map((page) => ({ params: { page: String(page) }, props: { page } }));
}

/**
 * Path of blog index page `page` in each language, and the languages where that page exists.
 * Languages with fewer pages fall back to their blog index.
 */
export async function blogPageAlternates(page: number) {
  const langs = Object.keys(languages) as Lang[];
  const counts = await Promise.all(langs.map(async (l) => pageCount((await getPosts(l)).length)));
  const translations = Object.fromEntries(
    langs.filter((_, i) => counts[i] >= page).map((l) => [l, pagePath(sectionPaths.blog[l], page)]),
  ) as Partial<Record<Lang, string>>;
  const alternates = Object.fromEntries(
    langs.map((l) => [l, translations[l] ?? sectionPaths.blog[l]]),
  ) as Record<Lang, string>;
  return { translations, alternates };
}

/** Categories that have at least one post in a language, in `categorySlugs` order, with their posts. */
export async function getCategories(lang: Lang) {
  const posts = await getPosts(lang);
  return categorySlugs
    .map((slug) => ({ slug, ...categories[slug][lang], posts: posts.filter((p) => p.data.category === slug) }))
    .filter((c) => c.posts.length > 0);
}

/**
 * Static paths for the category pages of one language, for `category/[category]/[...page]` routes:
 * `page` is `undefined` for page 1 and `page/N` for later pages. Empty categories get no page.
 */
export async function getCategoryPaths(lang: Lang) {
  const found = await getCategories(lang);
  const all = await Promise.all((Object.keys(languages) as Lang[]).map(async (l) => [l, await getCategories(l)] as const));
  return found.flatMap((category) => {
    // Number of pages of this category in each language that has it.
    const pagesIn = Object.fromEntries(
      all.flatMap(([l, cats]) => {
        const c = cats.find((c) => c.slug === category.slug);
        return c ? [[l, pageCount(c.posts.length)]] : [];
      }),
    ) as Partial<Record<Lang, number>>;
    const noindex = category.posts.length < categoryIndexMinPosts;
    return Array.from({ length: pageCount(category.posts.length) }, (_, i) => i + 1).map((page) => {
      // Languages with this page of the category, for hreflang; others fall back to that category's
      // first page, or to the blog index when the language has no such category.
      const translations = Object.fromEntries(
        (Object.keys(pagesIn) as Lang[])
          .filter((l) => (pagesIn[l] ?? 0) >= page)
          .map((l) => [l, pagePath(categoryPath(l, category.slug), page)]),
      ) as Partial<Record<Lang, string>>;
      const alternates = Object.fromEntries(
        (Object.keys(languages) as Lang[]).map((l) => [
          l,
          translations[l] ?? (pagesIn[l] ? categoryPath(l, category.slug) : sectionPaths.blog[l]),
        ]),
      ) as Record<Lang, string>;
      return {
        params: { category: category.slug, page: page === 1 ? undefined : `page/${page}` },
        props: { category, page, translations, alternates, noindex },
      };
    });
  });
}

/** Up to `limit` other posts in the same language: same category first, then most shared tags, then newest. */
export async function relatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const others = (await getPosts(postLang(post))).filter((p) => p.id !== post.id);
  const score = (p: Post) =>
    (post.data.category && p.data.category === post.data.category ? 100 : 0) +
    p.data.tags.filter((tag) => post.data.tags.includes(tag)).length;
  return others
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ p }) => p);
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(locales[lang].bcp47, { day: "numeric", month: "long", year: "numeric" }).format(date);
}
