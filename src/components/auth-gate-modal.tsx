import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes/route-paths";

interface AuthGateModalProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
}

export function AuthGateModal({
  theme,
  onThemeChange,
}: AuthGateModalProps) {
  const navigate = useNavigate();

  return (
    <div className="auth-gate-overlay" role="presentation">
      <div className="auth-gate-card" role="dialog" aria-modal="true" aria-label="Sign in to unlock MAANGco">
        <div className="auth-gate-mini">
          <div className="auth-gate-mini-top">
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

          <div className="auth-gate-mini-icon">
            <svg viewBox="0 0 20 20" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" />
            </svg>
          </div>

          <div className="auth-gate-mini-title">Login/Sign up to access MAANGco Plus</div>
          <div className="auth-gate-mini-subtitle">
            Unlock the dashboard, DSA, and system design sections. Frontend Prep stays free.
          </div>

          <div className="auth-gate-mini-actions">
            <button
              type="button"
              className="auth-gate-action"
              onClick={() => navigate(ROUTES.login, { replace: true })}
            >
              Login
            </button>
            <button
              type="button"
              className="auth-gate-action auth-gate-action--primary"
              onClick={() => navigate(ROUTES.dashboard, { replace: true })}
            >
              Free preview
            </button>
          </div>

          <button
            type="button"
            className="auth-gate-link"
            onClick={() => navigate(ROUTES.signup, { replace: true })}
          >
            New here? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
