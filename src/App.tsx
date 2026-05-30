import { startTransition, useEffect, useMemo } from "react";

import { AppShell } from "./components/app-shell";
import { DashboardPanel } from "./components/dashboard-panel";
import { DsaPanel } from "./components/dsa-panel";
import { FrontendPanel } from "./components/frontend-panel";
import { dsaCompanies } from "./data/dsa";
import { frontendQuestions, roadmapWeeks } from "./data/frontend";
import { useLocalStorage } from "./hooks/use-local-storage";
import type { AppPanel, FrontendQuestionId, QuestionId } from "./types/prepdoc";

function App() {
  const [activePanel, setActivePanel] = useLocalStorage<AppPanel>(
    "prepdoc.active-panel",
    "dashboard",
  );
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const dsaQuestionCount = useMemo(
    () =>
      dsaCompanies.reduce(
        (total, company) => total + company.questions.length,
        0,
      ),
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

  const handlePanelChange = (panel: AppPanel) => {
    startTransition(() => {
      setActivePanel(panel);
    });
  };

  return (
    <AppShell
      activePanel={activePanel}
      onPanelChange={handlePanelChange}
      theme={theme}
      onThemeChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
      lcSolvedCount={solvedDsaIds.length}
      qDoneCount={completedFrontendIds.length}
    >
      {activePanel === "dashboard" ? (
        <DashboardPanel
          dsaProgress={dsaProgress}
          frontendProgress={frontendProgress}
          overallProgress={overallProgress}
          solvedDsaCount={solvedDsaIds.length}
          totalDsaCount={dsaQuestionCount}
          completedFrontendCount={completedFrontendIds.length}
          totalFrontendCount={frontendQuestionCount}
          completedRoadmapDays={completedRoadmapDays.length}
          totalRoadmapDays={roadmapDayCount}
          companyCount={dsaCompanies.length}
          onOpenDsa={() => handlePanelChange("dsa")}
          onOpenFrontend={() => handlePanelChange("frontend")}
        />
      ) : null}

      {activePanel === "dsa" ? (
        <DsaPanel
          companies={dsaCompanies}
          solvedIds={solvedDsaIds}
          bookmarkedIds={bookmarkedDsaIds}
          onSolvedIdsChange={setSolvedDsaIds}
          onBookmarkedIdsChange={setBookmarkedDsaIds}
        />
      ) : null}

      {activePanel === "frontend" ? (
        <FrontendPanel
          questions={frontendQuestions}
          roadmapWeeks={roadmapWeeks}
          completedQuestionIds={completedFrontendIds}
          completedRoadmapDays={completedRoadmapDays}
          onCompletedQuestionIdsChange={setCompletedFrontendIds}
          onCompletedRoadmapDaysChange={setCompletedRoadmapDays}
        />
      ) : null}
    </AppShell>
  );
}

export default App;
