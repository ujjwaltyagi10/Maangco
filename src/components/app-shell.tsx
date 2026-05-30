import type { ReactNode } from "react";

import type { AppPanel } from "@/types/prepdoc";

interface AppShellProps {
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

const navItems = [
  { id: "dashboard" as AppPanel, label: "Dashboard", emoji: "🏠" },
  { id: "dsa" as AppPanel, label: "DSA Practice", emoji: "⚡", badge: "LC" },
  { id: "frontend" as AppPanel, label: "Frontend Prep", emoji: "🎯", badge: "45d" },
];

const panelLabels: Record<AppPanel, string> = {
  dashboard: "Dashboard",
  dsa: "DSA Practice",
  frontend: "Frontend Prep",
};

export function AppShell({
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
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", width: "100%" }}>
      {/* SIDEBAR */}
      <aside className={`sidebar${isSidebarCollapsed ? " collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 20 20">
              <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" />
            </svg>
          </div>
          <div className="logo-text">
            Prep<span>Doc</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-section-label">Navigation</div>

        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activePanel === item.id ? " active" : ""}`}
            onClick={() => onPanelChange(item.id)}
          >
            <div className="nav-icon">{item.emoji}</div>
            <span className="nav-label">{item.label}</span>
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </button>
        ))}

        {/* Resources */}
        <div className="sidebar-section-label">Resources</div>

        <a
          className="nav-item"
          href="https://leetcode.com"
          target="_blank"
          rel="noreferrer"
          style={{ opacity: 0.7 }}
        >
          <div className="nav-icon">🔗</div>
          <span className="nav-label">LeetCode</span>
        </a>

        <a
          className="nav-item"
          href="https://developer.mozilla.org"
          target="_blank"
          rel="noreferrer"
          style={{ opacity: 0.7 }}
        >
          <div className="nav-icon">📖</div>
          <span className="nav-label">MDN Docs</span>
        </a>

        {/* Bottom Controls */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="theme-toggle"
            onClick={onThemeChange}
            aria-label="Toggle theme"
          >
            <div className="theme-toggle-icon">
              {theme === "light" ? (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 16, height: 16 }}
                >
                  <circle cx="10" cy="10" r="3.2" />
                  <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ width: 16, height: 16 }}
                >
                  <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                </svg>
              )}
            </div>
            <span className="theme-mode-text">
              {theme === "light" ? "Light" : "Dark"}
            </span>
            <span className="control-spacer" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="collapse-btn"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="collapse-btn-icon">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                style={{ width: 16, height: 16 }}
              >
                <path d="M13 5L8 10L13 15" />
              </svg>
            </div>
            <span className="collapse-label">Collapse</span>
            <span className="control-spacer" aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* MAIN BODY */}
      <div className="app-body">
        {/* Top Nav */}
        <div className="topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-home">PrepDoc</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{panelLabels[activePanel]}</span>
          </div>
          <div className="topnav-actions">
            <div className="topnav-stat">
              <strong>{lcSolvedCount}</strong> LC solved
            </div>
            <div className="topnav-stat">
              <strong>{qDoneCount}</strong> Q done
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">{children}</div>
      </div>
    </div>
  );
}
