---
title: "Device Bound Session Credentials (DBSC): gắn phiên đăng nhập với thiết bị"
seoTitle: "DBSC là gì: gắn phiên đăng nhập với thiết bị"
description: "Cookie phiên bị đánh cắp cho phép kẻ tấn công bỏ qua cả mật khẩu lẫn 2FA. Device Bound Session Credentials (DBSC) trên Chrome gắn phiên đăng nhập với một khóa lưu trong phần cứng của thiết bị. Bài này giải thích DBSC hoạt động thế nào, ba thay đổi cần làm phía server và các trường hợp fallback cần tính trước."
pubDate: 2026-11-11T00:29:00+07:00
updatedDate: 2026-11-15T00:09:00+07:00
category: web-platform
tags: [web-platform, security, chrome, authentication, cookies]
---

:::tldr
- **Vấn đề:** cookie phiên sống lâu có thể bị đánh cắp (thường qua malware) rồi dùng lại trên máy khác, bỏ qua cả mật khẩu lẫn 2FA.
- **DBSC** cho Chrome tạo một cặp khóa khi đăng nhập, private key nằm trong phần cứng bảo mật (như **TPM**). Phiên sau đó chạy bằng **cookie sống ngắn**, mỗi lần làm mới đều phải chứng minh request đến từ đúng thiết bị ban đầu.
- **Phía server cần:** thêm header `Secure-Session-Registration` vào response đăng nhập, một **endpoint đăng ký phiên** và một **endpoint làm mới**. Phần lớn endpoint khác giữ nguyên.
- **Fallback êm:** thiết bị không có kho khóa bảo mật vẫn chạy như cũ. Nên giữ thêm một cookie sống lâu song song với cookie sống ngắn để xử lý các trường hợp DBSC bị bỏ qua.
:::

Hầu hết website giữ trạng thái đăng nhập bằng một cookie sống lâu. Cách này tiện, nhưng nếu cookie bị lấy ra khỏi máy (ví dụ qua malware dạng infostealer), kẻ tấn công chỉ cần dán nó vào trình duyệt của họ là vào được tài khoản: không cần mật khẩu, không cần 2FA. Xoay vòng cookie nhanh hơn cũng không giúp nhiều, vì kẻ tấn công cứ lấy cookie mới.

