import type { APIRoute } from "astro";
import { searchIndex, searchIndexResponse } from "../../lib/search";

export const GET: APIRoute = async () => searchIndexResponse(await searchIndex("vi"));
