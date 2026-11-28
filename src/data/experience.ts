import type { Lang } from "../i18n/ui";

export interface ExperienceItem {
  id: string;
  period: string;
  duration: string;
  role: string;
  org: string;
  orgUrl?: string;
  workMode?: string;
  teamSize: string;
  isCurrent?: boolean;
  summary: string;
  metrics: string[];
  highlights: string[];
  outcomes: string[];
  tech: string[];
}

export interface RecognitionItem {
  period: string;
  title: string;
  issuer: string;
  note?: string;
  href?: string;
}

export const experiences: Record<Lang, ExperienceItem[]> = {
  vi: [
    {
      id: "kd-labs",
      period: "08/2026 – nay",
      duration: "Hiện tại",
      role: "Founder",
      org: "KD Labs",
      orgUrl: "https://kd.io.vn",
      teamSize: "Solo",
      isCurrent: true,
      summary: "Sáng lập lab R&D theo hướng AI-native, thiết kế và phát hành các công cụ mã nguồn mở cho lập trình viên và bảo mật cá nhân.",
      metrics: ["2 sản phẩm MIT", "12 bài viết kỹ thuật", "VS Code & App Store"],
      highlights: [
        "Xây dựng KD Code, extension VS Code điều phối nhiều coding agent (Claude, Codex, OpenCode) qua ACP với Best-of-N trên Git worktree riêng và rà diff song song.",
        "Xây dựng Simple OTP, ứng dụng 2FA không kết nối mạng cho iOS và Android, mã hoá bằng AES-256-GCM trong Keychain/Keystore.",
        "Tổ chức sản phẩm web của lab theo kiến trúc micro-frontend triển khai độc lập, dùng chung design system và lớp GraphQL API typed.",
      ],
      outcomes: [
        "Phát hành 2 sản phẩm mã nguồn mở (MIT): KD Code trên VS Code Marketplace / Open VSX và Simple OTP trên App Store.",
        "Xuất bản 12 bài viết kỹ thuật về AI agent, bảo mật di động và mật mã học tại kd.io.vn.",
      ],
      tech: ["TypeScript", "GraphQL", "Micro-frontends", "VS Code API", "ACP", "iOS / Android", "AES-256-GCM", "Astro"],
    },
    {
      id: "afd",
      period: "04/2025 – 08/2026",
      duration: "1 năm 4 tháng",
      role: "Front-End Lead",
      org: "AFD - Marketing Agency",
      workMode: "On-Site & Remote",
      teamSize: "Đội 10 người",
      summary: "Dẫn dắt đội frontend 10 người về kiến trúc, lập kế hoạch, review code và chuẩn hoá quy trình phát triển AI-native cho toàn team.",
      metrics: ["3 sản phẩm / 6 tháng", "Triệu lượt truy cập/tháng", "Đội 10 người"],
      highlights: [
        "Thiết kế nền tảng multi-tenant trên Contentful: một codebase Next.js phục vụ nhiều brand site với theme riêng và trang lắp ghép từ block CMS.",
        "Xây dựng tầng dữ liệu nội dung bằng GraphQL typed queries và kiến trúc micro-frontend để 10 dev phát triển, triển khai độc lập song song.",
        "Phát triển AI Content Engine nội bộ dùng LLM APIs để sinh và xuất bản nội dung tiếp thị thẳng lên Contentful; chuẩn hoá Claude Code (CLAUDE.md, skills, MCP) cho cả team.",
        "Triển khai dự án trên Strapi, đánh giá Payload CMS cho phương án self-hosted, tối ưu Cloudflare CDN và hạ tầng AWS bằng Terraform.",
      ],
      outcomes: [
        "Hoàn thành 3 sản phẩm (nền tảng web, mobile app, AI Content Engine) trong 6 tháng cùng đội 10 lập trình viên.",
        "Giúp đội marketing tự mở brand site mới từ CMS không cần dev can thiệp; vận hành hệ thống đạt hàng triệu lượt truy cập mỗi tháng.",
      ],
      tech: ["Next.js", "TypeScript", "GraphQL", "Micro-frontends", "Contentful", "Strapi", "Payload CMS", "LLM APIs", "Cloudflare", "AWS", "Terraform", "Claude Code"],
    },
    {
      id: "10x-saladin",
      period: "08/2021 – 04/2025",
      duration: "3 năm 8 tháng",
      role: "Frontend Web Developer",
      org: "10X Consulting & Technology Ltd",
      orgUrl: "https://www.saladin.vn",
      teamSize: "Đội 10 người",
      summary: "Xây dựng Saladin, nền tảng bảo hiểm một cửa, làm việc trực tiếp với CEO và Product Manager từ kiến trúc frontend đến triển khai production.",
      metrics: ["2M+ khách hàng", "10+ sản phẩm / 7 hãng", "5 cổng thanh toán"],
      highlights: [
        "Thiết kế design system từ đầu bằng Storybook, đóng gói package dùng chung và thiết lập boilerplate chuẩn (ESLint, conventions) cho toàn bộ dự án.",
        "Tích hợp 5 cổng thanh toán lớn tại Việt Nam: MoMo, ZaloPay, Payoo, OnePay và Viettel Money; tối ưu tốc độ tải bằng code splitting, lazy loading và CDN.",
        "Phối hợp DevOps dựng pipeline CI/CD, tối ưu Dockerfile, chuyển dịch vụ từ Jenkins sang Kubernetes và viết công cụ Node.js nội bộ.",
      ],
      outcomes: [
        "Saladin đạt hơn 2 triệu khách hàng với hơn 10 sản phẩm bảo hiểm từ 7 nhà bảo hiểm (Bảo Việt, Bảo Minh, Liberty, MSIG, PVI, VNI, BSH).",
        "Bàn giao bộ công cụ admin nội bộ phục vụ vận hành hằng ngày cho nhân sự và đối tác.",
      ],
      tech: ["Next.js (SSR)", "React", "TypeScript", "Vite", "React Query", "Zustand", "TailwindCSS", "Storybook", "Docker", "Kubernetes", "CI/CD"],
    },
    {
      id: "hello-health",
      period: "01/2020 – 05/2021",
      duration: "1 năm 4 tháng",
      role: "Senior Web Developer",
      org: "Hello Health Group",
      teamSize: "Đội 8 người",
      summary: "Chuyển đổi nền tảng web sức khoẻ lưu lượng lớn sang Next.js SSR và xây dựng loạt công cụ vận hành nội bộ cho marketing, content và data.",
      metrics: ["30M+ lượt xem/tháng", "9 site trong 2 tháng", "Tải trang < 2s"],
      highlights: [
        "Cùng frontend lead và backend team chuyển 9 trang sức khoẻ khu vực (HelloBacsi, HelloSehat) từ WordPress sang Next.js SSR chỉ trong 2 tháng.",
        "Xây trình dựng chatbot động bằng React + React Flow giúp đội marketing tự thiết kế chiến dịch không cần dev.",
        "Phát triển trình quản lý quảng cáo kéo thả (Vue.js), trình biên tập nội dung (React) và công cụ symptom checker phối hợp cùng team Data.",
      ],
      outcomes: [
        "Giảm thời gian tải trang từ 4–5 giây xuống dưới 2 giây; HelloBacsi và HelloSehat đạt hơn 30 triệu lượt xem trang mỗi tháng.",
        "Rút ngắn đáng kể thời gian ra mắt chiến dịch chatbot và quy trình xuất bản bài viết.",
      ],
      tech: ["Next.js (SSR)", "React", "Vue.js", "TypeScript", "Webpack", "React Flow", "WordPress", "PHP", "Go"],
    },
    {
      id: "sutrix",
      period: "08/2018 – 10/2019",
      duration: "1 năm 2 tháng",
      role: "Senior JavaScript Developer",
      org: "Sutrix Group",
      teamSize: "Đội 20+ người",
      summary: "Phát triển ứng dụng mobile doanh nghiệp đa nền tảng và hệ thống component cho website viễn thông lưu lượng cực lớn.",
      metrics: ["10M+ lượt tải app", "25M+ views/tháng", "2 ứng dụng doanh nghiệp"],
      highlights: [
        "Phát triển ứng dụng bán hàng hybrid với Angular + Cordova; nghiên cứu và áp dụng NativeScript (Vue.js, React) xây app iOS/Android cho khách hàng lớn tại Philippines.",
        "Xây dựng các component tái sử dụng trên Adobe Experience Manager (AEM) cho luồng mua điện thoại và đăng ký SIM.",
        "Hướng dẫn 2 thực tập sinh trở thành thành viên chính thức và tổ chức các buổi chia sẻ kỹ thuật frontend cho team.",
      ],
      outcomes: [
        "Ra mắt 2 ứng dụng mobile doanh nghiệp, trong đó một app vượt mốc 10 triệu lượt tải trên Google Play.",
        "Component AEM vận hành trên website viễn thông phục vụ 25 triệu lượt xem mỗi tháng.",
      ],
      tech: ["Angular", "Cordova", "NativeScript", "Vue.js", "React", "Adobe Experience Manager", "Java"],
    },
    {
      id: "maple-studio",
      period: "10/2017 – 08/2018",
      duration: "10 tháng",
      role: "Junior Web Developer",
      org: "Maple Studio",
      teamSize: "Đội 4 người",
      summary: "Xây dựng landing page responsive, tuỳ biến theme thương mại điện tử và tối ưu tốc độ tải trang cho khách hàng.",
      metrics: ["10+ theme đã giao", "100% đúng tiến độ"],
      highlights: [
        "Chuyển thiết kế PSD và Illustrator thành landing page responsive, mobile-first và theme WordPress tuỳ biến.",
        "Tuỳ biến theme Shopify, Haravan theo đúng thiết kế, tối ưu tốc độ tải và viết công cụ Node.js nội bộ tăng tốc quy trình.",
      ],
      outcomes: ["Hoàn thành hơn 10 theme WordPress, Shopify và Haravan đúng hạn."],
      tech: ["HTML", "CSS", "JavaScript", "WordPress", "Shopify", "Haravan", "Node.js"],
    },
  ],
  en: [
    {
      id: "kd-labs",
      period: "Aug 2026 – Present",
      duration: "Current",
      role: "Founder",
      org: "KD Labs",
      orgUrl: "https://kd.io.vn",
      teamSize: "Solo",
      isCurrent: true,
      summary: "Founded an AI-native R&D lab designing and shipping open-source developer tools and privacy-first productivity apps.",
      metrics: ["2 MIT products", "12 technical articles", "VS Code & App Store"],
      highlights: [
        "Built KD Code, a VS Code extension orchestrating multiple coding agents (Claude, Codex, OpenCode) over ACP with Best-of-N runs in isolated Git worktrees and side-by-side diff review.",
        "Built Simple OTP, a zero-network 2FA app for iOS and Android encrypted with AES-256-GCM in Keychain/Keystore.",
        "Structured the lab's web products as independently deployable micro-frontends sharing one design system and a typed GraphQL API layer.",
      ],
      outcomes: [
        "Shipped 2 open-source products (MIT): KD Code on VS Code Marketplace and Open VSX, Simple OTP on the App Store.",
        "Published 12 technical articles on AI agents, mobile security, and cryptography at kd.io.vn.",
      ],
      tech: ["TypeScript", "GraphQL", "Micro-frontends", "VS Code API", "ACP", "iOS / Android", "AES-256-GCM", "Astro"],
    },
    {
      id: "afd",
      period: "Apr 2025 – Aug 2026",
      duration: "1 yr 4 mos",
      role: "Front-End Lead",
      org: "AFD - Marketing Agency",
      workMode: "On-Site & Remote",
      teamSize: "Team of 10",
      summary: "Led a 10-developer frontend team across architecture, planning, code reviews, and team-wide AI-native engineering workflows.",
      metrics: ["3 products in 6 mos", "Millions of visits/mo", "Led 10 developers"],
      highlights: [
        "Architected a dynamic multi-tenant platform on Contentful: one Next.js codebase serving multiple brand sites with per-tenant theming and CMS-composed pages.",
        "Built a typed GraphQL data layer and micro-frontend shell so 10 engineers could develop and release independently in parallel.",
        "Built an internal LLM-powered AI Content Engine publishing directly to Contentful, and standardized Claude Code (CLAUDE.md, custom skills, MCP) with human review across the team.",
        "Delivered Strapi projects, evaluated Payload CMS for self-hosted needs, served millions of visits via Cloudflare CDN, and managed AWS with Terraform.",
      ],
      outcomes: [
        "Delivered 3 products (web platform, mobile app, AI Content Engine) in 6 months while leading a team of 10.",
        "Turned new brand site launches from a developer project into a CMS task while scaling traffic to millions of monthly visits.",
      ],
      tech: ["Next.js", "TypeScript", "GraphQL", "Micro-frontends", "Contentful", "Strapi", "Payload CMS", "LLM APIs", "Cloudflare", "AWS", "Terraform", "Claude Code"],
    },
    {
      id: "10x-saladin",
      period: "Aug 2021 – Apr 2025",
      duration: "3 yrs 8 mos",
      role: "Frontend Web Developer",
      org: "10X Consulting & Technology Ltd",
      orgUrl: "https://www.saladin.vn",
      teamSize: "Team of 10",
      summary: "Built Saladin, a one-stop insurtech platform, partnering directly with the CEO and PMs from frontend architecture to Kubernetes delivery.",
      metrics: ["2M+ customers", "10+ products / 7 insurers", "5 payment gateways"],
      highlights: [
        "Designed and built the Storybook design system from scratch, shared internal packages, and project boilerplates with consistent ESLint rules.",
        "Integrated 5 major Vietnamese payment gateways (MoMo, ZaloPay, Payoo, OnePay, Viettel Money) and tuned loading performance via code splitting, lazy loading, and CDN.",
        "Partnered with DevOps on CI/CD pipelines, Dockerfile optimization, Jenkins-to-Kubernetes migration, and internal Node.js tooling.",
      ],
      outcomes: [
        "Grew Saladin to 2M+ customers offering 10+ insurance products across 7 insurers (Bao Viet, Bao Minh, Liberty, MSIG, PVI, VNI, BSH).",
        "Delivered internal admin tools used daily by operations staff and partners.",
      ],
      tech: ["Next.js (SSR)", "React", "TypeScript", "Vite", "React Query", "Zustand", "TailwindCSS", "Storybook", "Docker", "Kubernetes", "CI/CD"],
    },
    {
      id: "hello-health",
      period: "Jan 2020 – May 2021",
      duration: "1 yr 4 mos",
      role: "Senior Web Developer",
      org: "Hello Health Group",
      teamSize: "Team of 8",
      summary: "Migrated high-traffic regional healthcare platforms to Next.js SSR and built internal workflow tools for marketing, editorial, and data teams.",
      metrics: ["30M+ monthly views", "9 sites in 2 mos", "< 2s load time"],
      highlights: [
        "Migrated 9 WordPress healthcare sites (including HelloBacsi and HelloSehat) to Next.js SSR in 2 months alongside the frontend lead and backend team.",
        "Built a dynamic React Flow chatbot builder empowering marketing to design and launch campaigns without developer intervention.",
        "Built a Vue.js drag-and-drop ads manager, React content editor, and internal symptom checker with the Data team.",
      ],
      outcomes: [
        "Cut page load time from 4–5s to under 2s while HelloBacsi and HelloSehat scaled past 30M+ monthly page views.",
        "Accelerated marketing campaign launches and streamlined editorial publishing.",
      ],
      tech: ["Next.js (SSR)", "React", "Vue.js", "TypeScript", "Webpack", "React Flow", "WordPress", "PHP", "Go"],
    },
    {
      id: "sutrix",
      period: "Aug 2018 – Oct 2019",
      duration: "1 yr 2 mos",
      role: "Senior JavaScript Developer",
      org: "Sutrix Group",
      teamSize: "Team of 20+",
      summary: "Shipped cross-platform enterprise mobile apps and reusable Adobe Experience Manager components for high-traffic telecom web properties.",
      metrics: ["10M+ downloads", "25M+ monthly views", "2 enterprise apps"],
      highlights: [
        "Maintained a hybrid sales app with Angular and Cordova; adopted NativeScript (Vue.js, React) to deliver a native iOS & Android app for a major Philippines enterprise client.",
        "Built reusable Adobe Experience Manager (AEM) components for phone purchase and SIM registration flows.",
        "Mentored 2 interns into full team members and ran internal frontend tech-sharing sessions.",
      ],
      outcomes: [
        "Shipped 2 enterprise mobile apps, with one surpassing 10M+ downloads on Google Play.",
        "Delivered telecom AEM components serving 25M+ monthly views.",
      ],
      tech: ["Angular", "Cordova", "NativeScript", "Vue.js", "React", "Adobe Experience Manager", "Java"],
    },
    {
      id: "maple-studio",
      period: "Oct 2017 – Aug 2018",
      duration: "10 mos",
      role: "Junior Web Developer",
      org: "Maple Studio",
      teamSize: "Team of 4",
      summary: "Built responsive landing pages, customized e-commerce themes, and automated frontend workflows for client websites.",
      metrics: ["10+ themes delivered", "100% on schedule"],
      highlights: [
        "Converted PSD and Illustrator designs into mobile-first responsive landing pages and custom WordPress themes.",
        "Customized Shopify and Haravan themes, optimized page speed, and built internal Node.js workflow tools.",
      ],
      outcomes: ["Delivered 10+ themes across WordPress, Shopify, and Haravan on schedule."],
      tech: ["HTML", "CSS", "JavaScript", "WordPress", "Shopify", "Haravan", "Node.js"],
    },
  ],
};

