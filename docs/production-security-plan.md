# PrepDoc Production Security Plan

This document defines the security baseline required to ship PrepDoc as a production-ready product, with special focus on auth, subscriptions, payment processing, premium content, and all browser-accessible storage and routing surfaces.

## Security goals

- Protect payment and subscription flows end to end.
- Prevent unauthorized access to premium content.
- Reduce XSS, CSRF, token theft, and session hijacking risk.
- Keep secrets and sensitive state out of the browser whenever possible.
- Make access control decisions on the server, not just in the UI.
- Add enough logging and monitoring to detect abuse quickly.

## Scope

This plan covers:

- Landing pages and marketing pages.
- Sign in, sign up, and logout flows.
- Subscription checkout and payment gateway integration.
- Dashboard and premium content access.
- API routes, route guards, redirects, and deep links.
- Browser storage such as localStorage, sessionStorage, and cookies.
- Server-side session management.
- Security headers, validation, rate limiting, and observability.

## Core principle

The browser should never be the source of truth for auth, subscription, or entitlements.

Use the UI only to present state. Enforce all sensitive decisions on the backend.

## Required security posture

### 1. Authentication and session handling

- Use server-issued sessions or short-lived access tokens stored in `httpOnly` cookies.
- Mark cookies as `Secure`, `HttpOnly`, and `SameSite=Lax` or stricter where possible.
- Use `SameSite=Strict` for session flows if it does not break the payment provider redirect flow.
- Rotate session identifiers after login, privilege changes, and password resets.
- Invalidate sessions on logout and on suspicious activity.
- Set idle timeout and absolute expiration for sessions.
- Support account recovery without exposing session tokens in URLs or client storage.

### 2. Local storage and browser storage

- Do not store auth tokens, refresh tokens, payment tokens, or subscription secrets in `localStorage`.
- Avoid `sessionStorage` for anything security-sensitive unless there is a very specific short-lived UX need.
- Treat all browser storage as readable by JavaScript and therefore unsafe for secrets.
- If a non-sensitive preference must be stored client-side, keep it minimal and non-identifying.
- Never place secrets in query params, fragment identifiers, or client-side logs.

### 3. URL and routing security

- Do not encode secrets, tokens, or payment identifiers in URLs.
- Validate and sanitize all route params, query params, and redirect targets.
- Use an allowlist for redirects after login or payment completion.
- Block open redirect patterns such as arbitrary `next`, `returnUrl`, or `redirectTo` values.
- Normalize routes before authorization checks.
- Enforce authorization on server-side route handlers, not only in frontend guards.
- Treat direct page access, deep links, and refreshed routes as untrusted entry points.

### 4. Authorization and premium access

- Check subscription status on the backend for every premium API request.
- Never trust a hidden button, disabled UI, or client-side flag to grant access.
- Use server-side entitlement checks for:
  - Company filters.
  - Premium questions.
  - Roadmap depth.
  - Bookmarks and saved progress if they are premium-only.
  - Analytics or export features if introduced later.
- Return consistent unauthorized or payment-required responses.
- Keep free and premium data separated at the API and data-access layer.

### 5. Payment gateway security

- Use a trusted payment provider flow and keep card data off your servers whenever possible.
- Prefer hosted checkout or provider-managed elements over custom card collection.
- Verify payment completion server-side using provider webhooks, not frontend success screens.
- Verify webhook signatures before trusting payment events.
- Make webhook handlers idempotent.
- Treat the frontend success callback as informational only.
- Update subscription state only after server verification.
- Reconcile provider events against local subscription records.
- Log payment state transitions, but never log card details, full payment payloads, or secrets.

### 6. CSRF protection

- Protect any cookie-authenticated state-changing request with CSRF defenses.
- Use CSRF tokens or double-submit protections where appropriate.
- Keep `SameSite` settings strict enough to reduce cross-site request risk.
- Require safe HTTP methods for reads and separate mutation endpoints clearly.

### 7. XSS prevention

- Escape all user-generated content by default.
- Avoid `dangerouslySetInnerHTML` unless content is fully sanitized and reviewed.
- Sanitize any rich text, markdown, or HTML before rendering.
- Prefer strict content rendering rules over ad hoc sanitization at the view layer.
- Add a strong Content Security Policy to reduce script injection impact.
- Do not inject untrusted values into script, style, or HTML attribute contexts.

### 8. Security headers

