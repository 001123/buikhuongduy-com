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
