import type { Dispatch, SetStateAction } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import type { AuthSession } from "@/lib/auth-api";
import type { DsaCompany, FrontendQuestion, FrontendQuestionId, QuestionId, RoadmapWeek, SystemDesignQuestion, SystemDesignQuestionId } from "@/types/maangco";
import type { AuthSubmitResult } from "./route-paths";
import { PrivateRoutes } from "./private-routes";
import { PublicRoutes } from "./public-routes";

export interface AppRouterProps {
  isPremium: boolean;
  onBuyPremium: (plan?: "monthly" | "yearly") => void;
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
  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  companies: DsaCompany[];
  systemDesignQuestions: SystemDesignQuestion[];
  completedSystemDesignIds: SystemDesignQuestionId[];
  onCompletedSystemDesignIdsChange: Dispatch<SetStateAction<SystemDesignQuestionId[]>>;
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
  isQuestionsLoading: boolean;
  onAuthSubmit: (input: {
    mode: "login" | "register" | "forgot" | "reset" | "verify";
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    resetToken: string;
  }) => Promise<AuthSubmitResult>;
  onResendVerification: (email: string) => Promise<void>;
  onGoogleCallback: (session: AuthSession) => Promise<void> | void;
}

function AppRouterContent(props: AppRouterProps) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isAppRoute =
    path === "/dashboard" ||
    path === "/dsa" ||
    path === "/system-design" ||
    path === "/frontend" ||
    path.startsWith("/dashboard/") ||
    path.startsWith("/dsa/") ||
    path.startsWith("/system-design/") ||
    path.startsWith("/frontend/");

  return (
    <>
      {props.authStatus === "loading" ? (
        <div className="app-loading-screen">
          <div className="app-loading-logo">
            <svg viewBox="0 0 20 20" width="28" height="28">
              <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
            </svg>
          </div>
          <div className="app-loading-text">MAANGco</div>
        </div>
      ) : isAppRoute ? (
        <PrivateRoutes
          isPremium={props.isPremium}
          onBuyPremium={props.onBuyPremium}
          authSession={props.authSession}
          theme={props.theme}
          onThemeChange={props.onThemeChange}
          isSidebarCollapsed={props.isSidebarCollapsed}
          onToggleSidebar={props.onToggleSidebar}
          onLogout={props.onLogout}
          onOpenChangePassword={props.onOpenChangePassword}
          userLabel={props.userLabel}

          solvedIds={props.solvedIds}
          bookmarkedIds={props.bookmarkedIds}
          companies={props.companies}
          systemDesignQuestions={props.systemDesignQuestions}
          completedSystemDesignIds={props.completedSystemDesignIds}
          onCompletedSystemDesignIdsChange={props.onCompletedSystemDesignIdsChange}
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
          isQuestionsLoading={props.isQuestionsLoading}
        />
      ) : (
        <PublicRoutes
          authSession={props.authSession}
          userLabel={props.userLabel}
          onAuthSubmit={props.onAuthSubmit}
          onResendVerification={props.onResendVerification}
          onGoogleCallback={props.onGoogleCallback}
          onLogout={props.onLogout}
          onOpenChangePassword={props.onOpenChangePassword}
          onBuyPremium={props.onBuyPremium}
          isPremium={props.isPremium}
          authError={props.authError}
          authInfo={props.authInfo}
          isSubmitting={props.authSubmitting}
          theme={props.theme}
          onThemeChange={props.onThemeChange}
        />
      )}
    </>
  );
}

export function AppRouter(props: AppRouterProps) {
  return (
    <BrowserRouter>
      <AppRouterContent {...props} />
    </BrowserRouter>
  );
}
