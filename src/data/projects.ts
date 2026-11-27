import type { Lang } from "../i18n/ui";

export interface Project {
  name: string;
  summary: string;
  tags: string[];
  href: string;
}

export const projects: Record<Lang, Project[]> = {
  vi: [
    {
      name: "KD Code",
      summary:
        "Extension VS Code mã nguồn mở để chat và điều phối nhiều coding agent (Claude, Codex, OpenCode) qua Agent Client Protocol, có so sánh Best-of-N trên Git worktree riêng.",
      tags: ["TypeScript", "VS Code API", "ACP"],
      href: "https://marketplace.visualstudio.com/items?itemName=kd-labs.kd-code",
    },
    {
      name: "Simple OTP",
      summary:
        "Ứng dụng 2FA mã nguồn mở, không kết nối mạng, cho iOS và Android. Mã hoá bằng AES-256-GCM trong Keychain/Keystore, hỗ trợ TOTP/HOTP và quét QR.",
      tags: ["iOS", "Android", "AES-256-GCM"],
      href: "https://github.com/kd-labs-io/simple-otp",
    },
    {
      name: "KD Labs (kd.io.vn)",
      summary: "Trang chủ KD Labs, tổng hợp các sản phẩm mã nguồn mở, dự án R&D và nghiên cứu về hệ thống AI-native.",
      tags: ["KD Labs", "Products", "R&D"],
      href: "https://kd.io.vn",
    },
    {
      name: "Onbai Online",
      summary: "Web app thời gian thực để cùng bạn bè luyện kiến thức trực tuyến.",
      tags: ["Realtime", "Web"],
      href: "https://github.com/onbai-oss",
    },
  ],
  en: [
    {
      name: "KD Code",
      summary:
        "Open-source VS Code extension to chat with and orchestrate coding agents (Claude, Codex, OpenCode) over the Agent Client Protocol, with Best-of-N comparison in isolated Git worktrees.",
      tags: ["TypeScript", "VS Code API", "ACP"],
      href: "https://marketplace.visualstudio.com/items?itemName=kd-labs.kd-code",
    },
    {
      name: "Simple OTP",
      summary:
        "Open-source, zero-network 2FA app for iOS and Android. Secrets are encrypted with AES-256-GCM in Keychain/Keystore, with TOTP/HOTP and QR import.",
      tags: ["iOS", "Android", "AES-256-GCM"],
      href: "https://github.com/kd-labs-io/simple-otp",
    },
    {
      name: "KD Labs (kd.io.vn)",
      summary: "KD Labs homepage bringing together open-source products, R&D experiments and AI-native engineering notes.",
      tags: ["KD Labs", "Products", "R&D"],
      href: "https://kd.io.vn",
    },
    {
      name: "Onbai Online",
      summary: "Realtime web app for practicing knowledge online with friends.",
      tags: ["Realtime", "Web"],
      href: "https://github.com/onbai-oss",
    },
  ],
};
