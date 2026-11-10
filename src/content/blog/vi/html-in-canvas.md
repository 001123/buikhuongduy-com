---
title: "HTML-in-Canvas: vẽ DOM sống, vẫn accessible, vào 2D, WebGL và WebGPU"
description: "Chrome 157 chính thức có HTML-in-Canvas API: vẽ cây DOM sống vào canvas 2D, WebGL hoặc WebGPU mà vẫn giữ tương tác, accessibility, Find-in-Page và dịch trang. Bài này giải thích thuộc tính drawable, sự kiện paint, đồng bộ geometry, các lỗi về kích thước và cách fallback."
pubDate: 2026-11-11
category: web-platform
tags: [web-platform, canvas, webgl, webgpu, accessibility, chrome]
---

:::tldr
- **Vấn đề:** ứng dụng canvas trước giờ phải chọn giữa vẽ chữ thành pixel (`fillText()`, mất accessibility và tính năng trình duyệt) hoặc đặt HTML nổi phía trên canvas (bị lệch, giới hạn thứ tự lớp, phải cập nhật `style.transform` mỗi frame).
- **HTML-in-Canvas** (stable từ **Chrome 157**) cho phép vẽ cây DOM sống vào canvas 2D, WebGL hoặc WebGPU. Nội dung vẫn chọn được, đọc được bằng screen reader, dịch được và tìm được bằng Find-in-Page.
- **Ba thành phần chính:** `content="drawable"` trên `<canvas>` và `drawable` trên phần tử, sự kiện `paint` bắn ra khi nội dung drawable thay đổi, và các hàm vẽ: `drawElementImage()` cho 2D, `texElementSubImage2D()` cho WebGL.
- **Geometry:** 2D tự đồng bộ vùng click và vị trí cho accessibility. Với WebGL/WebGPU bạn phải tự báo cho trình duyệt phần tử nằm ở đâu bằng `updateElementGeometry()`.
- **Cần để ý:** đơn vị (pixel lưới canvas và pixel CSS), ảnh bị mờ khi lưới canvas không khớp pixel thiết bị, và feature detection cho các trình duyệt khác.
:::

Ai từng làm UI nặng về canvas (editor, công cụ vẽ biểu đồ, cảnh 3D có màn hình trong game) đều biết cái giá phải trả. `<canvas>` cho quyền kiểm soát từng pixel và GPU, nhưng chữ vẽ bằng `fillText()` chỉ là pixel: screen reader không đọc được, người dùng không bôi đen hay copy được, Find-in-Page, dịch trang và autofill đều không chạy. Đặt HTML đè lên canvas thì giữ được các tính năng đó, nhưng lớp phủ có thể lệch khỏi cảnh khi camera di chuyển, không bao giờ nằm *sau* một vật thể 3D được, và bạn phải ghi lại `style.transform` cho từng lớp phủ ở mỗi frame.

