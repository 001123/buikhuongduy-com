import { getCollection, type CollectionEntry } from "astro:content";
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

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(locales[lang].bcp47, { day: "numeric", month: "long", year: "numeric" }).format(date);
}
