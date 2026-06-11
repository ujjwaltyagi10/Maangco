import { useEffect, useRef, useState, type ReactNode } from "react";
import { BookOpen, Code2, ExternalLink, LayoutDashboard, Layers, Server } from "lucide-react";

import type { AppPanel } from "@/types/prepdoc";

interface AppShellProps {
  activePanel: AppPanel;
  onPanelChange: (panel: AppPanel) => void;
  theme: "light" | "dark";
  onThemeChange: () => void;
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  lcSolvedCount: number;
  qDoneCount: number;
  userLabel: string;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
  onOpenChangePassword: () => void;
  isLocked?: boolean;
  children: ReactNode;
}

const navItems = [
  { id: "dashboard" as AppPanel, label: "Dashboard", icon: LayoutDashboard },
  { id: "dsa" as AppPanel, label: "DSA Practice", icon: Code2, badge: "LC" },
  { id: "system-design" as AppPanel, label: "System Design", icon: Server, badge: "150" },
  { id: "frontend" as AppPanel, label: "Frontend Prep", icon: Layers, badge: "45d" },
];

const panelLabels: Record<AppPanel, string> = {
  dashboard: "Dashboard",
  dsa: "DSA Practice",
  "system-design": "System Design",
  frontend: "Frontend Prep",
};

export function AppShell({
  activePanel,
  onPanelChange,
  theme,
  onThemeChange,
  isAuthenticated,
  isSidebarCollapsed,
  onToggleSidebar,
  lcSolvedCount,
  qDoneCount,
  userLabel,
  onSignIn,
  onSignUp,
  onLogout,
  onOpenChangePassword,
  isLocked,
  children,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const userInitials =
    userLabel
      .split(" ")
      .map((w) => w[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className={isLocked ? "app-shell app-shell--locked" : "app-shell"}
      style={{ display: "flex", height: "100vh", overflow: "hidden", width: "100%" }}
      aria-hidden={isLocked ? true : undefined}
    >
      {/* SIDEBAR */}
      <aside className={`sidebar${isSidebarCollapsed ? " collapsed" : ""}`}>
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

        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activePanel === item.id ? " active" : ""}`}
            onClick={() => onPanelChange(item.id)}
          >
            <div className="nav-icon"><item.icon size={16} strokeWidth={1.8} /></div>
            <span className="nav-label">{item.label}</span>
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </button>
        ))}

        <div className="sidebar-section-label">Resources</div>
        <a className="nav-item" href="https://leetcode.com" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>
          <div className="nav-icon"><ExternalLink size={16} strokeWidth={1.8} /></div>
          <span className="nav-label">LeetCode</span>
        </a>
        <a className="nav-item" href="https://developer.mozilla.org" target="_blank" rel="noreferrer" style={{ opacity: 0.7 }}>
          <div className="nav-icon"><BookOpen size={16} strokeWidth={1.8} /></div>
          <span className="nav-label">MDN Docs</span>
        </a>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="collapse-btn"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="collapse-btn-icon">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
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

            {isAuthenticated ? (
              <div className="profile-menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  className={`profile-menu-btn${menuOpen ? " open" : ""}`}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Open user menu"
                  aria-expanded={menuOpen}
                >
                  <div className="profile-avatar">{userInitials}</div>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="profile-chevron"
                    style={{ width: 12, height: 12 }}
                  >
                    <path d="M5 8l5 5 5-5H5z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar profile-avatar--lg">{userInitials}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="profile-dropdown-name">{userLabel}</div>
                        <div className="profile-dropdown-sub">Signed in</div>
                      </div>
                    </div>

                    <div className="profile-dropdown-divider" />

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => { onThemeChange(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        {theme === "light" ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                            <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <circle cx="10" cy="10" r="3.2" />
                            <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
                          </svg>
                        )}
                      </span>
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => { onOpenChangePassword(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          <rect x="3" y="9" width="14" height="10" rx="2" />
                          <path d="M7 9V6a3 3 0 0 1 6 0v3" />
                        </svg>
                      </span>
                      Change Password
                    </button>

                    <div className="profile-dropdown-divider" />

                    <button
                      type="button"
                      className="profile-dropdown-item profile-dropdown-item--danger"
                      onClick={() => { onLogout(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          <path d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3M13 14l4-4-4-4M17 10H7" />
                        </svg>
                      </span>
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="profile-menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  className={`profile-menu-btn${menuOpen ? " open" : ""}`}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Open guest menu"
                  aria-expanded={menuOpen}
                >
                  <div className="profile-avatar">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 14, height: 14 }}>
                      <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="profile-chevron"
                    style={{ width: 12, height: 12 }}
                  >
                    <path d="M5 8l5 5 5-5H5z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar profile-avatar--lg">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18 }}>
                          <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="profile-dropdown-name">Guest</div>
                        <div className="profile-dropdown-sub">Browse or sign in</div>
                      </div>
                    </div>

                    <div className="profile-dropdown-divider" />

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => { onThemeChange(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        {theme === "light" ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                            <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <circle cx="10" cy="10" r="3.2" />
                            <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
                          </svg>
                        )}
                      </span>
                      {theme === "light" ? "Dark Mode" : "Light Mode"}
                    </button>

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => { onSignIn(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          <path d="M7 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3M13 14l4-4-4-4M17 10H7" />
                        </svg>
                      </span>
                      Sign In
                    </button>

                    <button
                      type="button"
                      className="profile-dropdown-item"
                      onClick={() => { onSignUp(); setMenuOpen(false); }}
                    >
                      <span className="profile-dropdown-item-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                          <path d="M10 2.5v15M2.5 10h15" />
                        </svg>
                      </span>
                      Get Started
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="content-area">{children}</div>
      </div>

      {/* BOTTOM NAV — mobile only */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item${activePanel === item.id ? " active" : ""}`}
            onClick={() => onPanelChange(item.id)}
          >
            <div className="bottom-nav-icon">
              <item.icon size={22} strokeWidth={1.8} />
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