export const certifications: Record<Lang, RecognitionItem[]> = {
  vi: [
    {
      period: "HackerRank",
      title: "Frontend Developer (React) Certificate",
      issuer: "HackerRank",
      href: "https://www.hackerrank.com/certificates/2f18023e9707",
    },
    {
      period: "HackerRank",
      title: "Software Engineer Certificate",
      issuer: "HackerRank",
      href: "https://www.hackerrank.com/certificates/873efdedfcc9",
    },
  ],
  en: [
    {
      period: "HackerRank",
      title: "Frontend Developer (React) Certificate",
      issuer: "HackerRank",
      href: "https://www.hackerrank.com/certificates/2f18023e9707",
    },
    {
      period: "HackerRank",
      title: "Software Engineer Certificate",
      issuer: "HackerRank",
      href: "https://www.hackerrank.com/certificates/873efdedfcc9",
    },
  ],
};

export const awards: Record<Lang, RecognitionItem[]> = {
  vi: [
    {
      period: "2022",
      title: "Saladin-er",
      issuer: "10X Consulting & Technology Ltd",
      note: "Ghi nhận đóng góp làm mới toàn diện website đúng tiến độ và yêu cầu.",
    },
    {
      period: "08/2020",
      title: "MVP of the Month",
      issuer: "Hello Health Group",
      note: "Ghi nhận đóng góp phát triển hệ thống chatbot và các công cụ nội bộ.",
    },
    {
      period: "2016",
      title: "Top 100 Startup Wheel Ho Chi Minh",
      issuer: "Startup Wheel",
      note: "Phát triển Google Chrome extension cải thiện trải nghiệm tab mới.",
    },
  ],
  en: [
    {
      period: "2022",
      title: "Saladin-er",
      issuer: "10X Consulting & Technology Ltd",
      note: "Recognized for revamping the platform websites on schedule and to spec.",
    },
    {
      period: "Aug 2020",
      title: "MVP of the Month",
      issuer: "Hello Health Group",
      note: "Acknowledged for building the dynamic chatbot builder and internal tools.",
    },
    {
      period: "2016",
      title: "Top 100 Startup Wheel Ho Chi Minh",
      issuer: "Startup Wheel",
      note: "Built a Google Chrome extension enhancing the new tab experience.",
    },
  ],
};

export const education: Record<Lang, { period: string; school: string; program: string }> = {
  vi: {
    period: "2015 – 2017",
    school: "VTC Academy",
    program: "Game Development",
  },
  en: {
    period: "2015 – 2017",
    school: "VTC Academy",
    program: "Game Development",
  },
};
