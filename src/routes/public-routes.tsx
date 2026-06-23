import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { AuthScreen } from "@/components/auth-screen";
import { ContactPage } from "@/components/contact-page";
import { LandingPage } from "@/components/landing-page";
import { TermsAndConditionsPage } from "@/components/terms-and-conditions-page";
import { getAuthErrorMessage, getGoogleAuthUrl, parseAuthCallbackSearch, verifyEmail, type AuthSession } from "@/lib/auth-api";
import { authModeFromPath, authPathForMode, ROUTES, type AuthMode, type AuthSubmitResult } from "./route-paths";

interface AuthSubmitInput {
  mode: AuthMode;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  resetToken: string;
}

interface PublicRoutesProps {
  authSession: AuthSession | null;
  userLabel: string;
  onAuthSubmit: (input: AuthSubmitInput) => Promise<AuthSubmitResult>;
  onResendVerification: (email: string) => Promise<void>;
  onGoogleCallback: (session: AuthSession) => Promise<void> | void;
  onLogout: () => void | Promise<void>;
  onOpenChangePassword: () => void;
  onBuyPremium?: (plan?: "monthly" | "yearly") => void;
  isPremium?: boolean;
  authError: string | null;
  authInfo: string | null;
  isSubmitting: boolean;
  theme: "light" | "dark";
  onThemeChange: () => void;
}

function AuthRoute({
  mode,
  onAuthSubmit,
  onResendVerification,
  authError,
  authInfo,
  isSubmitting,
  resetTokenHint,
  theme,
  onThemeChange,
}: Pick<PublicRoutesProps, "onAuthSubmit" | "onResendVerification" | "authError" | "authInfo" | "isSubmitting" | "theme" | "onThemeChange"> & {
  mode: AuthMode;
  resetTokenHint?: string;
}) {
  const navigate = useNavigate();

  const handleSubmit = async (input: AuthSubmitInput) => {
    const result = await onAuthSubmit({ ...input, mode });
    if (result.nextRoute) {
      navigate(result.nextRoute, { replace: true });
    }
  };

  return (
    <AuthScreen
      mode={mode}
      onModeChange={(nextMode) => navigate(authPathForMode(nextMode, resetTokenHint))}
      onSubmit={handleSubmit}
      onGoogleLogin={() => window.location.assign(getGoogleAuthUrl())}
      onResendVerification={onResendVerification}
      isLoading={isSubmitting}
      errorMessage={authError}
      infoMessage={authInfo}
      resetTokenHint={resetTokenHint}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
}

function ResetPasswordRoute(
  props: Pick<PublicRoutesProps, "onAuthSubmit" | "onResendVerification" | "authError" | "authInfo" | "isSubmitting" | "theme" | "onThemeChange">,
) {
  const params = useParams();
  return <AuthRoute {...props} mode="reset" resetTokenHint={params.token} />;
}

function VerifyEmailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function run() {
      const token = params.token;
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }
      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
      } catch (error) {
        setStatus("error");
        setMessage(getAuthErrorMessage(error));
      }
    }
    void run();
  }, [params.token]);

  return (
    <div className="auth-status-page">
      <div className="auth-status-card">
        <div className="auth-status-title">
          {status === "success" ? "Email verified" : status === "error" ? "Verification failed" : "Verifying email"}
        </div>
        <div className="auth-status-copy">{message}</div>
        {status !== "loading" ? (
          <button
            type="button"
            className="auth-btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate(ROUTES.login, { replace: true })}
          >
            Go to Sign In
          </button>
        ) : null}
      </div>
    </div>
  );
}

