import { useEffect, useMemo, useState } from "react";

import { ChangePasswordModal } from "./components/change-password-modal";
import { AppRouter } from "./routes/app-router";
import { getAuthErrorMessage, getCurrentUser, getPasswordPolicyMessage, isStrongPassword, isValidEmail, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, resendVerificationEmail, type AuthSession, type AuthUser } from "./lib/auth-api";
import { useLocalStorage } from "./hooks/use-local-storage";
import { dsaCompanies } from "./data/dsa";
import { frontendQuestions, roadmapWeeks } from "./data/frontend";
import type { FrontendQuestionId, QuestionId } from "./types/prepdoc";
import { ROUTES, type AuthSubmitResult } from "./routes/route-paths";
import "./App.css";

function formatUserLabel(user: AuthUser | null) {
  if (!user) return "Unknown user";

  const fields = [user.name, user.first_name, user.last_name, user.email];
  for (const field of fields) {
    if (typeof field === "string" && field.trim()) {
      return field.trim();
    }
  }

  return "Unknown user";
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    "prepdoc.sidebar-collapsed",
    false,
  );
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "prepdoc.theme",
    "light",
  );
  const [solvedDsaIds, setSolvedDsaIds] = useLocalStorage<QuestionId[]>(
    "prepdoc.dsa.solved",
    [],
  );
  const [bookmarkedDsaIds, setBookmarkedDsaIds] = useLocalStorage<QuestionId[]>(
    "prepdoc.dsa.bookmarked",
    [],
  );
  const [completedFrontendIds, setCompletedFrontendIds] = useLocalStorage<
    FrontendQuestionId[]
  >("prepdoc.frontend.completed", []);
  const [completedRoadmapDays, setCompletedRoadmapDays] = useLocalStorage<
    number[]
  >("prepdoc.frontend.roadmap-days", []);
  const [authSession, setAuthSession] = useLocalStorage<AuthSession | null>(
    "prepdoc.auth-session",
    null,
  );
  const [authStatus, setAuthStatus] = useState<"loading" | "ready">("loading");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changePasswordSubmitting, setChangePasswordSubmitting] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordInfo, setChangePasswordInfo] = useState<string | null>(null);

  const authToken = authSession?.token;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!authToken) {
        if (!cancelled) setAuthStatus("ready");
        return;
      }

      try {
        const session = await getCurrentUser(authToken);
        if (!cancelled) {
          setAuthSession(session);
        }
      } catch {
        if (!cancelled) {
          setAuthSession(null);
        }
      } finally {
        if (!cancelled) {
          setAuthStatus("ready");
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [authToken, setAuthSession]);

  const dsaQuestionCount = useMemo(
    () => dsaCompanies.reduce((total, company) => total + company.questions.length, 0),
    [],
  );
  const frontendQuestionCount = frontendQuestions.length;
  const roadmapDayCount = useMemo(
    () => roadmapWeeks.reduce((total, week) => total + week.days.length, 0),
    [],
  );

  const dsaProgress =
    dsaQuestionCount === 0
      ? 0
      : Math.round((solvedDsaIds.length / dsaQuestionCount) * 100);
  const frontendProgress =
    frontendQuestionCount === 0
      ? 0
      : Math.round((completedFrontendIds.length / frontendQuestionCount) * 100);
  const roadmapProgress =
    roadmapDayCount === 0
      ? 0
      : Math.round((completedRoadmapDays.length / roadmapDayCount) * 100);
  const overallProgress = Math.round(
    (dsaProgress + frontendProgress + roadmapProgress) / 3,
  );

  const handleAuthSubmit = async ({
    mode,
    first_name,
    last_name,
    email,
    password,
    resetToken,
  }: {
    mode: "login" | "register" | "forgot" | "reset" | "verify";
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    resetToken: string;
  }): Promise<AuthSubmitResult> => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthInfo(null);

    try {
      if (mode === "register") {
        if (!first_name.trim() || !last_name.trim() || !email.trim() || !password.trim()) {
          throw new Error("All fields are required");
        }
        if (!isValidEmail(email)) {
          throw new Error("Invalid email format");
        }
        if (!isStrongPassword(password)) {
          throw new Error(getPasswordPolicyMessage());
        }

        const result = await registerUser({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        setAuthInfo(result.message);
        return { nextRoute: ROUTES.verifyEmail, message: result.message };
      }

      if (mode === "forgot") {
        if (!email.trim()) throw new Error("Email is required");
        if (!isValidEmail(email)) throw new Error("Invalid email format");

        await requestPasswordReset(email.trim().toLowerCase());
        const message = "Password reset email requested.";
        setAuthInfo(message);
        return { nextRoute: ROUTES.login, message };
      }

      if (mode === "reset") {
        if (!resetToken) throw new Error("Missing reset token.");
        if (!isStrongPassword(password)) {
          throw new Error(getPasswordPolicyMessage());
        }

        await resetPassword(resetToken, password);
        const message = "Password reset complete. You can sign in now.";
        setAuthInfo(message);
        return { nextRoute: ROUTES.login, message };
      }

      if (mode === "verify") {
        if (!email.trim()) throw new Error("Email is required");
        if (!isValidEmail(email)) throw new Error("Invalid email format");

        await resendVerificationEmail(email.trim().toLowerCase());
        const message = "Verification email sent.";
        setAuthInfo(message);
        return { nextRoute: ROUTES.verifyEmail, message };
      }

      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required");
      }
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }

      const session = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });
      setAuthSession(session);
      return { nextRoute: ROUTES.dashboard };
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      return { nextRoute: ROUTES.login };
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleCallback = (session: AuthSession) => {
    setAuthSession(session);
    setAuthError(null);
    setAuthInfo("Google sign-in completed.");
  };

  const handleLogout = async () => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthInfo(null);

    try {
      if (authSession?.token) {
        await logoutUser(authSession.token);
      }
    } catch {
      // Ignore backend logout failure and clear local state.
    } finally {
      setAuthSession(null);
      setIsChangePasswordOpen(false);
      setAuthSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!authSession?.token) return;

    if (newPassword !== confirmPassword) {
      setChangePasswordError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setChangePasswordError(getPasswordPolicyMessage());
      return;
    }

    setChangePasswordSubmitting(true);
    setChangePasswordError(null);
    setChangePasswordInfo(null);

    try {
      await fetch(`${import.meta.env.VITE_AUTH_API_BASE_URL?.trim() || "https://lcauth-backend.onrender.com"}/api/change-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authSession.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }).then(async (response) => {
        const text = await response.text();
        let payload: unknown = null;
        try {
          payload = text ? JSON.parse(text) : null;
        } catch {
          payload = text;
        }
        if (!response.ok) {
          const errorMessage =
            typeof payload === "object" && payload && "message" in payload
              ? String((payload as { message?: unknown }).message ?? "Unable to change password.")
              : "Unable to change password.";
          throw new Error(errorMessage);
        }
        return payload;
      });
      setChangePasswordInfo("Password changed. Please sign in again.");
      await handleLogout();
    } catch (error) {
      setChangePasswordError(getAuthErrorMessage(error));
    } finally {
      setChangePasswordSubmitting(false);
    }
  };

  const currentUser = authSession?.user ?? null;
  const userLabel = formatUserLabel(currentUser);
  const allowEmptyCurrentPassword = currentUser?.has_password === false;

  return (
    <>
      <AppRouter
      authSession={authSession}
      authStatus={authStatus}
      authError={authError}
      authInfo={authInfo}
      authSubmitting={authSubmitting}
      theme={theme}
      onThemeChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
      onLogout={handleLogout}
      onOpenChangePassword={() => {
        setChangePasswordError(null);
        setChangePasswordInfo(null);
        setIsChangePasswordOpen(true);
      }}
      userLabel={userLabel}
      lcSolvedCount={solvedDsaIds.length}
      qDoneCount={completedFrontendIds.length}
      solvedIds={solvedDsaIds}
      bookmarkedIds={bookmarkedDsaIds}
      companies={dsaCompanies}
      questions={frontendQuestions}
      roadmapWeeks={roadmapWeeks}
      completedQuestionIds={completedFrontendIds}
      completedRoadmapDays={completedRoadmapDays}
      onSolvedIdsChange={setSolvedDsaIds}
      onBookmarkedIdsChange={setBookmarkedDsaIds}
      onCompletedQuestionIdsChange={setCompletedFrontendIds}
      onCompletedRoadmapDaysChange={setCompletedRoadmapDays}
      dsaProgress={dsaProgress}
      frontendProgress={frontendProgress}
      overallProgress={overallProgress}
      solvedDsaCount={solvedDsaIds.length}
      totalDsaCount={dsaQuestionCount}
      completedFrontendCount={completedFrontendIds.length}
      totalFrontendCount={frontendQuestionCount}
      completedRoadmapCount={completedRoadmapDays.length}
      totalRoadmapCount={roadmapDayCount}
      companyCount={dsaCompanies.length}
      onAuthSubmit={handleAuthSubmit}
      onResendVerification={async (email) => {
        await resendVerificationEmail(email);
        setAuthInfo("Verification email sent.");
      }}
      onGoogleCallback={handleGoogleCallback}
      />

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePasswordSubmit}
        allowEmptyCurrentPassword={allowEmptyCurrentPassword}
        isLoading={changePasswordSubmitting}
        errorMessage={changePasswordError}
        infoMessage={changePasswordInfo}
      />
    </>
  );
}

export default App;
