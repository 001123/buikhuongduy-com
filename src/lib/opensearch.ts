import { homePath, locales, sectionPaths, ui, type Lang } from "../i18n/ui";

const escapeXml = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * OpenSearch description, so browsers can add the site as a search engine (address-bar search).
 * https://github.com/dewitt/opensearch/blob/master/opensearch-1-1-draft-6.md
 */
export function openSearchResponse(lang: Lang, site: URL): Response {
  const t = ui[lang];
  const abs = (path: string) => new URL(path, site).href;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>${escapeXml(t["site.name"])}</ShortName>
  <Description>${escapeXml(t["seo.search"])}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Language>${locales[lang].bcp47}</Language>
  <Image width="32" height="32" type="image/png">${abs("/favicon-32x32.png")}</Image>
  <Url type="text/html" method="get" template="${abs(sectionPaths.search[lang])}?q={searchTerms}"/>
  <Url type="application/opensearchdescription+xml" rel="self" template="${abs(`${homePath[lang]}opensearch.xml`)}"/>
  <moz:SearchForm>${abs(sectionPaths.search[lang])}</moz:SearchForm>
</OpenSearchDescription>
`;
  return new Response(xml, { headers: { "Content-Type": "application/opensearchdescription+xml; charset=utf-8" } });
}
