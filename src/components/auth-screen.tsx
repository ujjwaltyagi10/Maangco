import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { AUTH_API_BASE_URL } from "@/lib/auth-api";

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
}: AuthScreenProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(resetTokenHint ?? "");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";
  const isVerify = mode === "verify";

  useEffect(() => {
    if (mode === "verify" && !verificationEmail && email) {
      setVerificationEmail(email);
    }
  }, [email, mode, verificationEmail]);

  const headline = useMemo(() => {
    if (isRegister) return "Create your account";
    if (isForgot) return "Reset your password";
    if (isReset) return "Enter your reset token";
    if (isVerify) return "Verify your email";
    return "Sign in to continue";
  }, [isForgot, isRegister, isReset, isVerify]);

  const subcopy = useMemo(() => {
    if (isRegister) {
      return "Create a new account with your backend auth service.";
    }
    if (isForgot) {
      return "Request a reset link using your account email.";
    }
    if (isReset) {
      return "Paste the token from your email and choose a new password.";
    }
    if (isVerify) {
      return "Request a fresh verification email or finish verifying your account.";
    }
    return "Use your existing credentials or continue with Google OAuth.";
  }, [isForgot, isRegister, isReset, isVerify]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if ((isRegister || isReset) && password !== confirmPassword) {
      return;
    }

    await onSubmit({
      mode,
      first_name: firstName,
      last_name: lastName,
      email: mode === "verify" ? verificationEmail : email,
      password,
      resetToken,
    });
  };

  const handleResendVerification = async () => {
    setVerificationBusy(true);
    setVerificationMessage(null);
    try {
      await onResendVerification(verificationEmail);
      setVerificationMessage("Verification email sent.");
    } catch {
      setVerificationMessage("Unable to resend verification email.");
    } finally {
      setVerificationBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-marketing">
          <div className="auth-brand">
            <div className="auth-brand-mark">P</div>
            <div>
              <div className="auth-brand-name">PrepDoc</div>
              <div className="auth-brand-copy">Interview prep workspace</div>
            </div>
          </div>

          <h1>
            Keep your interview prep
            <span> synced behind one account.</span>
          </h1>

          <p>
            Sign in to persist DSA progress, frontend roadmap completion, and
            study state through your backend API.
          </p>

          <div className="auth-feature-grid">
            <div className="auth-feature">
              <strong>Google OAuth</strong>
              One-click login through your backend Google flow.
            </div>
            <div className="auth-feature">
              <strong>Password tools</strong>
              Forgot password, reset password, and change password support.
            </div>
            <div className="auth-feature">
              <strong>Backend-driven</strong>
              Requests are sent to <code>{AUTH_API_BASE_URL}</code>.
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab${mode === "login" ? " active" : ""}`}
                onClick={() => onModeChange("login")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab${mode === "register" ? " active" : ""}`}
                onClick={() => onModeChange("register")}
              >
                Create Account
              </button>
              <button
                type="button"
                className={`auth-tab${mode === "forgot" ? " active" : ""}`}
                onClick={() => onModeChange("forgot")}
              >
                Forgot Password
              </button>
              <button
                type="button"
                className={`auth-tab${mode === "reset" ? " active" : ""}`}
                onClick={() => onModeChange("reset")}
              >
                Reset Password
              </button>
              <button
                type="button"
                className={`auth-tab${mode === "verify" ? " active" : ""}`}
                onClick={() => onModeChange("verify")}
              >
                Verify Email
              </button>
            </div>
            <div className="auth-card-title">{headline}</div>
            <div className="auth-card-copy">{subcopy}</div>
          </div>

          <button type="button" className="auth-google-btn" onClick={onGoogleLogin}>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or use email</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister ? (
              <div className="auth-name-grid">
              <label className="auth-field">
                <span>First name</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Last name</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                />
              </label>
              </div>
            ) : null}

            {!isForgot && !isReset && mode !== "verify" ? (
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            ) : null}

            {isReset ? (
              <label className="auth-field">
                <span>Reset Token</span>
                <input
                  value={resetToken}
                  onChange={(event) => setResetToken(event.target.value)}
                  placeholder="Paste token from email"
                  required
                />
              </label>
            ) : null}

            {(isRegister || isReset || mode === "login") && !isForgot ? (
              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={6}
                  required
                />
              </label>
            ) : null}

            {isRegister || isReset ? (
              <label className="auth-field">
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>
            ) : null}

            {isForgot ? (
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            ) : null}

            {mode === "verify" ? (
              <label className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  value={verificationEmail}
                  onChange={(event) => setVerificationEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            ) : null}

            {isRegister && password && confirmPassword && password !== confirmPassword ? (
              <div className="auth-error">Passwords do not match.</div>
            ) : null}

            {isReset && password && confirmPassword && password !== confirmPassword ? (
              <div className="auth-error">Passwords do not match.</div>
            ) : null}

            {errorMessage ? <div className="auth-error">{errorMessage}</div> : null}
            {infoMessage ? <div className="auth-info">{infoMessage}</div> : null}
            {verificationMessage ? <div className="auth-info">{verificationMessage}</div> : null}

            {mode === "verify" ? (
              <button
                type="button"
                className="auth-submit auth-submit--secondary"
                onClick={handleResendVerification}
                disabled={verificationBusy}
              >
                {verificationBusy ? "Sending..." : "Resend verification email"}
              </button>
            ) : null}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading
                ? "Working..."
                : isRegister
                  ? "Create account"
                  : isForgot
                    ? "Send reset email"
                    : isReset
                      ? "Reset password"
                      : isVerify
                        ? "Send verification email"
                      : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            {mode === "login" ? "Need an account?" : "Already have an account?"}
            <button
              type="button"
              className="auth-switch"
              onClick={() => onModeChange(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </div>

          <div className="auth-footer auth-footer--links">
            <button type="button" className="auth-link" onClick={() => onModeChange("forgot")}>
              Forgot password?
            </button>
            <button type="button" className="auth-link" onClick={() => onModeChange("reset")}>
              Have a reset token?
            </button>
            <button type="button" className="auth-link" onClick={() => onModeChange("verify")}>
              Resend verification?
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
