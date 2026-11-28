---
title: "Rebuilding My Personal Site in 3 Days with AI Agents, and Chasing a 100 Score"
seoTitle: "Rebuilding My Personal Site in 3 Days with AI Agents"
description: "Honest notes on rebuilding buikhuongduy.com: a new title, a pixel-art UI with 4 AI agents, SEO, then chasing a 100 mobile PageSpeed score across 10 PRs. Including where I am still stuck at 99."
pubDate: 2026-11-28T17:30:00+07:00
category: ai
tags: [ai, agents, astro, performance, lighthouse, accessibility]
---

:::tldr
- From Nov 26 to 28, 2026, I rebuilt most of this site: a **new title**, a **new UI**, **SEO** and a run of performance and accessibility fixes. **10 PRs** in total, plus a few large UI commits.
- How: every task was its own thread with **Claude Code**. The agent wrote the code and opened a PR; I read the diff and merged. **Lighthouse CI** blocks any PR that drops a score below 100.
- Biggest lesson: a green 100 in CI does not mean real PageSpeed is 100. Production got stuck at **99** several times, each time for a different reason.
- I dropped web fonts entirely for **system fonts**. Lab mobile LCP went from about **1.9 s** to **1.3 s**.
- Real mobile PageSpeed is still **99** today. The last culprit is the Cloudflare Web Analytics beacon, injected automatically at the edge.
:::

I am looking for a new job this November, so this site is the first thing a recruiter sees. Reading it again, I saw three problems.

My title was inconsistent. The site said "Front-End Lead (AI-Native)", my CV said something else, and GitHub said "Front-end developer". The home page had no projects section and no easy-to-find LinkedIn or GitHub links. And I want to apply for both Frontend and Full-Stack roles, so the old intro was simply out of date.

So I rebuilt it. This post goes through it in the order it happened, with the numbers from each PR.

![The new buikhuongduy.com home page: the Lead/Senior Frontend and Full-Stack Engineer title and a pixel-art office with Duy in the middle orchestrating 4 agents: Claude, Codex, Antigravity and OpenCode](../../../assets/blog/site-revamp-home-hero.webp)

## How I worked with agents

I write about [AI-Native](/en/blog/what-is-ai-native/) a lot, so this time I wanted to work exactly the way I describe it.

Every task was a separate thread with Claude Code running in the cloud. I described the problem; the agent read the code, made the fix, ran Lighthouse on its own machine and opened a PR. Every PR has a "Cause", a "Fix" and before/after numbers. I read the diff, asked questions when something looked off, then merged.

The big UI work I did on my own machine, with several agents running in parallel on separate git worktrees. That is also why I built [KD Code](/en/blog/why-i-built-kd-code/).

What kept everything from breaking was CI. The GitHub Actions workflow has a Lighthouse job that runs on 7 pages, and every category must score exactly 1:

```js
// lighthouserc.cjs
'categories:performance': ['error', { minScore: 1, aggregationMethod: 'optimistic' }],
'categories:accessibility': ['error', { minScore: 1 }],
'categories:best-practices': ['error', { minScore: 1 }],
'categories:seo': ['error', { minScore: 1 }],
'categories:agentic-browsing': ['error', { minScore: 1 }],
```

An agent can write code faster than I can. It can also drop a score without anyone noticing. A hard 100 threshold in CI lets me hand off work without watching over it.

## Day 1: new title and SEO

