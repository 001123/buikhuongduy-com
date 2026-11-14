import type { APIRoute } from "astro";
import { rssResponse } from "../../lib/rss";

export const GET: APIRoute = ({ site }) => rssResponse("en", site!);
