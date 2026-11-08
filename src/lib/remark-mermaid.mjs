import { visit } from "unist-util-visit";

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Turns ```mermaid code blocks into `<pre class="mermaid">` before syntax highlighting,
 * so the client script can render them. Flags the post via `hasMermaid`.
 */
export default function remarkMermaid() {
  return (tree, file) => {
    let hasMermaid = false;
    visit(tree, "code", (node, index, parent) => {
      if (node.lang !== "mermaid" || !parent || index == null) return;
      hasMermaid = true;
      parent.children.splice(index, 1, { type: "html", value: `<pre class="mermaid not-prose">${escapeHtml(node.value)}</pre>` });
    });
    if (hasMermaid) file.data.astro.frontmatter.hasMermaid = true;
  };
}
