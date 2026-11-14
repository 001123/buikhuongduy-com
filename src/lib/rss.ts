import rss from "@astrojs/rss";
import { categories } from "../data/categories";
import { homePath, locales, sectionPaths, ui, type Lang } from "../i18n/ui";
import { getPosts, postUrl } from "./blog";

/** Path of the RSS feed of one language: `/rss.xml` or `/en/rss.xml`. */
export function rssPath(lang: Lang): string {
  return `${homePath[lang]}rss.xml`;
}

/** RSS 2.0 feed of the published posts in one language, newest first. */
export async function rssResponse(lang: Lang, site: URL): Promise<Response> {
  const t = ui[lang];
  const posts = await getPosts(lang);
  return rss({
    title: `${t["blog.title"]} – ${t["site.name"]}`,
    description: t["seo.blog"],
    site: new URL(sectionPaths.blog[lang], site).href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: postUrl(post),
      pubDate: post.data.pubDate,
      categories: [
        ...(post.data.category ? [categories[post.data.category][lang].name] : []),
        ...post.data.tags,
      ],
    })),
    customData: [
      `<language>${locales[lang].bcp47}</language>`,
      posts[0] && `<lastBuildDate>${new Date(Math.max(...posts.map((p) => (p.data.updatedDate ?? p.data.pubDate).valueOf()))).toUTCString()}</lastBuildDate>`,
      `<atom:link href="${new URL(rssPath(lang), site).href}" rel="self" type="application/rss+xml"/>`,
    ]
      .filter(Boolean)
      .join(""),
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
  });
}
