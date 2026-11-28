---
title: "Làm lại trang cá nhân trong 3 ngày cùng AI agent, vẫn giữ 100 điểm Lighthouse"
seoTitle: "Làm lại trang cá nhân trong 3 ngày, vẫn 100 điểm"
description: "Ba ngày, 10 PR, giao diện mới hoàn toàn với văn phòng pixel art và 4 AI agent. PageSpeed trên production vẫn đạt 100 ở mọi nhóm, cả mobile lẫn desktop. Mình đã làm thế nào."
pubDate: 2026-11-28T17:30:00+07:00
category: ai
tags: [ai, agents, astro, performance, lighthouse]
---

:::tldr
- **26–28/11/2026**: làm lại gần như toàn bộ trang, **10 PR** cùng vài commit UI lớn.
- Mỗi việc là một thread với **Claude Code**: agent viết code, đo Lighthouse, mở PR. Mình đọc diff và merge.
- **Lighthouse CI** chặn mọi PR dưới 100, nên đi nhanh mà không vỡ.
- Kết quả: PageSpeed production đạt **100 ở cả 4 nhóm**, mobile lẫn desktop.
:::

Ba ngày trước, trang này còn là một trang giới thiệu khá đơn giản. Giờ nó có giao diện mới hoàn toàn, và điểm PageSpeed vẫn là 100/100/100/100.

![Trang chủ mới của buikhuongduy.com: văn phòng pixel art với Duy ở giữa điều phối 4 agent Claude, Codex, Antigravity và OpenCode](../../../assets/blog/site-revamp-home-hero.webp)

## Có gì mới

- **Hero văn phòng pixel art**: mình ngồi giữa điều phối 4 agent dùng hằng ngày (Claude, Codex, Antigravity, OpenCode). Bấm vào bàn nào, bong bóng thoại kể agent đó đang làm gì.
- Bảng màu cam mới, thanh điều hướng cho mobile, nút đổi theme lan ra hình tròn.
- Timeline kinh nghiệm, lưới 28 công nghệ có chế độ Tech Radar, phần dự án với ảnh GIF pixel.
- SEO: ảnh OG mới, mô tả trang rút từ 204 xuống dưới 150 ký tự, JSON-LD `Person` đầy đủ hơn.

## Làm nhanh nhờ đâu

Mình chia việc thành nhiều thread Claude Code chạy song song. Mỗi thread nhận một vấn đề, tự đọc code, sửa, đo Lighthouse rồi mở PR kèm nguyên nhân và số đo trước/sau. Việc của mình là đọc diff, hỏi lại chỗ lạ, và quyết định.

Thứ cho phép đi nhanh là một ngưỡng cứng trong CI:

```js
// lighthouserc.cjs
'categories:performance': ['error', { minScore: 1, aggregationMethod: 'optimistic' }],
'categories:accessibility': ['error', { minScore: 1 }],
'categories:best-practices': ['error', { minScore: 1 }],
'categories:seo': ['error', { minScore: 1 }],
'categories:agentic-browsing': ['error', { minScore: 1 }],
```

PR nào làm tụt điểm ở bất kỳ trang nào trong 7 trang được kiểm tra thì không merge được. Mình giao việc mà không phải ngồi canh.

## Giữ 100 với một giao diện nặng hơn nhiều

Giao diện mới có ảnh lớn, nhiều tương tác hơn, và production từng rơi xuống 99. Mấy thay đổi giúp lấy lại điểm:

- **Bỏ web font, dùng font hệ thống.** 6 file woff2 đang chặn ảnh LCP. Bỏ đi, LCP lab giảm từ khoảng 1,9 s xuống 1,3 s.
- **Nén ảnh poster** ở WebP quality 65: nhẹ hơn khoảng 30%, pixel art nhìn không khác.
- **Google Analytics (Partytown) tải sau `load`**, không tranh băng thông với ảnh hero. Beacon Cloudflare Web Analytics (được chèn ở edge, CI không thấy) là thứ cuối cùng mình xử lý.
- **Làm nhẹ trang chủ**: Tech Radar chỉ dựng khi mở, CSS bài viết tách riêng, script nhỏ được inline.
- **Accessibility**: sửa vị trí bong bóng thoại, role ARIA sai, tên công nghệ bị cắt trên mobile, hai link trùng tên.

Chi tiết từng kỹ thuật có trong [bài 100 điểm Lighthouse](/blog/perfect-lighthouse-score/) và [bài về gtag](/blog/why-gtag-did-not-lower-lighthouse-score/).

## Rút ra

Với agent, mình làm xong khối lượng này trong 3 ngày. Nhưng tốc độ chỉ có ích khi có hàng rào chất lượng tự động, và khi người quyết định đánh đổi (như bỏ font Be Vietnam Pro mình rất thích) vẫn là mình.

Nếu team bạn cần một người làm frontend hoặc full-stack, làm nhanh mà vẫn giữ chất lượng: **mình đang tìm cơ hội mới**. [Kết nối với mình](/contact/) nhé.
