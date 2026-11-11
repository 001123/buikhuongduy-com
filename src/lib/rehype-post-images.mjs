import { visit } from "unist-util-visit";

/**
 * Rendered width of the post body (see SectionPage.astro): the article is `max-w-[54rem]` with
 * `px-4` (mobile) / `sm:px-12` padding and a 1px border, inside `main` with `px-2.5` / `sm:px-6`.
 */
const SIZES = "(min-width: 912px) 766px, (min-width: 640px) calc(100vw - 146px), calc(100vw - 54px)";
const WIDTHS = [360, 480, 640, 768, 1024, 1280, 1536];

/**
 * Responsive markdown images. Astro's `rehype-images` runs after user rehype plugins and forwards
 * these properties to `getImage()`, so `widths` + `sizes` produce a `srcset`.
 *
 * The first image is often the LCP element, so it loads eagerly with high fetch priority.
 */
export default function rehypePostImages() {
  return (tree) => {
    let first = true;
    visit(tree, "element", (node) => {
      if (node.tagName !== "img" || typeof node.properties?.src !== "string") return;
      // Only local/remote images collected by Astro get optimized; skip data URIs and inline SVGs.
      if (node.properties.src.startsWith("data:")) return;
      node.properties.widths = WIDTHS;
      node.properties.sizes = SIZES;
      if (first) {
        node.properties.loading = "eager";
        node.properties.fetchpriority = "high";
        first = false;
      }
    });
  };
}
