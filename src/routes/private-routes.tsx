import type { Dispatch, SetStateAction } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { AuthGateModal } from "@/components/auth-gate-modal";
import { DashboardPanel } from "@/components/dashboard-panel";
import { DsaPanel } from "@/components/dsa-panel";
import { FrontendPanel } from "@/components/frontend-panel";
import { PublicDashboardPreview } from "@/components/public-dashboard-preview";
import { SystemDesignPanel } from "@/components/system-design-panel";
import type { AuthSession } from "@/lib/auth-api";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek, SystemDesignQuestion, SystemDesignQuestionId } from "@/types/prepdoc";
import { panelFromPath, panelPath, ROUTES } from "./route-paths";

interface PrivateRoutesProps {
  isPremium: boolean;
  onBuyPremium: () => void;
  authSession: AuthSession | null;
  theme: "light" | "dark";
  onThemeChange: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void | Promise<void>;
  onOpenChangePassword: () => void;
  userLabel: string;
  lcSolvedCount: number;
  qDoneCount: number;
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
  lcSolvedCount,
  qDoneCount,
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
  const isLocked = !isAuthenticated && !isFrontendFree && !isDashboardPreview;

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
        lcSolvedCount={lcSolvedCount}
        qDoneCount={qDoneCount}
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
              isAuthenticated ? (
                <DashboardPanel
                  isPremium={isPremium}
                  onBuyPremium={onBuyPremium}
                  dsaProgress={dsaProgress}
                  frontendProgress={frontendProgress}
                  overallProgress={overallProgress}
                  solvedDsaCount={solvedDsaCount}
                  totalDsaCount={totalDsaCount}
                  completedFrontendCount={completedFrontendCount}
                  totalFrontendCount={totalFrontendCount}
                  completedRoadmapDays={completedRoadmapCount}
                  totalRoadmapDays={totalRoadmapCount}
                  companyCount={companyCount}
                  onOpenDsa={() => navigate(ROUTES.dsa)}
                  onOpenFrontend={() => navigate(ROUTES.frontend)}
                />
              ) : (
                <PublicDashboardPreview
                  companyCount={companyCount}
                  theme={theme}
                  onSignIn={onSignIn}
                  onSignUp={onSignUp}
                  onBrowseFrontend={() => navigate(ROUTES.frontend)}
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
              <SystemDesignPanel
                questions={systemDesignQuestions}
                completedIds={completedSystemDesignIds}
                onCompletedIdsChange={onCompletedSystemDesignIdsChange}
              />
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
              />
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
        </Routes>
      </AppShell>

      {isLocked ? (
        <AuthGateModal
          theme={theme}
          onThemeChange={onThemeChange}
          onBrowseFrontend={() => navigate(ROUTES.frontend)}
        />
      ) : null}
    </>
  );
}
