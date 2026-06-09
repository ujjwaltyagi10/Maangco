import type { Dispatch, SetStateAction } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { DashboardPanel } from "@/components/dashboard-panel";
import { DsaPanel } from "@/components/dsa-panel";
import { FrontendPanel } from "@/components/frontend-panel";
import type { AuthSession } from "@/lib/auth-api";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek } from "@/types/prepdoc";
import { panelFromPath, panelPath, ROUTES } from "./route-paths";

interface PrivateRoutesProps {
  isPremium: boolean;
  onBuyPremium: () => void;
  authSession: AuthSession;
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

  if (!authSession?.token) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return (
    <AppShell
      activePanel={activePanel}
      onPanelChange={(panel) => {
        navigate(panelPath(panel));
      }}
      theme={theme}
      onThemeChange={onThemeChange}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={onToggleSidebar}
      lcSolvedCount={lcSolvedCount}
      qDoneCount={qDoneCount}
      userLabel={userLabel}
      onLogout={onLogout}
      onOpenChangePassword={onOpenChangePassword}
    >
      <Routes>
        <Route
          path={ROUTES.dashboard}
          element={
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
  );
}