**HTML-in-Canvas API** lên stable ở Chrome 157 sau một đợt origin trial, và nó xóa bỏ lựa chọn khó chịu đó. Dưới đây là phần tóm tắt của mình từ [tài liệu trên Chrome for Developers](https://developer.chrome.com/docs/web-platform/html-in-canvas) và [bài giới thiệu chính thức](https://developer.chrome.com/blog/html-in-canvas).

## Bạn được gì

HTML vẽ vào canvas hoạt động y như HTML bình thường:

- Dàn chữ bằng CSS, kể cả nhiều dòng và văn bản hai chiều (bidi).
- Form control thật, tùy biến bằng CSS hoặc đưa qua shader.
- Bôi đen, copy/paste và menu chuột phải, kể cả trong cảnh 3D.
- Có mặt trong accessibility tree cho screen reader.
- Dịch trang, autofill và Find-in-Page của trình duyệt, kể cả với chữ trên texture WebGL/WebGPU.
- Soi được bằng DevTools, extension trình duyệt hoạt động được, crawler và AI agent index được.
- Xuất toàn bộ cảnh bằng `toDataURL()`, `toBlob()` hoặc `captureStream()`.

## Bước 1: chuẩn bị canvas

Hai thuộc tính để bật tính năng:

- `content="drawable"` trên `<canvas>` báo trình duyệt dàn layout cho các phần tử con, thay vì coi chúng là nội dung fallback bị ẩn.
- `drawable` trên một phần tử biến nó thành một **paint root** độc lập, có thể vẽ vào canvas.

```html
<canvas id="canvas" width="600" height="400" content="drawable">
  <div id="card" drawable>
    <h2>Tiêu đề thẻ</h2>
    <p>Nội dung trong thẻ.</p>
    <!-- drawable lồng nhau: không thuộc #card, được vẽ riêng -->
    <button id="action" drawable>Hành động</button>
  </div>
</canvas>
```

Một **drawable subtree** gồm phần tử có `drawable` cùng toàn bộ phần tử con, *trừ* các phần tử con cũng có `drawable`. Trong ví dụ, vẽ `#card` sẽ ra nền, tiêu đề và đoạn văn nhưng không có nút; nút cần một lệnh vẽ riêng. Nhờ vậy bạn giữ được cấu trúc HTML có ngữ nghĩa mà vẫn đặt vị trí hay tạo animation cho từng phần tử con một cách độc lập.

## Bước 2: vẽ trong sự kiện `paint`

Trình duyệt bắn sự kiện `paint` lên canvas mỗi khi layout, nội dung chữ hoặc style của bất kỳ phần tử drawable nào thay đổi. Đó là chỗ bạn vẽ lại:

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.onpaint = (event) => {
  ctx.reset();
  ctx.drawElementImage(card, 20, 20);
  ctx.drawElementImage(action, 40, 90);

  // Chỉ những phần tử drawable đã thay đổi hình ảnh kể từ lần paint trước
  console.log(event.changedElements);
};
```

`drawElementImage()` có dạng giống `drawImage()` với 3, 5, 7 và 9 tham số (đặt vị trí, co giãn, cắt, cắt rồi co giãn), cộng thêm một object `options` tùy chọn.

Vài chi tiết về vòng đời nên biết:

- Lệnh vẽ canvas trong `paint` hiện ra ngay ở frame **hiện tại**, còn thay đổi DOM trong `paint` chỉ hiện ở frame **kế tiếp** (và kích hoạt thêm một `paint` nữa). Muốn đổi style cho frame hiện tại thì làm trong `requestAnimationFrame`, vốn chạy trước `paint`.
- Muốn tạo animation khi DOM không đổi, gọi `canvas.requestPaint()` để hẹn một `paint` ở frame sau, và gọi lại trong handler để có vòng lặp liên tục.
- Với `<canvas content="drawable">` lồng nhau, `paint` bắn theo thứ tự ngược cây DOM: canvas bên trong vẽ trước, nên canvas bên ngoài luôn vẽ được pixel mới nhất.

## Bước 3: đồng bộ geometry

Khi bạn vẽ một phần tử ở đâu đó trong canvas, trình duyệt vẫn phải biết nó nằm chỗ nào trên màn hình để làm **hit testing** (click và pointer event), trả về `getBoundingClientRect()` đúng, và báo cho công cụ hỗ trợ như kính lúp màn hình.

- **2D:** `drawElementImage()` tự cập nhật geometry dựa trên tham số và transform hiện tại của context. Truyền `{ preserveElementGeometry: true }` nếu muốn tự quản lý.
- **WebGL/WebGPU:** phần tử trở thành texture và shader có thể ánh xạ nó đi bất cứ đâu, nên trình duyệt không tự đoán được. Bạn truyền một `DOMMatrix` (đơn vị pixel CSS) vào `updateElementGeometry()`. Nếu quên, click vẫn rơi vào chỗ phần tử *từng nằm*.

Với WebGL, bạn cấp phát texture một lần rồi upload ảnh chụp DOM ở mỗi lần `paint`:

```js
const { width, height } = canvas.getElementImageDefaultSize(card);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, Math.ceil(width), Math.ceil(height), 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

canvas.addEventListener("paint", () => {
  gl.bindTexture(gl.TEXTURE_2D, cardTexture);
  gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, card);
  draw3DScene();

  // Ánh xạ border box của phần tử tới vị trí đã vẽ (pixel CSS)
  const transform = new DOMMatrix().translate(50, 100).scale(1.5);
  canvas.updateElementGeometry(card, { canvasTransform: transform });
});
```

Mỗi lần gọi `updateElementGeometry()`, phần tử được đưa lên đầu thứ tự nhận click. Với phần tử nền được cập nhật sau phần tử phía trước, truyền `preserveHitTestOrder: true` để nó không "cướp" click. Muốn gỡ một phần tử khỏi canvas mà không xóa khỏi DOM, gọi `canvas.clearElementGeometry(el)`.

## Kích thước: tránh bị mờ

Đây là chỗ dễ vấp nhất. Có ba hệ tọa độ cùng lúc: **pixel CSS**, **pixel lưới canvas** (`canvas.width`/`height`) và **pixel thiết bị**. Nếu lưới canvas không khớp số pixel thiết bị mà nó chiếm, nội dung bị khử răng cưa một lần trên lưới canvas rồi lại bị nội suy thêm lần nữa khi hiển thị, kết quả là bị mờ.

Cách sửa là đặt kích thước lưới canvas theo `devicePixelContentBoxSize` bằng `ResizeObserver`, và giữ lại tỉ lệ để quy đổi đơn vị:

```js
let scaleX = 1;
let scaleY = 1;

