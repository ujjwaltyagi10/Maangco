import type { CSSProperties, FormEvent } from "react";
import { useState, useEffect } from "react";
import adobeSvg from "@/assets/svg/adobe.svg";
import airbnbSvg from "@/assets/svg/airbnb.svg";
import googleSvg from "@/assets/svg/google.svg";
import metaSvg from "@/assets/svg/meta.svg";
import microsoftSvg from "@/assets/svg/microsoft.svg";
import netflixSvg from "@/assets/svg/netflix.svg";
import pinterestSvg from "@/assets/svg/pinterest.svg";
import salesforceSvg from "@/assets/svg/salesforce.svg";
import amazonSvg from "@/assets/svg/amazon.svg";
import appleSvg from "@/assets/svg/apple.svg";
import atlassianSvg from "@/assets/svg/atlassian.svg";
import nvidiaLightSvg from "@/assets/svg/nvidia-light.svg";
import oracleSvg from "@/assets/svg/oracle.svg";
import snowflakeSvg from "@/assets/svg/snowflake.svg";
import uberDarkSvg from "@/assets/svg/uber-dark.svg";
import visaSvg from "@/assets/svg/visa.svg";

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

const floatingLogos = [
  { src: googleSvg, style: { top: "10%", right: "10%", width: 42 }, delay: 0 },
  { src: metaSvg, style: { top: "14%", left: "6%", width: 30 }, delay: 1.1 },
  { src: microsoftSvg, style: { top: "34%", left: "22%", width: 34 }, delay: 0.6 },
  { src: netflixSvg, style: { bottom: "22%", right: "12%", width: 28 }, delay: 1.8 },
  { src: adobeSvg, style: { top: "28%", right: "24%", width: 26 }, delay: 2.4 },
  { src: airbnbSvg, style: { top: "40%", left: "10%", width: 32 }, delay: 0.9 },
  { src: salesforceSvg, style: { bottom: "18%", right: "6%", width: 38 }, delay: 1.5 },
  { src: pinterestSvg, style: { top: "42%", left: "42%", width: 26 }, delay: 3.0 },
  { src: amazonSvg, style: { bottom: "12%", left: "30%", width: 38 }, delay: 2.1 },
  { src: appleSvg, style: { top: "22%", left: "16%", width: 28 }, delay: 0.3 },
  { src: atlassianSvg, style: { top: "62%", left: "18%", width: 30 }, delay: 1.0 },
  { src: nvidiaLightSvg, style: { top: "18%", right: "28%", width: 40 }, delay: 2.7 },
  { src: oracleSvg, style: { bottom: "30%", right: "28%", width: 34 }, delay: 1.4 },
  { src: snowflakeSvg, style: { top: "76%", left: "14%", width: 28 }, delay: 3.3 },
  { src: uberDarkSvg, style: { bottom: "10%", right: "40%", width: 32 }, delay: 0.5 },
  { src: visaSvg, style: { top: "46%", right: "36%", width: 34 }, delay: 2.0 },
];

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
    isRegister ? "Create account" :
    isForgot ? "Reset password" :
    isReset ? "New password" :
    isVerify ? "Verify email" :
    "Welcome back";

  const subtitle =
    isRegister ? "Start tracking your interview prep today." :
    isForgot ? "Enter your email and we'll send a reset link." :
    isReset ? "Enter the token from your email and set a new password." :
    isVerify ? "Enter your email to get a fresh verification link." :
    "Sign in to your MAANGco account.";

  const submitLabel = isLoading ? "Working..." :
    isRegister ? "Create account" :
    isForgot ? "Send reset email" :
    isReset ? "Set new password" :
    isVerify ? "Send verification" :
    "Log in";

  return (
    <div className="auth-page-v2 w-full min-w-0">

      {/* ── Theme toggle (fixed top-right) ── */}
      <button type="button" className="auth-theme-toggle" onClick={onThemeChange} aria-label="Toggle theme">
        {theme === "light" ? (
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
            <circle cx="10" cy="10" r="3.2" />
            <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
          </svg>
        )}
      </button>

      {/* ── Centered card ── */}
      <div className="auth-float-logos" aria-hidden="true">
        {floatingLogos.map((logo, index) => (
          <img
            key={`${logo.src}-${index}`}
            src={logo.src}
            className="auth-float-logo"
            style={{ ...logo.style, animationDelay: `${logo.delay}s` } as CSSProperties}
            alt=""
          />
        ))}
      </div>

      <div className={`auth-card ${isRegister ? "auth-card--signup" : ""}`}>

        {/* Logo mark */}
        <div className="auth-card-logo-wrap">
          <a href="/" className="auth-card-logo-link" aria-label="MAANGco home">
            <div className="auth-card-logo-mark">
              <svg viewBox="0 0 20 20" width="20" height="20">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
          </a>
        </div>

        {isSecondary ? (
          <button type="button" className="auth-back" onClick={() => onModeChange("login")} aria-label="Back">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <path d="M13 5L8 10L13 15" />
            </svg>
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
            <div className="auth-divider-v2"><span>OR</span></div>
          </>
        ) : null}

        <form className="auth-form-v2" onSubmit={handleSubmit}>
          {isRegister ? (
            <div className="auth-name-row">
              <label className="auth-field-v2">
                <span className="auth-field-head">
                  <span className="auth-field-title">First name <span className="auth-required-mark">*</span></span>
                </span>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" autoComplete="given-name" required />
              </label>
              <label className="auth-field-v2">
                <span className="auth-field-head">
                  <span className="auth-field-title">Last name <span className="auth-required-mark">*</span></span>
                </span>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" autoComplete="family-name" required />
              </label>
            </div>
          ) : null}

          {!isForgot && !isReset && !isVerify ? (
            <label className="auth-field-v2">
              <span className="auth-field-head">
                <span className="auth-field-title">Email <span className="auth-required-mark">*</span></span>
              </span>
              <div className="auth-input-icon-wrap">
                <svg className="auth-input-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="16" height="12" rx="2"/>
                  <path d="M2 7.5l8 5 8-5"/>
                </svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email address" autoComplete="email" required />
              </div>
            </label>
          ) : null}

          {isForgot || isVerify ? (
            <label className="auth-field-v2">
              <span className="auth-field-head">
                <span className="auth-field-title">Email <span className="auth-required-mark">*</span></span>
              </span>
              <div className="auth-input-icon-wrap">
                <svg className="auth-input-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="16" height="12" rx="2"/>
                  <path d="M2 7.5l8 5 8-5"/>
                </svg>
                <input
                  type="email"
                  value={isVerify ? verificationEmail : email}
                  onChange={(e) => isVerify ? setVerificationEmail(e.target.value) : setEmail(e.target.value)}
                  placeholder="email address"
                  autoComplete="email"
                  required
                />
              </div>
            </label>
          ) : null}

          {isReset ? (
            <label className="auth-field-v2">
              <span className="auth-field-head">
                <span className="auth-field-title">Reset Token <span className="auth-required-mark">*</span></span>
              </span>
              <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste token from email" required />
            </label>
          ) : null}

          {(mode === "login" || isRegister || isReset) && !isForgot ? (
            <label className="auth-field-v2">
              <span className="auth-field-head">
                <span className="auth-field-title">Password <span className="auth-required-mark">*</span></span>
                {mode === "login" ? (
                  <button type="button" className="auth-forgot-inline" onClick={() => onModeChange("forgot")}>
                    Forgot password?
                  </button>
                ) : null}
              </span>
              <div className="auth-password-wrap">
                <div className="auth-input-icon-wrap">
                  <svg className="auth-input-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="9" width="12" height="9" rx="2"/>
                    <path d="M7 9V6a3 3 0 0 1 6 0v3"/>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    minLength={6}
                    required
                  />
                </div>
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
              <span className="auth-field-head">
                <span className="auth-field-title">Confirm Password <span className="auth-required-mark">*</span></span>
              </span>
              <div className="auth-input-icon-wrap">
                <svg className="auth-input-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="9" width="12" height="9" rx="2"/>
                  <path d="M7 9V6a3 3 0 0 1 6 0v3"/>
                </svg>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
            </label>
          ) : null}

          {(isRegister || isReset) && password && confirmPassword && password !== confirmPassword ? (
            <div className="auth-error-v2">Passwords do not match.</div>
          ) : null}

          {errorMessage ? <div className="auth-error-v2">{errorMessage}</div> : null}
          {infoMessage ? <div className="auth-info-v2">{infoMessage}</div> : null}
          {verificationMessage ? <div className="auth-info-v2">{verificationMessage}</div> : null}

          {isVerify ? (
            <button type="button" className="auth-submit-v2 auth-submit-v2--secondary" onClick={handleResend} disabled={verificationBusy}>
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
  );
}
