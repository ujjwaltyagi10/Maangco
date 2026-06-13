import type { Dispatch, SetStateAction } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { AuthGateModal } from "@/components/auth-gate-modal";
import { DashboardPanel } from "@/components/dashboard-panel";
import { PremiumGateModal } from "@/components/premium-gate-modal";
import { DsaPanel } from "@/components/dsa-panel";
import { FrontendPanel } from "@/components/frontend-panel";
import { PublicDashboardPreview } from "@/components/public-dashboard-preview";
import { SystemDesignPanel } from "@/components/system-design-panel";
import type { AuthSession } from "@/lib/auth-api";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek, SystemDesignQuestion, SystemDesignQuestionId } from "@/types/prepdoc";
import { panelFromPath, panelPath, ROUTES } from "./route-paths";

interface PrivateRoutesProps {
  isPremium: boolean;
  onBuyPremium: (plan?: "monthly" | "yearly") => void;
  authSession: AuthSession | null;
  theme: "light" | "dark";
  onThemeChange: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void | Promise<void>;
  onOpenChangePassword: () => void;
  userLabel: string;

  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  companies: DsaCompany[];
  questions: FrontendQuestion[];
  roadmapWeeks: RoadmapWeek[];
  systemDesignQuestions: SystemDesignQuestion[];
  completedSystemDesignIds: SystemDesignQuestionId[];
  onCompletedSystemDesignIdsChange: Dispatch<SetStateAction<SystemDesignQuestionId[]>>;
  completedQuestionIds: FrontendQuestionId[];
  completedRoadmapDays: number[];
  onSolvedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onBookmarkedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onCompletedQuestionIdsChange: Dispatch<SetStateAction<FrontendQuestionId[]>>;
  onCompletedRoadmapDaysChange: Dispatch<SetStateAction<number[]>>;
  dsaProgress: number;
  frontendProgress: number;
  overallProgress: number;
  solvedDsaCount: number;
  totalDsaCount: number;
  completedFrontendCount: number;
  totalFrontendCount: number;
  completedRoadmapCount: number;
  totalRoadmapCount: number;
  companyCount: number;
}

export function PrivateRoutes({
  isPremium,
  onBuyPremium,
  authSession,
  theme,
  onThemeChange,
  isSidebarCollapsed,
  onToggleSidebar,
  onLogout,
  onOpenChangePassword,
  userLabel,

  solvedIds,
  bookmarkedIds,
  companies,
  systemDesignQuestions,
  completedSystemDesignIds,
  onCompletedSystemDesignIdsChange,
  questions,
  roadmapWeeks,
  completedQuestionIds,
  completedRoadmapDays,
  onSolvedIdsChange,
  onBookmarkedIdsChange,
  onCompletedQuestionIdsChange,
  onCompletedRoadmapDaysChange,
  dsaProgress,
  frontendProgress,
  overallProgress,
  solvedDsaCount,
  totalDsaCount,
  completedFrontendCount,
  totalFrontendCount,
  completedRoadmapCount,
  totalRoadmapCount,
  companyCount,
}: PrivateRoutesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePanel = panelFromPath(location.pathname);
  const onSignIn = () => navigate(ROUTES.login);
  const onSignUp = () => navigate(ROUTES.signup);
  const isAuthenticated = Boolean(authSession?.token);
  const isFrontendFree = activePanel === "frontend";
  const isDashboardPreview = !isAuthenticated && activePanel === "dashboard";
  const isAuthLocked = !isAuthenticated && !isFrontendFree && !isDashboardPreview;
  const isPremiumLocked = isAuthenticated && !isPremium && activePanel === "system-design";
  const isLocked = isAuthLocked || isPremiumLocked;

  return (
    <>
      <AppShell
        activePanel={activePanel}
        onPanelChange={(panel) => {
          navigate(panelPath(panel));
        }}
        onLogoClick={() => navigate("/")}
        theme={theme}
        onThemeChange={onThemeChange}
        isAuthenticated={isAuthenticated}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}

        userLabel={userLabel}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onLogout={onLogout}
        onOpenChangePassword={onOpenChangePassword}
        isLocked={isLocked}
      >
        <Routes>
          <Route
            path={ROUTES.dashboard}
            element={
              isAuthenticated && isPremium ? (
                <DashboardPanel
                  isPremium={isPremium}
                  onBuyPremium={onBuyPremium}
                  dsaProgress={dsaProgress}
                  frontendProgress={frontendProgress}
                  systemDesignProgress={systemDesignQuestions.length > 0 ? Math.round((completedSystemDesignIds.length / systemDesignQuestions.length) * 100) : 0}
                  overallProgress={overallProgress}
                  solvedDsaCount={solvedDsaCount}
                  totalDsaCount={totalDsaCount}
                  completedFrontendCount={completedFrontendCount}
                  totalFrontendCount={totalFrontendCount}
                  completedRoadmapDays={completedRoadmapCount}
                  totalRoadmapDays={totalRoadmapCount}
                  completedSystemDesignCount={completedSystemDesignIds.length}
                  totalSystemDesignCount={systemDesignQuestions.length}
                  onOpenDsa={() => navigate(ROUTES.dsa)}
                  onOpenFrontend={() => navigate(ROUTES.frontend)}
                  onOpenSystemDesign={() => navigate(ROUTES.systemDesign)}
                />
              ) : (
                <PublicDashboardPreview
                  companyCount={companyCount}
                  theme={theme}
                  onSignIn={onSignIn}
                  onSignUp={onSignUp}
                  isPremiumMode={isAuthenticated && !isPremium}
                  onBuyPremium={onBuyPremium}
                />
              )
            }
          />
          <Route
            path={ROUTES.dsa}
            element={
              <DsaPanel
                isPremium={isPremium}
                onBuyPremium={onBuyPremium}
                companies={companies}
                solvedIds={solvedIds}
                bookmarkedIds={bookmarkedIds}
                onSolvedIdsChange={onSolvedIdsChange}
                onBookmarkedIdsChange={onBookmarkedIdsChange}
              />
            }
          />
          <Route
            path={ROUTES.systemDesign}
            element={
              isPremiumLocked ? (
                <PublicDashboardPreview
                  companyCount={companyCount}
                  theme={theme}
                  onSignIn={onSignIn}
                  onSignUp={onSignUp}
                />
              ) : (
                <SystemDesignPanel
                  questions={systemDesignQuestions}
                  completedIds={completedSystemDesignIds}
                  onCompletedIdsChange={onCompletedSystemDesignIdsChange}
                />
              )
            }
          />
          <Route
            path={ROUTES.frontend}
            element={
              <FrontendPanel
                questions={questions}
                roadmapWeeks={roadmapWeeks}
                completedQuestionIds={completedQuestionIds}
                completedRoadmapDays={completedRoadmapDays}
                onCompletedQuestionIdsChange={onCompletedQuestionIdsChange}
                onCompletedRoadmapDaysChange={onCompletedRoadmapDaysChange}
                isPremium={isPremium}
                onBuyPremium={onBuyPremium}
              />
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
        </Routes>
      </AppShell>

      {isAuthLocked ? (
        <AuthGateModal
          theme={theme}
          onThemeChange={onThemeChange}
        />
      ) : null}
      {isPremiumLocked ? (
        <PremiumGateModal
          theme={theme}
          onThemeChange={onThemeChange}
          onBuyPremium={() => { navigate(ROUTES.dashboard); onBuyPremium(); }}
        />
      ) : null}
    </>
  );
}
