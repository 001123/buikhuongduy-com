import type { APIRoute, GetStaticPaths } from "astro";
import { formatDate, getPosts, postLang, type Post } from "../../lib/blog";
import { cleanText } from "../../lib/seo";
import { renderOgImage } from "../../lib/og";

/** One OG image per post, at `/og/<lang>/<slug>.png`. */
export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: Post }> = async ({ props: { post } }) => {
  const lang = postLang(post);
  const png = await renderOgImage({
    title: cleanText(post.data.title),
    description: cleanText(post.data.description),
    kicker: formatDate(post.data.pubDate, lang),
    footer: "BUIKHUONGDUY.COM",
  });
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
