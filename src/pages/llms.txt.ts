import type { APIRoute } from "astro";
import { cvUrl, email, socials } from "../data/profile";
import { getPosts, postLang, postUrl } from "../lib/blog";
import { homePath, sectionPaths, ui } from "../i18n/ui";

/** Plain-text site summary for LLMs, following https://llmstxt.org. */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const en = ui.en;
  const posts = await getPosts();

  const postLines = posts.map(
    (post) => `- [${post.data.title}](${url(postUrl(post))}) (${postLang(post)}): ${post.data.description}`,
  );

  const body = [
    `# ${en["site.name"]}`,
    "",
    `> ${en["site.tagline"].split("|").join(" ")}. ${en["contact.lead"].replace(/⁠/g, "")}`,
    "",
    "The site is bilingual: Vietnamese (default, no prefix) and English (under /en/).",
    "",
    "## Pages",
    "",
    `- [Home](${url(homePath.en)}): ${en["site.description"]}`,
    `- [About](${url(sectionPaths.about.en)}): ${en["about.lead"]}`,
    `- [Blog](${url(sectionPaths.blog.en)}): ${en["blog.lead"]}`,
    `- [Contact](${url(sectionPaths.contact.en)}): Email and social links`,
    `- [RSS feed](${url(`${homePath.en}rss.xml`)}): English blog posts`,
    `- [RSS feed (vi)](${url(`${homePath.vi}rss.xml`)}): Vietnamese blog posts`,
    `- [Trang chủ (vi)](${url(homePath.vi)})`,
    `- [Giới thiệu (vi)](${url(sectionPaths.about.vi)})`,
    `- [Blog (vi)](${url(sectionPaths.blog.vi)})`,
    `- [Liên hệ (vi)](${url(sectionPaths.contact.vi)})`,
    "",
    "## Blog posts",
    "",
    ...(postLines.length ? postLines : ["- No posts published yet."]),
    "",
    "## Contact",
    "",
    `- [Résumé](${cvUrl})`,
    `- [Email](mailto:${email})`,
    ...socials.map((s) => `- [${s.label}](${s.href})`),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
