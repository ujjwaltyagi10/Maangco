import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes/route-paths";

interface PremiumGateModalProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
  onBuyPremium: () => void;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export function PremiumGateModal({
  theme,
  onThemeChange,
  onBuyPremium,
  title = "System Design is Premium",
  subtitle = "Get full access to 150+ questions, HLD + LLD depth, and category-based tracking.",
  onClose,
}: PremiumGateModalProps) {
  const navigate = useNavigate();

  return (
    <div
      className="auth-gate-overlay"
      role="presentation"
      onClick={onClose ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div className="auth-gate-card" role="dialog" aria-modal="true" aria-label="Upgrade to unlock this feature">
        <div className="auth-gate-mini">
          <div className="auth-gate-mini-top">
            {onClose && (
              <button
                type="button"
                className="auth-gate-theme-btn"
                onClick={onClose}
                aria-label="Close"
                style={{ marginRight: "auto" }}
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 14, height: 14 }}>
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="auth-gate-theme-btn"
              onClick={onThemeChange}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                  <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                  <circle cx="10" cy="10" r="3.2" />
                  <path d="M10 1.8V4.1M10 15.9V18.2M1.8 10H4.1M15.9 10H18.2M4.2 4.2L5.8 5.8M14.2 14.2L15.8 15.8M4.2 15.8L5.8 14.2M14.2 5.8L15.8 4.2" />
                </svg>
              )}
            </button>
          </div>

          <div className="auth-gate-mini-icon premium-gate-icon">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 8l4 6 6-9 6 9 4-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z" />
            </svg>
          </div>

          <div className="auth-gate-mini-title">{title}</div>
          <div className="auth-gate-mini-subtitle">{subtitle}</div>

          <div className="auth-gate-mini-actions">
            <button
              type="button"
              className="auth-gate-action"
              onClick={() => navigate(ROUTES.dashboard, { replace: true })}
            >
              Preview Dashboard
            </button>
            <button
              type="button"
              className="auth-gate-action auth-gate-action--primary"
              onClick={onBuyPremium}
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
