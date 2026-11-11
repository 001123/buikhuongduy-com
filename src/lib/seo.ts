import { cvUrl, email, socials } from "../data/profile";
import { homePath, languages, locales, sectionPaths, ui, type Lang } from "../i18n/ui";
import type { PageDates } from "./git-dates";

/** schema.org type of the page itself. */
export type PageType = "WebPage" | "ProfilePage" | "ContactPage" | "CollectionPage" | "SearchResultsPage";

export interface ArticleMeta {
  headline: string;
  publishedTime: Date;
  modifiedTime?: Date;
  tags: string[];
  /** Name of the post's category (`articleSection`). */
  section?: string;
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
  /** Breadcrumb trail after Home, ending with the current page. Defaults to Blog › post on articles. */
  breadcrumbs?: Crumb[];
  /** Paths of the items a CollectionPage lists, in order. */
  itemList?: string[];
  /** When the page was first published and last changed (`dateCreated`/`dateModified`). */
  dates?: PageDates;
}

export interface Crumb {
  name: string;
  path: string;
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

/** KD Labs description per language, worded as on kd.io.vn. */
const kdLabsDescription: Record<Lang, string> = {
  vi: "KD Labs là AI-Native Software & Research Lab sáng lập bởi Bùi Khương Duy — nghiên cứu và phát triển phần mềm tích hợp AI Agent, kiến trúc hệ thống phân tán, hạ tầng Cloud-Native Kubernetes (K8s) và các ứng dụng đề cao quyền riêng tư.",
  en: "KD Labs is an AI-native software and research lab founded by Bui Khuong Duy, building AI-agent software, distributed system architectures, cloud-native Kubernetes infrastructure and privacy-first apps.",
};

/** Remove invisible characters (such as word joiners) that should not reach search snippets. */
export function cleanText(text: string): string {
  return text.replace(/[​-‍⁠﻿]/g, "");
}

/** JSON-LD graph describing the site owner, the bilingual site and the current page. */
export function structuredData(input: StructuredDataInput) {
  const { lang, site, pageUrl, title, description, pageType, image, avatar, article, itemList, dates } = input;
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
    // Sitelinks search box / site search for engines that read it; the search page itself is noindex.
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${abs(sectionPaths.search[lang])}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
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
    ...(dates?.created ? { dateCreated: dates.created.toISOString() } : {}),
    ...(dates?.modified ? { dateModified: dates.modified.toISOString() } : {}),
    ...(pageType === "ProfilePage" ? { mainEntity: { "@id": personId } } : { about: { "@id": personId } }),
  };

  const organization = { ...kdLabs, description: kdLabsDescription[lang], founder: { "@id": personId } };

  const graph: Record<string, unknown>[] = [person, organization, website, page];

  const breadcrumbs =
    input.breadcrumbs ??
    (article ? [{ name: t["nav.blog"], path: sectionPaths.blog[lang] }, { name: article.headline, path: pageUrl.pathname }] : undefined);
  if (breadcrumbs) {
    const breadcrumbId = `${pageUrl.href}#breadcrumb`;
    page.breadcrumb = { "@id": breadcrumbId };
    const crumbs = [{ name: t["nav.home"], path: homePath[lang] }, ...breadcrumbs];
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: abs(crumb.path) })),
    });
  }

  if (itemList && pageType === "CollectionPage") {
    page.mainEntity = {
      "@type": "ItemList",
      numberOfItems: itemList.length,
      itemListElement: itemList.map((path, i) => ({ "@type": "ListItem", position: i + 1, url: abs(path) })),
    };
  }

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
      ...(article.section ? { articleSection: article.section } : {}),
      author: { "@id": personId },
      publisher: { "@id": personId },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