Apply a production security header baseline:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options` or CSP `frame-ancestors`

Recommended behavior:

- Force HTTPS everywhere.
- Block framing unless there is a specific business need.
- Restrict scripts, fonts, and API origins to known trusted domains.
- Limit referrer leakage for payment and auth pages.

### 9. Input validation and API hardening

- Validate all request bodies, params, and query strings on the server.
- Use schema validation for every public API route.
- Reject malformed or unexpected payloads early.
- Limit payload sizes to reduce abuse.
- Treat all client data as untrusted, including hidden form fields.
- Apply rate limits to auth, checkout, webhook, and search endpoints.
- Add brute-force protection for login and password reset flows.

### 10. Secret management

- Keep API keys, webhook secrets, JWT signing keys, and provider credentials in environment variables or a secrets manager.
- Never commit secrets to the repository.
- Rotate secrets regularly and immediately after exposure.
- Separate development, staging, and production credentials.
- Use least-privilege keys for each service.

### 11. Logging and monitoring

- Log auth failures, payment failures, webhook errors, and suspicious route access.
- Redact personal data and secrets from logs.
- Add alerts for repeated failed logins, webhook verification failures, unusual payment reversals, and access spikes on premium routes.
- Keep audit trails for subscription state changes.

### 12. Deployment and transport security

- Serve the application only over HTTPS.
- Redirect HTTP to HTTPS at the edge.
- Use secure domain configuration for cookies and callbacks.
- Restrict CORS to known application origins.
- Do not use wildcard CORS with credentialed requests.

## High-risk surfaces and required controls

### Landing and marketing pages

- Prevent injected scripts through analytics, chat widgets, or embedded previews.
- Audit third-party scripts before enabling them.
- Keep CTA links and external destinations on an allowlist.

### Auth pages

- Rate limit login, sign up, password reset, and OTP endpoints.
- Do not reveal whether an email exists unless intentionally designed.
- Keep redirect targets validated after auth completion.

### Dashboard

- Fetch data with authenticated server-side APIs.
- Re-check entitlement on every premium fetch.
- Do not rely on hidden UI controls to block access.

### Payment and checkout

- Use provider-hosted payment UI where possible.
- Confirm payment success from webhook events.
- Prevent duplicate charge or duplicate activation issues with idempotency keys.
- Ensure refund, cancellation, and renewal events reconcile cleanly.

### Webhooks

- Verify every webhook signature.
- Reject replayed, unsigned, or malformed events.
- Return fast, deterministic responses.
- Process events idempotently and in a controlled order.

## Route protection model

Use three layers of protection:

1. Frontend route guards for UX only.
2. Backend authorization for actual access control.
3. Data-layer checks for sensitive records and premium content.

Rules:

- Unauthenticated users can reach only public routes.
- Authenticated users can reach account routes.
- Premium routes require both auth and entitlement checks.
- Admin or internal routes must be separately restricted.

## Storage policy

### Allowed in browser storage

- Non-sensitive UI preferences.
- Theme choice.
- Non-identifying onboarding state.

### Not allowed in browser storage

- Access tokens.
- Refresh tokens.
- Payment secrets.
- Webhook secrets.
- Subscription verification data.
- Sensitive user claims if they can be derived server-side.

## Redirect policy

- Only redirect to trusted internal paths or allowlisted external domains.
- Strip unexpected query parameters from redirect URLs.
- Reject protocol-relative or full external URLs unless explicitly allowed.
- Preserve the user context without exposing tokens in the redirect string.

## Minimum production checklist

- Session cookies are `HttpOnly`, `Secure`, and `SameSite` protected.
- No auth or payment secrets are stored in `localStorage`.
- Payment completion is verified by backend webhook, not only by UI success state.
- Premium APIs enforce subscription checks server-side.
- CSP and other security headers are enabled.
- Auth and checkout endpoints are rate limited.
- Redirect targets are allowlisted.
- Webhook signatures are verified.
- Secrets are excluded from source control.
- Logs are redacted and monitored.

## Incident response basics

- Be able to revoke sessions globally.
- Be able to rotate payment and webhook secrets quickly.
- Be able to disable checkout temporarily if abuse is detected.
- Be able to audit recent subscription changes and webhook activity.
- Keep rollback steps documented for auth or payment releases.

## Production-ready definition

PrepDoc should be considered production-ready only when:

- Unauthorized users cannot access premium data by changing URLs or client state.
- No sensitive token is recoverable from browser storage or page source.
- Checkout and subscription state are validated server-side.
- Security headers, validation, and rate limiting are in place.
- Logs and monitoring provide enough visibility to catch abuse quickly.

## Recommended implementation order

1. Move session and subscription trust to server-side checks.
2. Remove any sensitive data from `localStorage` or URL params.
3. Lock down route authorization and redirect validation.
4. Secure checkout and webhook verification.
5. Add CSP, cookie hardening, and rate limiting.
6. Add logging, monitoring, and incident response steps.

## Relationship to the growth plan

The growth plan focuses on conversion, onboarding, and premium activation. This security plan ensures those same surfaces are safe enough to support payment, authentication, and production traffic without exposing user data or subscription state.
