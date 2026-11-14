---
title: "Device Bound Session Credentials (DBSC): Binding Login Sessions to the Device"
seoTitle: "Device Bound Session Credentials (DBSC) Explained"
description: "Stolen session cookies let attackers skip passwords and 2FA entirely. Device Bound Session Credentials (DBSC) in Chrome bind a session to a hardware-backed key on the user's device. This post explains how DBSC works, the three changes your server needs, and the fallback cases to plan for."
pubDate: 2026-11-11T00:29:00+07:00
updatedDate: 2026-11-15T00:09:00+07:00
category: web-platform
tags: [web-platform, security, chrome, authentication, cookies]
---

:::tldr
- **The problem:** long-lived session cookies can be stolen (usually by malware) and replayed from another machine, bypassing passwords and 2FA.
- **DBSC** makes Chrome generate a key pair at login and keep the private key in secure hardware (such as a **TPM**). The session then runs on **short-lived cookies**, and every refresh requires proof that the request comes from the original device.
- **Server changes:** add a `Secure-Session-Registration` header to the login response, a **registration endpoint**, and a **refresh endpoint**. Most other endpoints stay untouched.
- **Graceful fallback:** devices without secure key storage keep working as before. Keep a long-lived cookie alongside the short-lived one to handle cases where DBSC is skipped.
:::

Most websites keep users signed in with a long-lived cookie. It is convenient, but if that cookie leaves the machine (through infostealer malware, for example), an attacker can paste it into their own browser and be signed in immediately: no password, no 2FA. Rotating the cookie more often does not help much, because the attacker simply steals the new one.

