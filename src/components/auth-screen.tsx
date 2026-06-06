import type { FormEvent } from "react";
import { useEffect, useState } from "react";


type AuthMode = "login" | "register" | "forgot" | "reset" | "verify";

interface AuthScreenProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (input: {
    mode: AuthMode;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    resetToken: string;
  }) => Promise<void>;
  onGoogleLogin: () => void;
  onResendVerification: (email: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  infoMessage: string | null;
  resetTokenHint?: string;
  theme: "light" | "dark";
  onThemeChange: () => void;
}

export function AuthScreen({
  mode,
  onModeChange,
  onSubmit,
  onGoogleLogin,
  onResendVerification,
  isLoading,
  errorMessage,
  infoMessage,
  resetTokenHint,
  theme,
  onThemeChange,
}: AuthScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(resetTokenHint ?? "");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isVerify = mode === "verify";
  const isSecondary = isForgot || isReset || isVerify;

  useEffect(() => {
    if (mode === "verify" && !verificationEmail && email) {
      setVerificationEmail(email);
    }
  }, [email, mode, verificationEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((isRegister || isReset) && password !== confirmPassword) return;
    await onSubmit({
      mode,
      first_name: firstName,
      last_name: lastName,
      email: mode === "verify" ? verificationEmail : email,
      password,
      resetToken,
    });
  };

  const handleResend = async () => {
    setVerificationBusy(true);
    setVerificationMessage(null);
    try {
      await onResendVerification(verificationEmail);
      setVerificationMessage("Verification email sent.");
    } catch {
      setVerificationMessage("Unable to resend. Try again.");
    } finally {
      setVerificationBusy(false);
    }
  };

  const title =
    isRegister ? "Create your account" :
    isForgot ? "Reset your password" :
    isReset ? "Set new password" :
    isVerify ? "Verify your email" :
    "Welcome back!";

  const subtitle =
    isRegister ? "Start tracking your interview prep today." :
    isForgot ? "Enter your email and we'll send you a reset link." :
    isReset ? "Enter the token from your email and choose a new password." :
    isVerify ? "Enter your email to receive a fresh verification link." :
    "Sign in to your PrepDoc account.";

  const submitLabel = isLoading ? "Working..." :
    isRegister ? "Create account" :
    isForgot ? "Send reset email" :
    isReset ? "Set new password" :
    isVerify ? "Send verification" :
    "Log in";

  return (
    /* w-full fixes blank space — #root is display:flex so children need w-full */
    <div className="auth-page-v2 w-full min-w-0">
      {/* LEFT PANEL — FORM */}
      <div className="auth-form-panel">
        {/* Header row */}
        <div className="auth-form-header">
          <a href="/" className="auth-form-logo">
            <div className="auth-form-logo-mark">
              <svg viewBox="0 0 20 20" width="16" height="16">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
            <span className="auth-form-logo-text">PrepDoc</span>
          </a>
          <button type="button" className="auth-theme-toggle" onClick={onThemeChange} aria-label="Toggle theme">
            {theme === "light" ? (
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <circle cx="10" cy="10" r="3.2" />
                <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
              </svg>
            )}
          </button>
        </div>

        <div className="auth-form-body">
          {isSecondary ? (
            <button
              type="button"
              className="auth-back"
              onClick={() => onModeChange("login")}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <path d="M13 5L8 10L13 15" />
              </svg>
              Back
            </button>
          ) : null}

          <h1 className="auth-form-title">{title}</h1>
          <p className="auth-form-subtitle">{subtitle}</p>

          {!isSecondary ? (
            <>
              <button type="button" className="auth-google-btn-v2" onClick={onGoogleLogin}>
                <svg viewBox="0 0 20 20" width="18" height="18" style={{ flexShrink: 0 }}>
                  <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.62 4.62 0 0 1-2 3.03v2.52h3.23c1.9-1.74 2.97-4.3 2.97-7.34Z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.52c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.75-5.6-4.11H1.07v2.6A10 10 0 0 0 10 20Z" fill="#34A853"/>
                  <path d="M4.4 11.89A5.94 5.94 0 0 1 4.09 10c0-.66.11-1.3.31-1.89V5.51H1.07A10 10 0 0 0 0 10c0 1.61.38 3.14 1.07 4.49l3.33-2.6Z" fill="#FBBC05"/>
                  <path d="M10 3.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 0 0 1.07 5.51l3.33 2.6C5.2 5.73 7.4 3.98 10 3.98Z" fill="#EA4335"/>
                </svg>
                Sign {isRegister ? "up" : "in"} with Google
              </button>

              <div className="auth-divider-v2">
                <span>OR</span>
              </div>
            </>
          ) : null}

          <form className="auth-form-v2" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="auth-name-row">
                <label className="auth-field-v2">
                  <span>First name</span>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" autoComplete="given-name" required />
                </label>
                <label className="auth-field-v2">
                  <span>Last name</span>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" autoComplete="family-name" required />
                </label>
              </div>
            ) : null}

            {!isForgot && !isReset && !isVerify ? (
              <label className="auth-field-v2">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
              </label>
            ) : null}

            {isForgot || isVerify ? (
              <label className="auth-field-v2">
                <span>Email</span>
                <input
                  type="email"
                  value={isVerify ? verificationEmail : email}
                  onChange={(e) => isVerify ? setVerificationEmail(e.target.value) : setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            ) : null}

            {isReset ? (
              <label className="auth-field-v2">
                <span>Reset Token</span>
                <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste token from email" required />
              </label>
            ) : null}

            {(mode === "login" || isRegister || isReset) && !isForgot ? (
              <label className="auth-field-v2">
                <span>
                  Password
                  {mode === "login" ? (
                    <button type="button" className="auth-forgot-inline" onClick={() => onModeChange("forgot")}>
                      Forgot password?
                    </button>
                  ) : null}
                </span>
                <div className="auth-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}>
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"/><circle cx="10" cy="10" r="2.5"/>
                        <path d="M3 3l14 14"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ width: 15, height: 15 }}>
                        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"/><circle cx="10" cy="10" r="2.5"/>
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            ) : null}

            {isRegister || isReset ? (
              <label className="auth-field-v2">
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>
            ) : null}

            {(isRegister || isReset) && password && confirmPassword && password !== confirmPassword ? (
              <div className="auth-error-v2">Passwords do not match.</div>
            ) : null}

            {errorMessage ? <div className="auth-error-v2">{errorMessage}</div> : null}
            {infoMessage ? <div className="auth-info-v2">{infoMessage}</div> : null}
            {verificationMessage ? <div className="auth-info-v2">{verificationMessage}</div> : null}

            {isVerify ? (
              <button
                type="button"
                className="auth-submit-v2 auth-submit-v2--secondary"
                onClick={handleResend}
                disabled={verificationBusy}
              >
                {verificationBusy ? "Sending..." : "Resend verification email"}
              </button>
            ) : null}

            <button type="submit" className="auth-submit-v2" disabled={isLoading}>
              {submitLabel}
            </button>
          </form>

          {!isSecondary ? (
            <div className="auth-switch-row">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button type="button" className="auth-switch-link" onClick={() => onModeChange("register")}>Sign up</button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" className="auth-switch-link" onClick={() => onModeChange("login")}>Log in</button>
                </>
              )}
            </div>
          ) : null}

          {mode === "login" ? (
            <div className="auth-extra-links">
              <button type="button" className="auth-extra-link" onClick={() => onModeChange("verify")}>Resend verification email</button>
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT PANEL — VISUAL */}
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <div className="auth-visual-tag">Interview Prep Workspace</div>
          <h2 className="auth-visual-title">
            Structured prep
            <br />
            for real results.
          </h2>
          <p className="auth-visual-sub">
            DSA company lists, a 90-day frontend roadmap, and a progress dashboard — all synced to your account.
          </p>

          {/* Floating cards */}
          <div className="auth-visual-cards">
            <div className="auth-visual-card auth-visual-card--1">
              <div className="auth-vc-label">Overall Progress</div>
              <div className="auth-vc-value">72%</div>
              <div className="auth-vc-bar">
                <div className="auth-vc-bar-fill" style={{ width: "72%" }} />
              </div>
              <div className="auth-vc-sub">Keep it up!</div>
            </div>

            <div className="auth-visual-card auth-visual-card--2">
              <div className="auth-vc-row">
                <span className="auth-vc-emoji">⚡</span>
                <div>
                  <div className="auth-vc-label">DSA Solved</div>
                  <div className="auth-vc-value auth-vc-value--sm">148 / 500</div>
                </div>
              </div>
            </div>

            <div className="auth-visual-card auth-visual-card--3">
              <div className="auth-vc-row">
                <span className="auth-vc-emoji">🎯</span>
                <div>
                  <div className="auth-vc-label">Frontend Roadmap</div>
                  <div className="auth-vc-value auth-vc-value--sm">Day 32 / 90</div>
                </div>
              </div>
            </div>

            <div className="auth-visual-card auth-visual-card--4">
              <div className="auth-vc-label">Target companies</div>
              <div className="auth-vc-tags">
                {["Google", "Meta", "Amazon", "Uber"].map((c) => (
                  <span key={c} className="auth-vc-tag">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-backdrop" />
      </div>
    </div>
  );
}
