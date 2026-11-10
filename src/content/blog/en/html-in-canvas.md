---
title: "HTML-in-Canvas: Drawing Live, Accessible DOM into 2D, WebGL and WebGPU"
description: "Chrome 157 ships the HTML-in-Canvas API: draw live DOM subtrees into 2D, WebGL or WebGPU canvases while keeping interactivity, accessibility, Find-in-Page and translation. This post covers the drawable attribute, the paint event, geometry sync, sizing pitfalls and fallbacks."
pubDate: 2026-11-11
category: web-platform
tags: [web-platform, canvas, webgl, webgpu, accessibility, chrome]
---

:::tldr
- **The problem:** canvas apps had to choose between drawing text as pixels (`fillText()`, no accessibility or browser features) and floating HTML overlays (drift, z-order limits, per-frame `style.transform` work).
- **HTML-in-Canvas** (stable in **Chrome 157**) lets you draw live DOM subtrees into a 2D, WebGL or WebGPU canvas. The content stays selectable, accessible, translatable and searchable with Find-in-Page.
- **Three building blocks:** `content="drawable"` on the `<canvas>` plus `drawable` on elements, the `paint` event that fires when drawable content changes, and drawing calls: `drawElementImage()` in 2D, `texElementSubImage2D()` in WebGL.
- **Geometry:** 2D syncs hit testing and accessibility bounds automatically. In WebGL/WebGPU you must tell the browser where the element ended up with `updateElementGeometry()`.
- **Watch out for:** units (canvas grid pixels vs CSS pixels), blurry output when the canvas grid doesn't match device pixels, and feature detection for other browsers.
:::

Anyone who has built a canvas-heavy UI (an editor, a chart tool, a 3D scene with an in-game screen) knows the trade-off. A `<canvas>` gives you pixel-level control and the GPU, but text drawn with `fillText()` is just pixels: screen readers can't read it, users can't select or copy it, and Find-in-Page, translation and autofill don't work. Putting HTML on top of the canvas keeps those features, but the overlay can drift from the scene when the camera moves, it can never sit *behind* a 3D object, and you end up rewriting `style.transform` for every overlay on every frame.

