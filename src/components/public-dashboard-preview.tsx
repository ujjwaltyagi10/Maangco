const DSALightVid = new URL("../assets/Video/DSALight.webm", import.meta.url).href;
const DSADarkVid = new URL("../assets/Video/DSADark.webm", import.meta.url).href;
const SDLightVid = new URL("../assets/Video/SDLight.webm", import.meta.url).href;
const SDDarkVid = new URL("../assets/Video/DSDark.webm", import.meta.url).href;

const features = [
  {
    icon: "⚡",
    name: "DSA Practice",
    desc: "Company-wise sheets with frequency, topic tags, bookmarks, and solve tracking.",
    statA: "840+",
    labelA: "Questions",
    statB: "25+",
    labelB: "Companies",
    accent: "var(--green)",
  },
  {
    icon: "🏗️",
    name: "System Design",
    desc: "A 150-question roadmap with HLD + LLD depth, categories, and study tracking.",
    statA: "150",
    labelA: "Questions",
    statB: "40+",
    labelB: "Companies",
    accent: "var(--amber)",
  },
  {
    icon: "🎯",
    name: "Frontend Prep",
    desc: "A free 45-day path covering JS, React, TypeScript, Testing, and performance.",
    statA: "45",
    labelA: "Days",
    statB: "275",
    labelB: "Questions",
    accent: "var(--blue)",
  },
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
        <section className="pd-premium-hero">
          <div className="pd-premium-orb pd-premium-orb-1" />
          <div className="pd-premium-orb pd-premium-orb-2" />

          {/* Left: label + title + pills */}
          <div className="pd-premium-left">
            <div className="pd-premium-label-row">
              <div className="pd-premium-crown">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8l4 6 6-9 6 9 4-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z" />
                </svg>
              </div>
              <span className="pd-premium-eyebrow">MAANGco Premium</span>
            </div>
            <h2 className="pd-premium-title">
              Unlock everything.{" "}
              <span className="pd-premium-title-accent">Crack any interview.</span>
            </h2>
            <div className="pd-premium-pills">
              <span className="pd-premium-pill">⚡ 840+ DSA</span>
              <span className="pd-premium-pill">🏗️ 150 System Design</span>
              <span className="pd-premium-pill">💬 275 Qs</span>
              <span className="pd-premium-pill">🏢 25+ Companies</span>
            </div>
          </div>

          {/* Right: price + CTA + note */}
          <div className="pd-premium-right">
            <div className="pd-premium-price-hint">Starting at ₹299 / month</div>
            <button type="button" className="pd-premium-cta" onClick={onBuyPremium}>
              <span>Upgrade to Premium</span>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" width="11" height="11">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </button>
            <div className="pd-premium-note">Cancel anytime · Instant access</div>
          </div>
        </section>
      ) : (
        <section className="pd-hero-card">
          <div className="pd-hero-inner">
            <div className="pd-badge">Free preview — explore before you sign in</div>
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
              ⚡
            </div>
            <div>
              <div className="pd-video-name">DSA Practice</div>
              <div className="pd-video-hint">Company-wise sheets, frequency &amp; tags</div>
            </div>
            <div className="pd-live-badge">Live</div>
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
              🏗️
            </div>
            <div>
              <div className="pd-video-name">System Design</div>
              <div className="pd-video-hint">150-question roadmap with depth &amp; tracking</div>
            </div>
            <div className="pd-live-badge">Live</div>
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
                {f.icon}
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
