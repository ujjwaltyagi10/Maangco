import type { CSSProperties, FormEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useState, useRef, useEffect } from "react";
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

export type AuthScreenMode = "login" | "otp";

interface AuthScreenProps {
  mode: AuthScreenMode;
  onModeChange: (mode: AuthScreenMode) => void;
  onSubmit: (input: { mode: AuthScreenMode; email: string; otp: string }) => Promise<void>;
  onGoogleLogin: () => void;
  onResendOtp?: (email: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  infoMessage: string | null;
  otpEmail?: string;
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

interface OtpBoxesProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}

function OtpBoxes({ value, onChange, disabled }: OtpBoxesProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const newVal = digits.map((d, i) => (i === index ? char : d)).join("");
    onChange(newVal);
    if (char && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newVal = digits.map((d, i) => (i === index - 1 ? "" : d)).join("");
      onChange(newVal);
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(0, "").slice(0, 6));
    const focusIndex = Math.min(pasted.length, 5);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="auth-otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          className="auth-otp-box"
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={i === 0}
          autoComplete={i === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
}

export function AuthScreen({
  mode,
  onModeChange,
  onSubmit,
  onGoogleLogin,
  onResendOtp,
  isLoading,
  errorMessage,
  infoMessage,
  otpEmail,
  theme,
  onThemeChange,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // Reset OTP digits when entering OTP mode
  useEffect(() => {
    if (mode === "otp") setOtp("");
  }, [mode]);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "otp" && otp.replace(/\D/g, "").length < 6) return;
    await onSubmit({ mode, email: otpEmail ?? email, otp });
  };

  const handleResend = async () => {
    if (!onResendOtp || !otpEmail || resendCooldown > 0) return;
    setResendBusy(true);
    setResendMessage(null);
    try {
      await onResendOtp(otpEmail);
      setResendCooldown(60);
      setResendMessage("New code sent.");
    } catch {
      setResendMessage("Could not resend. Try again.");
    } finally {
      setResendBusy(false);
    }
  };

  const isOtp = mode === "otp";
  const canSubmit = isOtp ? otp.replace(/\D/g, "").length === 6 : email.trim().length > 0;

  return (
    <div className="auth-page-v2 w-full min-w-0">

      {/* Theme toggle */}
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

      {/* Floating logos */}
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

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-card-logo-wrap">
          <a href="/" className="auth-card-logo-link" aria-label="MAANGco home">
            <div className="auth-card-logo-mark">
              <svg viewBox="0 0 20 20" width="20" height="20">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
          </a>
        </div>

        {/* Back button — OTP step only */}
        {isOtp ? (
          <button type="button" className="auth-back" onClick={() => onModeChange("login")} aria-label="Back">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
              <path d="M13 5L8 10L13 15" />
            </svg>
          </button>
        ) : null}

        {/* Header */}
        <h1 className="auth-form-title">{isOtp ? "Check your email" : "Welcome to MAANGco"}</h1>
        <p className="auth-form-subtitle">
          {isOtp
            ? `We sent a 6-digit code to ${otpEmail ?? "your email"}. Enter it below.`
            : "Sign in or create an account with your email."}
        </p>

        {/* Google OAuth — login step only */}
        {!isOtp ? (
          <>
            <button type="button" className="auth-google-btn-v2" onClick={onGoogleLogin}>
              <svg viewBox="0 0 20 20" width="18" height="18" style={{ flexShrink: 0 }}>
                <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.62 4.62 0 0 1-2 3.03v2.52h3.23c1.9-1.74 2.97-4.3 2.97-7.34Z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.52c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.75-5.6-4.11H1.07v2.6A10 10 0 0 0 10 20Z" fill="#34A853"/>
                <path d="M4.4 11.89A5.94 5.94 0 0 1 4.09 10c0-.66.11-1.3.31-1.89V5.51H1.07A10 10 0 0 0 0 10c0 1.61.38 3.14 1.07 4.49l3.33-2.6Z" fill="#FBBC05"/>
                <path d="M10 3.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86C14.96.9 12.7 0 10 0A10 10 0 0 0 1.07 5.51l3.33 2.6C5.2 5.73 7.4 3.98 10 3.98Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <div className="auth-divider-v2"><span>OR</span></div>
          </>
        ) : null}

        <form className="auth-form-v2" onSubmit={handleSubmit}>

          {/* Email step */}
          {!isOtp ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>
          ) : null}

          {/* OTP step */}
          {isOtp ? (
            <div className="auth-field-v2">
              <span className="auth-field-head">
                <span className="auth-field-title">6-digit code</span>
              </span>
              <OtpBoxes value={otp} onChange={setOtp} disabled={isLoading} />
            </div>
          ) : null}

          {errorMessage ? <div className="auth-error-v2">{errorMessage}</div> : null}
          {infoMessage ? <div className="auth-info-v2">{infoMessage}</div> : null}
          {resendMessage ? <div className="auth-info-v2">{resendMessage}</div> : null}

          <button type="submit" className="auth-submit-v2" disabled={isLoading || !canSubmit}>
            {isLoading ? "Working..." : isOtp ? "Verify code" : "Continue"}
          </button>
        </form>

        {/* Resend — OTP step only */}
        {isOtp ? (
          <div className="auth-resend-row">
            Didn't get a code?{" "}
            <button
              type="button"
              className="auth-switch-link"
              onClick={handleResend}
              disabled={resendBusy || resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : resendBusy ? "Sending..." : "Resend"}
            </button>
          </div>
        ) : null}

      </div>
    </div>
  );
}
