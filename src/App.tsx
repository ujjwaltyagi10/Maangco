import { useEffect, useMemo, useState, type SetStateAction } from "react";

import { ChangePasswordModal } from "./components/change-password-modal";
import { PremiumModal } from "./components/premium-modal";
import { AppRouter } from "./routes/app-router";
import { changePassword, getAuthErrorMessage, getCurrentUser, getPasswordPolicyMessage, isStrongPassword, isValidEmail, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, resendVerificationEmail, type AuthSession, type AuthUser } from "./lib/auth-api";
import { fetchProgress, toggleProgress, emptyProgress, type ProgressState } from "./lib/progress-api";
import { fetchDsaGrouped, fetchSystemDesignQuestions, fetchFrontendQuestions, fetchRoadmap } from "./lib/questions-api";
import { useLocalStorage } from "./hooks/use-local-storage";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek, SystemDesignQuestion, SystemDesignQuestionId } from "./types/maangco";
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

function getDeviceDefaultTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

async function hydrateSessionFromBackend(
  token: string,
  fallbackUser?: AuthUser,
): Promise<AuthSession> {
  const session = await getCurrentUser(token);

  return {
    token: session.token,
    user: {
      ...fallbackUser,
      ...session.user,
    },
  };
}

async function tryHydrateSessionFromBackend(
  token: string,
  fallbackUser?: AuthUser,
): Promise<AuthSession> {
  try {
    return await hydrateSessionFromBackend(token, fallbackUser);
  } catch {
    return {
      token,
      user: {
        ...fallbackUser,
      },
    };
  }
}

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage(
    "maangco.sidebar-collapsed",
    false,
  );
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "maangco.theme",
    getDeviceDefaultTheme(),
  );
  const [solvedDsaIds, setSolvedDsaIds] = useLocalStorage<QuestionId[]>(
    "maangco.dsa.solved",
    [],
  );
  const [bookmarkedDsaIds, setBookmarkedDsaIds] = useLocalStorage<QuestionId[]>(
    "maangco.dsa.bookmarked",
    [],
  );
  const [completedSystemDesignIds, setCompletedSystemDesignIds] = useLocalStorage<
    SystemDesignQuestionId[]
  >("maangco.sd.completed", []);
  const [completedFrontendIds, setCompletedFrontendIds] = useLocalStorage<
    FrontendQuestionId[]
  >("maangco.frontend.completed", []);
  const [completedRoadmapDays, setCompletedRoadmapDays] = useLocalStorage<
    number[]
  >("maangco.frontend.roadmap-days", []);
  // Optimistic in-memory flag — resets on refresh so localStorage tampering has no effect.
  // Source of truth is currentUser.subscription.isActive from the backend.
  const [premiumAccess, setPremiumAccess] = useState(false);
  const [authSession, setAuthSession] = useLocalStorage<AuthSession | null>(
    "maangco.auth-session",
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumModalDefaultPlan, setPremiumModalDefaultPlan] = useState<"monthly" | "yearly">("monthly");
  const [dsaCompanies, setDsaCompanies] = useState<DsaCompany[]>([]);
  const [systemDesignQuestions, setSystemDesignQuestions] = useState<SystemDesignQuestion[]>([]);
  const [frontendQuestions, setFrontendQuestions] = useState<FrontendQuestion[]>([]);
  const [roadmapWeeks, setRoadmapWeeks] = useState<RoadmapWeek[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);

  const authToken = authSession?.token;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Remove legacy localStorage premium flag — backend subscription is now the source of truth
    localStorage.removeItem("maangco.premium-access");
  }, []);

  // Apply backend progress to local state
  function applyProgress(progress: ProgressState) {
    setSolvedDsaIds(progress.dsa.solved as QuestionId[]);
    setBookmarkedDsaIds(progress.dsa.bookmarked as QuestionId[]);
    setCompletedSystemDesignIds(progress.system_design.completed as SystemDesignQuestionId[]);
    setCompletedFrontendIds(progress.frontend.completed as FrontendQuestionId[]);
    setCompletedRoadmapDays(progress.roadmap.completed.map(Number));
  }

  useEffect(() => {
    setAuthStatus("ready");
    if (authSession?.token) {
      const token = authSession.token;
      const user = authSession.user;
      void tryHydrateSessionFromBackend(token, user)
        .then((session) => setAuthSession(session))
        .catch(() => {});
      void fetchProgress(token)
        .then(applyProgress)
        .catch(() => {});
    }
    // Load question data from API — track loading state for skeleton UIs
    void Promise.allSettled([
      fetchDsaGrouped().then((companies) => setDsaCompanies(companies as DsaCompany[])),
      fetchSystemDesignQuestions({}).then(({ data }) => setSystemDesignQuestions(data)),
      Promise.all([fetchFrontendQuestions({}), fetchRoadmap()]).then(([feRes, weeks]) => {
        setFrontendQuestions(feRes.data);
        setRoadmapWeeks(weeks);
      }),
    ]).finally(() => setIsQuestionsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount

  const dsaQuestionCount = useMemo(
    () => dsaCompanies.reduce((total, company) => total + company.questions.length, 0),
    [dsaCompanies],
  );
  const frontendQuestionCount = frontendQuestions.length;
  const roadmapDayCount = useMemo(
    () => roadmapWeeks.reduce((total, week) => total + (week.days?.length ?? 0), 0),
    [roadmapWeeks],
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

  // ── Progress setters that also sync to backend ─────────────────────────────
  // Panels call these with either a plain array OR a (prev) => next updater,
  // so each wrapper resolves the SetStateAction before diffing.

  function handleSolvedDsaChange(action: SetStateAction<QuestionId[]>) {
    const prev = solvedDsaIds;
    const newIds = typeof action === "function" ? action(prev) : action;
    setSolvedDsaIds(newIds);
    if (!authToken) return;
    const added = newIds.filter((id) => !prev.includes(id));
    const removed = prev.filter((id) => !newIds.includes(id));
    for (const id of added)
      void toggleProgress(authToken, { questionType: "dsa", questionId: id, action: "solved", active: true }).catch(() => {});
    for (const id of removed)
      void toggleProgress(authToken, { questionType: "dsa", questionId: id, action: "solved", active: false }).catch(() => {});
  }

  function handleBookmarkedDsaChange(action: SetStateAction<QuestionId[]>) {
    const prev = bookmarkedDsaIds;
    const newIds = typeof action === "function" ? action(prev) : action;
    setBookmarkedDsaIds(newIds);
    if (!authToken) return;
    const added = newIds.filter((id) => !prev.includes(id));
    const removed = prev.filter((id) => !newIds.includes(id));
    for (const id of added)
      void toggleProgress(authToken, { questionType: "dsa", questionId: id, action: "bookmarked", active: true }).catch(() => {});
    for (const id of removed)
      void toggleProgress(authToken, { questionType: "dsa", questionId: id, action: "bookmarked", active: false }).catch(() => {});
  }

  function handleCompletedSdChange(action: SetStateAction<SystemDesignQuestionId[]>) {
    const prev = completedSystemDesignIds;
    const newIds = typeof action === "function" ? action(prev) : action;
    setCompletedSystemDesignIds(newIds);
    if (!authToken) return;
    const added = newIds.filter((id) => !prev.includes(id));
    const removed = prev.filter((id) => !newIds.includes(id));
    for (const id of added)
      void toggleProgress(authToken, { questionType: "system_design", questionId: id, action: "completed", active: true }).catch(() => {});
    for (const id of removed)
      void toggleProgress(authToken, { questionType: "system_design", questionId: id, action: "completed", active: false }).catch(() => {});
  }

  function handleCompletedFrontendChange(action: SetStateAction<FrontendQuestionId[]>) {
    const prev = completedFrontendIds;
    const newIds = typeof action === "function" ? action(prev) : action;
    setCompletedFrontendIds(newIds);
    if (!authToken) return;
    const added = newIds.filter((id) => !prev.includes(id));
    const removed = prev.filter((id) => !newIds.includes(id));
    for (const id of added)
      void toggleProgress(authToken, { questionType: "frontend", questionId: id, action: "completed", active: true }).catch(() => {});
    for (const id of removed)
      void toggleProgress(authToken, { questionType: "frontend", questionId: id, action: "completed", active: false }).catch(() => {});
  }

  function handleCompletedRoadmapChange(action: SetStateAction<number[]>) {
    const prev = completedRoadmapDays;
    const newDays = typeof action === "function" ? action(prev) : action;
    setCompletedRoadmapDays(newDays);
    if (!authToken) return;
    const added = newDays.filter((d) => !prev.includes(d));
    const removed = prev.filter((d) => !newDays.includes(d));
    for (const d of added)
      void toggleProgress(authToken, { questionType: "roadmap", questionId: String(d), action: "completed", active: true }).catch(() => {});
    for (const d of removed)
      void toggleProgress(authToken, { questionType: "roadmap", questionId: String(d), action: "completed", active: false }).catch(() => {});
  }

  // ── Auth handlers ──────────────────────────────────────────────────────────

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
      const hydratedSession = await tryHydrateSessionFromBackend(session.token, session.user);
      setAuthSession(hydratedSession);

      // Load progress from backend after login (replaces localStorage)
      void fetchProgress(session.token)
        .then(applyProgress)
        .catch(() => {});

      return { nextRoute: ROUTES.dashboard };
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      return { nextRoute: ROUTES.login };
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleCallback = async (session: AuthSession) => {
    const hydratedSession = await tryHydrateSessionFromBackend(session.token, session.user);
    setAuthSession(hydratedSession);
    setAuthError(null);
    setAuthInfo("Google sign-in completed.");

    // Load progress from backend after Google login
    void fetchProgress(session.token)
      .then(applyProgress)
      .catch(() => {});
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
      // Clear local progress on logout
      applyProgress(emptyProgress());
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
      await changePassword(authSession.token, { currentPassword, newPassword });
      setChangePasswordInfo("Password changed. Please sign in again.");
      await handleLogout();
    } catch (error) {
      setChangePasswordError(getAuthErrorMessage(error));
    } finally {
      setChangePasswordSubmitting(false);
    }
  };

  const currentUser = authSession?.user ?? null;
  const userLabel = currentUser ? formatUserLabel(currentUser) : "Guest";
  const allowEmptyCurrentPassword = currentUser?.has_password === false;
  // Backend is the sole source of truth — subscription.isActive from /api/me
  // premiumAccess is only an optimistic flag set right after payment (cleared on refresh)
  const isPremium = currentUser?.subscription?.isActive === true || premiumAccess;

  const handleBuyPremium = (plan?: "monthly" | "yearly") => {
    const safePlan = plan === "monthly" || plan === "yearly" ? plan : "monthly";
    setPremiumModalDefaultPlan(safePlan);
    setShowPremiumModal(true);
  };

  const handlePaymentSuccess = async () => {
    setPremiumAccess(true);
    const token = authToken;
    const fallbackUser = authSession?.user;
    if (token) {
      try {
        const session = await tryHydrateSessionFromBackend(token, fallbackUser);
        setAuthSession(session);
        // Webhook may not have fired yet — retry after 3s to catch late activation
        if (!session.user?.subscription?.isActive) {
          setTimeout(async () => {
            try {
              const retried = await tryHydrateSessionFromBackend(token, fallbackUser);
              setAuthSession(retried);
            } catch { /* ignore */ }
          }, 3000);
        }
      } catch {
        // keep local premium flag if refresh fails
      }
    }
  };

  return (
    <>
      <AppRouter
        isPremium={isPremium}
        onBuyPremium={handleBuyPremium}
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
        userEmail={currentUser?.email}
        solvedIds={solvedDsaIds}
        bookmarkedIds={bookmarkedDsaIds}
        companies={dsaCompanies}
        systemDesignQuestions={systemDesignQuestions}
        completedSystemDesignIds={completedSystemDesignIds}
        onCompletedSystemDesignIdsChange={handleCompletedSdChange}
        questions={frontendQuestions}
        roadmapWeeks={roadmapWeeks}
        completedQuestionIds={completedFrontendIds}
        completedRoadmapDays={completedRoadmapDays}
        onSolvedIdsChange={handleSolvedDsaChange}
        onBookmarkedIdsChange={handleBookmarkedDsaChange}
        onCompletedQuestionIdsChange={handleCompletedFrontendChange}
        onCompletedRoadmapDaysChange={handleCompletedRoadmapChange}
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
        isQuestionsLoading={isQuestionsLoading}
        onAuthSubmit={handleAuthSubmit}
        onResendVerification={async (email) => {
          await resendVerificationEmail(email);
          setAuthInfo("Verification email sent.");
        }}
        onGoogleCallback={handleGoogleCallback}
      />

      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        authToken={authToken}
        userEmail={currentUser?.email}
        onPaymentSuccess={handlePaymentSuccess}
        defaultPlan={premiumModalDefaultPlan}
        onSignInRequired={() => {
          setShowPremiumModal(false);
          void handleLogout();
        }}
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
