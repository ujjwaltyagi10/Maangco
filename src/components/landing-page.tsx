import { useEffect, useRef, useState } from "react";
import { FinancialAidModal } from "./financial-aid-modal";

const DSALightVid = new URL("../assets/Video/DSALight.webm", import.meta.url).href;
const DSADarkVid = new URL("../assets/Video/DSADark.webm", import.meta.url).href;
const SDLightVid = new URL("../assets/Video/SDLight.webm", import.meta.url).href;
const SDDarkVid = new URL("../assets/Video/DSDark.webm", import.meta.url).href;

interface LandingPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
  onSignIn: () => void;
  onGetStarted: () => void;
  onStartFree: () => void;
  isAuthenticated?: boolean;
  userLabel?: string;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
  onOpenChangePassword?: () => void;
}

const companies = [
  "Google",
  "Meta",
  "Amazon",
  "Microsoft",
  "Apple",
  "Uber",
  "Netflix",
  "Atlassian",
  "Adobe",
  "Walmart",
  "Flipkart",
  "Nvidia",
  "Bloomberg",
  "Salesforce",
  "TikTok",
  "Citadel",
  "Goldman Sachs",
  "Visa",
  "Oracle",
  "Pinterest",
  "Airbnb",
  "Snowflake",
  "TCS",
];

const PLAN_FEATURES = [
  "500+ company-wise DSA questions",
  "System Design roadmap — 90 days, HLD + LLD",
  "Unified progress dashboard",
  "Questions refreshed every single day",
  "Bookmark & revisit any problem",
  "10+ FAANG company curated lists",
  "Progress sync across all devices",
];

const heroProblems = [
  { name: "Two Sum", diff: "easy", done: true },
  { name: "LRU Cache", diff: "hard", done: false },
  { name: "Merge Intervals", diff: "med", done: true },
  { name: "Word Break", diff: "med", done: false },
  { name: "Course Schedule II", diff: "hard", done: false },
];

const testimonials = [
  {
    initials: "AR",
    name: "Arjun Rao",
    role: "SDE @ Amazon",
    text: "PrepDoc's company-filtered DSA list is a game-changer. Focused on Amazon-tagged problems for 6 weeks, cleared my loop. No noise — just the problems that showed up in my actual rounds.",
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    role: "SDE-2 @ Flipkart",
    text: "The System Design roadmap is exactly what I was missing. Went through HLD + LLD day by day and walked into every design round prepared. Offer in 8 weeks.",
  },
  {
    initials: "SN",
    name: "Sahil Nair",
    role: "SDE-2 @ Google",
    text: "I've tried 4-5 prep platforms. PrepDoc is the sharpest and most focused. No bloat, no 2,000 random problems — cleared Google in my first attempt.",
  },
  {
    initials: "MT",
    name: "Mihika Tiwari",
    role: "SWE @ Microsoft",
    text: "Everything in one place — DSA tracker, system design roadmap, progress dashboard. The daily updates kept my prep fresh. Landed Microsoft in 10 weeks.",
  },
  {
    initials: "RS",
    name: "Rohan Sharma",
    role: "SDE @ Uber",
    text: "Zero filler content. Exactly the problems that show in real interviews. Bookmarked all hard problems, revisited them systematically. Cleared Uber backend loop in 8 weeks.",
  },
  {
    initials: "DG",
    name: "Divya Gupta",
    role: "SDE @ Adobe",
    text: "Best ₹249 I've spent. System Design coverage + DSA lists are unmatched. Daily updates meant I was always solving fresh, interview-relevant content.",
  },
];

