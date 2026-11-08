import { createMermaidRenderer } from "mermaid-isomorphic";
import { visit } from "unist-util-visit";

/** Same palette as the site theme (see global.css). */
const mermaidConfig = {
  theme: "base",
  // Resolves to the site font (Astro Fonts API) in the page; defined below for build-time measuring.
  fontFamily: "var(--font-be-vietnam-pro)",
  themeVariables: {
    darkMode: true,
    background: "#2b1d12",
    primaryColor: "#4a2f1c",
    primaryTextColor: "#f6ecd9",
    primaryBorderColor: "#d9b54a",
    secondaryColor: "#3a2617",
    tertiaryColor: "#2b1d12",
    lineColor: "#d9b54a",
    textColor: "#f6ecd9",
    noteBkgColor: "#4a2f1c",
    noteTextColor: "#f6ecd9",
    noteBorderColor: "#e9a3b4",
    actorBkg: "#4a2f1c",
    actorBorder: "#d9b54a",
    actorTextColor: "#f6ecd9",
    signalColor: "#f6ecd9",
    signalTextColor: "#f6ecd9",
  },
};

// Load the site font so Mermaid measures labels with the same metrics the page renders them with.
const css = [
  ...[400, 500].map((w) => import.meta.resolve(`@fontsource/be-vietnam-pro/${w}.css`)),
  `data:text/css,${encodeURIComponent(':root { --font-be-vietnam-pro: "Be Vietnam Pro", sans-serif; }')}`,
];

// Uses the system Chrome, so no Playwright browser download is needed (GitHub runners ship Chrome).
let renderer;
const render = (diagrams, prefix) => {
  renderer ??= createMermaidRenderer({ launchOptions: { channel: "chrome" } });
  return renderer(diagrams, { css, mermaidConfig, prefix });
};

/**
 * Renders ```mermaid code blocks to inline SVG at build time, so readers download no Mermaid runtime.
 * Flags the post via `hasMermaid` so the page includes the diagram viewer.
 */
export default function remarkMermaid() {
  return async (tree, file) => {
    const blocks = [];
    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "mermaid" && parent && index != null) blocks.push({ node, parent });
    });
    if (blocks.length === 0) return;

    const results = await render(
      blocks.map((b) => b.node.value),
      "mermaid",
    );
    results.forEach((result, i) => {
      const { node, parent } = blocks[i];
      if (result.status === "rejected") {
        file.fail(`Mermaid diagram failed to render: ${result.reason}`, node);
      }
      const html = `<figure class="mermaid not-prose">${result.value.svg}</figure>`;
      parent.children.splice(parent.children.indexOf(node), 1, { type: "html", value: html });
    });
    file.data.astro.frontmatter.hasMermaid = true;
  };
}
