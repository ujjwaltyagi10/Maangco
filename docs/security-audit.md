# PrepDoc Security Audit

This audit compares the current codebase against the production security plan.

## Findings

### High: Auth tokens are persisted in `localStorage`

`AuthSession` is stored through `useLocalStorage` in [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx#L88) and the token is then reused for authenticated requests in [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts#L221).

Why this matters:

- Anything in `localStorage` is readable by JavaScript.
- If any XSS lands on the page, the auth token is exposed.
- This conflicts with the production security plan’s requirement to keep secrets out of browser storage.

### High: Google and recovery flows carry tokens in the URL

`parseAuthCallbackSearch` reads `token`, `accessToken`, and `authToken` from query parameters in [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts#L441).
Those values are then accepted by the Google callback page in [src/routes/public-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/public-routes.tsx#L128).
Reset and verify flows also use token-bearing path segments in [src/routes/route-paths.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/route-paths.ts#L24) and [src/routes/public-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/public-routes.tsx#L73).

Why this matters:

- Tokens in URLs can leak through browser history, logs, screenshots, referrers, and shared links.
- This is especially risky for password reset and email verification links.
- The plan calls for avoiding secrets in URLs wherever possible.

### High: Payment success is trusted from the client-side callback

`handlePaymentSuccess` in [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx#L311) sets `premiumAccess` to `true` immediately after Razorpay returns success.
The `handler` in [src/components/premium-modal.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/components/premium-modal.tsx#L76) calls that success path directly.

Why this matters:

- The frontend is treating a UI callback as proof of payment.
- The code comments say backend subscription is the source of truth, but the optimistic flag still unlocks premium immediately.
- If the backend/webhook check is delayed or absent, the app can temporarily grant access without server verification.

### High: Route protection is client-side only

Premium and authenticated areas are guarded in [src/routes/private-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/private-routes.tsx#L97), but the enforcement is entirely in the SPA.
The actual route elements are still rendered in the client bundle, and security depends on the frontend state staying honest.

Why this matters:

- Frontend guards are useful for UX, but they are not access control.
- The production plan requires backend authorization for premium data and sensitive routes.
- If the backend mirrors this model, direct API access or client tampering can expose premium content.

### Medium: `localStorage` is used broadly for app state without a storage policy

Several keys are written in [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx#L60) through the shared `useLocalStorage` hook in [src/hooks/use-local-storage.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/hooks/use-local-storage.ts#L1).

Why this matters:

- Most of these keys are likely safe preferences or progress state.
- There is no explicit allowlist or classification system, so a future sensitive value could be added accidentally.
- The app already had a legacy premium flag in localStorage, which is a sign this boundary has been easy to cross.

### Medium: No visible redirect allowlist or open-redirect defense in the frontend

The current route helpers in [src/routes/route-paths.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/route-paths.ts#L1) handle path mapping, but there is no general redirect validation layer for auth or checkout return URLs.

Why this matters:

- The current code does not show an open redirect bug.
- The production security plan still requires an allowlist for any future `next`, `returnUrl`, or payment callback redirect behavior.
- This is a likely future footgun if redirect support is added later.

## Positive observations

- Legacy premium localStorage state is removed on startup in [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx#L108).
- Subscription status is re-hydrated from `/api/me` rather than trusting a client flag in [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx#L303).
- Auth requests use `credentials: "include"` in [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts#L208), which is compatible with a cookie-based session design if the backend supports it.
- The payment flow already uses a hosted provider SDK instead of collecting card details manually in the app.

## Residual risks

- The repo does not include the backend, so server-side cookie policy, webhook signature verification, CSRF protection, rate limiting, and secret rotation could not be validated here.
- If the backend does not enforce premium access independently, the frontend gate is not sufficient.
- If any third-party script injects JavaScript, the current token-in-localStorage model is high risk.

## Priority fixes

1. Move auth/session state out of `localStorage` and into server-managed cookies or equivalent.
2. Stop passing auth or recovery tokens through URLs.
3. Make payment activation depend on server-side verification only.
4. Enforce premium authorization in backend APIs, not just frontend route guards.
5. Add a storage policy so sensitive values cannot be added to browser storage accidentally.

- High: auth session is persisted in localStorage in src/App.tsx via src/
  hooks/use-local-storage.ts

- High: tokens are accepted from URLs in src/lib/auth-api.ts, src/routes/
  public-routes.tsx, and src/routes/route-paths.ts

- High: payment success is trusted client-side in src/App.tsx and src/
  components/premium-modal.tsx

- High: route protection is frontend-only in src/routes/private-routes.tsx