The **HTML-in-Canvas API**, which reached stable in Chrome 157 after an origin trial, removes that choice. Below is my summary of the [Chrome for Developers documentation](https://developer.chrome.com/docs/web-platform/html-in-canvas) and the [launch post](https://developer.chrome.com/blog/html-in-canvas).

## What You Get

HTML drawn into a canvas behaves like regular HTML:

- Text layout with CSS, including multiline and bidirectional text.
- Real form controls that you can style with CSS or run through shaders.
- Text selection, copy and paste, and context menus, even inside a 3D scene.
- Exposure in the accessibility tree for screen readers.
- Browser translation, autofill and Find-in-Page, including for text on WebGL/WebGPU textures.
- DevTools inspection, browser extensions, and indexing by crawlers and AI agents.
- Export of the composite with `toDataURL()`, `toBlob()` or `captureStream()`.

## Step 1: Prepare the Canvas

Two attributes opt content in:

- `content="drawable"` on the `<canvas>` tells the browser to lay out its children instead of treating them as hidden fallback content.
- `drawable` on an element makes it an independent **paint root** that you can draw into the canvas.

```html
<canvas id="canvas" width="600" height="400" content="drawable">
  <div id="card" drawable>
    <h2>Card title</h2>
    <p>Text inside the card.</p>
    <!-- Nested drawable: excluded from #card, drawn separately -->
    <button id="action" drawable>Action</button>
  </div>
</canvas>
```

A **drawable subtree** is an element with `drawable` plus all its descendants, *except* nested descendants that also carry `drawable`. In the example, drawing `#card` renders the panel, heading and paragraph but not the button; the button needs its own draw call. This lets you keep semantic HTML structure while positioning or animating children independently.

## Step 2: Draw on the `paint` Event

The browser fires a `paint` event on the canvas whenever the layout, text or styles of any drawable descendant change. That is where you redraw:

```js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.onpaint = (event) => {
  ctx.reset();
  ctx.drawElementImage(card, 20, 20);
  ctx.drawElementImage(action, 40, 90);

  // Only the drawable elements that visually changed since the last paint
  console.log(event.changedElements);
};
```

`drawElementImage()` mirrors `drawImage()` with 3, 5, 7 and 9 argument forms (position, scaled, cropped, cropped and scaled), plus an optional `options` object.

A few lifecycle details are worth knowing:

- Canvas drawing inside `paint` shows up in the **current** frame, but DOM changes made inside `paint` only show up in the **next** one (and trigger another `paint`). To change styles for the current frame, do it in `requestAnimationFrame`, which runs before `paint`.
- To animate without any DOM change, call `canvas.requestPaint()` to schedule a `paint` on the next frame, and call it again inside the handler for a continuous loop.
- With nested `<canvas content="drawable">`, `paint` fires in reverse tree order: the inner canvas paints first, so the outer one draws up-to-date pixels.

## Step 3: Sync Geometry

When you draw an element somewhere in a canvas, the browser still has to know where it is on screen for **hit testing** (clicks and pointer events), `getBoundingClientRect()`, and accessibility tools such as magnifiers.

- **2D:** `drawElementImage()` updates the geometry automatically from its arguments and the current transform. Pass `{ preserveElementGeometry: true }` if you want to manage it yourself.
- **WebGL/WebGPU:** the element becomes a texture and your shader can map it anywhere, so the browser can't guess. You pass a `DOMMatrix` (in CSS pixels) to `updateElementGeometry()`. If you stop doing that, clicks keep landing where the element *used to be*.

In WebGL, you allocate the texture once and then upload the DOM snapshot on each `paint`:

```js
const { width, height } = canvas.getElementImageDefaultSize(card);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, Math.ceil(width), Math.ceil(height), 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

canvas.addEventListener("paint", () => {
  gl.bindTexture(gl.TEXTURE_2D, cardTexture);
  gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, card);
  draw3DScene();

  // Map the element's border box to where it was drawn (CSS pixels)
  const transform = new DOMMatrix().translate(50, 100).scale(1.5);
  canvas.updateElementGeometry(card, { canvasTransform: transform });
});
```

Each `updateElementGeometry()` call moves the element to the top of the hit-test stack. For background elements updated after foreground ones, pass `preserveHitTestOrder: true` so they don't steal clicks. To "undraw" an element without removing it from the DOM, call `canvas.clearElementGeometry(el)`.

## Sizing: Avoid Blurry Output

This is the part most likely to trip you up. Three coordinate systems are in play: **CSS pixels**, **canvas grid pixels** (`canvas.width`/`height`) and **device pixels**. If the canvas grid doesn't match the device pixels it covers, the content is anti-aliased once onto the canvas grid and then resampled again onto the screen, so it looks blurry.

The fix is to size the canvas grid from `devicePixelContentBoxSize` with a `ResizeObserver`, and keep the ratio around for unit conversion:

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

Then remember which unit each API uses:

| Value | Unit |
|---|---|
| `dx`, `dy`, `dwidth`, `dheight` of `drawElementImage()`, `getElementImageDefaultSize()` | Canvas grid pixels |
| Source rectangles (`sx`, `sy`, ...), `getElementTransform()`, `updateElementGeometry()` options | CSS pixels |
| `offsetWidth`, `getBoundingClientRect()`, pointer coordinates | CSS pixels |

So a CSS measurement like `card.offsetWidth` must be multiplied by `scaleX` before you use it as a drawing coordinate. Also set `box-sizing: border-box` on drawable elements, since `drawElementImage()` draws the border box. Setting `canvas.width` clears the canvas; if you change it outside the resize observer, call `requestPaint()` to redraw.

## Accessibility

Content inside `<canvas content="drawable">` is in the accessibility tree like normal DOM unless you hide it with `aria-hidden` or `inert`. The one exception: a drawable element that hasn't been drawn yet (or had its geometry set) is reported **without geometry**. Screen readers can still read the semantics, while visual tools such as magnifiers know to skip it. That means you can keep a `<figure>` with its `<img>` and `<figcaption>` intact and still draw the image and caption separately.

:::advanced
## Libraries

If you'd rather not handle matrices yourself, several community libraries already have (mostly experimental) support:

- **Three.js:** `THREE.HTMLTexture(element)` as a material map.
- **Babylon.js:** `BABYLON.HtmlTexture`.
- **PlayCanvas:** `htmlTexture.setSource(element)` inside a `paint` listener.
- **PixiJS** (v8.19.0+): `HTMLSource` from `pixi.js/html-source`.
- **CanvasUI:** a UI component library built on HTML-in-Canvas.

```js
const material = new THREE.MeshBasicMaterial();
material.map = new THREE.HTMLTexture(uiElement);
scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material));
```
:::

## Feature Detection and Fallback

The API is only in Chrome for now, so detect it first:

```js
export function supportsHtmlInCanvas() {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("content", "drawable");
  return canvas.content === "drawable";
}
```

When it's missing, fall back to an alternative UI, floating HTML overlays, or libraries such as `three-html-render`, `html2canvas` or `dom-to-image`.

## Wrapping Up

HTML-in-Canvas fixes a long-standing gap: you no longer have to give up accessibility and browser features to get canvas performance and shader effects. The core API is small (two attributes, one event, a couple of draw methods), and the real work is getting geometry and pixel sizing right. If you build editors, data-dense canvas apps, WebXR or games with in-scene UI, it's worth trying now behind feature detection.

Further reading: [the Chrome for Developers docs](https://developer.chrome.com/docs/web-platform/html-in-canvas), [core concepts](https://developer.chrome.com/docs/web-platform/html-in-canvas/concepts), [the WICG explainer and issues](https://github.com/WICG/html-in-canvas) and [the community demo collection](https://github.com/GoogleChromeLabs/css-web-ui-demos/blob/main/html-in-canvas/awesome-html-in-canvas.md).
