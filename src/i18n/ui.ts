export const languages = {
  vi: "Tiếng Việt",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "vi";

export const ui = {
  vi: {
    "site.name": "Bùi Khương Duy",
    "site.description": "Bùi Khương Duy – Front-End Lead (AI-Native) với hơn 9 năm kinh nghiệm React, Next.js, TypeScript, DevOps và Kubernetes. Kinh nghiệm, dự án và blog.",
    "seo.homeTitle": "Bùi Khương Duy – Front-End Lead (AI-Native) | React, Next.js",
    "seo.jobTitle": "Front-End Lead (AI-Native)",
    "seo.ogImageAlt": "Bùi Khương Duy — Front-End Lead (AI-Native), hơn 9 năm kinh nghiệm React, Next.js, TypeScript, DevOps & K8s",
    "seo.about": "Kinh nghiệm, kỹ năng và dự án của Bùi Khương Duy – Front-End Lead hơn 9 năm làm React, Next.js, TypeScript, AI agents và hạ tầng cloud.",
    "seo.blog": "Blog của Bùi Khương Duy về frontend, React, Next.js, TypeScript, AI agents và DevOps: ghi chép, kinh nghiệm thực tế và bài học rút ra.",
    "seo.contact": "Liên hệ Bùi Khương Duy – sẵn sàng cho vai trò Frontend Lead hoặc AI-native engineering. Email, LinkedIn, GitHub và CV.",
    // "|" marks allowed line breaks; each segment stays on a single line.
    "site.tagline": "Front-End Lead (AI-Native)|với hơn 9 năm kinh nghiệm|React, Next.js, TypeScript, DevOps & K8s",
    "nav.label": "Điều hướng chính",
    "nav.about": "Giới Thiệu",
    "nav.blog": "Blog",
    "nav.contact": "Kết Nối",
    "nav.cv": "CV",
    "nav.home": "Trang chủ",
    "lang.switch": "Chuyển ngôn ngữ",
    "nav.back": "Trở lại",
    "scroll.top": "Lên đầu trang",
    "end.thanks": "Cảm ơn bạn đã đọc đến cuối.",
    "end.prompt": "Bạn muốn {back} hay {top}?",
    "end.back": "trở lại trang trước",
    "end.top": "đọc lại từ đầu",
    "hero.status": "Sẵn sàng cho cơ hội mới",

    "about.title": "Giới Thiệu",
    "about.lead": "Đôi lời về mình, công việc và con đường đã đi qua.",
    "about.experience": "Kinh nghiệm",
    "about.languages": "Ngôn ngữ",
    "about.hire": "Hiện mình đang tìm kiếm cơ hội mới.",
    "about.hireLink": "Bấm để kết nối",
    "about.blog": "Những điều nhặt nhạnh được trên chặng đường ấy, mình ghi lại dần ở",
    "about.blogLink": "blog",

    "projects.title": "Dự án cá nhân",
    "cv.download": "Xem CV đầy đủ",
    "projects.skills": "Kỹ năng",

    "blog.title": "Blog",
    "blog.lead": "Ghi chép, suy nghĩ và những điều mình học được.",
    "blog.empty": "Bài viết đầu tiên đang được chuẩn bị.",
    "blog.back": "Tất cả bài viết",
    "blog.published": "Đăng ngày",
    "blog.updated": "Cập nhật",
    "blog.draft": "Bản nháp",
    "blog.like": "Thả tim",
    "blog.likeMax": "Bạn đã thả tối đa 50 tim",
    "blog.likeHint": "Bấm để thả tim, nhấn giữ để xóa",
    "blog.likeReset": "Đã xóa tim",
    "blog.shareFacebook": "Chia sẻ Facebook",
    "blog.copyLink": "Sao chép liên kết",
    "blog.copied": "Đã sao chép",
    "feedback.title": "Bài viết này thế nào?",
    "feedback.rating1": "Chưa ổn",
    "feedback.rating2": "Tạm được",
    "feedback.rating3": "Ổn",
    "feedback.rating4": "Hay",
    "feedback.rating5": "Rất hay",
    "feedback.commentLabel": "Góp ý thêm (không bắt buộc)",
    "feedback.commentPlaceholder": "Điều bạn thích, chỗ chưa rõ, hoặc chủ đề muốn đọc tiếp…",
    "feedback.submit": "Gửi góp ý",
    "feedback.hint": "Nút sẽ mở ứng dụng email của bạn với nội dung soạn sẵn, gửi tới",
    "feedback.sent": "Cảm ơn bạn! Hãy bấm gửi trong ứng dụng email để hoàn tất.",
    "feedback.mailSubject": "[Góp ý blog]",
    "feedback.mailPost": "Bài viết",
    "feedback.mailLink": "Liên kết",
    "feedback.mailRating": "Đánh giá",
    "feedback.mailComment": "Góp ý",
    "blog.mode.label": "Chế độ đọc",
    "blog.mode.tldr": "TL;DR",
    "blog.mode.normal": "Bình thường",
    "blog.mode.advanced": "Nâng cao",
    "diagram.open": "Phóng to sơ đồ",
    "diagram.dialog": "Xem sơ đồ",
    "diagram.zoomIn": "Phóng to",
    "diagram.zoomOut": "Thu nhỏ",
    "diagram.fit": "Vừa màn hình",
    "diagram.reset": "Đặt lại zoom",
    "diagram.actual": "Kích thước gốc",
    "diagram.download": "Tải SVG",
    "diagram.close": "Đóng",
    "diagram.hint": "Kéo để di chuyển · Cuộn hoặc chụm 2 ngón để phóng to",

    "contact.title": "Kết Nối",
    "contact.lead": "Duy đang sẵn sàng cho công việc mới, đặc biệt là vai trò Frontend Lead hoặc AI\u2060-\u2060native engineering. Nếu đội của bạn đang tìm người, hãy kết nối với Duy nhé!",
    "contact.email": "Email",

    "notFound.title": "Lạc đường rồi",
    "notFound.seoTitle": "Không tìm thấy trang",
    "notFound.description": "Trang bạn tìm không tồn tại hoặc đã được dời đi nơi khác.",
    // Lục bát couplet: 6 then 8 syllables.
    "notFound.verse1": "Đường này mây trắng giăng ngang,",
    "notFound.verse2": "Trang ai tìm đã lạc sang cánh đồng.",
    "notFound.lead": "Đường dẫn này không tồn tại, hoặc trang đã được dời đi nơi khác.",
    "notFound.path": "Bạn đang tìm",
    "notFound.suggest": "Thử một lối khác",
    "notFound.seal": "Lạc|đường",
    "notFound.restamp": "Đóng dấu lại",
  },
  en: {
    "site.name": "Bui Khuong Duy",
    "site.description": "Bui Khuong Duy – Front-End Lead (AI-Native) with 9+ years of experience in React, Next.js, TypeScript, DevOps and Kubernetes. Experience, projects and blog.",
    "seo.homeTitle": "Bui Khuong Duy – Front-End Lead (AI-Native) | React, Next.js",
    "seo.jobTitle": "Front-End Lead (AI-Native)",
    "seo.ogImageAlt": "Bui Khuong Duy — Front-End Lead (AI-Native) with 9+ years in React, Next.js, TypeScript, DevOps & K8s",
    "seo.about": "Experience, skills and projects of Bui Khuong Duy, a Front-End Lead with 9+ years in React, Next.js, TypeScript, AI agents and cloud infrastructure.",
    "seo.blog": "Bui Khuong Duy's blog on front-end engineering, React, Next.js, TypeScript, AI agents and DevOps: notes, hands-on experience and lessons learned.",
    "seo.contact": "Contact Bui Khuong Duy, open to Frontend Lead and AI-native engineering roles. Email, LinkedIn, GitHub and résumé.",
    "site.tagline": "Front-End Lead (AI-Native)|with 9+ years in|React, Next.js, TypeScript, DevOps & K8s",
    "nav.label": "Main navigation",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.cv": "Résumé",
    "nav.home": "Home",
    "lang.switch": "Change language",
    "nav.back": "Back",
    "scroll.top": "Back to top",
    "end.thanks": "Thanks for reading to the end.",
    "end.prompt": "Would you like to {back} or {top}?",
    "end.back": "go back",
    "end.top": "start again from the top",
    "hero.status": "Open to new opportunities",

    "about.title": "About",
    "about.lead": "A little about me, what I do and the path that led here.",
    "about.experience": "Experience",
    "about.languages": "Languages",
    "about.hire": "I'm currently open to new opportunities.",
    "about.hireLink": "Get in touch",
    "about.blog": "I jot down what I pick up along the way on my",
    "about.blogLink": "blog",

    "projects.title": "Personal Projects",
    "cv.download": "View full résumé",
    "projects.skills": "Skills",

    "blog.title": "Blog",
    "blog.lead": "Notes, thoughts and things I have learned.",
    "blog.empty": "The first post is on its way.",
    "blog.back": "All posts",
    "blog.published": "Published",
    "blog.updated": "Updated",
    "blog.draft": "Draft",
    "blog.like": "Like",
    "blog.likeMax": "You have reached the 50-like limit",
    "blog.likeHint": "Click to like, press and hold to clear",
    "blog.likeReset": "Likes cleared",
    "blog.shareFacebook": "Share on Facebook",
    "blog.copyLink": "Copy link",
    "blog.copied": "Copied",
    "feedback.title": "How was this post?",
    "feedback.rating1": "Not great",
    "feedback.rating2": "Okay",
    "feedback.rating3": "Good",
    "feedback.rating4": "Great",
    "feedback.rating5": "Excellent",
    "feedback.commentLabel": "Anything else? (optional)",
    "feedback.commentPlaceholder": "What you liked, what was unclear, or topics you'd like to read next…",
    "feedback.submit": "Send feedback",
    "feedback.hint": "This opens your email app with a pre-filled message to",
    "feedback.sent": "Thank you! Press send in your email app to finish.",
    "feedback.mailSubject": "[Blog feedback]",
    "feedback.mailPost": "Post",
    "feedback.mailLink": "Link",
    "feedback.mailRating": "Rating",
    "feedback.mailComment": "Feedback",
    "blog.mode.label": "Reading mode",
    "blog.mode.tldr": "TL;DR",
    "blog.mode.normal": "Standard",
    "blog.mode.advanced": "Advanced",
    "diagram.open": "Expand diagram",
    "diagram.dialog": "Diagram viewer",
    "diagram.zoomIn": "Zoom in",
    "diagram.zoomOut": "Zoom out",
    "diagram.fit": "Fit to screen",
    "diagram.reset": "Reset zoom",
    "diagram.actual": "Actual size",
    "diagram.download": "Download SVG",
    "diagram.close": "Close",
    "diagram.hint": "Drag to pan · Scroll or pinch to zoom",

    "contact.title": "Contact",
    "contact.lead": "I'm open to new roles, especially Frontend Lead or AI\u2060-\u2060native engineering positions. If your team is hiring, let's connect!",
    "contact.email": "Email",

    "notFound.title": "Lost the trail",
    "notFound.seoTitle": "Page not found",
    "notFound.description": "The page you are looking for does not exist or has moved elsewhere.",
    "notFound.verse1": "White clouds lie across the lane;",
    "notFound.verse2": "the page you sought has strayed into the fields.",
    "notFound.lead": "This link does not exist, or the page has moved somewhere else.",
    "notFound.path": "You were looking for",
    "notFound.suggest": "Try another path",
    "notFound.seal": "Off|path",
    "notFound.restamp": "Stamp again",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];

export function getLang(locale: string | undefined): Lang {
  return locale && locale in languages ? (locale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key];
}

/** Locale codes for Open Graph and hreflang-style tags. */
export const locales: Record<Lang, { og: string; bcp47: string }> = {
  vi: { og: "vi_VN", bcp47: "vi-VN" },
  en: { og: "en_US", bcp47: "en-US" },
};


/** Home page path for each language. */
export const homePath: Record<Lang, string> = {
  vi: "/",
  en: "/en/",
};

export type Section = "about" | "blog" | "contact";

/** Path of each section in each language. */
export const sectionPaths: Record<Section, Record<Lang, string>> = {
  about: { vi: "/gioi-thieu/", en: "/en/about/" },
  blog: { vi: "/blog/", en: "/en/blog/" },
  contact: { vi: "/lien-he/", en: "/en/contact/" },
};
