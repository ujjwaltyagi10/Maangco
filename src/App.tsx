import { startTransition, useEffect, useMemo } from "react";
import {
  BookOpenCheck,
  Code2,
  LayoutDashboard,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  SunMedium,
} from "lucide-react";

import { DashboardPanel } from "@/components/dashboard-panel";
import { DsaPanel } from "@/components/dsa-panel";
import { FrontendPanel } from "@/components/frontend-panel";
import { PrepDocLogo } from "@/components/prepdoc-logo";
import { Button } from "@/components/ui/button";
import { dsaCompanies } from "@/data/dsa";
import { frontendQuestions, roadmapWeeks } from "@/data/frontend";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { AppPanel, FrontendQuestionId, PanelDefinition, QuestionId } from "@/types/prepdoc";

const panelDefinitions: PanelDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "dsa",
    label: "DSA Prep",
    description: "Company tracker",
    icon: Code2,
  },
  {
    id: "frontend",
    label: "Frontend",
    description: "Roadmap + bank",
    icon: BookOpenCheck,
  },
];

function App() {
  const [activePanel, setActivePanel] = useLocalStorage<AppPanel>("prepdoc.active-panel", "dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage("prepdoc.sidebar-collapsed", false);
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("prepdoc.theme", "light");
  const [solvedDsaIds, setSolvedDsaIds] = useLocalStorage<QuestionId[]>("prepdoc.dsa.solved", []);
  const [bookmarkedDsaIds, setBookmarkedDsaIds] = useLocalStorage<QuestionId[]>("prepdoc.dsa.bookmarked", []);
  const [completedFrontendIds, setCompletedFrontendIds] = useLocalStorage<FrontendQuestionId[]>(
    "prepdoc.frontend.completed",
    [],
  );
  const [completedRoadmapDays, setCompletedRoadmapDays] = useLocalStorage<number[]>(
    "prepdoc.frontend.roadmap-days",
    [],
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const dsaQuestionCount = useMemo(
    () => dsaCompanies.reduce((total, company) => total + company.questions.length, 0),
    [],
  );
  const frontendQuestionCount = frontendQuestions.length;
  const roadmapDayCount = useMemo(
    () => roadmapWeeks.reduce((total, week) => total + week.days.length, 0),
    [],
  );

  const dsaProgress = dsaQuestionCount === 0 ? 0 : Math.round((solvedDsaIds.length / dsaQuestionCount) * 100);
  const frontendProgress =
    frontendQuestionCount === 0 ? 0 : Math.round((completedFrontendIds.length / frontendQuestionCount) * 100);
  const roadmapProgress =
    roadmapDayCount === 0 ? 0 : Math.round((completedRoadmapDays.length / roadmapDayCount) * 100);
  const overallProgress = Math.round((dsaProgress + frontendProgress + roadmapProgress) / 3);

  const handlePanelChange = (panel: AppPanel) => {
    startTransition(() => {
      setActivePanel(panel);
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.12),_transparent_28%),linear-gradient(180deg,_var(--background),_var(--background-elevated))] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <aside
          className={cn(
            "hidden border-r border-border/70 bg-sidebar/85 backdrop-blur md:flex md:flex-col",
            isSidebarCollapsed ? "md:w-24" : "md:w-76",
          )}
        >
          <div className="border-b border-border/70 p-4">
            <PrepDocLogo collapsed={isSidebarCollapsed} />
          </div>

          <nav className="flex-1 space-y-2 p-3">
            {panelDefinitions.map((panel) => {
              const Icon = panel.icon;

              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => handlePanelChange(panel.id)}
                  className={cn(
                    "flex w-full items-center rounded-2xl border px-3 py-3 text-left transition",
                    activePanel === panel.id
                      ? "border-primary/30 bg-primary/10 text-foreground shadow-[0_12px_32px_-20px_rgba(20,83,45,0.75)]"
                      : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card/80 hover:text-foreground",
                    isSidebarCollapsed ? "justify-center" : "gap-3",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-primary">
                    <Icon className="size-5" />
                  </span>
                  {!isSidebarCollapsed ? (
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{panel.label}</span>
                      <span className="block text-xs text-muted-foreground">{panel.description}</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-border/70 p-3">
            <Button
              variant="outline"
              className={cn("h-12 w-full justify-start rounded-2xl", isSidebarCollapsed && "justify-center px-0")}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunMedium /> : <Moon />}
              {!isSidebarCollapsed ? <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span> : null}
            </Button>
            <Button
              variant="outline"
              className={cn("h-12 w-full justify-start rounded-2xl", isSidebarCollapsed && "justify-center px-0")}
              onClick={() => setIsSidebarCollapsed((current) => !current)}
            >
              {isSidebarCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              {!isSidebarCollapsed ? <span>{isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}</span> : null}
            </Button>
          </div>
        </aside>

        <main className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">PrepDoc</p>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Interview workspace
                  </h1>
                </div>
                <div className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground">
                  Overall progress <span className="font-semibold text-foreground">{overallProgress}%</span>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto md:hidden">
                {panelDefinitions.map((panel) => {
                  const Icon = panel.icon;

                  return (
                    <button
                      key={panel.id}
                      type="button"
                      onClick={() => handlePanelChange(panel.id)}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                        activePanel === panel.id
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border bg-card/70 text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {panel.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
            {activePanel === "dashboard" ? (
              <DashboardPanel
                dsaProgress={dsaProgress}
                frontendProgress={frontendProgress}
                roadmapProgress={roadmapProgress}
                overallProgress={overallProgress}
                solvedDsaCount={solvedDsaIds.length}
                totalDsaCount={dsaQuestionCount}
                completedFrontendCount={completedFrontendIds.length}
                totalFrontendCount={frontendQuestionCount}
                completedRoadmapDays={completedRoadmapDays.length}
                totalRoadmapDays={roadmapDayCount}
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
