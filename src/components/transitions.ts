// Hiệu ứng khi đổi trang/ngôn ngữ: nội dung cũ mờ dần, nội dung mới hiện ra nhẹ nhàng.
// Đi tới thì nội dung trôi lên; quay lại thì trôi xuống — biên độ nhỏ để cảm giác liền mạch.
const out = { duration: "0.16s", easing: "cubic-bezier(0.4, 0, 1, 1)", fillMode: "both" };
const inn = { duration: "0.38s", delay: "0.05s", easing: "cubic-bezier(0.16, 1, 0.3, 1)", fillMode: "both" };

export const contentAnim = {
  forwards: { old: { name: "content-out", ...out }, new: { name: "content-in", ...inn } },
  backwards: { old: { name: "content-out-back", ...out }, new: { name: "content-in-back", ...inn } },
};
