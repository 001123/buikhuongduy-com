import { createMermaidRenderer } from "mermaid-isomorphic";
import { visit } from "unist-util-visit";

/** Light-mode editorial palette matching global.css; dark mode is overridden via CSS. */
const mermaidConfig = {
  theme: "base",
  // Resolves to the site's system font stack in the page; defined below for build-time measuring.
  fontFamily: "var(--font-system-sans)",
  themeVariables: {
    darkMode: false,
    background: "#F5F5F7",
    primaryColor: "#FFFFFF",
    primaryTextColor: "#0A0A0B",
    primaryBorderColor: "#D4D4D8",
    secondaryColor: "#F5F5F7",
    tertiaryColor: "#FFFFFF",
    lineColor: "#63636E",
    textColor: "#0A0A0B",
    noteBkgColor: "#FFF1E8",
    noteTextColor: "#0A0A0B",
    noteBorderColor: "#C84300",
    actorBkg: "#FFFFFF",
    actorBorder: "#D4D4D8",
    actorTextColor: "#0A0A0B",
    signalColor: "#0A0A0B",
    signalTextColor: "#0A0A0B",
  },
};

// Same system stack as global.css, so Mermaid measures labels with a font close to what readers see.
const css = [
  `data:text/css,${encodeURIComponent(':root { --font-system-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif; }')}`,
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
