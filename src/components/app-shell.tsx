import type { ReactNode } from "react";
import { Moon, PanelLeftClose, PanelLeftOpen, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PrepDocLogo } from "@/components/prepdoc-logo";
import { cn } from "@/lib/utils";
import type { AppPanel, PanelDefinition } from "@/types/prepdoc";

interface AppShellProps {
  panels: PanelDefinition[];
  activePanel: AppPanel;
  onPanelChange: (panel: AppPanel) => void;
  theme: "light" | "dark";
  onThemeChange: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  lcSolvedCount: number;
  qDoneCount: number;
  children: ReactNode;
}

export function AppShell({
  panels,
  activePanel,
  onPanelChange,
  theme,
  onThemeChange,
  isSidebarCollapsed,
  onToggleSidebar,
  lcSolvedCount,
  qDoneCount,
  children,
}: AppShellProps) {
  const activePanelDefinition =
    panels.find((panel) => panel.id === activePanel) ?? panels[0];

  return (
    <div className="min-h-screen text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-400">
        <aside
          className={cn(
            "hidden shrink-0 border-r border-[#e5dccd] bg-[rgba(247,241,231,0.88)] backdrop-blur md:flex md:flex-col",
            isSidebarCollapsed ? "md:w-22" : "md:w-53.5",
          )}
        >
          <div
            className={cn(
              "border-b border-[#e5dccd] px-4 py-4",
              isSidebarCollapsed && "px-3",
            )}
          >
            <PrepDocLogo collapsed={isSidebarCollapsed} />
          </div>

          <div className="flex-1 px-3 py-4">
            <p
              className={cn(
                "px-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a917e]",
                isSidebarCollapsed && "sr-only",
              )}
            >
              Navigation
            </p>
            <div className="mt-4 space-y-2">
              {panels.map((panel) => {
                const Icon = panel.icon;

                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => onPanelChange(panel.id)}
                    className={cn(
                      "flex w-full items-center rounded-[1.15rem] border px-3 py-3 text-left transition",
                      activePanel === panel.id
                        ? "border-[#b8d1a8] bg-[#e9f2e2] text-[#1f271f] shadow-[0_12px_26px_-22px_rgba(77,140,73,0.8)]"
                        : "border-transparent text-[#6f6658] hover:border-[#ddd4c1] hover:bg-white/70 hover:text-[#1f271f]",
                      isSidebarCollapsed ? "justify-center px-0" : "gap-3",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] bg-white/80 text-[#4d8c49] shadow-[0_6px_18px_-16px_rgba(30,41,59,0.6)]">
                      <Icon className="size-4.5" />
                    </span>
                    {!isSidebarCollapsed ? (
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.96rem] font-semibold leading-5">
                          {panel.label}
                        </span>
                        <span className="mt-0.5 block text-[0.74rem] text-[#9a917e]">
                          {panel.description}
                        </span>
                      </span>
                    ) : null}
                    {!isSidebarCollapsed && panel.id !== "dashboard" ? (
                      <span className="rounded-full bg-[#e9f2e2] px-2 py-1 text-[0.7rem] font-semibold text-[#6c8a5f]">
                        {panel.id === "dsa" ? "LC" : "45d"}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <p
              className={cn(
                "mt-8 px-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#9a917e]",
                isSidebarCollapsed && "sr-only",
              )}
            >
              Resources
            </p>
            <div className="mt-4 space-y-2">
              {[
                { label: "LeetCode", icon: "⧉" },
                { label: "MDN Docs", icon: "◫" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={cn(
                    "flex w-full items-center rounded-[1rem] border border-transparent px-3 py-3 text-left text-[#6f6658] transition hover:border-[#ddd4c1] hover:bg-white/60 hover:text-[#1f271f]",
                    isSidebarCollapsed ? "justify-center px-0" : "gap-3",
                  )}
                >
                  <span className="flex size-9 items-center justify-center rounded-[0.95rem] bg-white/80 text-[0.95rem] shadow-[0_6px_18px_-16px_rgba(30,41,59,0.55)]">
                    {item.icon}
                  </span>
                  {!isSidebarCollapsed ? (
                    <span className="text-[0.94rem] font-medium">
                      {item.label}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-[#e5dccd] p-3">
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-[1rem] border-[#ddd4c1] bg-white/65 px-4 text-[#5f584d] shadow-none hover:bg-white"
              onClick={onThemeChange}
            >
              {theme === "dark" ? (
                <SunMedium className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              {!isSidebarCollapsed ? (
                <span>{theme === "dark" ? "Light" : "Light"}</span>
              ) : null}
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full justify-start rounded-[1rem] border-[#ddd4c1] bg-white/65 px-4 text-[#5f584d] shadow-none hover:bg-white"
              onClick={onToggleSidebar}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
              {!isSidebarCollapsed ? (
                <span>{isSidebarCollapsed ? "Expand" : "Collapse"}</span>
              ) : null}
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#e5dccd] bg-[rgba(248,244,236,0.9)] backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="truncate text-[0.92rem] text-[#aa9f8a]">
                  PrepDoc <span className="px-1 text-[#c3b69e]">›</span>{" "}
                  <span className="font-semibold text-[#2f2a23]">
                    {activePanelDefinition.label}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <StatPill label="LC solved" value={lcSolvedCount} />
                <StatPill label="Q done" value={qDoneCount} />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:hidden lg:px-8">
              {panels.map((panel) => {
                const Icon = panel.icon;

                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => onPanelChange(panel.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                      activePanel === panel.id
                        ? "border-[#b8d1a8] bg-[#e9f2e2] text-[#223020]"
                        : "border-[#ddd4c1] bg-white/70 text-[#73695b]",
                    )}
                  >
                    <Icon className="size-4" />
                    {panel.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-350">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[#ddd4c1] bg-[#f7f2e8] px-3 text-[0.84rem] font-medium text-[#534a3f] shadow-[0_8px_18px_-16px_rgba(30,41,59,0.45)]">
      <span className="text-[0.78rem] font-semibold text-[#2f2a23]">
        {value}
      </span>
      <span>{label}</span>
    </div>
  );
}
