export const languages = {
  vi: "Tiếng Việt",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "vi";

export const ui = {
  vi: {
    "site.name": "Bùi Khương Duy",
    "site.description": "Trang cá nhân của Bùi Khương Duy",
    // Dấu "|" đánh dấu chỗ được phép xuống dòng; mỗi cụm giữ nguyên trên một dòng.
    "site.tagline": "Front-End Lead (AI-Native)|với hơn 9 năm kinh nghiệm|React, Next.js, TypeScript, DevOps & K8s",
    "nav.label": "Điều hướng chính",
    "nav.about": "Giới Thiệu",
    "nav.blog": "Blog",
    "nav.contact": "Liên Hệ",
    "nav.cv": "CV",
    "nav.home": "Trang chủ",
    "lang.switch": "Chuyển ngôn ngữ",
    "scroll.top": "Lên đầu trang",

    "about.title": "Giới Thiệu",
    "about.lead": "Đôi lời về mình, những gì mình làm và con đường đã đi qua.",
    "about.experience": "Kinh nghiệm",
    "about.languages": "Ngôn ngữ",

    "projects.title": "Dự án cá nhân",
    "cv.download": "Xem CV đầy đủ",
    "projects.skills": "Kỹ năng",

    "blog.title": "Blog",
    "blog.lead": "Ghi chép, suy nghĩ và những điều mình học được.",
    "blog.empty": "Bài viết đầu tiên đang được chuẩn bị.",

    "contact.title": "Liên Hệ",
    "contact.lead": "Bạn muốn hợp tác, trao đổi hay chỉ đơn giản là chào hỏi? Mình luôn sẵn lòng.",
    "contact.email": "Email",
  },
  en: {
    "site.name": "Bui Khuong Duy",
    "site.description": "Personal website of Bui Khuong Duy",
    "site.tagline": "Front-End Lead (AI-Native)|with 9+ years in|React, Next.js, TypeScript, DevOps & K8s",
    "nav.label": "Main navigation",
    "nav.about": "About",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.cv": "Résumé",
    "nav.home": "Home",
    "lang.switch": "Change language",
    "scroll.top": "Back to top",

    "about.title": "About",
    "about.lead": "A little about me, what I do and the path that led here.",
    "about.experience": "Experience",
    "about.languages": "Languages",

    "projects.title": "Personal Projects",
    "cv.download": "View full résumé",
    "projects.skills": "Skills",

    "blog.title": "Blog",
    "blog.lead": "Notes, thoughts and things I have learned.",
    "blog.empty": "The first post is on its way.",

    "contact.title": "Contact",
    "contact.lead": "Want to collaborate, talk shop or just say hi? I'd love to hear from you.",
    "contact.email": "Email",
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLang];

export function getLang(locale: string | undefined): Lang {
  return locale && locale in languages ? (locale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key];
}

/** Đường dẫn trang chủ của mỗi ngôn ngữ. */
export const homePath: Record<Lang, string> = {
  vi: "/",
  en: "/en/",
};

export type Section = "about" | "blog" | "contact";

/** Đường dẫn của từng mục ở mỗi ngôn ngữ. */
export const sectionPaths: Record<Section, Record<Lang, string>> = {
  about: { vi: "/gioi-thieu/", en: "/en/about/" },
  blog: { vi: "/blog/", en: "/en/blog/" },
  contact: { vi: "/lien-he/", en: "/en/contact/" },
};