const observer = new ResizeObserver(([entry]) => {
  const dpc = entry.devicePixelContentBoxSize;
  const { width, height } = entry.contentRect;
  canvas.width = dpc ? dpc[0].inlineSize : Math.round(width * devicePixelRatio);
  canvas.height = dpc ? dpc[0].blockSize : Math.round(height * devicePixelRatio);
  scaleX = canvas.width / width;
  scaleY = canvas.height / height;
});

const supportsDpc = typeof ResizeObserverEntry !== "undefined" && "devicePixelContentBoxSize" in ResizeObserverEntry.prototype;
observer.observe(canvas, supportsDpc ? { box: "device-pixel-content-box" } : {});
```

Sau đó nhớ API nào dùng đơn vị nào:

| Giá trị | Đơn vị |
|---|---|
| `dx`, `dy`, `dwidth`, `dheight` của `drawElementImage()`, `getElementImageDefaultSize()` | Pixel lưới canvas |
| Vùng nguồn (`sx`, `sy`, ...), `getElementTransform()`, option của `updateElementGeometry()` | Pixel CSS |
| `offsetWidth`, `getBoundingClientRect()`, tọa độ con trỏ | Pixel CSS |

Vì vậy một số đo bằng CSS như `card.offsetWidth` phải nhân với `scaleX` trước khi dùng làm tọa độ vẽ. Nên đặt `box-sizing: border-box` cho phần tử drawable, vì `drawElementImage()` vẽ theo border box. Gán `canvas.width` sẽ xóa trắng canvas; nếu đổi kích thước ở ngoài resize observer, hãy gọi `requestPaint()` để vẽ lại.

## Accessibility

Nội dung trong `<canvas content="drawable">` nằm trong accessibility tree như DOM bình thường, trừ khi bạn ẩn bằng `aria-hidden` hoặc `inert`. Ngoại lệ duy nhất: phần tử drawable chưa được vẽ (hoặc chưa được đặt geometry) sẽ được báo **không kèm vị trí**. Screen reader vẫn đọc được ngữ nghĩa, còn công cụ trực quan như kính lúp biết để bỏ qua. Nhờ vậy bạn có thể giữ nguyên `<figure>` với `<img>` và `<figcaption>` bên trong, nhưng vẫn vẽ ảnh và chú thích riêng rẽ.

:::advanced
## Thư viện

Nếu không muốn tự xử lý ma trận, một số thư viện cộng đồng đã hỗ trợ (phần lớn còn thử nghiệm):

- **Three.js:** `THREE.HTMLTexture(element)` làm map cho material.
- **Babylon.js:** `BABYLON.HtmlTexture`.
- **PlayCanvas:** `htmlTexture.setSource(element)` trong listener `paint`.
- **PixiJS** (từ v8.19.0): `HTMLSource` trong `pixi.js/html-source`.
- **CanvasUI:** thư viện component UI dựng trên HTML-in-Canvas.

```js
const material = new THREE.MeshBasicMaterial();
material.map = new THREE.HTMLTexture(uiElement);
scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material));
```
:::

## Feature detection và fallback

Hiện API mới có trên Chrome, nên hãy kiểm tra trước:

```js
export function supportsHtmlInCanvas() {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("content", "drawable");
  return canvas.content === "drawable";
}
```

Nếu không hỗ trợ, fallback về một giao diện khác, lớp HTML nổi phía trên canvas, hoặc các thư viện như `three-html-render`, `html2canvas`, `dom-to-image`.

## Kết

HTML-in-Canvas lấp một lỗ hổng tồn tại đã lâu: bạn không còn phải hy sinh accessibility và tính năng trình duyệt để đổi lấy hiệu năng canvas và hiệu ứng shader. Phần API lõi khá nhỏ (hai thuộc tính, một sự kiện, vài hàm vẽ); việc khó thật sự là làm đúng geometry và kích thước pixel. Nếu bạn làm editor, ứng dụng canvas dày dữ liệu, WebXR hay game có UI nằm trong cảnh, đáng để thử ngay từ bây giờ, kèm feature detection.

Đọc thêm: [tài liệu trên Chrome for Developers](https://developer.chrome.com/docs/web-platform/html-in-canvas), [các khái niệm cốt lõi](https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts), [explainer và issue trên WICG](https://github.com/WICG/html-in-canvas) và [bộ sưu tập demo của cộng đồng](https://github.com/GoogleChromeLabs/css-web-ui-demos/blob/main/html-in-canvas/awesome-html-in-canvas.md).
