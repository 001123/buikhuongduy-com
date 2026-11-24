---
title: "Vì sao iOS vẫn chưa có trình duyệt nào ngoài WebKit"
seoTitle: "Vì sao iOS vẫn chưa có trình duyệt ngoài WebKit"
description: "EU và Nhật đã buộc Apple cho phép engine trình duyệt khác trên iOS, nhưng đến cuối 2026 vẫn chưa có trình duyệt non-WebKit nào ra mắt. Mình tóm tắt bài viết của Mozilla về các điều kiện của Apple và điều đó có nghĩa gì với người làm web."
pubDate: 2026-11-25T02:40:00+07:00
category: web-platform
tags: [web-platform, ios, safari, webkit, firefox, browser-engine]
---

:::tldr
- **Hiện trạng:** mọi trình duyệt trên iPhone và iPad (Chrome, Firefox, Edge…) vẫn chạy trên **WebKit**, engine của Safari. iOS là hệ điều hành lớn duy nhất còn giới hạn này.
- **Luật đã đổi:** **DMA** của EU (từ 2024) và luật mới ở Nhật buộc Apple cho phép engine khác. Apple có công bố điều kiện cho cả hai nơi.
- **Thực tế:** gần ba năm ở EU và gần một năm ở Nhật, **chưa có trình duyệt non-WebKit nào ra mắt**. Mozilla nói thẳng: điều kiện của Apple không làm được.
- **Ví dụ Mozilla đưa ra:** muốn dùng Gecko, Firefox phải ra **một app riêng**, rồi người dùng tự tải về và tự chuyển bookmark, mật khẩu, lịch sử sang.
- **Với dev web:** trên iOS, "test trên Chrome" vẫn là test trên WebKit. Bug và giới hạn của Safari là của mọi trình duyệt trên iPhone.
:::

