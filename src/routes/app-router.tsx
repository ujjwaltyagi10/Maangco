import type { Dispatch, SetStateAction } from "react";
import { BrowserRouter } from "react-router-dom";

import type { AuthSession } from "@/lib/auth-api";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek } from "@/types/prepdoc";
import type { AuthSubmitResult } from "./route-paths";
import { PrivateRoutes } from "./private-routes";
import { PublicRoutes } from "./public-routes";

export interface AppRouterProps {
  authSession: AuthSession | null;
  authStatus: "loading" | "ready";
  authError: string | null;
  authInfo: string | null;
  authSubmitting: boolean;
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
  onAuthSubmit: (input: {
    mode: "login" | "register" | "forgot" | "reset" | "verify";
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    resetToken: string;
  }) => Promise<AuthSubmitResult>;
  onResendVerification: (email: string) => Promise<void>;
  onGoogleCallback: (session: AuthSession) => void;
}

export function AppRouter(props: AppRouterProps) {
  return (
    <BrowserRouter>
      {props.authStatus === "loading" ? (
        <div className="auth-page auth-page--loading">
          <div className="auth-loading-card">Restoring session...</div>
        </div>
      ) : props.authSession?.token ? (
        <PrivateRoutes
          authSession={props.authSession}
          theme={props.theme}
          onThemeChange={props.onThemeChange}
          isSidebarCollapsed={props.isSidebarCollapsed}
          onToggleSidebar={props.onToggleSidebar}
          onLogout={props.onLogout}
          onOpenChangePassword={props.onOpenChangePassword}
          userLabel={props.userLabel}
          lcSolvedCount={props.lcSolvedCount}
          qDoneCount={props.qDoneCount}
          solvedIds={props.solvedIds}
          bookmarkedIds={props.bookmarkedIds}
          companies={props.companies}
          questions={props.questions}
          roadmapWeeks={props.roadmapWeeks}
          completedQuestionIds={props.completedQuestionIds}
          completedRoadmapDays={props.completedRoadmapDays}
          onSolvedIdsChange={props.onSolvedIdsChange}
          onBookmarkedIdsChange={props.onBookmarkedIdsChange}
          onCompletedQuestionIdsChange={props.onCompletedQuestionIdsChange}
          onCompletedRoadmapDaysChange={props.onCompletedRoadmapDaysChange}
          dsaProgress={props.dsaProgress}
          frontendProgress={props.frontendProgress}
          overallProgress={props.overallProgress}
          solvedDsaCount={props.solvedDsaCount}
          totalDsaCount={props.totalDsaCount}
          completedFrontendCount={props.completedFrontendCount}
          totalFrontendCount={props.totalFrontendCount}
          completedRoadmapCount={props.completedRoadmapCount}
          totalRoadmapCount={props.totalRoadmapCount}
          companyCount={props.companyCount}
        />
      ) : (
        <PublicRoutes
          authSession={props.authSession}
          onAuthSubmit={props.onAuthSubmit}
          onResendVerification={props.onResendVerification}
          onGoogleCallback={props.onGoogleCallback}
          authError={props.authError}
          authInfo={props.authInfo}
          isSubmitting={props.authSubmitting}
        />
      )}
    </BrowserRouter>
  );
}