The first PR (#1) only changed text. The intro became **"Lead/Senior Frontend Engineer & Full-Stack Developer (AI-Native)"** across the hero, `<title>`, `og:title`, meta descriptions, JSON-LD, the About page and even an answer in the recruiter mini game. Both Vietnamese and English.

The second PR (#2) cleaned up what users do not see but Google and social networks do:

- The OG image still showed the old title. The agent redrew the text panel with the same layout and colors.
- The home description was 204 characters and About was 183. Google cuts at around 155–160. Both languages now sit at 141–147.
- The `Person` JSON-LD gained a home location, past employers and a link to my CV.

Neither PR was hard. I mention them because this is where people often slip: they change the visible title and forget the OG image and structured data.

## Days 2–3: the new UI

This is my favorite part. The site got a new orange palette, a mobile navigation bar and a completely different hero: a **pixel-art office**.

I sit in the middle at the "lead desk". Around me are 4 desks for the 4 agents I use every day: Claude, Codex, Antigravity and OpenCode. Each desk has a signal line to mine and a speech bubble saying what that agent is doing, like "Split the spec; run 4 agents across git worktrees." Click a desk and the bubble jumps to it. On mobile there is also a row of buttons to pick a station.

I wanted visitors to understand how I work within the first 3 seconds, before reading a word.

Beyond the hero:

- A tabbed experience timeline.
- A `duy.stack.ts` grid of 28 technologies, grouped into Adopt, Trial and Assess rings. Click "Radar" to see it as a Tech Radar.
- A projects section with pixel GIFs and several links per project (store, source, marketplace).
- A small mini game where recruiters can check whether I fit their team.
- A theme toggle that reveals the new theme in a circle from where you click.

It is all Astro, rendered to static HTML. JavaScript only ships where something is actually interactive.

## Chasing 100

Every PR passed CI at 100. Then I ran [PageSpeed Insights](/en/blog/pagespeed-insights-explained/) against production and saw **99** on mobile. A few runs even showed 98.

It is one point. But this site once had a [perfect 100/100/100/100](/en/blog/perfect-lighthouse-score/), and I use it as proof that I can do performance work. So I chased it.

### Round 1: fonts

The LCP element was the pixel office background. Lighthouse showed it waiting on **6 woff2 files** for Be Vietnam Pro and JetBrains Mono. Simulated LCP was 2.0 s.

The agent tried four things before touching the fonts:

- Preloading the hero with `fetchpriority="high"`: barely moved.
- A smaller mobile hero image: still waiting on fonts.
- Dropping only the mono font: not enough.
- Deferring fonts until after `load`: LCP fell to 1.2 s, but the font swap forced a relayout and TBT jumped to **178 ms**.

I had seen the font bottleneck before: adding just one more weight or subset dropped the home page to 0.98.

In the end I chose to drop web fonts and use system font stacks (#3). The page now makes zero font requests. Lab LCP went to **1.28–1.36 s**, and all 6 runs scored 100.

That decision was mine; the agent only brought the numbers. I like Be Vietnam Pro and I miss it. But on a frontend developer's portfolio, the performance score says more than a typeface does.

### Round 2: the poster image

Still 99, LCP 1.9 s. The mobile LCP image is a 960px poster of the office. The agent re-encoded it from the 1376px original at WebP quality 65 (#6):

| | Before | After |
| --- | --- | --- |
| Light poster | 43.6 KB | 31.4 KB |
| Dark poster | 30.6 KB | 20.2 KB |

For pixel art, I could not see a difference in a zoomed side-by-side. Simulated LCP dropped from about 1.66 s to 1.51 s.

### Round 3: Google Analytics

Still 99 in production, while local and CI said 100. What was different?

CI uses a dummy GA ID that loads nothing real. Production loads the real `gtag.js`. Partytown injects its snippet in `<head>`, boots at `DOMContentLoaded`, then immediately fetches its service worker, the sandbox iframe and `gtag.js`. All of that competes for bandwidth with the poster image, and Lighthouse counts every request that starts before LCP in the simulated LCP.

The fix in #7: boot Partytown only after `load` plus `requestIdleCallback`. GA still runs in a worker; it just arrives a bit later.

:::advanced
### Replacing the official integration with a tiny one

`@astrojs/partytown` always injects its snippet in `<head>` and has no option to defer it. So the agent replaced it with a small custom integration that does one thing: copy Partytown's lib files to `/~partytown/`, using the same `copyLibFiles` the official one calls.

`Analytics.astro` rebuilds the snippet with `partytownSnippet()`, plus the script that keeps the iframe alive across `ClientRouter` navigations. It is appended after `load` + `requestIdleCallback` (3 s timeout), guarded so it boots only once.

Checked: the Partytown sandbox request now starts after `loadEventEnd`, and both GA scripts carry `type="text/partytown-x"`. Why adding GA did not change the score in the first place is in my [gtag post](/en/blog/why-gtag-did-not-lower-lighthouse-score/).
:::

### Round 4: a lighter home page

LCP was still about 1.8 s. This time the agent hunted down everything that loaded alongside the hero image and cut it (#9):

1. **Tech Radar built on demand.** The radar stays hidden until someone clicks "Radar", yet its 28 blip buttons were already in the HTML. Now they are cloned from the stack grid the first time it opens.
2. **Post CSS split out.** CSS for prose, code blocks, Mermaid and reading modes moved to `content.css`, which only post pages include. The home page no longer inlines it.
3. **Small JS chunks inlined.** `assetsInlineLimit` now inlines `.js` files up to 8 KB, which covers the mascot and command palette scripts. Two fewer requests competing with the hero.

Home HTML went to 66.0 KB gzipped (from 68.7 KB) and simulated LCP to 1.35–1.5 s.

## Accessibility: the small things Lighthouse caught

Alongside performance came a series of accessibility bugs. Each one was small, and each one cost points.

**The speech bubble covered my face (#4).** On mobile, the first paint put the bubble on top of my head instead of above it. The server-rendered position was a fixed `translate3d(-50%, 3.5rem, 0)`, and the script skipped updates while my station was active. The initial position now comes from my head's anchor in CSS, matching the JS math. No JS needed, no layout shift.

**`role="tabpanel"` on an `<article>` (#5).** ARIA does not allow that, and Lighthouse's new **Agentic Browsing** category flagged it. Switching to a `<div>` fixed it. I also added `categories:agentic-browsing` to CI so it cannot slip in again.

**Truncated tech names (#8).** On tablet and mobile, the stack grid showed "TypeScri…", "Kubernet…", "Anti…". The agent hid the ring word (keeping the colored dot, with the word still there for screen readers), let names wrap to 2 lines, and used 1 column under 400px.

**Two links both named "GitHub" (#10).** The Simple OTP source link and my GitHub profile link both read "GitHub" but went to different places. An `aria-label` of "Simple OTP source code on GitHub" fixed it; the visible text stays the same.

One more trap from the reveal animations: a card waiting to animate in must stay at a full `opacity: 0`. If it sits half-transparent, axe measures contrast at that moment and reports a failure.

## Where I am still stuck

After 10 PRs, local Lighthouse without the beacon scores 100. Real mobile PageSpeed is still **99**, with LCP at 1.8 s.

What still loads before LCP is Astro's `ClientRouter` and the **Cloudflare Web Analytics** beacon. The beacon is not in my code. Cloudflare injects it into the HTML at the edge, so CI never sees it.

The fix would be to turn off auto-injection and load the beacon myself after `load`, the same way I did with GA. I have not done it yet because it touches Cloudflare settings, and I want to be sure analytics data does not drop. I will update this post when it is done.

## What I took away

**CI at 100 is necessary, not sufficient.** The CI lab has no real GA, no Cloudflare beacon and no edge headers. It catches problems in my code, but nothing added after the build. I now re-check production with PageSpeed after every deploy.

**Measure first, then fix.** None of the PRs above was a guess. Each has a specific cause, before and after numbers, and the approaches that did not work. Agents are very good at this if you ask for it from the start.

**The agent types, I own the result.** The agent found the 6 font files blocking LCP. Which fonts to drop, which trade-off to accept and when to stop at 99 were still my calls. To me, that is what working AI-Native means: less time typing, more time reading diffs and making decisions.

Three days, 10 PRs, and a site that finally feels like me. If your team needs a frontend or full-stack engineer who cares about performance and is used to working with AI agents: **I am open to new opportunities**. [Get in touch](/en/contact/).
