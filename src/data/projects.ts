import type { Lang } from "../i18n/ui";

export type ProjectCategory = "open-source" | "production";

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  org: string;
  period: string;
  role?: string;
  impact?: string;
  summary: string;
  tags: string[];
  href?: string;
  linkLabel?: string;
  links?: { label: string; href: string }[];
}

export const projects: Record<Lang, Project[]> = {
  vi: [
    {
      id: "kd-code",
      name: "KD Code",
      category: "open-source",
      org: "KD Labs",
      period: "11/2026 – nay",
      role: "Tác giả · Mã nguồn mở (MIT)",
      impact: "VS Code & Open VSX",
      summary:
        "Extension VS Code mã nguồn mở để chat và điều phối nhiều coding agent (Claude, Codex, OpenCode) qua Agent Client Protocol, có so sánh Best-of-N trên Git worktree riêng.",
      tags: ["TypeScript", "VS Code API", "ACP", "Git Worktrees"],
      href: "https://marketplace.visualstudio.com/items?itemName=kd-labs.kd-code",
      linkLabel: "Marketplace ↗",
    },
    {
      id: "simple-otp",
      name: "Simple OTP",
      category: "open-source",
      org: "KD Labs",
      period: "10/2026 – nay",
      role: "Tác giả · Mã nguồn mở (MIT)",
      impact: "App Store · Zero-Network",
      summary:
        "Ứng dụng 2FA mã nguồn mở, không kết nối mạng, cho iOS và Android. Mã hoá bằng AES-256-GCM trong Keychain/Keystore, hỗ trợ TOTP/HOTP và quét QR.",
      tags: ["iOS", "Android", "AES-256-GCM", "TOTP/HOTP"],
      href: "https://github.com/kd-labs-io/simple-otp",
      linkLabel: "GitHub ↗",
    },
    {
      id: "saladin",
      name: "Saladin",
      category: "production",
      org: "10X Consulting & Technology",
      period: "2021 – 2025",
      role: "Frontend Web Developer",
      impact: "2M+ khách hàng · 7 nhà bảo hiểm",
      summary:
        "Nền tảng bảo hiểm một cửa với hơn 10 sản phẩm từ 7 hãng bảo hiểm lớn. Dựng Storybook design system từ đầu, tích hợp MoMo, ZaloPay, Payoo, OnePay, Viettel Money và chạy CI/CD trên Kubernetes.",
      tags: ["Next.js SSR", "TypeScript", "Storybook", "Kubernetes"],
      href: "https://www.saladin.vn",
      linkLabel: "saladin.vn ↗",
    },
    {
      id: "hellobacsi-hellosehat",
      name: "HelloBacsi & HelloSehat",
      category: "production",
      org: "Hello Health Group",
      period: "2020 – 2021",
      role: "Senior Web Developer",
      impact: "30M+ lượt xem/tháng · < 2s",
      summary:
        "Chuyển đổi 9 trang sức khoẻ từ WordPress sang Next.js SSR trong 2 tháng (giảm tải từ 4–5s xuống dưới 2s). Xây trình dựng chatbot React Flow, ads manager Vue.js kéo thả, trình biên tập React và symptom checker.",
      tags: ["Next.js SSR", "React Flow", "Vue.js", "TypeScript"],
      links: [
        { label: "hellobacsi.com", href: "https://hellobacsi.com/" },
        { label: "hellosehat.com", href: "https://hellosehat.com/" },
      ],
    },
    {
      id: "afd-platform",
      name: "Multi-Tenant CMS & AI Content Engine",
      category: "production",
      org: "AFD - Marketing Agency",
      period: "2025 – 2026",
      role: "Front-End Lead (Đội 10 người)",
      impact: "3 sản phẩm / 6 tháng · Triệu lượt truy cập",
      summary:
        "Kiến trúc Next.js multi-tenant trên Contentful + GraphQL typed và micro-frontends để marketing tự mở brand site mới không cần dev. Tích hợp AI Content Engine dùng LLM xuất bản lên Contentful, vận hành trên Cloudflare và AWS Terraform.",
      tags: ["Next.js", "GraphQL", "Micro-frontends", "Contentful", "LLM APIs"],
    },
    {
      id: "sutrix-enterprise",
      name: "Enterprise Telecom & Mobile Apps",
      category: "production",
      org: "Sutrix Group",
      period: "2018 – 2019",
      role: "Senior JavaScript Developer",
      impact: "10M+ lượt tải · 25M+ views/tháng",
      summary:
        "Component tái sử dụng trên Adobe Experience Manager (AEM) cho website viễn thông (mua máy, đăng ký SIM) đạt 25 triệu lượt xem/tháng và 2 ứng dụng mobile doanh nghiệp (Angular/Cordova, NativeScript Vue/React) với một app vượt 10 triệu lượt tải.",
      tags: ["AEM", "NativeScript", "Angular", "Cordova"],
    },
    {
      id: "kd-labs",
      name: "KD Labs (kd.io.vn)",
      category: "open-source",
      org: "KD Labs",
      period: "08/2026 – nay",
      role: "Founder · R&D",
      impact: "12 bài nghiên cứu kỹ thuật",
      summary:
        "Trang chủ KD Labs, tổng hợp các sản phẩm mã nguồn mở, kiến trúc micro-frontend với GraphQL và nghiên cứu chuyên sâu về AI agent, bảo mật di động và mật mã học.",
      tags: ["Astro", "Micro-frontends", "GraphQL", "R&D"],
      href: "https://kd.io.vn",
      linkLabel: "kd.io.vn ↗",
    },
    {
      id: "onbai-online",
      name: "Onbai Online",
      category: "open-source",
      org: "Open Source",
      period: "2021 – 2022",
      role: "Tác giả · Mã nguồn mở",
      impact: "Realtime Web App",
      summary: "Web app thời gian thực để cùng bạn bè ôn luyện kiến thức trực tuyến.",
      tags: ["Realtime", "Web", "Open Source"],
      href: "https://github.com/onbai-oss",
      linkLabel: "GitHub ↗",
    },
  ],
  en: [
    {
      id: "kd-code",
      name: "KD Code",
      category: "open-source",
      org: "KD Labs",
      period: "Nov 2026 – Present",
      role: "Creator · Open Source (MIT)",
      impact: "VS Code & Open VSX",
      summary:
        "Open-source VS Code extension to chat with and orchestrate coding agents (Claude, Codex, OpenCode) over the Agent Client Protocol, with Best-of-N comparison in isolated Git worktrees.",
      tags: ["TypeScript", "VS Code API", "ACP", "Git Worktrees"],
      href: "https://marketplace.visualstudio.com/items?itemName=kd-labs.kd-code",
      linkLabel: "Marketplace ↗",
    },
    {
      id: "simple-otp",
      name: "Simple OTP",
      category: "open-source",
      org: "KD Labs",
      period: "Oct 2026 – Present",
      role: "Creator · Open Source (MIT)",
      impact: "App Store · Zero-Network",
      summary:
        "Open-source, zero-network 2FA app for iOS and Android. Secrets are encrypted with AES-256-GCM in Keychain/Keystore, with TOTP/HOTP and QR import.",
      tags: ["iOS", "Android", "AES-256-GCM", "TOTP/HOTP"],
      href: "https://github.com/kd-labs-io/simple-otp",
      linkLabel: "GitHub ↗",
    },
    {
      id: "saladin",
      name: "Saladin",
      category: "production",
      org: "10X Consulting & Technology",
      period: "2021 – 2025",
      role: "Frontend Web Developer",
      impact: "2M+ customers · 7 insurers",
      summary:
        "One-stop insurtech platform offering 10+ products from 7 major insurers. Built the Storybook design system from scratch, integrated MoMo, ZaloPay, Payoo, OnePay, and Viettel Money, and shipped CI/CD on Kubernetes.",
      tags: ["Next.js SSR", "TypeScript", "Storybook", "Kubernetes"],
      href: "https://www.saladin.vn",
      linkLabel: "saladin.vn ↗",
    },
    {
      id: "hellobacsi-hellosehat",
      name: "HelloBacsi & HelloSehat",
      category: "production",
      org: "Hello Health Group",
      period: "2020 – 2021",
      role: "Senior Web Developer",
      impact: "30M+ monthly views · < 2s",
      summary:
        "Migrated 9 regional healthcare sites from WordPress to Next.js SSR in 2 months (cutting load time from 4–5s to under 2s). Also built a React Flow chatbot builder, Vue.js drag-and-drop ads manager, React content editor, and symptom checker.",
      tags: ["Next.js SSR", "React Flow", "Vue.js", "TypeScript"],
      links: [
        { label: "hellobacsi.com", href: "https://hellobacsi.com/" },
        { label: "hellosehat.com", href: "https://hellosehat.com/" },
      ],
    },
    {
      id: "afd-platform",
      name: "Multi-Tenant CMS & AI Content Engine",
      category: "production",
      org: "AFD - Marketing Agency",
      period: "2025 – 2026",
      role: "Front-End Lead (Team of 10)",
      impact: "3 products / 6 mos · Millions of visits",
      summary:
        "Multi-tenant Next.js + Contentful + typed GraphQL platform and micro-frontend architecture letting marketing launch brand sites without developers. Paired with an internal LLM-powered AI Content Engine, Cloudflare CDN, and AWS Terraform.",
      tags: ["Next.js", "GraphQL", "Micro-frontends", "Contentful", "LLM APIs"],
    },
    {
      id: "sutrix-enterprise",
      name: "Enterprise Telecom & Mobile Apps",
      category: "production",
      org: "Sutrix Group",
      period: "2018 – 2019",
      role: "Senior JavaScript Developer",
      impact: "10M+ downloads · 25M+ monthly views",
      summary:
        "Reusable Adobe Experience Manager (AEM) components for a telecom storefront (device purchase & SIM registration) serving 25M+ monthly views, plus 2 enterprise mobile apps (Angular/Cordova & NativeScript Vue/React) with one exceeding 10M+ Google Play downloads.",
      tags: ["AEM", "NativeScript", "Angular", "Cordova"],
    },
    {
      id: "kd-labs",
      name: "KD Labs (kd.io.vn)",
      category: "open-source",
      org: "KD Labs",
      period: "Aug 2026 – Present",
      role: "Founder · R&D",
      impact: "12 technical articles",
      summary:
        "KD Labs homepage bringing together open-source products, micro-frontend & typed GraphQL architecture, and 12 technical articles on AI agents, mobile security, and cryptography.",
      tags: ["Astro", "Micro-frontends", "GraphQL", "R&D"],
      href: "https://kd.io.vn",
      linkLabel: "kd.io.vn ↗",
    },
    {
      id: "onbai-online",
      name: "Onbai Online",
      category: "open-source",
      org: "Open Source",
      period: "2021 – 2022",
      role: "Creator · Open Source",
      impact: "Realtime Web App",
      summary: "Realtime web app for practicing knowledge online with friends.",
      tags: ["Realtime", "Web", "Open Source"],
      href: "https://github.com/onbai-oss",
      linkLabel: "GitHub ↗",
    },
  ],
};
