import type { Lang } from "../i18n/ui";

/**
 * Blog categories: a small, fixed set of topics. Each post belongs to at most one.
 *
 * Slugs are English, lowercase kebab-case and shared by both languages
 * (`/blog/category/react/` ↔ `/en/blog/category/react/`). Do not rename a slug
 * once published; if you must, add a 301 in `public/_redirects`.
 *
 * Kept free of `astro:content` imports so `content.config.ts` and `astro.config.mjs` can use it.
 */
export const categorySlugs = ["ai", "react", "nextjs", "typescript", "astro", "performance", "devops", "web-platform", "frontend-system-design"] as const;

export type CategorySlug = (typeof categorySlugs)[number];

/** Category pages with fewer posts than this are `noindex, follow` and left out of the sitemap. */
export const categoryIndexMinPosts = 2;

interface CategoryCopy {
  /** Short label for chips and breadcrumbs. */
  name: string;
  /** Page title and H1; aims at the search phrase. */
  title: string;
  /** Meta description, unique per category. */
  description: string;
  /** Intro paragraph shown above the post list. */
  intro: string;
}

export const categories: Record<CategorySlug, Record<Lang, CategoryCopy>> = {
  ai: {
    vi: {
      name: "AI",
      title: "Bài viết về AI và AI agents",
      description: "Ghi chép của Bùi Khương Duy về AI-native, AI agents và coding agent: cách thiết kế sản phẩm quanh AI và làm việc cùng agent mỗi ngày.",
      intro: "AI-native, coding agent và cách làm việc cùng AI trong thực tế: những gì mình thử, công cụ mình làm ra và bài học rút ra khi đưa agent vào quy trình phát triển phần mềm.",
    },
    en: {
      name: "AI",
      title: "Articles on AI and AI Agents",
      description: "Bui Khuong Duy's notes on AI-native products, AI agents and coding agents: designing around AI and working with agents every day.",
      intro: "AI-native products, coding agents and working with AI in practice: what I have tried, the tools I have built and the lessons from bringing agents into software development.",
    },
  },
  react: {
    vi: {
      name: "React",
      title: "Bài viết về React",
      description: "Bài viết về React của Bùi Khương Duy: kiến trúc component, quản lý state, hiệu năng và kinh nghiệm thực tế sau hơn 9 năm làm frontend.",
      intro: "Kiến trúc component, quản lý state, hiệu năng và những pattern mình dùng khi xây ứng dụng React ở quy mô thật.",
    },
    en: {
      name: "React",
      title: "React Articles",
      description: "React articles by Bui Khuong Duy: component architecture, state management, performance and hands-on lessons from 9+ years of front-end work.",
      intro: "Component architecture, state management, performance and the patterns I rely on when building React apps at real-world scale.",
    },
  },
  nextjs: {
    vi: {
      name: "Next.js",
      title: "Bài viết về Next.js",
      description: "Bài viết về Next.js của Bùi Khương Duy: App Router, rendering, caching, SEO và triển khai ứng dụng Next.js lên production.",
      intro: "App Router, các chế độ rendering, caching, SEO và kinh nghiệm đưa ứng dụng Next.js lên production.",
    },
    en: {
      name: "Next.js",
      title: "Next.js Articles",
      description: "Next.js articles by Bui Khuong Duy: the App Router, rendering, caching, SEO and shipping Next.js apps to production.",
      intro: "The App Router, rendering modes, caching, SEO and what I have learned shipping Next.js apps to production.",
    },
  },
  typescript: {
    vi: {
      name: "TypeScript",
      title: "Bài viết về TypeScript",
      description: "Bài viết về TypeScript của Bùi Khương Duy: thiết kế type, generic, kiểm tra kiểu an toàn và cách giữ codebase lớn dễ bảo trì.",
      intro: "Thiết kế type, generic và những cách giúp codebase TypeScript lớn vẫn an toàn, dễ đọc và dễ bảo trì.",
    },
    en: {
      name: "TypeScript",
      title: "TypeScript Articles",
      description: "TypeScript articles by Bui Khuong Duy: type design, generics, type safety and keeping large codebases maintainable.",
      intro: "Type design, generics and the habits that keep a large TypeScript codebase safe, readable and maintainable.",
    },
  },
  astro: {
    vi: {
      name: "Astro",
      title: "Bài viết về Astro",
      description: "Bài viết về Astro của Bùi Khương Duy: dựng trang tĩnh nhanh, content collections, island architecture và kinh nghiệm làm trang cá nhân bằng Astro.",
      intro: "Trang cá nhân này được dựng bằng Astro. Ở đây mình ghi lại lý do chọn Astro, cách dùng content collections, island và những gì học được trong quá trình làm.",
    },
    en: {
      name: "Astro",
      title: "Astro Articles",
      description: "Astro articles by Bui Khuong Duy: fast static sites, content collections, island architecture and lessons from building a personal site with Astro.",
      intro: "This site is built with Astro. Here I write about why I chose it, how I use content collections and islands, and what I learned along the way.",
    },
  },
  performance: {
    vi: {
      name: "Hiệu năng",
      title: "Bài viết về hiệu năng web",
      description: "Bài viết về hiệu năng web của Bùi Khương Duy: Core Web Vitals, Lighthouse, tối ưu font, ảnh, CSS và JavaScript cho trang tải nhanh.",
      intro: "Core Web Vitals, Lighthouse và các kỹ thuật cụ thể để trang tải nhanh trên mạng chậm: font, ảnh, CSS, JavaScript và những thứ chặn render.",
    },
    en: {
      name: "Performance",
      title: "Web Performance Articles",
      description: "Web performance articles by Bui Khuong Duy: Core Web Vitals, Lighthouse, and optimizing fonts, images, CSS and JavaScript for fast pages.",
      intro: "Core Web Vitals, Lighthouse and concrete techniques for pages that load fast on slow networks: fonts, images, CSS, JavaScript and render-blocking resources.",
    },
  },
  devops: {
    vi: {
      name: "DevOps",
      title: "Bài viết về DevOps và CI/CD",
      description: "Bài viết về DevOps của Bùi Khương Duy: CI/CD, GitHub Actions, Cloudflare, Kubernetes và cách build, deploy nhanh mà vẫn ổn định.",
      intro: "CI/CD, GitHub Actions, Cloudflare và Kubernetes: cách mình build và deploy nhanh, gọn mà vẫn ổn định.",
    },
    en: {
      name: "DevOps",
      title: "DevOps and CI/CD Articles",
      description: "DevOps articles by Bui Khuong Duy: CI/CD, GitHub Actions, Cloudflare, Kubernetes and fast, reliable builds and deploys.",
      intro: "CI/CD, GitHub Actions, Cloudflare and Kubernetes: how I keep builds and deploys fast, lean and reliable.",
    },
  },
  "web-platform": {
    vi: {
      name: "Web Platform",
      title: "Bài viết về Web Platform",
      description: "Bài viết về Web Platform của Bùi Khương Duy: API mới của trình duyệt, tiêu chuẩn web, bảo mật và cách áp dụng chúng vào ứng dụng thật.",
      intro: "API mới của trình duyệt, tiêu chuẩn web và tính năng bảo mật: mình đọc, thử và ghi lại cách đưa chúng vào ứng dụng thật.",
    },
    en: {
      name: "Web Platform",
      title: "Web Platform Articles",
      description: "Web Platform articles by Bui Khuong Duy: new browser APIs, web standards, security features and how to apply them in real apps.",
      intro: "New browser APIs, web standards and security features: what I read, try out and how to bring them into real apps.",
    },
  },
  "frontend-system-design": {
    vi: {
      name: "Front-end System Design",
      title: "Bài viết về Front-end System Design",
      description: "Bài viết về Front-end System Design của Bùi Khương Duy: kiến trúc rendering, quản lý state, mạng và real-time, hiệu năng, độ tin cậy và bảo mật phía client.",
      intro: "Cách thiết kế một ứng dụng frontend từ yêu cầu đến kiến trúc: rendering, state, mạng, hiệu năng, độ tin cậy và bảo mật. Hữu ích cho cả phỏng vấn system design lẫn dự án thật.",
    },
    en: {
      name: "Front-end System Design",
      title: "Front-end System Design Articles",
      description: "Front-end system design articles by Bui Khuong Duy: rendering, state management, networking, real-time, performance, reliability and client-side security.",
      intro: "How to design a front-end app from requirements to architecture: rendering, state, networking, performance, reliability and security. Useful for system design interviews and real projects alike.",
    },
  },
};