Mozilla vừa đăng bài [Why there are still no non-WebKit browsers on iOS](https://blog.mozilla.org/en/mozilla/internet-policy/apple-ios-browser-engine-rules/) (20/11/2026). Bài ngắn, giọng chính sách, nhưng chạm đúng một chuyện mà ai làm frontend cũng từng vấp: trên iPhone, chọn trình duyệt nào thì engine bên dưới vẫn là một.

Dưới đây là phần tóm tắt của mình, kèm vài ghi chú từ góc nhìn người làm web.

## Chrome trên iPhone vẫn là WebKit

Apple bắt mọi trình duyệt trên iOS phải dựng trên WebKit. Chrome trên iPhone dùng giao diện, đồng bộ và tài khoản của Google, nhưng phần render HTML, chạy CSS và JavaScript là WebKit. Firefox cũng vậy.

Mozilla nhấn mạnh hệ quả với họ: nhiều tính năng của Firefox nằm ngay trong engine **Gecko**, nên không mang lên iPhone được. Trên macOS, Windows, Android hay Linux, người dùng đều có Firefox chạy Gecko. Chỉ iPhone và iPad là không.

Theo Mozilla, Gecko là engine trình duyệt lớn cuối cùng không thuộc về một công ty big tech. Blink là của Google, WebKit là của Apple.

## Luật đã mở cửa, nhưng chưa ai đi qua được

Từ 2024, **Digital Markets Act (DMA)** buộc Apple cho người dùng EU chọn trình duyệt mặc định. Mozilla cho biết hàng triệu người đã chọn Firefox, và lượt dùng hằng ngày trên iOS tăng gấp đôi.

DMA cũng khiến Apple cho phép engine thay thế ở EU, kèm một bộ điều kiện mà bên làm trình duyệt phải tuân theo. Hồi đó Mozilla đã nói các quy định này làm mọi thứ "as painful as possible". Sau đó Nhật Bản cũng ra luật yêu cầu tương tự, và Apple áp điều kiện gần giống hệt.

Kết quả sau gần ba năm ở EU và gần một năm ở Nhật: **không một nhà phát triển nào ra mắt được trình duyệt non-WebKit trên iOS.**

Câu mình thấy đáng nhớ nhất trong bài:

> The real test of any rule is whether it delivers the change it was meant to achieve in practice. Compliance on paper alone falls short of that test.

Luật được viết ra để có thêm lựa chọn thật. Nếu sau ba năm số lựa chọn vẫn bằng không, thì việc tuân thủ chỉ nằm trên giấy.

## Phải làm "Firefox thứ hai"

Mozilla nói họ đã làm việc với Apple từ khi DMA có hiệu lực để thử và cải thiện các điều kiện này, và phần lớn nỗ lực đó thất bại. Một điều kiện cấm họ tiết lộ thông tin không công khai về dự án, nên bài chỉ đưa ra một ví dụ.

Để dùng Gecko, Mozilla không được cập nhật app Firefox mà người dùng đang có. Họ phải làm hẳn một app riêng. Sau đó từng người dùng phải:

1. Tải app mới về.
2. Chuyển bookmark, mật khẩu và lịch sử sang.
3. Tự đổi trình duyệt mặc định.

Nhiều người sẽ bỏ cuộc giữa chừng, kể cả những người vừa chọn Firefox từ màn hình chọn trình duyệt của EU. Mozilla gọi đây là mức ma sát mà Apple sẽ không bao giờ chấp nhận cho app của chính mình. Cánh cửa mở ra nhìn giống một cái bẫy sập ("trap door") hơn.

Thử nghĩ ngược lại từ phía một team sản phẩm: một bản cập nhật bắt người dùng cài app khác và tự migrate dữ liệu thì gần như chắc chắn mất một phần lớn người dùng. Không team nào muốn ship kiểu đó.

## Điều này có nghĩa gì với người làm web

Phần này là ghi chú của mình, bài của Mozilla không đề cập.

**Test trên iOS là test trên WebKit.** Mở trang bằng Chrome trên iPhone không cho bạn thêm thông tin gì về Blink. Bug layout trên Safari iOS gần như chắc chắn cũng xuất hiện trên Chrome iOS, Firefox iOS và Edge iOS. Ma trận test thực tế cho iPhone chỉ có một engine.

**Đừng dựa vào user agent để đoán engine.** Chrome trên iOS có `CriOS` trong UA, Firefox có `FxiOS`. Code kiểu "thấy chữ Chrome thì dùng API của Chrome" sẽ hỏng trên iPhone. Feature detection an toàn hơn nhiều:

```js
// Check the capability, not the brand name in the UA string.
if ("showPicker" in HTMLInputElement.prototype) {
  input.showPicker();
}
```

```css
@supports (anchor-name: --a) {
  /* Only applies where the engine actually supports anchor positioning. */
}
```

**Tốc độ ra tính năng mới trên iPhone phụ thuộc vào một lịch phát hành.** API mới của web platform chỉ dùng được trên iPhone khi WebKit hỗ trợ, bất kể người dùng cài trình duyệt nào. Khi đọc bảng tương thích trên MDN hay caniuse, cột "Safari on iOS" thực chất là cột cho cả iPhone.

## Mình nghĩ sao

Bài của Mozilla là bài vận động chính sách, nên tất nhiên nghiêng về phía họ. Nhưng con số thì khó cãi: luật có hiệu lực ở hai thị trường lớn, nhiều năm trôi qua, và chưa có trình duyệt non-WebKit nào trên App Store.

Với người làm web, có thêm engine trên iPhone nghĩa là có thêm áp lực cạnh tranh lên WebKit, và về lâu dài là API mới đến với người dùng iPhone nhanh hơn. Trong lúc chờ, cách thực tế nhất vẫn là coi Safari iOS là một target riêng: test trên máy thật, dùng feature detection, và theo dõi release notes của WebKit.

Đọc bài gốc: [Why there are still no non-WebKit browsers on iOS](https://blog.mozilla.org/en/mozilla/internet-policy/apple-ios-browser-engine-rules/) trên blog Mozilla.
