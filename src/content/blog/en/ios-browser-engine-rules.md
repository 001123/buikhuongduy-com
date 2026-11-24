---
title: "Why iOS Still Has No Browsers Outside WebKit"
seoTitle: "Why iOS Still Has No Non-WebKit Browsers"
description: "The EU and Japan forced Apple to allow other browser engines on iOS, yet by late 2026 not a single non-WebKit browser has launched. My summary of Mozilla's post on Apple's conditions, and what it means for people who build for the web."
pubDate: 2026-11-25T02:40:00+07:00
category: web-platform
tags: [web-platform, ios, safari, webkit, firefox, browser-engine]
---

:::tldr
- **Where things stand:** every browser on iPhone and iPad (Chrome, Firefox, Edge…) still runs on **WebKit**, Safari's engine. iOS is the only major OS with this restriction.
- **The law changed:** the EU's **DMA** (since 2024) and new rules in Japan require Apple to allow other engines. Apple published conditions for both.
- **In practice:** nearly three years in the EU and almost one in Japan, **no non-WebKit browser has shipped**. Mozilla says it plainly: Apple's conditions are unworkable.
- **Mozilla's example:** to use Gecko, Firefox would need **a separate app**, and users would have to download it and move bookmarks, passwords and history over themselves.
- **For web developers:** on iOS, "testing in Chrome" is still testing WebKit. Safari's bugs and gaps belong to every browser on the iPhone.
:::

Mozilla just published [Why there are still no non-WebKit browsers on iOS](https://blog.mozilla.org/en/mozilla/internet-policy/apple-ios-browser-engine-rules/) (November 20, 2026). It's a short policy post, but it touches something every front-end developer has run into: on an iPhone, whichever browser you pick, the engine underneath is the same.

Here's my summary, plus a few notes from the web developer side.

## Chrome on iPhone is still WebKit

Apple requires every browser on iOS to be built on WebKit. Chrome on iPhone has Google's UI, sync and account, but HTML rendering, CSS and JavaScript all run on WebKit. Same for Firefox.

Mozilla points out what this costs them: many Firefox features live inside its engine, **Gecko**, so they can't come to the iPhone. On macOS, Windows, Android and Linux people get Gecko-powered Firefox. Only iPhone and iPad are the exception.

Mozilla also calls Gecko the last major browser engine not developed by a big tech company. Blink belongs to Google, WebKit to Apple.

## The door opened, nobody got through

Since 2024 the **Digital Markets Act (DMA)** has required Apple to let EU users choose their default browser. Mozilla says millions picked Firefox and daily use on iOS doubled.

The DMA also made Apple allow alternative engines in the EU, under a set of conditions browser vendors must meet. At the time Mozilla said the rules made things "as painful as possible". Japan later introduced similar requirements, and Apple applied nearly identical conditions there.

The result after almost three years in the EU and almost one in Japan: **not one developer has launched a non-WebKit browser on iOS.**

The line I'd keep from the post:

> The real test of any rule is whether it delivers the change it was meant to achieve in practice. Compliance on paper alone falls short of that test.

The rules exist to create real choice. If the number of new choices is still zero three years later, the compliance only exists on paper.

## A "second Firefox"

Mozilla says it has been working behind the scenes since the DMA took effect to test and improve Apple's conditions, and that those efforts have largely failed. One condition bars them from disclosing non-public details about the project, so the post gives only one example.

To use Gecko, Mozilla can't just update the Firefox app people already have. It would have to ship a whole separate app. Then each user would need to:

1. Download the new app.
2. Move bookmarks, passwords and history across.
3. Switch their default browser manually.

Plenty of people would give up partway, including many who picked Firefox from the EU choice screen. Mozilla describes this as friction Apple would never accept for its own apps. The open door feels more like a trap door.

Think about it from a product team's side. An update that makes users install another app and migrate their own data will lose a big share of them. No team would choose to ship that.

## What this means if you build for the web

This part is my own take; Mozilla's post doesn't cover it.

**Testing on iOS means testing on WebKit.** Opening your page in Chrome on an iPhone tells you nothing about Blink. A layout bug in iOS Safari will almost certainly show up in Chrome, Firefox and Edge on iOS too. The real test matrix for iPhone has exactly one engine.

**Don't infer the engine from the user agent.** Chrome on iOS has `CriOS` in its UA, Firefox has `FxiOS`. Code like "if it says Chrome, use the Chrome API" breaks on iPhone. Feature detection is much safer:

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

**New features reach iPhone on one release schedule.** A new web platform API only works on iPhone once WebKit supports it, whatever browser the user installed. When you read compatibility tables on MDN or caniuse, the "Safari on iOS" column is effectively the column for the whole iPhone.

## My take

Mozilla's post is advocacy, so naturally it argues its own side. The numbers are hard to argue with, though: the rules are in force in two big markets, years have passed, and there's still no non-WebKit browser on the App Store.

For web developers, more engines on the iPhone would mean more competitive pressure on WebKit and, over time, new APIs reaching iPhone users sooner. Until then, the practical move is to treat iOS Safari as its own target: test on real devices, use feature detection, and follow WebKit's release notes.

Read the original: [Why there are still no non-WebKit browsers on iOS](https://blog.mozilla.org/en/mozilla/internet-policy/apple-ios-browser-engine-rules/) on the Mozilla blog.