function GoogleCallbackPage({ onGoogleCallback }: Pick<PublicRoutesProps, "onGoogleCallback">) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing Google sign-in...");

  useEffect(() => {
    async function run() {
      const callback = parseAuthCallbackSearch(location.search);
      if (callback.success === "false") {
        setStatus("error");
        setMessage(callback.message || "Google authentication failed.");
        return;
      }
      if (!callback.token) {
        setStatus("error");
        setMessage("Google callback did not include an access token.");
        return;
      }
      const session: AuthSession = {
        token: callback.token,
        user: {
          ...(callback.user ?? {}),
          first_name: callback.user?.first_name || callback.user?.name?.split(" ")?.[0] || callback.name?.split(" ")?.[0],
          last_name: callback.user?.last_name || callback.user?.name?.split(" ").slice(1).join(" ") || undefined,
          name: callback.user?.name || [callback.user?.first_name, callback.user?.last_name].filter(Boolean).join(" ") || callback.name,
          email: callback.user?.email || callback.email,
          provider: callback.user?.provider || "google",
        },
      };
      await onGoogleCallback(session);
      setStatus("success");
      setMessage("Google authentication successful.");
      navigate(ROUTES.dashboard, { replace: true });
    }

    void run();
  }, [location.search, navigate, onGoogleCallback]);

  return (
    <div className="auth-status-page">
      <div className="auth-status-card">
        <div className="auth-status-title">
          {status === "success" ? "Signed in" : status === "error" ? "Authentication failed" : "Signing in"}
        </div>
        <div className="auth-status-copy">{message}</div>
        {status === "error" ? (
          <button
            type="button"
            className="auth-btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate(ROUTES.login, { replace: true })}
          >
            Go to Sign In
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function PublicRoutes({
  authSession,
  userLabel,
  onAuthSubmit,
  onResendVerification,
  onGoogleCallback,
  onLogout,
  onOpenChangePassword,
  onBuyPremium,
  isPremium,
  authError,
  authInfo,
  isSubmitting,
  theme,
  onThemeChange,
}: PublicRoutesProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMemo(() => authModeFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      "/": "MAANGco – MAANG Interview Prep | DSA, System Design & Frontend",
      "/terms-and-conditions": "Terms and Conditions – MAANGco",
      "/contact": "Contact Us – MAANGco",
      "/login": "Sign In – MAANGco",
      "/signup": "Get Started Free – MAANGco",
      "/forgot-password": "Reset Password – MAANGco",
    };
    document.title = pageTitles[location.pathname] ?? "MAANGco";
  }, [location.pathname]);

  const isAuthenticated = Boolean(authSession?.token);

  // Redirect logged-in users away from auth screens only (not the landing page)
  const isPublicLegalRoute = location.pathname === ROUTES.termsConditions || location.pathname === ROUTES.contact;

  if (isAuthenticated && location.pathname !== ROUTES.landing && !isPublicLegalRoute) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return (
    <Routes>
      <Route
        path={ROUTES.landing}
        element={
          <LandingPage
            theme={theme}
            onThemeChange={onThemeChange}
            onSignIn={() => navigate(ROUTES.login)}
            onGetStarted={() => navigate(ROUTES.signup)}
            onStartFree={() => navigate(ROUTES.dashboard)}
            isAuthenticated={isAuthenticated}
            userLabel={userLabel}
            onGoToDashboard={() => navigate(ROUTES.dashboard)}
            onLogout={onLogout}
            onOpenChangePassword={onOpenChangePassword}
            onBuyPremium={onBuyPremium}
            isPremium={isPremium}
          />
        }
      />
      <Route path={ROUTES.termsConditions} element={<TermsAndConditionsPage theme={theme} onThemeChange={onThemeChange} />} />
      <Route path={ROUTES.contact} element={<ContactPage theme={theme} onThemeChange={onThemeChange} />} />
      <Route
        path={ROUTES.login}
        element={
          <AuthRoute mode="login" onAuthSubmit={onAuthSubmit} onResendVerification={onResendVerification}
            authError={authError} authInfo={authInfo} isSubmitting={isSubmitting} theme={theme} onThemeChange={onThemeChange} />
        }
      />
      <Route
        path={ROUTES.signup}
        element={
          <AuthRoute mode="register" onAuthSubmit={onAuthSubmit} onResendVerification={onResendVerification}
            authError={authError} authInfo={authInfo} isSubmitting={isSubmitting} theme={theme} onThemeChange={onThemeChange} />
        }
      />
      <Route
        path={ROUTES.forgotPassword}
        element={
          <AuthRoute mode="forgot" onAuthSubmit={onAuthSubmit} onResendVerification={onResendVerification}
            authError={authError} authInfo={authInfo} isSubmitting={isSubmitting} theme={theme} onThemeChange={onThemeChange} />
        }
      />
      <Route
        path={`${ROUTES.resetPassword}/:token`}
        element={
          <ResetPasswordRoute onAuthSubmit={onAuthSubmit} onResendVerification={onResendVerification}
            authError={authError} authInfo={authInfo} isSubmitting={isSubmitting} theme={theme} onThemeChange={onThemeChange} />
        }
      />
      <Route
        path={ROUTES.verifyEmail}
        element={
          <AuthRoute mode="verify" onAuthSubmit={onAuthSubmit} onResendVerification={onResendVerification}
            authError={authError} authInfo={authInfo} isSubmitting={isSubmitting} theme={theme} onThemeChange={onThemeChange} />
        }
      />
      <Route path={`${ROUTES.verifyEmail}/:token`} element={<VerifyEmailPage />} />
      <Route path={ROUTES.googleCallback} element={<GoogleCallbackPage onGoogleCallback={onGoogleCallback} />} />
      <Route path="*" element={<Navigate to={mode === "login" ? ROUTES.login : authPathForMode(mode)} replace />} />
    </Routes>
  );
}
