# PrepDoc Security Implementation Checklist

This checklist turns the production security plan into file-level work items for the current codebase.

## 1. Auth session hardening

- [ ] Stop persisting auth tokens in browser `localStorage`.
- [ ] Move session trust to server-set `httpOnly` cookies or another server-managed session mechanism.
- [ ] Ensure `getCurrentUser` and refresh logic do not depend on a token that can be read by JavaScript.
- [ ] Rotate or invalidate sessions after login, logout, password reset, and password change.

Relevant files:

- [ ] [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx)
- [ ] [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts)
- [ ] [src/hooks/use-local-storage.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/hooks/use-local-storage.ts)

## 2. Browser storage policy

- [ ] Remove any sensitive data from `localStorage`.
- [ ] Keep only non-sensitive preferences client-side.
- [ ] Add a storage allowlist so future sensitive fields cannot be added casually.
- [ ] Audit existing keys and classify them as safe or unsafe.

Relevant files:

- [ ] [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx)
- [ ] [src/hooks/use-local-storage.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/hooks/use-local-storage.ts)

## 3. URL and redirect safety

- [ ] Remove any auth or payment tokens from query params or route segments.
- [ ] Add a redirect allowlist for login, OAuth, password reset, and post-payment flows.
- [ ] Block open redirects such as arbitrary `next`, `returnUrl`, or `redirectTo` values.
- [ ] Normalize and validate path inputs before navigation.

Relevant files:

- [ ] [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts)
- [ ] [src/routes/route-paths.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/route-paths.ts)
- [ ] [src/routes/public-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/public-routes.tsx)

## 4. Route protection

- [ ] Keep frontend route guards for UX only.
- [ ] Add backend authorization checks for premium and account routes.
- [ ] Re-check entitlement on every premium data request.
- [ ] Separate public, authenticated, and premium APIs.

Relevant files:

- [ ] [src/routes/private-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/private-routes.tsx)
- [ ] [src/routes/public-routes.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/routes/public-routes.tsx)
- [ ] [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx)

## 5. Payment flow

- [ ] Treat Razorpay success handler as UI-only, not proof of payment.
- [ ] Confirm payment activation from a verified backend webhook or server-side subscription fetch.
- [ ] Add idempotency handling for subscription creation and webhook processing.
- [ ] Handle payment failure, retry, and duplicate activation cleanly.

Relevant files:

- [ ] [src/components/premium-modal.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/components/premium-modal.tsx)
- [ ] [src/lib/subscription-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/subscription-api.ts)
- [ ] [src/App.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/App.tsx)

## 6. CSRF and cookie settings

- [ ] Require CSRF protection for cookie-authenticated mutations.
- [ ] Use `Secure`, `HttpOnly`, and `SameSite` cookies.
- [ ] Confirm payment-provider redirects still work under the chosen `SameSite` policy.

Relevant files:

- [ ] [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts)
- [ ] Backend auth implementation

## 7. XSS and third-party script safety

- [ ] Avoid injecting unsanitized HTML.
- [ ] Review any analytics, widget, or payment scripts before adding them.
- [ ] Add a strong CSP in the deployment layer.

Relevant files:

- [ ] [src/components/landing-page.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/components/landing-page.tsx)
- [ ] [src/components/premium-modal.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/components/premium-modal.tsx)
- [ ] Deployment / hosting config

## 8. Validation and abuse controls

- [ ] Validate every public request body and route param.
- [ ] Rate limit auth, password reset, checkout, and webhook endpoints.
- [ ] Avoid leaking whether an email exists or whether a token is valid.

Relevant files:

- [ ] [src/lib/auth-api.ts](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/lib/auth-api.ts)
- [ ] [src/components/auth-screen.tsx](/Users/ujjwaltyagi/Desktop/CodeT/PrepDoc/src/components/auth-screen.tsx)
- [ ] Backend API layer

## 9. Monitoring and incident response

- [ ] Log auth failures, payment failures, and webhook errors.
- [ ] Redact secrets and personal data from logs.
- [ ] Add alerts for failed logins, repeated webhook errors, and abnormal subscription activity.
- [ ] Document session revocation and secret rotation steps.

Relevant files:

- [ ] Backend API layer
- [ ] Deployment / monitoring stack

## 10. Minimum production gate

- [ ] No auth tokens are recoverable from browser storage.
- [ ] No secrets appear in URLs.
- [ ] Premium access is enforced on the server.
- [ ] Payment completion is verified server-side.
- [ ] Security headers and rate limits are enabled.
- [ ] Redirect targets are allowlisted.

## Suggested order

1. Remove browser-stored auth tokens.
2. Remove token-bearing URL flows.
3. Harden payment verification.
4. Add backend entitlement checks for premium routes and APIs.
5. Add cookie/CSRF/header hardening in deployment.
6. Add monitoring and incident response controls.
