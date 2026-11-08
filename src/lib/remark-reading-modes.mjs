import { visit } from "unist-util-visit";

/** Container directives that mark content for one reading mode. */
const MODES = ["tldr", "advanced"];

/**
 * Turns `:::tldr` / `:::advanced` blocks into `<div class="mode-…">` and flags the
 * post via `hasModes` in remark frontmatter. Any other directive is restored as
 * plain text, so stray colons like `a:b` in prose are left untouched.
 */
export default function remarkReadingModes() {
  return (tree, file) => {
    let hasModes = false;

    visit(tree, (node, index, parent) => {
      if (node.type === "containerDirective" && MODES.includes(node.name)) {
        hasModes = true;
        node.data = { hName: "div", hProperties: { className: [`mode-${node.name}`], dataMode: node.name } };
        return;
      }
      if (["textDirective", "leafDirective", "containerDirective"].includes(node.type) && parent && index != null) {
        const marker = { textDirective: ":", leafDirective: "::", containerDirective: ":::" }[node.type];
        const restored = node.type === "textDirective"
          ? [{ type: "text", value: `${marker}${node.name}` }, ...(node.children ?? [])]
          : [{ type: "paragraph", children: [{ type: "text", value: `${marker}${node.name}` }] }, ...(node.children ?? [])];
        parent.children.splice(index, 1, ...restored);
        return index;
      }
    });

    if (hasModes) file.data.astro.frontmatter.hasModes = true;
  };
}