const faqs = [
  {
    q: "What's included in a PrepDoc subscription?",
    a: "Everything FAANG interviews actually test: 500+ company-wise DSA problems, a 90-day System Design roadmap (HLD + LLD), a unified dashboard, and daily question updates. Not a single extra topic you won't need.",
  },
  {
    q: "How often are questions updated?",
    a: "Every single day. Our team adds new DSA problems and system design case studies daily, sourced from fresh interview reports at Google, Meta, Amazon, Microsoft and more.",
  },
  {
    q: "What DSA questions are included?",
    a: "500+ LeetCode-style problems organised by company. Each tagged by difficulty and topic — only the patterns that actually appear in real FAANG rounds, no filler.",
  },
  {
    q: "What does the System Design roadmap cover?",
    a: "A 90-day structured plan from CAP theorem to designing Twitter, YouTube, and distributed databases. Every day covers one concept with HLD + LLD breakdown — the exact depth FAANG senior rounds expect.",
  },
  {
    q: "Is there a yearly discount?",
    a: "Yes — the yearly plan at ₹1,999 saves you ₹989 vs monthly (₹249 × 12 = ₹2,988). You get 12 months of full access including all daily updates.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly subscribers can cancel anytime with no penalty. Yearly subscribers retain full access for the remainder of the year.",
  },
  {
    q: "Will my progress sync across devices?",
    a: "Yes. Sign in with Google or email and your solved problems, roadmap completion, and bookmarks persist everywhere you log in.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      width="14"
      height="14"
    >
      <path d="M3 8l4 4 6-6" />
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button
        type="button"
        className="faq-question"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            width: 16,
            height: 16,
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open ? <div className="faq-answer">{a}</div> : null}
    </div>
  );
}

function getInitials(label: string) {
  const parts = label.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return label.slice(0, 2).toUpperCase();
}

