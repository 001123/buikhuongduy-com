import type { APIRoute } from "astro";
import { openSearchResponse } from "../lib/opensearch";

export const GET: APIRoute = ({ site }) => openSearchResponse("vi", site!);
