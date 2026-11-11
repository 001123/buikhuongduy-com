import { visit } from "unist-util-visit";

/**
 * Rendered width of the post body (see SectionPage.astro): the article is `max-w-[54rem]` with
 * `px-4` (mobile) / `sm:px-12` padding and a 1px border, inside `main` with `px-2.5` / `sm:px-6`.
 */
const SIZES = "(min-width: 912px) 766px, (min-width: 640px) calc(100vw - 146px), calc(100vw - 54px)";
const WIDTHS = [360, 480, 640, 768, 1024, 1280, 1536];

/**
 * Whether Astro's image pipeline will process this `src`: relative imports (e.g. `../../../assets/...`)
 * and remote URLs on an allowed domain. `public/` paths, other remote URLs and data URIs are left
 * untouched, otherwise `widths` would leak into the HTML as an unknown attribute.
 * @param {string} src
 * @param {string[]} domains
 */
function isOptimizable(src, domains) {
  if (/^https?:\/\//i.test(src)) {
    try {
      return domains.includes(new URL(src).hostname);
    } catch {
      return false;
    }
  }
  return !/^(\/|[a-z][a-z0-9+.-]*:)/i.test(src);
}

/**
 * Responsive markdown images. Astro's `rehype-images` runs after user rehype plugins and forwards
 * these properties to `getImage()`, so `widths` + `sizes` produce a `srcset`.
 *
 * The first image is often the LCP element, so it loads eagerly with high fetch priority.
 * @param {{ domains?: string[] }} [options] Must match `image.domains` in astro.config.mjs.
 */
export default function rehypePostImages({ domains = [] } = {}) {
  return (tree) => {
    let first = true;
    visit(tree, "element", (node) => {
      if (node.tagName !== "img" || typeof node.properties?.src !== "string") return;
      if (!isOptimizable(node.properties.src, domains)) return;
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