export function LandingPage({
  theme,
  onThemeChange,
  onSignIn,
  onGetStarted,
  onStartFree,
  isAuthenticated = false,
  userLabel = "",
  onGoToDashboard,
  onLogout,
  onOpenChangePassword,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [aidModalOpen, setAidModalOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    if (avatarMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  return (
    <div className="landing w-full min-w-0">
      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-container">
          <div className="landing-nav-row">
            <div className="landing-nav-left">
              <a href="/" className="landing-logo flex-shrink-0">
                <div className="landing-logo-mark">
                  <svg viewBox="0 0 20 20" width="16" height="16">
                    <path
                      d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="landing-logo-text">
                  Prep<em>Doc</em>
                </span>
              </a>

              <div className="hidden lg:flex items-center gap-1 flex-1">
                <a href="#features" className="landing-nav-link">
                  Features
                </a>
                <a href="#pricing" className="landing-nav-link">
                  Pricing
                </a>
                <a href="#testimonials" className="landing-nav-link">
                  Reviews
                </a>
                <a href="#faq" className="landing-nav-link">
                  FAQ
                </a>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {!isAuthenticated && (
                <button
                  type="button"
                  className="lnav-theme-btn"
                  onClick={onThemeChange}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="15"
                      height="15"
                    >
                      <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      width="15"
                      height="15"
                    >
                      <circle cx="10" cy="10" r="3.2" />
                      <path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.9 4.9L6.3 6.3M13.7 13.7L15.1 15.1M4.9 15.1L6.3 13.7M13.7 6.3L15.1 4.9" />
                    </svg>
                  )}
                </button>
              )}
              {isAuthenticated ? (
                <div className="profile-menu-wrap" ref={avatarMenuRef}>
                  <button
                    type="button"
                    className={`profile-menu-btn${avatarMenuOpen ? " open" : ""}`}
                    onClick={() => setAvatarMenuOpen((o) => !o)}
                    aria-label="Open user menu"
                    aria-expanded={avatarMenuOpen}
                  >
                    <div className="profile-avatar">{getInitials(userLabel)}</div>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="profile-chevron" style={{ width: 12, height: 12 }}>
                      <path d="M5 8l5 5 5-5H5z" />
                    </svg>
                  </button>

                  {avatarMenuOpen ? (
                    <div className="profile-dropdown" style={{ right: 0, left: "auto", top: "calc(100% + 8px)" }}>
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar profile-avatar--lg">{getInitials(userLabel)}</div>
                        <div style={{ minWidth: 0 }}>
                          <div className="profile-dropdown-name">{userLabel}</div>
                          <div className="profile-dropdown-sub">Signed in</div>
                        </div>
                      </div>

                      <div className="profile-dropdown-divider" />

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => { onGoToDashboard?.(); setAvatarMenuOpen(false); }}
                      >
                        <span className="profile-dropdown-item-icon">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <rect x="2" y="3" width="7" height="7" rx="1" />
                            <rect x="11" y="3" width="7" height="7" rx="1" />
                            <rect x="2" y="11" width="7" height="7" rx="1" />
                            <rect x="11" y="11" width="7" height="7" rx="1" />
                          </svg>
                        </span>
                        Dashboard
                      </button>

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => { onThemeChange(); setAvatarMenuOpen(false); }}
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
                        onClick={() => { onOpenChangePassword?.(); setAvatarMenuOpen(false); }}
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
                        onClick={() => { onLogout?.(); setAvatarMenuOpen(false); }}
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
                <>
                  <button type="button" className="lnav-sign-in" onClick={onSignIn}>
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="lnav-get-started"
                    onClick={onGetStarted}
                  >
                    Get Started →
                  </button>
                </>
              )}
            </div>

            <div className="landing-nav-mobile">
              <button
                type="button"
                className="lnav-theme-btn"
                onClick={onThemeChange}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    width="14"
                    height="14"
                  >
                    <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    width="14"
                    height="14"
                  >
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 2V4M10 16V18M2 10H4M16 10H18" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="lnav-theme-btn"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="16"
                  height="16"
                >
                  {mobileMenuOpen ? (
                    <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                  ) : (
                    <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen ? (
            <div className="lg:hidden pb-4 flex flex-col gap-1">
              {["#features", "#pricing", "#testimonials", "#faq"].map(
                (href, i) => (
                  <a
                    key={href}
                    href={href}
                    className="landing-nav-link block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {["Features", "Pricing", "Reviews", "FAQ"][i]}
                  </a>
                ),
              )}
              <div className="flex gap-2 mt-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="lnav-get-started flex-1"
                    onClick={onGoToDashboard}
                  >
                    Go to Dashboard →
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="lnav-sign-in flex-1"
                      onClick={onSignIn}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className="lnav-get-started flex-1"
                      onClick={onGetStarted}
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      {/* ── HERO v2 ── */}
      <section className="lhero-v2">
        <div className="lhero-orb lhero-orb-1" />
        <div className="lhero-orb lhero-orb-2" />
        <div className="lhero-orb lhero-orb-3" />
        <div className="lhero-grid-overlay" />

        <div className="landing-container lhero-v2-wrap">
          {/* Left: content */}
          <div className="lhero-v2-left">
            <div className="lhero-v2-badge">
              <span className="lhero-v2-live-dot" />
              Live · Questions added daily from fresh FAANG reports
            </div>

            <h1 className="lhero-v2-title">
              Crack FAANG.
              <span className="lhero-v2-gradient-text">
                Not a question more.
                <br />
                Not a concept less.
              </span>
            </h1>

            <p className="lhero-v2-sub">
              The exact DSA and System Design material FAANG interviews demand.
              Zero fluff. Zero gaps. Refreshed every single day.
            </p>

            <div className="lhero-v2-ctas">
              <button
                type="button"
                className="lbtn-primary lbtn-lg lbtn-glow"
                onClick={onStartFree}
              >
                Start Learning for Free
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="15"
                  height="15"
                >
                  <path d="M7 5l6 5-6 5V5z" />
                </svg>
              </button>
              <a href="#pricing" className="lbtn-outline lbtn-lg">
                View Pricing
              </a>
            </div>

            <div className="lhero-v2-stats">
              {[
                { v: "500+", l: "DSA Questions" },
                { v: "10+", l: "FAANG Companies" },
                { v: "Daily", l: "Fresh Questions" },
                { v: "90-Day", l: "System Design" },
              ].map((s, i, arr) => (
                <div
                  key={s.l}
                  className="lhero-v2-stat-item"
                  style={{
                    borderRight:
                      i < arr.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div className="lhero-v2-stat-val">{s.v}</div>
                  <div className="lhero-v2-stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating 3D cards */}
          <div className="lhero-v2-right">
            {/* Back card: System Design */}
            <div className="lhfc lhfc--back">
              <div className="lhfc-header">
                <div className="lhfc-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="lhfc-title">System Design — Day 11</span>
                <span className="lhfc-live-dot" />
              </div>
              <div className="lhfc-topic">Design YouTube Upload Flow</div>
              <div className="lhfc-tags">
                {["HLD", "LLD", "CDN", "Message Queue"].map((t) => (
                  <span key={t} className="lhfc-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="lhfc-row-bar">
                <span className="lhfc-bar-label">Week 2 of 13</span>
                <div className="lhfc-bar-track">
                  <div className="lhfc-bar-fill" style={{ width: "28%" }} />
                </div>
                <span className="lhfc-bar-pct">28%</span>
              </div>
            </div>

            {/* Front card: DSA Practice */}
            <div className="lhfc lhfc--front">
              <div className="lhfc-header">
                <div className="lhfc-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="lhfc-title">DSA Practice — Google</span>
                <span className="lhfc-live-dot" />
              </div>
              <div className="lhfc-tabs">
                {["All", "Google", "Meta", "Amazon"].map((c) => (
                  <span
                    key={c}
                    className={`lhfc-tab${c === "Google" ? " active" : ""}`}
                  >
                    {c}
                  </span>
                ))}
              </div>
              {heroProblems.map((p) => (
                <div
                  key={p.name}
                  className={`lhfc-problem-row${p.done ? " done" : ""}`}
                >
                  <span className={`lhfc-diff lhfc-diff--${p.diff}`}>
                    {p.diff}
                  </span>
                  <span className="lhfc-problem-name">{p.name}</span>
                  {p.done ? (
                    <span className="lhfc-check">✓</span>
                  ) : (
                    <span className="lhfc-circle" />
                  )}
                </div>
              ))}
              <div className="lhfc-footer">
                <div className="lhfc-footer-bar">
                  <div className="lhfc-footer-fill" style={{ width: "45%" }} />
                </div>
                <span className="lhfc-footer-label">45 / 100 solved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section className="lmarquee-section">
        <div className="lmarquee-fade-left" />
        <div className="lmarquee-fade-right" />
        <p className="lmarquee-eyebrow">Questions sourced from engineers at</p>
        <div className="lmarquee-overflow">
          <div className="lmarquee-track">
            {[...companies, ...companies].map((c, i) => (
              <div key={`${c}-${i}`} className="lmarquee-chip">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SHOWCASE ── */}
      <section className="lsection lvideo-section">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">See it in action</div>
            <h2 className="lsection-title">The exact tools you'll use every day.</h2>
            <p className="lsection-sub">
              Live previews of the DSA tracker and system design roadmap — exactly what you get after signing up.
            </p>
          </div>
          <div className="lvideo-grid">
            <div className="lvideo-card">
              <div className="lvideo-header">
                <div className="lvideo-icon" style={{ background: "var(--green-bg)", color: "var(--green)" }}>⚡</div>
                <div>
                  <div className="lvideo-name">DSA Practice</div>
                  <div className="lvideo-hint">Company-wise sheets, frequency &amp; tags</div>
                </div>
                <div className="lvideo-live-badge">Live</div>
              </div>
              <div className="lvideo-frame">
                <video autoPlay loop muted playsInline preload="metadata" key={theme === "dark" ? DSADarkVid : DSALightVid}>
                  <source src={theme === "dark" ? DSADarkVid : DSALightVid} type="video/webm" />
                </video>
              </div>
            </div>
            <div className="lvideo-card">
              <div className="lvideo-header">
                <div className="lvideo-icon" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>🏗️</div>
                <div>
                  <div className="lvideo-name">System Design</div>
                  <div className="lvideo-hint">150-question roadmap with depth &amp; tracking</div>
                </div>
                <div className="lvideo-live-badge">Live</div>
              </div>
              <div className="lvideo-frame">
                <video autoPlay loop muted playsInline preload="metadata" key={theme === "dark" ? SDDarkVid : SDLightVid}>
                  <source src={theme === "dark" ? SDDarkVid : SDLightVid} type="video/webm" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section className="lsection" id="features">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Features</div>
            <h2 className="lsection-title">
              Everything you need. Nothing you don't.
            </h2>
            <p className="lsection-sub">
              Three precision modules — DSA, System Design, and progress
              tracking. Built to crack FAANG, not overwhelm you.
            </p>
          </div>

          <div className="lbento-grid">
            {/* DSA — large left card */}
            <div className="lbento-card lbento-dsa">
              <div className="lbento-card-inner">
                <div
                  className="lbento-tag"
                  style={{
                    color: "var(--amber)",
                    background: "var(--amber-bg)",
                  }}
                >
                  DSA Practice
                </div>
                <h3 className="lbento-title">
                  Company-wise questions.
                  <br />
                  Only what they ask.
                </h3>
                <p className="lbento-desc">
                  500+ curated problems organised by company. No filler — just
                  the exact patterns FAANG tests. New problems added every
                  single day.
                </p>
                <ul className="lbento-list">
                  <li>
                    <CheckIcon /> Easy / Medium / Hard difficulty tags
                  </li>
                  <li>
                    <CheckIcon /> Bookmark problems to revisit later
                  </li>
                  <li>
                    <CheckIcon /> New questions added every day
                  </li>
                </ul>
                <button
                  type="button"
                  className="lfeat-cta"
                  onClick={onGetStarted}
                >
                  Start practising →
                </button>
              </div>
              <div className="lbento-dsa-visual">
                <div className="lbdv-header">
                  <div className="lhfc-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="lhfc-title">Amazon · 148 problems</span>
                  <span className="lhfc-live-dot" />
                </div>
                {[
                  { name: "Two Sum", diff: "easy", done: true },
                  { name: "LRU Cache", diff: "hard", done: false },
                  { name: "Merge Intervals", diff: "med", done: true },
                  { name: "Word Break", diff: "med", done: false },
                  { name: "Trapping Rain Water", diff: "hard", done: false },
                ].map((q) => (
                  <div
                    key={q.name}
                    className={`lhfc-problem-row${q.done ? " done" : ""}`}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span className={`lhfc-diff lhfc-diff--${q.diff}`}>
                      {q.diff}
                    </span>
                    <span className="lhfc-problem-name">{q.name}</span>
                    {q.done ? (
                      <span className="lhfc-check">✓</span>
                    ) : (
                      <span className="lhfc-circle" />
                    )}
                  </div>
                ))}
                <div className="lbdv-footer">
                  <span className="lbdv-new-badge">+3 new today</span>
                  <div
                    style={{
                      flex: 1,
                      height: 4,
                      background: "var(--border)",
                      borderRadius: 99,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "45%",
                        height: "100%",
                        background: "var(--amber)",
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text3)",
                      fontWeight: 600,
                    }}
                  >
                    45%
                  </span>
                </div>
              </div>
            </div>

            {/* System Design — top right */}
            <div className="lbento-card lbento-sysdesign">
              <div
                className="lbento-tag"
                style={{ color: "var(--blue)", background: "var(--blue-bg)" }}
              >
                System Design
              </div>
              <h3 className="lbento-title">90-day HLD + LLD mastery</h3>
              <p className="lbento-desc">
                From CAP theorem to designing YouTube — every FAANG topic, one
                per day. Exactly the depth senior rounds expect.
              </p>
              <div className="lbento-topic-pills">
                {[
                  "CAP Theorem",
                  "Load Balancing",
                  "Caching (Redis)",
                  "DB Sharding",
                  "Design Twitter",
                  "Message Queues",
                ].map((t) => (
                  <span key={t} className="lbento-pill">
                    {t}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="lfeat-cta"
                onClick={onGetStarted}
              >
                Explore roadmap →
              </button>
            </div>

            {/* Dashboard — bottom right */}
            <div className="lbento-card lbento-dashboard">
              <div
                className="lbento-tag"
                style={{ color: "var(--green)", background: "var(--green-bg)" }}
              >
                Dashboard
              </div>
              <h3 className="lbento-title">Know exactly where you stand</h3>
              <div className="lbento-dash-rows">
                {[
                  { l: "DSA", v: 45, c: "var(--amber)" },
                  { l: "Sys Design", v: 78, c: "var(--blue)" },
                  { l: "Overall", v: 62, c: "var(--green)" },
                ].map((s) => (
                  <div key={s.l} className="lbento-dash-row">
                    <span className="lbento-dash-label">{s.l}</span>
                    <div className="lbento-dash-track">
                      <div
                        className="lbento-dash-fill"
                        style={{ width: `${s.v}%`, background: s.c }}
                      />
                    </div>
                    <span className="lbento-dash-pct" style={{ color: s.c }}>
                      {s.v}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lsection lsection--alt" id="testimonials">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Reviews</div>
            <h2 className="lsection-title">
              Engineers who cracked it with PrepDoc
            </h2>
            <p className="lsection-sub">
              Real results from engineers who got into Google, Meta, Amazon,
              Microsoft and more.
            </p>
          </div>
          <div className="ltesti-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="ltesti-card">
                <div className="ltesti-stars">{"★★★★★"}</div>
                <p className="ltesti-text">{t.text}</p>
                <div className="ltesti-author">
                  <div className="ltesti-avatar">{t.initials}</div>
                  <div>
                    <div className="ltesti-name">{t.name}</div>
                    <div className="ltesti-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lsection" id="pricing">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Pricing</div>
            <h2 className="lsection-title">One plan. Everything unlocked.</h2>
            <p className="lsection-sub">
              No tiers, no upsells. Every feature from day one — DSA, System
              Design, daily updates, full dashboard.
            </p>
          </div>

          <div className="lprice-cards">
            {/* Monthly */}
            <div className="lprice-card">
              <div className="lprice-plan-name">Monthly</div>
              <div className="lprice-amount">
                <span className="lprice-currency">₹</span>
                <span className="lprice-num">249</span>
                <span className="lprice-period">/month</span>
              </div>
              <p className="lprice-tagline">Great to start. Cancel anytime.</p>
              <ul className="lprice-features">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="lprice-feature">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="lbtn-outline lprice-btn"
                onClick={onGetStarted}
              >
                Start monthly →
              </button>
            </div>

            {/* Yearly — highlighted */}
            <div className="lprice-card lprice-card--highlight">
              <div className="lprice-popular-badge">
                Most Popular · Save 33%
              </div>
              <div className="lprice-plan-name">Yearly</div>
              <div className="lprice-amount">
                <span className="lprice-currency">₹</span>
                <span className="lprice-num">1,999</span>
                <span className="lprice-period">/year</span>
              </div>
              <p className="lprice-tagline">
                ₹167/month · Save ₹989 vs monthly
              </p>
              <ul className="lprice-features">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="lprice-feature">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
                <li className="lprice-feature lprice-feature--bonus">
                  <CheckIcon />
                  Priority support
                </li>
              </ul>
              <button
                type="button"
                className="lbtn-primary lprice-btn lbtn-glow"
                onClick={onGetStarted}
              >
                Get yearly access →
              </button>
            </div>
          </div>
          <p className="lprice-note">
            Secure payment · Cancel anytime · All major cards accepted
          </p>
        </div>
      </section>

      {/* ── FINANCIAL AID ── */}
      <section className="lsection lfa-section" id="financial-aid">
        <div className="landing-container">
          <div className="lfa-card">
            {/* Left: text content */}
            <div className="lfa-card-left">
              <div className="lfa-tag">Financial Aid</div>
              <h2 className="lfa-title">Can't afford it right now?</h2>
              <p className="lfa-sub">
                Financial barriers shouldn't stop anyone from cracking their dream job. If you
                genuinely can't afford Premium, apply — every application is reviewed personally
                and approved applicants get <strong>3 months free</strong>.
              </p>
              <ul className="lfa-checklist">
                <li className="lfa-check-row">
                  <svg className="lfa-check-icon" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                  <span className="lfa-check-text">3 months of full Premium access, completely free</span>
                </li>
                <li className="lfa-check-row">
                  <svg className="lfa-check-icon" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                  <span className="lfa-check-text">Every application reviewed personally, not by bots</span>
                </li>
                <li className="lfa-check-row">
                  <svg className="lfa-check-icon" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                  <span className="lfa-check-text">No credit card required, ever</span>
                </li>
                <li className="lfa-check-row">
                  <svg className="lfa-check-icon" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6l3 3 5-5" /></svg>
                  <span className="lfa-check-text">Response within 2–3 business days</span>
                </li>
              </ul>
            </div>

            {/* Right: action panel */}
            <div className="lfa-card-right">
              <p className="lfa-card-right-title">Apply in 2 minutes</p>
              <div className="lfa-stats">
                <div className="lfa-stat">
                  <div className="lfa-stat-num">3 mo</div>
                  <div className="lfa-stat-lbl">Free access if approved</div>
                </div>
                <div className="lfa-stat-divider" />
                <div className="lfa-stat">
                  <div className="lfa-stat-num">2–3</div>
                  <div className="lfa-stat-lbl">Days to review</div>
                </div>
              </div>
              <button
                type="button"
                className="lfa-cta-btn"
                onClick={() => setAidModalOpen(true)}
              >
                Apply for Financial Aid
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </button>
              <p className="lfa-cta-note">Reviewed Mon – Fri · No card required</p>
            </div>
          </div>
        </div>
      </section>

      <FinancialAidModal open={aidModalOpen} onClose={() => setAidModalOpen(false)} />

      {/* ── FAQ ── */}
      <section className="lsection lsection--alt" id="faq">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">FAQ</div>
            <h2 className="lsection-title">Frequently asked questions</h2>
          </div>
          <div className="lfaq-list">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lfinal-cta">
        <div className="lfinal-glow" />
        <div className="landing-container relative z-10 text-center">
          <div className="lfinal-badge">
            <span className="lhero-v2-live-dot" />
            Questions updated daily
          </div>
          <h2 className="lfinal-title">
            Stop winging your prep.
            <br />
            Start cracking FAANG.
          </h2>
          <p className="lfinal-sub">
            The exact DSA and System Design material FAANG tests — structured,
            daily-updated, nothing extra.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <button
              type="button"
              className="lbtn-primary lbtn-lg lbtn-glow"
              onClick={onGetStarted}
            >
              Start your prep →
            </button>
            <a href="#pricing" className="lbtn-outline lbtn-lg">
              View Pricing
            </a>
          </div>
          <p className="lfinal-note">
            Secure payment · Cancel anytime · Questions refreshed daily
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <a href="/" className="landing-logo">
              <div
                className="landing-logo-mark"
                style={{ width: 28, height: 28 }}
              >
                <svg viewBox="0 0 20 20" width="13" height="13">
                  <path
                    d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="landing-logo-text" style={{ fontSize: 14 }}>
                Prep<em>Doc</em>
              </span>
            </a>
            <p className="lfooter-copy">
              © 2025 PrepDoc. Built for engineers, by engineers.
            </p>
            <div className="flex items-center gap-1">
              <button type="button" className="lfooter-link" onClick={onSignIn}>
                Sign In
              </button>
              <button
                type="button"
                className="lfooter-link"
                onClick={onGetStarted}
              >
                Get Started
              </button>
              <a href="#features" className="lfooter-link">
                Features
              </a>
              <a href="#pricing" className="lfooter-link">
                Pricing
              </a>
              <a href="#faq" className="lfooter-link">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
