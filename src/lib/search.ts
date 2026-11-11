import { categories } from "../data/categories";
import { sectionPaths, type Lang } from "../i18n/ui";
import { formatDateTime, getPosts, postUrl } from "./blog";

/** One post in the client-side search index (`/search/index.json`, `/en/search/index.json`). */
export interface SearchDoc {
  url: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  /** ISO publish date. */
  date: string;
  /** Publish date as shown on post cards. */
  dateLabel: string;
  /** Plain-text body: no code blocks, markup or directive fences. */
  body: string;
}

/** Path of the search index for a language, next to its search page. */
export function searchIndexPath(lang: Lang): string {
  return `${sectionPaths.search[lang]}index.json`;
}

/** Rough Markdown → plain text, good enough for matching and snippets. */
function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code and Mermaid diagrams
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ") // inline HTML
    .replace(/^:{2,}.*$/gm, " ") // directive fences (:::tldr, :::)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ") // table separator rows
    .replace(/[`*_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchIndex(lang: Lang): Promise<SearchDoc[]> {
  const posts = await getPosts(lang);
  return posts.map((post) => ({
    url: postUrl(post),
    title: post.data.title,
    description: post.data.description,
    category: post.data.category ? categories[post.data.category][lang].name : undefined,
    tags: post.data.tags,
    date: post.data.pubDate.toISOString(),
    dateLabel: formatDateTime(post.data.pubDate, lang),
    body: plainText(post.body ?? ""),
  }));
}

export function searchIndexResponse(docs: SearchDoc[]): Response {
  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