**Device Bound Session Credentials (DBSC)** giải quyết tận gốc: phiên đăng nhập được gắn với một khóa mật mã không thể rời khỏi thiết bị. Dưới đây là phần tóm tắt của mình từ [hướng dẫn trên Chrome for Developers](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials) và [đặc tả W3C](https://w3c.github.io/webappsec-dbsc/).

## DBSC hoạt động thế nào

Ở mức tổng quan:

1. Khi người dùng đăng nhập, Chrome tạo một **cặp khóa** cho phiên đó. Private key được lưu trong phần cứng bảo mật như [TPM](https://en.wikipedia.org/wiki/Trusted_Platform_Module) nếu có, nên không thể sao chép ra ngoài.
2. Server chuyển phiên sang dùng **cookie sống ngắn** (ví dụ 10 phút).
3. Khi cookie ngắn hạn hết hạn, Chrome **tạm dừng** request đang chờ, dùng private key ký một challenge từ server, nhận cookie mới rồi mới gửi tiếp request ban đầu.

Nhờ vậy, cookie bị đánh cắp chỉ dùng được trong vài phút. Muốn giữ phiên lâu hơn, kẻ tấn công phải có private key, mà khóa này nằm trong phần cứng của thiết bị gốc.

Nếu thiết bị không có kho lưu khóa bảo mật, DBSC tự lùi về hành vi bình thường, luồng đăng nhập không bị hỏng.

## Cần thay đổi những gì

DBSC được thiết kế theo kiểu **bổ sung**, bạn chỉ cần:

- Thêm header `Secure-Session-Registration` vào response sau khi đăng nhập thành công.
- Thêm endpoint **đăng ký phiên**: lưu public key, trả cấu hình phiên và chuyển sang cookie sống ngắn.
- Thêm endpoint **làm mới**: phát challenge, kiểm tra chữ ký và cấp cookie ngắn hạn mới.

Các endpoint khác vẫn kiểm tra cookie phiên như cũ. Khi cookie thiếu hoặc hết hạn, Chrome tự làm mới trước khi gửi request, nên code ứng dụng gần như không phải biết đến DBSC.

![Sơ đồ luồng DBSC](https://developer.chrome.com/static/docs/web-platform/device-bound-session-credentials/image/dbsc-flow.png)

### 1. Sửa luồng đăng nhập

Sau khi người dùng đăng nhập, trả cookie sống lâu như bình thường kèm header `Secure-Session-Registration`:

```http
HTTP/1.1 200 OK
Secure-Session-Registration: (ES256 RS256);path="/StartSession";challenge="random_challenge"
Set-Cookie: auth_cookie=session_id; max-age=2592000; Domain=example.com; Secure; SameSite=Lax
```

`(ES256 RS256)` là danh sách thuật toán ký mà server chấp nhận. Nếu thiết bị hỗ trợ lưu khóa bảo mật, Chrome sẽ gọi `/StartSession` và gửi public key trong một JWT ký trên `challenge`. Ví dụ trong hướng dẫn của Chrome thiếu `challenge`. Khi mình thử thiếu nó, Chrome vẫn gọi `/StartSession` nhưng không gửi JWT hay public key nào.

Tên cookie (`auth_cookie` ở đây) tùy bạn đặt, miễn là khớp với trường `name` trong cấu hình phiên ở bước sau.

### 2. Endpoint đăng ký phiên

Tại `/StartSession`, server:

- Gắn public key nhận được với phiên của người dùng.
- Trả cấu hình phiên dạng JSON.
- Thay cookie sống lâu bằng cookie sống ngắn.

```http
HTTP/1.1 200 OK
Set-Cookie: auth_cookie=short_lived_grant; Max-Age=600; Domain=example.com; Secure; SameSite=Lax
```

```json
{
  "session_identifier": "session_id",
  "refresh_url": "/RefreshEndpoint",
  "scope": {
    "origin": "https://example.com",
    "include_site": true,
    "scope_specification": [
      { "type": "exclude", "domain": "*.example.com", "path": "/static" }
    ]
  },
  "credentials": [{
    "type": "cookie",
    "name": "auth_cookie",
    "attributes": "Domain=example.com; Secure; SameSite=Lax"
  }]
}
```

Vài điểm đáng chú ý:

- `scope` xác định phiên áp dụng cho những request nào. Ở ví dụ, `/static` bị loại ra để tài nguyên tĩnh không phải chờ làm mới cookie.
- `credentials` cho Chrome biết cookie nào do DBSC quản lý và cookie đó cần thuộc tính gì.
- DBSC **chỉ áp dụng cho HTTPS** và **không hỗ trợ cookie Partitioned**. Đặc tả không bắt buộc thuộc tính `Secure`, nhưng request HTTP thường không được DBSC bảo vệ.

### 3. Endpoint làm mới

Khi cookie ngắn hạn hết hạn, Chrome và server trao đổi qua vài bước:

1. Chrome hoãn request của người dùng và gửi yêu cầu làm mới:

   ```http
   POST /RefreshEndpoint HTTP/1.1
   Sec-Secure-Session-Id: session_id
   ```

2. Server trả về một challenge:

   ```http
   HTTP/1.1 403 Forbidden
   Secure-Session-Challenge: "challenge_value";id="session_id"
   ```

3. Chrome ký challenge bằng private key rồi gửi lại:

   ```http
   POST /RefreshEndpoint HTTP/1.1
   Sec-Secure-Session-Id: session_id
   Secure-Session-Response: <JWT proof>
   ```

4. Server kiểm tra chữ ký bằng public key đã lưu và cấp cookie ngắn hạn mới:

   ```http
   HTTP/1.1 200 OK
   Set-Cookie: auth_cookie=short_lived_grant; Max-Age=600; Domain=example.com; Secure; SameSite=Lax
   ```

5. Chrome nhận cookie và gửi tiếp request đã bị hoãn.

:::advanced
## Cách tích hợp thay thế: hai cookie

Để chịu lỗi tốt hơn, Chrome gợi ý giữ **hai cookie** song song:

- Một cookie **sống lâu**, không do DBSC quản lý. Cookie này vẫn còn khi DBSC lỗi và chỉ dùng để cấp lại token ngắn hạn.
- Một cookie **sống ngắn**, được làm mới qua DBSC, bắt buộc cho các thao tác nhạy cảm (đổi mật khẩu, thanh toán, xem dữ liệu cá nhân…).

Cách này giúp phân biệt request thật sự chưa đăng nhập với trường hợp DBSC tạm thời thất bại, và cho bạn tự quyết mức độ chặt: ví dụ cho phép đọc thông thường chỉ với cookie sống lâu, nhưng yêu cầu cookie ngắn hạn (hoặc đăng nhập lại) cho thao tác nhạy cảm.
:::

## Các trường hợp fallback cần tính trước

Chrome có thể bỏ qua DBSC và gửi request **không kèm cookie ngắn hạn** khi:

- Không gọi được endpoint làm mới (lỗi mạng, server gặp sự cố).
- TPM đang bận hoặc ký lỗi. TPM dùng chung cho cả hệ thống, làm mới quá dày có thể chạm giới hạn tần suất của nó. Đừng đặt thời gian sống của cookie quá ngắn.
- Cookie ngắn hạn là cookie bên thứ ba và người dùng đã chặn cookie bên thứ ba.

Khi đó Chrome dùng cookie sống lâu **nếu nó vẫn còn**. Đây cũng là lý do nên cân nhắc cách dùng hai cookie ở trên: nếu chỉ có cookie ngắn hạn, request sẽ đi mà không có cookie nào và người dùng trông như đã bị đăng xuất.

## Giới hạn

DBSC không phải thuốc tiên. Nếu malware **đã có sẵn trên máy ngay lúc đăng ký phiên**, nó có thể lấy được private key và chiếm phiên giống như các kiểu trộm cookie khác. Tuy vậy, tấn công cần malware đúng lúc đăng nhập hoặc phải sửa driver TPM phức tạp và dễ bị phát hiện hơn nhiều so với việc chỉ copy một file cookie. DBSC làm chi phí trộm phiên tăng mạnh chứ không xóa bỏ hoàn toàn rủi ro.

## Mình thử thì thấy

Mình dựng một server Node tối giản gồm `/login`, `/StartSession`, `/refresh` và một endpoint cần đăng nhập, rồi chạy với Chrome 157 trên MacBook M4 Pro (ngày 14/11/2026, profile mới, không bật flag nào). Đặt cookie ngắn hạn 60 giây để dễ quan sát.

**Chỉ chạy trên HTTPS, kể cả ở localhost.** Với `http://localhost`, Chrome lặng lẽ bỏ qua header đăng ký: không request, không cảnh báo trong console. Chuyển sang `https://localhost` với chứng chỉ tự ký thì `/StartSession` được gọi ngay, lần nào cũng dùng ES256. Máy Mac không có TPM nhưng DBSC vẫn bật mặc định. Mỗi lần ký mất khoảng 8–16 ms, gợi ý khóa nằm trong phần cứng, nhưng mình không kiểm chứng trực tiếp được.

**Làm mới gần như vô hình.** Khi cookie ngắn hạn hết hạn, Chrome giữ request lại khoảng **93 ms** để làm mới. Server không bao giờ nhận request nào thiếu cookie. Nếu server gửi sẵn challenge kế tiếp trong response thành công, Chrome bỏ được vòng 403 và thời gian giữ còn khoảng **16 ms**. Cần lưu ý: Chrome vẫn ký một challenge đã 70 giây tuổi, nên server phải tự giới hạn tuổi của challenge. Với cookie 60 giây, Chrome làm mới ở gần như mọi request dù còn khoảng 54 giây. Với cookie 600 giây thì không. Đặt thời hạn quá ngắn đồng nghĩa với ký ở gần như mọi request.

**Mô phỏng trộm cookie.** Cookie copy sang curl hoặc một profile Chrome khác dùng được ngay. Sau 65 giây, cookie ngắn hạn bị trộm hết hạn và không làm mới được, vì kẻ trộm không có khóa. Proof ký bằng khóa khác bị từ chối. Trong lúc đó, phiên của nạn nhân vẫn làm mới bình thường. Nhưng **cookie sống lâu 30 ngày vẫn mở được mọi thứ chỉ cần nó**. DBSC chỉ bảo vệ những endpoint mà server bắt buộc phải có cookie ngắn hạn. Nếu dùng cách hai cookie, đừng để cookie dài tự nó mở được dữ liệu nhạy cảm.

**Khi server lỗi.** Endpoint làm mới trả 500 thì Chrome không chặn người dùng: request vẫn đi, không kèm cookie ngắn, có thêm header `Secure-Session-Skipped: server_error`. Sau 4 lần lỗi liên tiếp, Chrome tạm ngừng gọi `/refresh`, và chạy lại trong vòng 15 giây sau khi server hồi phục.

Những chỗ tốn thời gian nhất đều đến từ chi tiết định dạng, và mình đã sửa lại các ví dụ ở trên:

- Header đăng ký phải có `challenge="…"`.
- Header challenge phải có `;id="<session>"`. Thiếu nó, Chrome bỏ ngang lần làm mới mà không thử lại.
- Chrome gửi `Sec-Secure-Session-Id` và `Secure-Session-Response` **không có dấu ngoặc kép**, khác với đặc tả, nên server phải chấp nhận cả hai dạng.
- JWT chỉ gồm `jti` (challenge) và `authorization`, không có `aud`/`iat`/`exp`. Public key nằm trong header JWT và chỉ có lúc đăng ký. Chữ ký ES256 ở dạng 64 byte thô, nên trên Node cần `dsaEncoding: "ieee-p1363"`.
- Công cụ debug tốt nhất là sự kiện `Network.deviceBoundSessionEventOccurred` của DevTools Protocol. Nó cho biết chính xác vì sao đăng ký hay làm mới thất bại.

Nhận định của mình: DBSC đã dùng được trên Chrome desktop mà không cần flag, và phía server không quá nhiều việc. Cái khó là đọc đúng từng dấu ngoặc trong header khi tài liệu còn chưa khớp với trình duyệt.

## Tổng kết

DBSC vá một điểm yếu lâu đời của phiên đăng nhập dựa trên cookie với khá ít thay đổi: thêm một header lúc đăng nhập và hai endpoint mới. Người dùng trên phần cứng được hỗ trợ được bảo vệ mà không nhận ra gì khác, những người còn lại vẫn dùng bình thường. Nếu ứng dụng của bạn giữ dữ liệu nhạy cảm, nhất là khi đã từng gặp chuyện tài khoản bị chiếm qua cookie bị đánh cắp, DBSC rất đáng đưa vào lộ trình.

Đọc thêm: [hướng dẫn trên Chrome for Developers](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials) và [đặc tả DBSC](https://w3c.github.io/webappsec-dbsc/). Các vấn đề bảo mật khác phía frontend (token đặt ở đâu, phân quyền trên UI) có trong [cheatsheet frontend system design](/blog/frontend-system-design-cheatsheet/).
