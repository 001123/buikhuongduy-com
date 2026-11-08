// Page/language change transition: old content fades out, new content gently fades in.
// Navigating forward slides content up; going back slides it down — small offset for a seamless feel.
const out = { duration: "0.16s", easing: "cubic-bezier(0.4, 0, 1, 1)", fillMode: "both" };
const inn = { duration: "0.38s", delay: "0.05s", easing: "cubic-bezier(0.16, 1, 0.3, 1)", fillMode: "both" };

export const contentAnim = {
  forwards: { old: { name: "content-out", ...out }, new: { name: "content-in", ...inn } },
  backwards: { old: { name: "content-out-back", ...out }, new: { name: "content-in-back", ...inn } },
};
