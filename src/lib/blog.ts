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

/** Categories that have at least one post in a language, in `categorySlugs` order, with their posts. */
export async function getCategories(lang: Lang) {
  const posts = await getPosts(lang);
  return categorySlugs
    .map((slug) => ({ slug, ...categories[slug][lang], posts: posts.filter((p) => p.data.category === slug) }))
    .filter((c) => c.posts.length > 0);
}

/** Static paths for the category pages of one language; empty categories get no page. */
export async function getCategoryPaths(lang: Lang) {
  const found = await getCategories(lang);
  const all = await Promise.all((Object.keys(languages) as Lang[]).map(async (l) => [l, await getCategories(l)] as const));
  return found.map((category) => {
    // Languages where this category has posts, for hreflang; others fall back to the blog index.
    const translations = Object.fromEntries(
      all.filter(([, cats]) => cats.some((c) => c.slug === category.slug)).map(([l]) => [l, categoryPath(l, category.slug)]),
    ) as Partial<Record<Lang, string>>;
    const alternates = Object.fromEntries(
      (Object.keys(languages) as Lang[]).map((l) => [l, translations[l] ?? sectionPaths.blog[l]]),
    ) as Record<Lang, string>;
    return {
      params: { category: category.slug },
      props: { category, translations, alternates, noindex: category.posts.length < categoryIndexMinPosts },
    };
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