**Device Bound Session Credentials (DBSC)** tackle this at the root: the session is tied to a cryptographic key that cannot leave the device. Below is my summary of the [Chrome for Developers guide](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials) and the [W3C specification](https://w3c.github.io/webappsec-dbsc/).

## How DBSC Works

At a high level:

1. When the user signs in, Chrome generates a **key pair** for the session. The private key is stored in secure hardware such as a [TPM](https://en.wikipedia.org/wiki/Trusted_Platform_Module) when available, so it cannot be copied out.
2. The server switches the session to **short-lived cookies** (for example, 10 minutes).
3. When the short-lived cookie expires, Chrome **pauses** the pending request, signs a challenge from the server with the private key, receives a new cookie, and then resumes the original request.

A stolen cookie is therefore only valid for a few minutes. To keep the session alive, an attacker would need the private key, which stays inside the hardware of the original device.

If the device has no secure key storage, DBSC falls back to normal behavior and the login flow does not break.

## What You Need to Change

DBSC is designed to be **additive**. You only need to:

- Add a `Secure-Session-Registration` header to the response after a successful login.
- Add a **session registration** endpoint: store the public key, return the session configuration, and switch to short-lived cookies.
- Add a **refresh** endpoint: issue a challenge, verify the signature, and set a new short-lived cookie.

Your other endpoints keep checking the session cookie as usual. When the cookie is missing or expired, Chrome refreshes it on its own before sending the request, so your application code barely notices.

![Diagram of the DBSC flow](https://developer.chrome.com/static/docs/web-platform/device-bound-session-credentials/image/dbsc-flow.png)

### 1. Modify the Login Flow

After the user signs in, return the usual long-lived cookie together with the `Secure-Session-Registration` header:

```http
HTTP/1.1 200 OK
Secure-Session-Registration: (ES256 RS256);path="/StartSession";challenge="random_challenge"
Set-Cookie: auth_cookie=session_id; max-age=2592000; Domain=example.com; Secure; SameSite=Lax
```

`(ES256 RS256)` lists the signing algorithms the server accepts. If the device supports secure key storage, Chrome calls `/StartSession` and sends the public key inside a JWT signed over the `challenge`. The example in Chrome's guide omits `challenge`. When I tried it without one, Chrome still called `/StartSession` but sent no JWT and no public key.

The cookie name (`auth_cookie` here) is up to you. It only has to match the `name` field in the session configuration in the next step.

### 2. Session Registration Endpoint

At `/StartSession`, the server:

- Associates the received public key with the user's session.
- Returns the session configuration as JSON.
- Replaces the long-lived cookie with a short-lived one.

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

A few points worth noting:

- `scope` defines which requests the session covers. In the example, `/static` is excluded so static assets never wait for a cookie refresh.
- `credentials` tells Chrome which cookie DBSC manages and which attributes it must have.
- DBSC **only applies to HTTPS** and **does not support Partitioned cookies**. The spec does not require the `Secure` attribute, but plain HTTP requests are not protected by DBSC.

### 3. Refresh Endpoint

When the short-lived cookie expires, Chrome and the server run a short exchange:

1. Chrome defers the user's request and sends a refresh request:

   ```http
   POST /RefreshEndpoint HTTP/1.1
   Sec-Secure-Session-Id: session_id
   ```

2. The server responds with a challenge:

   ```http
   HTTP/1.1 403 Forbidden
   Secure-Session-Challenge: "challenge_value";id="session_id"
   ```

3. Chrome signs the challenge with the private key and retries:

   ```http
   POST /RefreshEndpoint HTTP/1.1
   Sec-Secure-Session-Id: session_id
   Secure-Session-Response: <JWT proof>
   ```

4. The server verifies the signature against the stored public key and issues a new short-lived cookie:

   ```http
   HTTP/1.1 200 OK
   Set-Cookie: auth_cookie=short_lived_grant; Max-Age=600; Domain=example.com; Secure; SameSite=Lax
   ```

5. Chrome receives the cookie and resumes the deferred request.

:::advanced
## Alternative Pattern: Two Cookies

To be more resilient, Chrome suggests keeping **two cookies** in parallel:

- A **long-lived** cookie not managed by DBSC. It persists even when DBSC fails and is used only to issue new short-lived tokens.
- A **short-lived** cookie refreshed through DBSC, required for sensitive operations (changing the password, payments, viewing personal data, and so on).

This lets you tell a truly unauthenticated request apart from a temporary DBSC failure, and decide for yourself how strict to be: for example, allow normal reads with only the long-lived cookie, but require the short-lived cookie (or a re-login) for sensitive actions.
:::

## Fallback Cases to Plan For

Chrome may skip DBSC and send the request **without the short-lived cookie** when:

- The refresh endpoint is unreachable (network errors, server issues).
- The TPM is busy or fails to sign. The TPM is shared across the whole system, so refreshing too often can hit its rate limits. Do not set the cookie lifetime too short.
- The short-lived cookie is a third-party cookie and the user has blocked third-party cookies.

In these cases Chrome falls back to the long-lived cookie **if one still exists**. That is another reason the two-cookie pattern above is worth considering: with only the short-lived cookie, the request goes out with no cookie at all and the user appears signed out.

## Limitations

DBSC is not a silver bullet. If malware is **already on the device at registration time**, it may be able to extract the private key and hijack the session like any other cookie theft. Attacks that require malware at the moment of login, or modified TPM drivers, are much more complex and easier to detect than simply copying a cookie file, though. DBSC significantly raises the cost of session theft rather than eliminating it.

## What I Found Trying It

I built a minimal Node server with `/login`, `/StartSession`, `/refresh` and one authenticated endpoint, then ran it against Chrome 157 on a MacBook M4 Pro (November 14, 2026, fresh profile, no flags). The short-lived cookie lasted 60 seconds so the behavior was easy to watch.

**HTTPS only, even on localhost.** On `http://localhost`, Chrome silently ignored the registration header: no request, no console warning. On `https://localhost` with a self-signed certificate, `/StartSession` was called right away, always with ES256. The Mac has no TPM, but DBSC was still on by default. Each signature took about 8–16 ms, which suggests a hardware-backed key, though I couldn't verify that directly.

**Refresh is nearly invisible.** When the short-lived cookie expired, Chrome held the request for about **93 ms** while it refreshed. The server never received a request without the cookie. If the server sends the next challenge ahead of time in the success response, Chrome skips the 403 round trip and the hold drops to about **16 ms**. One caveat: Chrome still signed a challenge that was 70 seconds old, so the server must enforce challenge freshness itself. With a 60-second cookie, Chrome refreshed on almost every request even with about 54 seconds left. With 600 seconds it didn't. A very short lifetime means a signature on nearly every request.

**Simulated cookie theft.** Cookies copied into curl or another Chrome profile worked immediately. After 65 seconds the stolen short-lived cookie expired and couldn't be refreshed, since the thief has no key. A proof signed with a different key was rejected. Meanwhile the victim's session kept refreshing normally. But **the 30-day long-lived cookie still opened everything that only required it**. DBSC protects only the endpoints where the server insists on the short-lived cookie. If you use the two-cookie pattern, don't let the long cookie unlock sensitive data on its own.

**When the server fails.** With the refresh endpoint returning 500, Chrome didn't block the user: the request went out without the short cookie, plus a `Secure-Session-Skipped: server_error` header. After 4 failures in a row Chrome paused calls to `/refresh`, and resumed within 15 seconds of the server recovering.

The most time-consuming parts were all formatting details, and I've fixed the examples above accordingly:

- The registration header needs `challenge="…"`.
- The challenge header needs `;id="<session>"`. Without it, Chrome abandons the refresh and doesn't retry.
- Chrome sends `Sec-Secure-Session-Id` and `Secure-Session-Response` **unquoted**, unlike the spec, so the server should accept both forms.
- The JWT contains only `jti` (the challenge) and `authorization`, with no `aud`/`iat`/`exp`. The public key sits in the JWT header and only at registration. The ES256 signature is raw 64 bytes, so Node needs `dsaEncoding: "ieee-p1363"`.
- The best debugging tool is the DevTools Protocol event `Network.deviceBoundSessionEventOccurred`. It tells you exactly why registration or refresh failed.

My take: DBSC already works on desktop Chrome with no flags, and the server side isn't much work. The hard part is getting every quote and parameter in the headers right while the docs and the browser still disagree.

## Wrapping Up

DBSC fixes a long-standing weakness of cookie-based sessions with fairly few changes: one extra header at login and two new endpoints. Users on supported hardware are protected without noticing anything, and everyone else keeps working as before. If your application holds sensitive data, especially if you have seen account takeovers through stolen cookies, DBSC is worth adding to your roadmap.

Further reading: [the Chrome for Developers guide](https://developer.chrome.com/docs/web-platform/device-bound-session-credentials) and [the DBSC specification](https://w3c.github.io/webappsec-dbsc/). Other front-end security concerns (where to store tokens, permissions in the UI) are covered in the [front-end system design cheatsheet](/en/blog/frontend-system-design-cheatsheet/).
