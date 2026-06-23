import { useEffect, useRef, useState } from "react";
import stoneLeftImg from "@/assets/stone-left.webp";
import stoneRightImg from "@/assets/stone-right.webp";
import statsHeroImg from "@/assets/stats-hero.webp";

import adobeSvg from "@/assets/svg/adobe.svg";
import airbnbSvg from "@/assets/svg/airbnb.svg";
import googleSvg from "@/assets/svg/google.svg";
import metaSvg from "@/assets/svg/meta.svg";
import microsoftSvg from "@/assets/svg/microsoft.svg";
import netflixSvg from "@/assets/svg/netflix.svg";
import pinterestSvg from "@/assets/svg/pinterest.svg";
import salesforceSvg from "@/assets/svg/salesforce.svg";
import amazonSvg from "@/assets/svg/amazon.svg";
import appleSvg from "@/assets/svg/apple.svg";
import atlassianSvg from "@/assets/svg/atlassian.svg";
import nvidiaLightSvg from "@/assets/svg/nvidia-light.svg";
import oracleSvg from "@/assets/svg/oracle.svg";
import snowflakeSvg from "@/assets/svg/snowflake.svg";
import uberDarkSvg from "@/assets/svg/uber-dark.svg";
import visaSvg from "@/assets/svg/visa.svg";

const DSALightVid = new URL("../assets/Video/DSALight.webm", import.meta.url)
  .href;
const DSADarkVid = new URL("../assets/Video/DSADark.webm", import.meta.url)
  .href;
const SDLightVid = new URL("../assets/Video/SDLight.webm", import.meta.url)
  .href;
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
  onBuyPremium?: (plan?: "monthly" | "yearly") => void;
  isPremium?: boolean;
}

const PLAN_FEATURES = [
  "840+ company-wise DSA questions",
  "System Design roadmap — 90 days, HLD + LLD",
  "Unified progress dashboard",
  "Questions refreshed every single day",
  "Bookmark & revisit any problem",
  "25+ company-curated DSA lists",
  "Progress sync across all devices",
];

const testimonials = [
  {
    initials: "AT",
    name: "Anuj Thakur",
    role: "SDE @ Amazon",
    text: "MAANGco's company-filtered DSA list is a game-changer. Focused on Amazon-tagged problems for 6 weeks, cleared my loop. No noise — just the problems that showed up in my actual rounds.",
  },
  {
    initials: "AJ",
    name: "Anusha Jha",
    role: "SDE-2 @ Flipkart",
    text: "The System Design roadmap is exactly what I was missing. Went through HLD + LLD day by day and walked into every design round prepared. Offer in 8 weeks.",
  },
  {
    initials: "AS",
    name: "Abilaash S",
    role: "SDE-2 @ Google",
    text: "I've tried 4-5 prep platforms. MAANGco is the sharpest and most focused. No bloat, no 2,000 random problems — cleared Google in my first attempt.",
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
    text: "Best ₹299 I've spent. System Design coverage + DSA lists are unmatched. Daily updates meant I was always solving fresh, interview-relevant content.",
  },
];

