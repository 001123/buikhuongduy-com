## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Rules

- Code, names, comments: English.

- Chat: reply in the conversation's language.

- Slugs (page routes, blog post filenames, content IDs): English, lowercase kebab-case, ASCII only. Never use Vietnamese slugs. Both languages share the same slug; English pages only add the `/en/` prefix (`/about/` ↔ `/en/about/`). Section paths live in `sectionPaths` in `src/i18n/ui.ts`.

- When renaming a published slug, add a 301 from the old path in `public/_redirects` (Cloudflare Pages).

## Blog Writing Style

Write blog posts like direct, firsthand engineering notes from one developer to another, never like polished AI essay prose:

- **No em dashes (`—`) in prose.** Split into shorter sentences with periods, or use commas, colons, or parentheses `(…)`. Reserve `—` only for empty table cells and `–` for numeric ranges (`3–5`).

- **Avoid negative parallelisms.** Cut formulaic `"not X, but Y"` / `"không phải X, mà là Y"` / `"không chỉ X, mà còn Y"` constructions. State what something is directly; if contrast is needed, state the main point first and keep it rare.

- **Break uniform templates and the Rule of Three.** Do not force examples or adjectives into groups of three, and do not repeat identical `- **Bold label.** Two sentences.` bullet patterns across a whole section.

- **Vary sentence and paragraph length.** Mix short, direct sentences (5–8 words) with longer explanations; short single-sentence paragraphs are fine.

- **Cut AI filler, hype, and stiff transitions.** Skip throat-clearing (`"This is not wordplay"`, `"Trong bối cảnh..."`), vague significance claims, poetic endings, robotic transitions (`Furthermore`, `Moreover`, `In conclusion`, `Hơn nữa`, `Thêm vào đó`, `Mặt khác`, `Tóm lại`), and buzzwords (`delve`, `landscape`, `testament`, `paramount`, `crucial`, `kiến tạo`, `định hình`, `bức tranh toàn cảnh`, `hành trình`, `giá trị cốt lõi`).

- **Keep tone plain, specific, and first-person.** Use `mình` / `bạn` in Vietnamese (never `tôi` for the author), conversational headings instead of textbook outlines (`Nhóm 1` / `Group 1`), straight quotes `"..."` in body prose, and light bolding. Anchor claims in concrete files, commands, or real observations.

- **Read-aloud check.** Before finishing, check if any Vietnamese sentence reads like translated English essay prose or sounds stiff spoken aloud; simplify it.
