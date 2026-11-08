import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori, { type Font } from "satori";
import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;
/** Width of the solid text panel in the base image; the portrait sits to its right. */
const PANEL = 700;
const NAVY = "#121B2A";
const GOLD = "#D9B77A";
const PAPER = "#F6ECD9";
const MUTED = "#6F7887";

/** Full (unsubsetted) Be Vietnam Pro: satori drops glyphs when stitching the web-font subsets together. */
const fontDir = join(process.cwd(), "src/assets/fonts");

let assets: Promise<{ fonts: Font[]; base: string }> | undefined;

/** Fonts and the base OG image, loaded once per build. */
function loadAssets() {
  assets ??= (async () => {
    const files = [
      [400, "BeVietnamPro-Regular.ttf"],
      [700, "BeVietnamPro-Bold.ttf"],
    ] as const;
    const fonts = await Promise.all(
      files.map(async ([weight, file]) => ({
        name: "Be Vietnam Pro",
        weight,
        style: "normal" as const,
        data: await readFile(join(fontDir, file)),
      })),
    );
    const base = await readFile(join(process.cwd(), "public/og-image.jpg"));
    return { fonts, base: `data:image/jpeg;base64,${base.toString("base64")}` };
  })();
  return assets;
}

/** Shrink the title as it grows so long titles still fit the panel. */
function titleSize(title: string): number {
  const len = title.length;
  if (len <= 30) return 60;
  if (len <= 50) return 52;
  if (len <= 75) return 44;
  return 38;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export interface OgInput {
  title: string;
  description: string;
  /** Small gold line above the footer, e.g. the publish date. */
  kicker: string;
  footer: string;
}

/** Render a 1200×630 PNG: the base OG image with its text panel replaced by the post's title. */
export async function renderOgImage({ title, description, kicker, footer }: OgInput): Promise<Uint8Array> {
  const { fonts, base } = await loadAssets();

  const tree = h("div", { display: "flex", width: WIDTH, height: HEIGHT, position: "relative", fontFamily: "Be Vietnam Pro" }, [
    h("img", { position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT }, undefined, { src: base, width: WIDTH, height: HEIGHT }),
    h(
      "div",
      {
        position: "absolute",
        top: 0,
        left: 0,
        width: PANEL,
        height: HEIGHT,
        backgroundColor: NAVY,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        padding: "88px 64px 64px 65px",
      },
      [
        h("div", { width: 76, height: 4, backgroundColor: GOLD }),
        h(
          "div",
          { marginTop: 44, fontSize: titleSize(title), fontWeight: 700, lineHeight: 1.18, color: PAPER, lineClamp: 4, display: "block" },
          title,
        ),
        h(
          "div",
          { marginTop: 24, fontSize: 24, lineHeight: 1.45, color: "rgba(246,236,217,0.72)", lineClamp: 2, display: "block" },
          description,
        ),
        h("div", { flexGrow: 1 }),
        h("div", { fontSize: 22, color: GOLD }, kicker),
        h("div", { marginTop: 14, fontSize: 18, color: MUTED, letterSpacing: 0.5 }, footer),
      ],
    ),
  ]);

  const svg = await satori(tree as never, { width: WIDTH, height: HEIGHT, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