const faqs = [
  {
    q: "What's included in a MAANGco subscription?",
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
    a: "Yes — the yearly plan at ₹1,999 saves you ₹1,589 vs monthly (₹299 × 12 = ₹3,588). You get 12 months of full access including all daily updates.",
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

function Faq2Item({
  q,
  a,
  delay = "0s",
}: {
  q: string;
  a: string;
  delay?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`lfaq2-item sr-child${open ? " open" : ""}`}
      style={{ "--sr-delay": delay } as React.CSSProperties}
    >
      <button type="button" className="lfaq2-q" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="lfaq2-chevron">
          {open ? (
            <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </button>
      {open && <div className="lfaq2-a">{a}</div>}
    </div>
  );
}

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
  onBuyPremium,
  isPremium = false,
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const landingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = landingRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const container = landingRef.current;
    if (!container) return;
    let observer: IntersectionObserver;
    const timer = setTimeout(() => {
      const targets = container.querySelectorAll("[data-scroll-reveal]");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("sr-visible");
              observer.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, root: null }
      );
      targets.forEach((el) => observer.observe(el));
    }, 100);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    }
    if (avatarMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  return (
    <div className="landing w-full min-w-0" ref={landingRef}>
      {/* ── NAVBAR ── */}
      <nav className={`landing-nav${navScrolled ? " scrolled" : ""}${mobileMenuOpen ? " mobile-open" : ""}`}>
        <div className="landing-container">
          <div className="landing-nav-row">
            <div className="landing-nav-left">
              <a href="/" className="landing-logo shrink-0">
                <div className="landing-logo-mark">
                  <svg viewBox="0 0 20 20" width="16" height="16">
                    <path
                      d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="landing-logo-text">
                  MAANG<em>co</em>
                </span>
              </a>

              <div className="hidden lg:flex items-center gap-1 flex-1">
                <a href="#features" className="landing-nav-link">
                  Features
                </a>
                {!isPremium && (
                  <a href="#pricing" className="landing-nav-link">
                    Pricing
                  </a>
                )}
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
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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
                    <div className="profile-avatar">
                      {getInitials(userLabel)}
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

                  {avatarMenuOpen ? (
                    <div
                      className="profile-dropdown"
                      style={{
                        right: 0,
                        left: "auto",
                        top: "calc(100% + 8px)",
                      }}
                    >
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar profile-avatar--lg">
                          {getInitials(userLabel)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="profile-dropdown-name">
                            {userLabel}
                          </div>
                          <div className="profile-dropdown-sub">Signed in</div>
                        </div>
                      </div>

                      <div className="profile-dropdown-divider" />

                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          onGoToDashboard?.();
                          setAvatarMenuOpen(false);
                        }}
                      >
                        <span className="profile-dropdown-item-icon">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 14, height: 14 }}
                          >
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
                        onClick={() => {
                          onThemeChange();
                          setAvatarMenuOpen(false);
                        }}
                      >
                        <span className="profile-dropdown-item-icon">
                          {theme === "light" ? (
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              style={{ width: 14, height: 14 }}
                            >
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ width: 14, height: 14 }}
                            >
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
                        onClick={() => {
                          onOpenChangePassword?.();
                          setAvatarMenuOpen(false);
                        }}
                      >
                        <span className="profile-dropdown-item-icon">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 14, height: 14 }}
                          >
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
                        onClick={() => {
                          onLogout?.();
                          setAvatarMenuOpen(false);
                        }}
                      >
                        <span className="profile-dropdown-item-icon">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ width: 14, height: 14 }}
                          >
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
                  <button
                    type="button"
                    className="lnav-sign-in"
                    onClick={onSignIn}
                  >
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
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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

          {mobileMenuOpen && (
            <div className="lnav-mobile-drawer">
              {["#features", "#pricing", "#testimonials", "#faq"].map(
                (href, i) => (
                  <a
                    key={href}
                    href={href}
                    className="lnav-mobile-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {["Features", "Pricing", "Reviews", "FAQ"][i]}
                  </a>
                ),
              )}
              <div className="lnav-mobile-actions">
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="lnav-get-started"
                    style={{ flex: 1 }}
                    onClick={onGoToDashboard}
                  >
                    Go to Dashboard →
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="lnav-sign-in"
                      style={{ flex: 1 }}
                      onClick={onSignIn}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className="lnav-get-started"
                      style={{ flex: 1 }}
                      onClick={onGetStarted}
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO (Obsidian stone-dark) ── */}
      <section className="lhero-obsidian">
        <div className="lhero-obsidian-bg" />
        <div className="lhero-obsidian-vignette" />

        {/* Floating background logos */}
        <div className="lhero-float-logos" aria-hidden>
          {[
            { src: googleSvg,     style: { top: "9%",     right: "8%",   width: 44 }, delay: 0 },
            { src: metaSvg,       style: { top: "14%",    left: "5%",    width: 30 }, delay: 1.2 },
            { src: microsoftSvg,  style: { top: "36%",    left: "28%",   width: 34 }, delay: 0.6 },
            { src: netflixSvg,    style: { bottom: "22%", right: "13%",  width: 28 }, delay: 1.8 },
            { src: adobeSvg,      style: { top: "28%",    right: "22%",  width: 26 }, delay: 2.4 },
            { src: airbnbSvg,     style: { top: "32%", left: "10%",   width: 32 }, delay: 0.9 },
            { src: salesforceSvg, style: { top: "68%",    right: "5%",   width: 38 }, delay: 1.5 },
            { src: pinterestSvg,  style: { top: "38%",    left: "40%",   width: 26 }, delay: 3.0 },
            { src: amazonSvg,     style: { bottom: "14%", left: "28%",   width: 40 }, delay: 2.1 },
            { src: appleSvg,      style: { top: "22%",    left: "15%",   width: 28 }, delay: 0.3 },
            { src: atlassianSvg,  style: { top: "60%",    left: "48%",   width: 30 }, delay: 1.0 },
            { src: nvidiaLightSvg,style: { top: "18%",    right: "28%",  width: 42 }, delay: 2.7 },
            { src: oracleSvg,     style: { bottom: "28%", right: "28%",  width: 36 }, delay: 1.4 },
            { src: snowflakeSvg,  style: { top: "75%",    left: "15%",   width: 28 }, delay: 3.3 },
            { src: uberDarkSvg,   style: { bottom: "10%", right: "42%",  width: 32 }, delay: 0.5 },
            { src: visaSvg,       style: { top: "42%",    right: "35%",  width: 36 }, delay: 2.0 },
          ].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              className="lhero-float-logo"
              style={{ ...logo.style, animationDelay: `${logo.delay}s` } as React.CSSProperties}
              alt=""
            />
          ))}
        </div>

        <div className="lhero-obsidian-inner">
          {/* Headline + sub + CTA */}
          <div className="lhero-obsidian-text">
            <h1 className="lhero-obsidian-h1">
              {["The", "all-in-one", "platform"].map((w, i) => (
                <span key={w} className="lhero-word" style={{ animationDelay: `${i * 0.1}s` }}>{w}</span>
              ))}
              <br />
              {["for", "MAANG", "interviews"].map((w, i) => (
                <span key={w} className="lhero-word" style={{ animationDelay: `${(3 + i) * 0.1}s` }}>{w}</span>
              ))}
            </h1>
            <p className="lhero-obsidian-sub lhero-fade-in" style={{ animationDelay: "0.75s" }}>
              Company-wise DSA sheets and System Design roadmaps curated from
              real interview experiences at top tech companies.
            </p>
            {isPremium ? (
              <button
                type="button"
                className="lhero-obsidian-cta lhero-fade-in"
                style={{ animationDelay: "1s" }}
                onClick={onGoToDashboard}
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                type="button"
                className="lhero-obsidian-cta lhero-fade-in"
                style={{ animationDelay: "1s" }}
                onClick={onStartFree}
              >
                Get Started For Free
              </button>
            )}
          </div>

          {/* Dashboard mockup */}
          <div className="lhero-obsidian-screenshot lhero-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="lodm-mockup">
              {/* Chrome bar */}
              <div className="lodm-chrome">
                <div className="lodm-dots">
                  <span className="lodm-dot" style={{ background: "#ff5f56" }} />
                  <span className="lodm-dot" style={{ background: "#ffbd2e" }} />
                  <span className="lodm-dot" style={{ background: "#27c93f" }} />
                </div>
                <div className="lodm-url">maangco.com / dashboard</div>
                <div style={{ width: 60 }} />
              </div>
              {/* App grid */}
              <div className="lodm-app">
                {/* Sidebar */}
                <div className="lodm-sidebar">
                  <div className="lodm-avatar">M</div>
                  <nav className="lodm-nav">
                    <div className="lodm-nav-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      <span>Search</span>
                    </div>
                    <div className="lodm-nav-item active">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <span>Home</span>
                    </div>
                    <div className="lodm-nav-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></svg>
                      <span>Problems</span>
                    </div>
                    <div className="lodm-nav-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                      <span>Sys Design</span>
                    </div>
                    <div className="lodm-nav-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      <span>Bookmarks</span>
                    </div>
                    <div className="lodm-nav-item lodm-nav-bottom">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                      <span>Progress</span>
                    </div>
                  </nav>
                </div>
                {/* Main content */}
                <div className="lodm-main">
                  <div className="lodm-topbar">
                    <span className="lodm-welcome">Welcome back 👋</span>
                    <div className="lodm-topbar-right">
                      <div className="lodm-co-pill active-co">Google</div>
                      <div className="lodm-co-pill">Meta</div>
                      <div className="lodm-co-pill">Amazon</div>
                      <div className="lodm-co-pill">Microsoft</div>
                      <div className="lodm-co-pill" style={{ color: "#444" }}>+19</div>
                    </div>
                  </div>
                  {/* Progress widget */}
                  <div className="lodm-prog-bar">
                    <div className="lodm-ring-wrap">
                      <svg viewBox="0 0 44 44" width="44" height="44">
                        <circle cx="22" cy="22" r="18" fill="none" className="lodm-ring-track" strokeWidth="3.5"/>
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#c87c4a" strokeWidth="3.5"
                          strokeDasharray="113.1" strokeDashoffset="111.9"
                          strokeLinecap="round" transform="rotate(-90 22 22)"/>
                        <text x="22" y="26" textAnchor="middle" className="lodm-ring-pct" fontSize="7.5" fontFamily="Inter,sans-serif" fontWeight="500">0%</text>
                      </svg>
                    </div>
                    <div className="lodm-prog-solved">
                      <div className="lodm-prog-num">5<span className="lodm-prog-total">/1138</span></div>
                      <div style={{ color: "#c87c4a", fontSize: 10 }}>✓ Solved</div>
                    </div>
                    <div className="lodm-prog-sep" />
                    <div className="lodm-prog-diff"><div className="lodm-diff-lbl">Easy</div><div className="lodm-diff-val" style={{ color: "#c87c4a" }}>1/258</div></div>
                    <div className="lodm-prog-diff"><div className="lodm-diff-lbl">Med.</div><div className="lodm-diff-val" style={{ color: "#fbbf24" }}>3/649</div></div>
                    <div className="lodm-prog-diff"><div className="lodm-diff-lbl">Hard</div><div className="lodm-diff-val" style={{ color: "#f87171" }}>1/231</div></div>
                  </div>
                  {/* Table */}
                  <div className="lodm-tbl-head">
                    <span style={{ width: 20 }} /><span style={{ flex: 1 }}>Problem</span>
                    <span style={{ width: 64 }}>Difficulty</span><span style={{ width: 96 }}>Company</span><span style={{ width: 48 }}>Freq</span>
                  </div>
                  {[
                    { name: "Two Sum", diff: "easy", done: true, co: "Google · Meta", w: "88%" },
                    { name: "Group Anagrams", diff: "med", done: true, co: "Amazon", w: "70%" },
                    { name: "Trapping Rain Water", diff: "hard", done: false, co: "Google", w: "82%", hi: true },
                    { name: "Top K Frequent Elements", diff: "med", done: false, co: "Google", w: "78%" },
                    { name: "Longest Consecutive Sequence", diff: "med", done: false, co: "Meta", w: "62%" },
                    { name: "Find Median from Data Stream", diff: "hard", done: false, co: "Amazon", w: "55%" },
                  ].map((r) => (
                    <div key={r.name} className={`lodm-row${r.hi ? " lodm-row-hi" : ""}`}>
                      <div className={`lodm-chk${r.done ? " done" : ""}`} />
                      <span className="lodm-pname">{r.name}</span>
                      <span className={`lodm-badge ${r.diff}`}>{r.diff === "med" ? "Med." : r.diff.charAt(0).toUpperCase() + r.diff.slice(1)}</span>
                      <span className="lodm-cotag">{r.co}</span>
                      <div className="lodm-fbar"><div className="lodm-fbar-fill" style={{ width: r.w }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company logos */}
        {/* Stone decorations */}
        <img className="lhero-stone-left" src={stoneLeftImg} alt="" aria-hidden decoding="async" loading="eager" />
        <img className="lhero-stone-right" src={stoneRightImg} alt="" aria-hidden decoding="async" loading="eager" />
      </section>

      <div className="lmarquee-section">
        <div className="lmarquee-overflow">
          <div className="lmarquee-track">
            {(() => {
              const logos = [
                { name: "Google", src: googleSvg },
                { name: "Meta", src: metaSvg },
                { name: "Microsoft", src: microsoftSvg },
                { name: "Netflix", src: netflixSvg },
                { name: "Adobe", src: adobeSvg },
                { name: "Airbnb", src: airbnbSvg },
                { name: "Pinterest", src: pinterestSvg },
                { name: "Salesforce", src: salesforceSvg },
              ];
              return [...logos, ...logos].map((c, i) => (
                <div key={`${c.name}-${i}`} className="lmarquee-chip">
                  <img src={c.src} alt={c.name} className="lmarquee-logo" />
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* ── STATS / SOCIAL PROOF ── */}
      <section className="lstat-section">
        <img src={statsHeroImg} alt="" className="lstat-bg-img" aria-hidden />
        <div className="lstat-overlay" />
        <div className="lstat-inner" data-scroll-reveal>
          <p className="lstat-eyebrow sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>Trusted by engineers worldwide</p>
          <div className="lstat-big-number sr-child" style={{ "--sr-delay": "0.1s" } as React.CSSProperties}>10,000<span>+</span></div>
          <h2 className="lstat-heading sr-child" style={{ "--sr-delay": "0.2s" } as React.CSSProperties}>Engineers preparing for MAANG</h2>
          <p className="lstat-sub sr-child" style={{ "--sr-delay": "0.32s" } as React.CSSProperties}>
            From fresh graduates to senior engineers — MAANGco is the go-to platform<br />for structured, focused MAANG interview preparation.
          </p>
          <div className="lstat-chips sr-child" style={{ "--sr-delay": "0.44s" } as React.CSSProperties}>
            <div className="lstat-chip">
              <div className="lstat-chip-val">840+</div>
              <div className="lstat-chip-lbl">DSA problems</div>
            </div>
            <div className="lstat-chip-divider" />
            <div className="lstat-chip">
              <div className="lstat-chip-val">150+</div>
              <div className="lstat-chip-lbl">System design topics</div>
            </div>
            <div className="lstat-chip-divider" />
            <div className="lstat-chip">
              <div className="lstat-chip-val">25+</div>
              <div className="lstat-chip-lbl">Company sheets</div>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const [dsaOpen, setDsaOpen] = useState("d1");
        const [sdOpen, setSdOpen] = useState("s1");

        const dsaItems = [
          { id: "d1", name: "Company-wise Sheets", desc: "Filter the entire question bank by company. See exactly what Google, Meta, Amazon and 20+ companies ask in real interviews." },
          { id: "d2", name: "Frequency Ranking", desc: "Every problem scored by how often it appears in real interviews — focus on what actually gets asked." },
          { id: "d3", name: "Topic Tags", desc: "Problems tagged by DSA topic: Arrays, Trees, DP, Graphs and more for structured topic-wise preparation." },
          { id: "d4", name: "Progress Tracking", desc: "Mark problems solved, track your Easy / Med / Hard spread and monitor completion per company at a glance." },
        ];

        const sdItems = [
          { id: "s1", name: "90-Day Roadmap", desc: "A week-by-week structured plan covering 150 system design questions from fundamentals to senior-level depth." },
          { id: "s2", name: "HLD + LLD Depth", desc: "Every topic covers both high-level architecture and low-level implementation detail — no surface-level answers." },
          { id: "s3", name: "Company Tags", desc: "Each question tagged with the companies that ask it, sourced from Glassdoor, Blind and Exponent reports." },
          { id: "s4", name: "Difficulty Levels", desc: "Questions rated from beginner-friendly to L5/L6 complexity — so you prep at exactly the right level." },
        ];

        const ACCORD_DURATION = 8000;

        const Accordion = ({ items, openId, setOpenId }: { items: typeof dsaItems; openId: string; setOpenId: (id: string) => void }) => {
          useEffect(() => {
            const t = setTimeout(() => {
              const idx = items.findIndex((i) => i.id === openId);
              setOpenId(items[(idx + 1) % items.length].id);
            }, ACCORD_DURATION);
            return () => clearTimeout(t);
          }, [openId, items, setOpenId]);

          return (
            <div className="lfsp-list" style={{ '--accord-dur': `${ACCORD_DURATION}ms` } as React.CSSProperties}>
              {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <button key={item.id} className={`lfsp-item${isOpen ? " active" : ""}`} onClick={() => setOpenId(item.id)}>
                    <span className="lfsp-item-name">{item.name}</span>
                    <div className="lfsp-item-body">
                      <div className="lfsp-item-body-inner">
                        <span className="lfsp-item-desc">{item.desc}</span>
                      </div>
                    </div>
                    {isOpen && <span key={openId} className="lfsp-item-progress" />}
                  </button>
                );
              })}
            </div>
          );
        };

        return (
          <section className="lfsp-section">
            <div className="lfsp-container">
              <p className="lfsp-eyebrow" data-scroll-reveal>What's inside</p>

              {/* DSA Panel — text left, video right */}
              <div className="lfsp-panel" data-scroll-reveal>
                <div className="lfsp-panel-text">
                  <div className="lfsp-panel-title sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>DSA Practice</div>
                  <p className="lfsp-panel-sub sr-child" style={{ "--sr-delay": "0.15s" } as React.CSSProperties}>
                    840+ company-tagged problems across 23 companies, sorted by
                    real interview frequency.
                  </p>
                  <div className="sr-child" style={{ "--sr-delay": "0.3s" } as React.CSSProperties}>
                    <Accordion
                      items={dsaItems}
                      openId={dsaOpen}
                      setOpenId={setDsaOpen}
                    />
                  </div>
                </div>
                <div className="lfsp-panel-media sr-child" style={{ "--sr-delay": "0.2s" } as React.CSSProperties}>
                  <div className="lfsp-media">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      key={`dsa-${theme}`}
                    >
                      <source
                        src={theme === "dark" ? DSADarkVid : DSALightVid}
                        type="video/webm"
                      />
                    </video>
                  </div>
                </div>
              </div>

              {/* SD Panel — video left, text right */}
              <div className="lfsp-panel lfsp-panel--reverse" data-scroll-reveal>
                <div className="lfsp-panel-text">
                  <div className="lfsp-panel-title sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>System Design</div>
                  <p className="lfsp-panel-sub sr-child" style={{ "--sr-delay": "0.15s" } as React.CSSProperties}>
                    150-question roadmap from HLD to LLD — structured, tracked
                    and company-tagged.
                  </p>
                  <div className="sr-child" style={{ "--sr-delay": "0.3s" } as React.CSSProperties}>
                    <Accordion
                      items={sdItems}
                      openId={sdOpen}
                      setOpenId={setSdOpen}
                    />
                  </div>
                </div>
                <div className="lfsp-panel-media sr-child" style={{ "--sr-delay": "0.2s" } as React.CSSProperties}>
                  <div className="lfsp-media">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      key={`sd-${theme}`}
                    >
                      <source
                        src={theme === "dark" ? SDDarkVid : SDLightVid}
                        type="video/webm"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}
      
      {/* ── PRICING SNAPSHOT ── */}
      {!isPremium && (
        <section className="lobs-price-section" data-scroll-reveal>
          <div className="lobs-price-inner">
            <div className="lobs-price-left sr-child" style={{ "--sr-delay": "0.14s" } as React.CSSProperties}>
              <p className="lobs-price-eyebrow">Pricing</p>
              <h2 className="lobs-price-heading">One plan. Everything unlocked.</h2>
              <p className="lobs-price-sub">
                Simple, Obsidian-style pricing with no tiers or upsells. Pick
                monthly to start, or yearly to save more.
              </p>
            </div>

            <div className="lobs-price-right sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>
              <div className="lprice-cards lobs-price-cards">
                <div className="lprice-card">
                  <div className="lprice-plan-name">Monthly</div>
                  <div className="lprice-amount">
                    <span className="lprice-currency">₹</span>
                    <span className="lprice-num">299</span>
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
                    onClick={
                      isAuthenticated && onBuyPremium
                        ? () => onBuyPremium("monthly")
                        : onGetStarted
                    }
                  >
                    Start monthly →
                  </button>
                </div>

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
                    ₹167/month · Save ₹1,589 vs monthly
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
                    onClick={
                      isAuthenticated && onBuyPremium
                        ? () => onBuyPremium("yearly")
                        : onGetStarted
                    }
                  >
                    Get yearly access →
                  </button>
                </div>
              </div>
              <p className="lobs-price-note">
                Secure payment · Cancel anytime · All major cards accepted
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── STUDENT REVIEWS ── */}
      <section className="lrev-section" data-scroll-reveal>
        <div className="lrev-inner">
          <div className="lrev-viewport sr-child" style={{ "--sr-delay": "0.16s" } as React.CSSProperties}>
            <div className="lrev-track">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="lrev-card">
                  <div className="lrev-card-top">
                    <div className={`lrev-avatar lrev-avatar--${i % 9}`}>{t.initials}</div>
                    <div className="lrev-card-meta">
                      <div className="lrev-name">{t.name}</div>
                      <div className="lrev-role">{t.role}</div>
                    </div>
                    <span className="lrev-card-stars">★★★★★</span>
                  </div>
                  <p className="lrev-text">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lrev-left sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>
            <p className="lrev-eyebrow">Student Reviews</p>
            <h2 className="lrev-heading">
              What engineers
              <br />
              say . . .
            </h2>
            <p className="lrev-count">10,000+ engineers worldwide</p>
          </div>
        </div>
      </section>

      {/* ── FAQ (Obsidian style) ── */}
      <section className="lfaq2-section" id="faq" data-scroll-reveal>
        <div className="lfaq2-inner">
          <div className="lfaq2-left sr-child" style={{ "--sr-delay": "0s" } as React.CSSProperties}>
            <p className="lfaq2-eyebrow">Frequently asked questions</p>
            <h2 className="lfaq2-heading">FAQ</h2>
          </div>
          <div className="lfaq2-right sr-child" style={{ "--sr-delay": "0.14s" } as React.CSSProperties}>
            {faqs.map((f, i) => (
              <Faq2Item key={f.q} q={f.q} a={f.a} delay={`${i * 0.08 + 0.06}s`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="lfooter-center">
            {/* Icon only — no text */}
            <div className="lfooter-logo-mark-wrap">
              <svg viewBox="0 0 20 20" width="26" height="26">
                <path
                  d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="lfooter-links-row">
                <a href="#" className="lfooter-link">Terms and Conditions</a>
              <a href="#faq" className="lfooter-link">Contact us</a>
              <a href="#pricing" className="lfooter-link">Pricing</a>
              <a href="#" className="lfooter-link">Privacy Policy</a>
            
              <a href="#" className="lfooter-link">Cancellation and Refund Policy</a>
            </div>

            <div className="lfooter-social-row">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="lfooter-social-link" aria-label="LinkedIn">
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
