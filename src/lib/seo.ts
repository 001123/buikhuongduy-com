import { cvUrl, email, socials } from "../data/profile";
import { homePath, languages, locales, ui, type Lang } from "../i18n/ui";

/** schema.org type of the page itself. */
export type PageType = "WebPage" | "ProfilePage" | "ContactPage" | "CollectionPage";

export interface ArticleMeta {
  headline: string;
  publishedTime: Date;
  modifiedTime?: Date;
  tags: string[];
  /** Path of the post's generated OG image. */
  image?: string;
}

interface StructuredDataInput {
  lang: Lang;
  site: URL;
  pageUrl: URL;
  title: string;
  description: string;
  pageType: PageType;
  image: URL;
  avatar: URL;
  article?: ArticleMeta;
}

/** KD Labs, the owner's company. Shares its `@id` with the JSON-LD on kd.io.vn so both sites describe one entity. */
const kdLabs = {
  "@type": "Organization",
  "@id": "https://kd.io.vn/#organization",
  name: "KD Labs",
  url: "https://kd.io.vn/",
  logo: "https://kd.io.vn/assets/branding/kd-labs-icon.png",
  foundingDate: "2026-08",
  sameAs: ["https://github.com/kd-labs-io"],
};

/** Remove invisible characters (such as word joiners) that should not reach search snippets. */
export function cleanText(text: string): string {
  return text.replace(/[​-‍⁠﻿]/g, "");
}

/** JSON-LD graph describing the site owner, the bilingual site and the current page. */
export function structuredData(input: StructuredDataInput) {
  const { lang, site, pageUrl, title, description, pageType, image, avatar, article } = input;
  const t = ui[lang];
  const abs = (path: string) => new URL(path, site).href;
  const personId = abs("/#person");
  const websiteId = abs("/#website");
  const inLanguage = locales[lang].bcp47;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: ui.vi["site.name"],
    alternateName: ui.en["site.name"],
    jobTitle: t["seo.jobTitle"],
    description: t["site.description"],
    url: abs(homePath[lang]),
    image: avatar.href,
    email: `mailto:${email}`,
    nationality: { "@type": "Country", name: "Vietnam" },
    knowsLanguage: (Object.keys(languages) as Lang[]).map((l) => locales[l].bcp47),
    knowsAbout: ["Front-end engineering", "React", "Next.js", "TypeScript", "AI agents", "DevOps", "Kubernetes"],
    sameAs: [...socials.map((s) => s.href), cvUrl, "https://kd.io.vn/", "https://github.com/kd-labs-io"],
    worksFor: { "@id": kdLabs["@id"] },
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: abs("/"),
    name: ui.vi["site.name"],
    alternateName: ui.en["site.name"],
    description: t["site.description"],
    inLanguage: (Object.keys(languages) as Lang[]).map((l) => locales[l].bcp47),
    publisher: { "@id": personId },
  };

  const page: Record<string, unknown> = {
    "@type": pageType,
    "@id": `${pageUrl.href}#webpage`,
    url: pageUrl.href,
    name: title,
    description,
    inLanguage,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: image.href,
    ...(pageType === "ProfilePage" ? { mainEntity: { "@id": personId } } : { about: { "@id": personId } }),
  };

  const organization = { ...kdLabs, founder: { "@id": personId } };

  const graph: Record<string, unknown>[] = [person, organization, website, page];

  if (article) {
    graph.push({
      "@type": "BlogPosting",
      "@id": `${pageUrl.href}#article`,
      headline: article.headline,
      description,
      inLanguage,
      url: pageUrl.href,
      mainEntityOfPage: { "@id": page["@id"] },
      image: image.href,
      datePublished: article.publishedTime.toISOString(),
      dateModified: (article.modifiedTime ?? article.publishedTime).toISOString(),
      keywords: article.tags,
      author: { "@id": personId },
      publisher: { "@id": personId },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
