import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/route-paths";

interface FinancialAidPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
}

const QUESTIONS = [
  {
    num: "01",
    q: "Full name & email",
    hint: "Your full name and the email address linked to your account (or the one you'll register with).",
  },
  {
    num: "02",
    q: "Current status",
    hint: "Student / Fresher / Unemployed / Employed (low income) / Career switcher",
  },
  {
    num: "03",
    q: "Country & city of residence",
    hint: "Helps us understand cost-of-living context without asking for income directly.",
  },
  {
    num: "04",
    q: "Why can't you afford the full subscription?",
    hint: "2–3 sentences max. This is your core self-declaration.",
  },
  {
    num: "05",
    q: "What is your target goal?",
    hint: "MAANG placement / Tier-1 startup / Any SWE job / Upskilling / Other",
  },
  {
    num: "06",
    q: "Hours per week you can commit to studying",
    hint: "Less than 5 / 5–10 / 10–20 / 20+",
  },
  {
    num: "07",
    q: "What discount would make this accessible?",
    hint: "25% off / 50% off / 75% off / I can't pay anything right now",
  },
];

export function FinancialAidPage({ theme, onThemeChange }: FinancialAidPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing w-full min-w-0" ref={containerRef}>

      {/* ── NAVBAR ── */}
      <nav className={`landing-nav${navScrolled ? " scrolled" : ""}${mobileMenuOpen ? " mobile-open" : ""}`}>
        <div className="landing-container">
          <div className="landing-nav-row">
            <div className="landing-nav-left">
              <Link to={ROUTES.landing} className="landing-logo shrink-0">
                <div className="landing-logo-mark">
                  <svg viewBox="0 0 20 20" width="16" height="16">
                    <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
                  </svg>
                </div>
                <span className="landing-logo-text">MAANG<em>co</em></span>
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="15">
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.9 4.9L6.3 6.3M13.7 13.7L15.1 15.1M4.9 15.1L6.3 13.7M13.7 6.3L15.1 4.9" />
                  </svg>
                )}
              </button>
            </div>
            <div className="landing-nav-mobile">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 2V4M10 16V18M2 10H4M16 10H18" />
                  </svg>
                )}
              </button>
              <button type="button" className="lnav-theme-btn" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Toggle menu">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  {mobileMenuOpen
                    ? <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                    : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ltc-hero">
        <div className="landing-container">
          <p className="ltc-eyebrow">Support</p>
          <h1 className="ltc-h1">Financial Aid</h1>
          <p className="ltc-sub">
            We believe cost should never be a barrier to learning. Send us an email with the details below we review every application personally and respond within 3–5 business days.
          </p>
          <p className="lfa-hero-email">
            <a href="mailto:support@maangco.com" className="lfa-email-link">support@maangco.com</a>
          </p>
        </div>
      </section>

      {/* ── QUESTIONS ── */}
      <section className="lfa-section">
        <div className="landing-container">
          <div className="lfa-grid">
            {QUESTIONS.map(({ num, q, hint }) => (
              <div key={num} className="lfa-item">
                <span className="lfa-item-num">{num}</span>
                <div className="lfa-item-body">
                  <p className="lfa-item-q">{q}</p>
                  <p className="lfa-item-hint">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="lfooter-center">
            <div className="lfooter-logo-mark-wrap">
              <svg viewBox="0 0 20 20" width="26" height="26">
                <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
              </svg>
            </div>
            <div className="lfooter-links-row">
              <Link to={ROUTES.termsConditions} className="lfooter-link" style={{ textDecoration: "none" }}>Terms and Conditions</Link>
              <Link to={ROUTES.contact} className="lfooter-link" style={{ textDecoration: "none" }}>Contact us</Link>
              <Link to={ROUTES.financialAid} className="lfooter-link" style={{ textDecoration: "none" }}>Financial Aid</Link>
              <Link to={ROUTES.privacyPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Privacy Policy</Link>
              <Link to={ROUTES.cancellationPolicy} className="lfooter-link" style={{ textDecoration: "none" }}>Cancellation and Refund Policy</Link>
            </div>
            <div className="lfooter-social-row">
              <a href="https://x.com/MAANGcode" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/maangco" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
            <div className="lfooter-divider" />
            <div className="lfooter-bottom">
              <p className="lfooter-wordmark">MAANG<em>co</em></p>
              <p className="lfooter-copy">© 2025 MAANGco. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
