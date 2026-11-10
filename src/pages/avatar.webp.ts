import { readFile } from "node:fs/promises";
import type { APIRoute } from "astro";

/** Avatar at a stable URL for JSON-LD, so `Person.image` survives rebuilds (hashed `_astro/` names change). */
export const GET: APIRoute = async () => {
  // Path from the project root: `import.meta.url` points into the build output at build time.
  const file = await readFile("src/assets/avatar_cv.webp");
  return new Response(file, { headers: { "Content-Type": "image/webp" } });
};
