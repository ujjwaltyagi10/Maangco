import { Boxes, Database } from "lucide-react";

import { COMPANY_LOGOS } from "@/lib/company-logos";
import { CompanyLogo } from "./ui/company-logo";

const DSALightVid = new URL("../assets/Video/DSALight.webm", import.meta.url).href;
const DSADarkVid = new URL("../assets/Video/DSADark.webm", import.meta.url).href;
const SDLightVid = new URL("../assets/Video/SDLight.webm", import.meta.url).href;
const SDDarkVid = new URL("../assets/Video/SDDark.webm", import.meta.url).href;

const LOCKED_KIT_COMPANIES = [
  { name: "Google", accent: "#4285F4" },
  { name: "Amazon", accent: "#FF9900" },
  { name: "Meta", accent: "#0866FF" },
  { name: "Microsoft", accent: "#00A4EF" },
  { name: "Uber", accent: "#06C167" },
];

const features = [
  {
    icon: Boxes,
    name: "DSA Practice",
    desc: "Company-wise sheets with frequency, topic tags, bookmarks, and solve tracking.",
    statA: "730+",
    labelA: "Questions",
    statB: "25+",
    labelB: "Companies",
    accent: "var(--green)",
  },
  {
    icon: Database,
    name: "System Design",
    desc: "A 150-question roadmap with HLD + LLD depth, categories, and study tracking.",
    statA: "150",
    labelA: "Questions",
    statB: "40+",
    labelB: "Companies",
    accent: "var(--amber)",
  },
  // { icon: "🎯", name: "Frontend Prep",
  //   desc: "A free 45-day path covering JS, React, TypeScript, Testing, and performance.",
  //   statA: "45", labelA: "Days", statB: "275", labelB: "Questions", accent: "var(--blue)" },
];


interface PublicDashboardPreviewProps {
  companyCount?: number;
  theme: "light" | "dark";
  onSignIn: () => void;
  onSignUp: () => void;
  onBrowseFrontend?: () => void;
  isPremiumMode?: boolean;
  onBuyPremium?: () => void;
}

export function PublicDashboardPreview({
  theme,
  onSignIn,
  onSignUp,
  isPremiumMode = false,
  onBuyPremium,
}: PublicDashboardPreviewProps) {
  const isDark = theme === "dark";
  const dsaVid = isDark ? DSADarkVid : DSALightVid;
  const sdVid = isDark ? SDDarkVid : SDLightVid;

  return (
    <div className="dashboard dashboard--public">
      {/* Hero */}
      {isPremiumMode ? (
        <div className="dp-kits">
          <div className="dp-kits-head">
            <div className="dp-kits-head-text">
              <div className="dp-kits-eyebrow">Start here</div>
              <h1 className="dp-kits-title">Popular company kits</h1>
            </div>
            <button type="button" className="dp-kits-viewall" onClick={onBuyPremium}>
              <span>View all companies</span>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div className="dp-kits-row pd-premium-kits-row">
          {LOCKED_KIT_COMPANIES.map((c) => (
            <div
              key={c.name}
              className="dp-kit-card dp-kit-card--locked"
              style={{ "--kit-accent": c.accent } as React.CSSProperties}
              onClick={onBuyPremium}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onBuyPremium?.()}
            >
              <div className="dp-kit-lock" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect x="3" y="9" width="14" height="10" rx="2" />
                  <path d="M7 9V6a3 3 0 0 1 6 0v3" />
                </svg>
              </div>
              <div className="dp-kit-logo">
                <CompanyLogo name={c.name} src={COMPANY_LOGOS[c.name]} alt={c.name} />
              </div>
              <div className="dp-kit-name">{c.name}</div>
              <div className="dp-kit-cta">Unlock</div>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <section className="pd-hero-card">
          <div className="pd-hero-inner">
            <h1 className="pd-title">
              Your complete <span>interview</span> prep hub.
            </h1>
            <p className="pd-sub">
              DSA company sheets, system design roadmaps, and frontend prep — all in one place.
              Track progress, bookmark problems, and crack your next role.
            </p>
          </div>
          <div className="pd-hero-ctas">
            <button type="button" className="lbtn-primary lbtn-lg" onClick={onSignUp}>
              Get Started Free
            </button>
            <button type="button" className="lbtn-outline lbtn-lg" onClick={onSignIn}>
              Sign In
            </button>
          </div>
        </section>
      )}

      {/* Video Showcase */}
      <div className="pd-video-grid">
        <div className="pd-video-card">
          <div className="pd-video-header">
            <div
              className="pd-video-icon"
              style={{ background: "var(--green-bg)", color: "var(--green)" }}
            >
              <Boxes size={16} strokeWidth={1.8} />
            </div>
            <div>
              <div className="pd-video-name">DSA Practice</div>
              <div className="pd-video-hint">Company-wise sheets, frequency &amp; tags</div>
            </div>
          </div>
          <div className="pd-video-frame">
            <video autoPlay loop muted playsInline preload="metadata" key={dsaVid}>
              <source src={dsaVid} type="video/webm" />
            </video>
          </div>
        </div>

        <div className="pd-video-card">
          <div className="pd-video-header">
            <div
              className="pd-video-icon"
              style={{ background: "var(--amber-bg)", color: "var(--amber)" }}
            >
              <Database size={16} strokeWidth={1.8} />
            </div>
            <div>
              <div className="pd-video-name">System Design</div>
              <div className="pd-video-hint">150-question roadmap with depth &amp; tracking</div>
            </div>
          </div>
          <div className="pd-video-frame">
            <video autoPlay loop muted playsInline preload="metadata" key={sdVid}>
              <source src={sdVid} type="video/webm" />
            </video>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <section className="pd-features">
        {features.map((f) => (
          <article key={f.name} className="pd-feature-card">
            <div className="pd-feature-top">
              <div
                className="pd-feature-icon"
                style={{ background: `${f.accent}18`, color: f.accent }}
              >
                <f.icon size={19} strokeWidth={1.8} />
              </div>
              <div>
                <div className="pd-feature-name">{f.name}</div>
                <div className="pd-feature-desc">{f.desc}</div>
              </div>
            </div>
            <div className="pd-feature-stats">
              <div className="pd-feature-stat">
                <div className="pd-feature-stat-val">{f.statA}</div>
                <div className="pd-feature-stat-lbl">{f.labelA}</div>
              </div>
              <div className="pd-feature-stat">
                <div className="pd-feature-stat-val">{f.statB}</div>
                <div className="pd-feature-stat-lbl">{f.labelB}</div>
              </div>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
}
