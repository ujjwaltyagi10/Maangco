import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Gift,
  MessageSquareText,
  Star,
  Target,
  UsersRound,
} from "lucide-react";
import { FinancialAidModal } from "./financial-aid-modal";
import amazonLogo from "@/assets/Amazon.png";
import googleLogo from "@/assets/google.png";
import metaLogo from "@/assets/meta.png";
import stoneLeftImg from "@/assets/stone-left.webp";
import stoneRightImg from "@/assets/stone-right.webp";

import adobeSvg from "@/assets/svg/adobe.svg";
import airbnbSvg from "@/assets/svg/airbnb.svg";
import googleSvg from "@/assets/svg/google.svg";
import metaSvg from "@/assets/svg/meta.svg";
import microsoftSvg from "@/assets/svg/microsoft.svg";
import netflixSvg from "@/assets/svg/netflix.svg";
import pinterestSvg from "@/assets/svg/pinterest.svg";
import salesforceSvg from "@/assets/svg/salesforce.svg";

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
    text: "MAANGco's company-filtered DSA list is a game-changer. Focused on Amazon-tagged problems for 6 weeks, cleared my loop. No noise — just the problems that showed up in my actual rounds.",
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

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function formatCalendarStamp(date: Date) {
  return (
    [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join(
      "",
    ) + `T${pad2(date.getHours())}${pad2(date.getMinutes())}00`
  );
}

function getLastSaturdayOfMonth(year: number, monthIndex: number) {
  const lastDay = new Date(year, monthIndex + 1, 0);
  const offset = (lastDay.getDay() - 6 + 7) % 7;
  return new Date(year, monthIndex + 1, 0 - offset);
}

function getUpcomingMentorshipSession(reference = new Date()) {
  const thisMonthSession = getLastSaturdayOfMonth(
    reference.getFullYear(),
    reference.getMonth(),
  );
  thisMonthSession.setHours(19, 0, 0, 0);

  if (reference <= thisMonthSession) {
    return thisMonthSession;
  }

  const nextMonthSession = getLastSaturdayOfMonth(
    reference.getFullYear(),
    reference.getMonth() + 1,
  );
  nextMonthSession.setHours(19, 0, 0, 0);
  return nextMonthSession;
}

function buildMentorshipCalendarUrl() {
  const start = getUpcomingMentorshipSession();
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "MAANGco Monthly Mentorship",
    details:
      "Monthly Zoom mentorship for MAANGco premium users. Ask questions, get guidance, and learn from FAANG engineers.",
    location: "Zoom",
    ctz: "Asia/Kolkata",
    dates: `${formatCalendarStamp(start)}/${formatCalendarStamp(end)}`,
    recur: "RRULE:FREQ=MONTHLY;BYDAY=SA;BYSETPOS=-1",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const mentorshipCompanies = [
  { name: "Google", logo: googleLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Amazon", logo: amazonLogo },
];

const mentorshipHighlights = [
  {
    icon: MessageSquareText,
    label: "Real conversations",
    value: "Ask anything and get honest, practical answers.",
  },
  {
    icon: Target,
    label: "Actionable guidance",
    value: "Leave with clarity and a clear next step.",
  },
  {
    icon: UsersRound,
    label: "Top engineers",
    value: "Learn from people who've been there, done that.",
  },
  {
    icon: Star,
    label: "Community of builders",
    value: "Connect with ambitious peers like you.",
  },
];

const mentorshipStats = [
  {
    icon: UsersRound,
    value: "5000+",
    label: "Premium\nmembers",
  },
  {
    icon: CalendarDays,
    value: "24+",
    label: "Sessions\nconducted",
  },
  {
    icon: MessageSquareText,
    value: "10K+",
    label: "Questions\nanswered",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Session\nrating",
  },
];

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
  const [aidModalOpen, setAidModalOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const lfspSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-scroll-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sr-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const mentorshipCalendarUrl = buildMentorshipCalendarUrl();
  const mentorshipCtaLabel = isPremium ? "Add to calendar" : "Reserve My Spot";

  const handleMentorshipCta = () => {
    if (!isAuthenticated) {
      onSignIn();
      return;
    }

    if (!isPremium) {
      if (onBuyPremium) {
        onBuyPremium("monthly");
      } else {
        onSignIn();
      }
      return;
    }

    window.open(mentorshipCalendarUrl, "_blank", "noopener,noreferrer");
  };

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
    <div className="landing w-full min-w-0">
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
              Company-wise DSA sheets and System Design roadmaps — curated from
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
                    <span className="lodm-welcome">Welcome back, Ujjwal 👋</span>
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
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#4ade80" strokeWidth="3.5"
                          strokeDasharray="113.1" strokeDashoffset="111.9"
                          strokeLinecap="round" transform="rotate(-90 22 22)"/>
                        <text x="22" y="26" textAnchor="middle" className="lodm-ring-pct" fontSize="7.5" fontFamily="Inter,sans-serif" fontWeight="500">0%</text>
                      </svg>
                    </div>
                    <div className="lodm-prog-solved">
                      <div className="lodm-prog-num">5<span className="lodm-prog-total">/1138</span></div>
                      <div style={{ color: "#4ade80", fontSize: 10 }}>✓ Solved</div>
                    </div>
                    <div className="lodm-prog-sep" />
                    <div className="lodm-prog-diff"><div className="lodm-diff-lbl">Easy</div><div className="lodm-diff-val" style={{ color: "#4ade80" }}>1/258</div></div>
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

      {/* ── FEATURES SPLIT ── */}
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

      {/* ── MENTORSHIP ── */}
      <section className="lsection lmentor-section">
        <div className="landing-container">
          <div className="lsection-header lsection-header--mentor">
            <div className="lsection-tag lsection-tag--icon">
              <UsersRound size={13} strokeWidth={2.2} />
              Mentorship
            </div>
            <h2 className="lsection-title">
              Monthly Zoom mentorship with{" "}
              <span className="lmentor-title-accent">FAANG</span> engineers.
            </h2>
            <p className="lsection-sub">
              Join a live 1.5 hour Zoom call on the last Saturday of every
              month. Ask questions, get guidance, and learn directly from
              engineers working at top tech companies.
            </p>
          </div>

          <div className="lmentor-card">
            <div className="lmentor-main">
              <div className="lmentor-badge lmentor-badge--premium">
                <Star size={14} strokeWidth={2.2} />
                Free for premium users
              </div>
              <h3 className="lmentor-title">
                Live Q&amp;A. Real guidance. No prerecorded fluff.
              </h3>
              <p className="lmentor-text">
                Get clarity on interviews, system design, data structures,
                career growth, and everything in between.
              </p>
              <div className="lmentor-list">
                <div className="lmentor-item">
                  <span className="lmentor-icon">
                    <CalendarDays size={16} strokeWidth={2.1} />
                  </span>
                  <span>Last Saturday of every month</span>
                </div>
                <div className="lmentor-item">
                  <span className="lmentor-icon">
                    <Clock3 size={16} strokeWidth={2.1} />
                  </span>
                  <span>Around 1.5 hours on Zoom</span>
                </div>
                <div className="lmentor-item">
                  <span className="lmentor-icon">
                    <MessageSquareText size={16} strokeWidth={2.1} />
                  </span>
                  <span>Live Q&amp;A with FAANG engineers</span>
                </div>
                <div className="lmentor-item">
                  <span className="lmentor-icon">
                    <Gift size={16} strokeWidth={2.1} />
                  </span>
                  <span>Interactive small-group session</span>
                </div>
                <div className="lmentor-item">
                  <span className="lmentor-icon">
                    <Gift size={16} strokeWidth={2.1} />
                  </span>
                  <span>Free for premium users, paid access for others</span>
                </div>
              </div>
            </div>

            <div className="lmentor-session">
              <div className="lmentor-session-info">
                <div className="lmentor-session-head">Upcoming session</div>
                <div className="lmentor-session-date">
                  <CalendarDays size={15} strokeWidth={2.1} />
                  {getUpcomingMentorshipSession().toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="lmentor-session-time-row">
                  <span className="lmentor-session-time-big">07:00</span>
                  <span className="lmentor-session-time-unit">PM IST</span>
                </div>
                <div className="lmentor-session-live">
                  <span className="lmentor-live-dot" />
                  Live on Zoom
                </div>
              </div>
              <div className="lmentor-session-action">
                <button
                  type="button"
                  className="lmentor-cta"
                  onClick={handleMentorshipCta}
                >
                  <CalendarDays size={16} strokeWidth={2.2} />
                  {mentorshipCtaLabel}
                </button>
                <div className="lmentor-session-note">
                  Spots are limited. Reserve early!
                </div>
              </div>
            </div>

            <div className="lmentor-side">
              <div className="lmentor-side-block">
                <div className="lmentor-side-label">
                  Learn from engineers at
                </div>
                <div className="lmentor-company-row">
                  {mentorshipCompanies.flatMap((company, i) => [
                    ...(i > 0
                      ? [
                          <div
                            key={`div-${i}`}
                            className="lmentor-company-divider"
                          />,
                        ]
                      : []),
                    <div key={company.name} className="lmentor-company-item">
                      <img
                        className="lmentor-company-logo"
                        src={company.logo}
                        alt={company.name}
                      />
                      <span>{company.name}</span>
                    </div>,
                  ])}
                </div>
              </div>

              <div className="lmentor-side-grid">
                {mentorshipHighlights.map((item) => {
                  const HIcon = item.icon;
                  return (
                    <div key={item.label} className="lmentor-side-card">
                      <div className="lmentor-side-card-icon">
                        <HIcon size={15} strokeWidth={2.1} />
                      </div>
                      <div className="lmentor-side-card-title">{item.label}</div>
                      <div className="lmentor-side-card-desc">{item.value}</div>
                    </div>
                  );
                })}
              </div>

              <div className="lmentor-stats">
                {mentorshipStats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={stat.label} className="lmentor-stat-item">
                      <div className="lmentor-stat-icon">
                        <StatIcon size={16} strokeWidth={2.1} />
                      </div>
                      <div className="lmentor-stat-value">{stat.value}</div>
                      <div className="lmentor-stat-label">
                        {stat.label.split("\n").map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
                  840+ curated problems organised by company. No filler — just
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
              Engineers who cracked it with MAANGco
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
      {!isPremium && (
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
                  <span className="lprice-num">299</span>
                  <span className="lprice-period">/month</span>
                </div>
                <p className="lprice-tagline">
                  Great to start. Cancel anytime.
                </p>
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
            <p className="lprice-note">
              Secure payment · Cancel anytime · All major cards accepted
            </p>
          </div>
        </section>
      )}

      {/* ── FINANCIAL AID ── */}
      {!isPremium && (
        <section className="lsection lfa-section" id="financial-aid">
          <div className="landing-container">
            <div className="lfa-card">
              {/* Left: text content */}
              <div className="lfa-card-left">
                <div className="lfa-tag">Financial Aid</div>
                <h2 className="lfa-title">Can't afford it right now?</h2>
                <p className="lfa-sub">
                  Financial barriers shouldn't stop anyone from cracking their
                  dream job. If you genuinely can't afford Premium, apply —
                  every application is reviewed personally and approved
                  applicants get <strong>3 months free</strong>.
                </p>
                <ul className="lfa-checklist">
                  <li className="lfa-check-row">
                    <svg
                      className="lfa-check-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                    <span className="lfa-check-text">
                      3 months of full Premium access, completely free
                    </span>
                  </li>
                  <li className="lfa-check-row">
                    <svg
                      className="lfa-check-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                    <span className="lfa-check-text">
                      Every application reviewed personally, not by bots
                    </span>
                  </li>
                  <li className="lfa-check-row">
                    <svg
                      className="lfa-check-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                    <span className="lfa-check-text">
                      No credit card required, ever
                    </span>
                  </li>
                  <li className="lfa-check-row">
                    <svg
                      className="lfa-check-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                    <span className="lfa-check-text">
                      Response within 2–3 business days
                    </span>
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
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="11"
                    height="11"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </button>
                <p className="lfa-cta-note">
                  Reviewed Mon – Fri · No card required
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <FinancialAidModal
        open={aidModalOpen}
        onClose={() => setAidModalOpen(false)}
      />

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
                MAANG<em>co</em>
              </span>
            </a>
            <p className="lfooter-copy">
              © 2025 MAANGco. Built for engineers, by engineers.
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
