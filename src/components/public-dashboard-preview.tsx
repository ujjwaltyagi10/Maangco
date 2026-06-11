const DSALightVid = new URL("../assets/Video/DSALight.webm", import.meta.url).href;
const DSADarkVid = new URL("../assets/Video/DSADark.webm", import.meta.url).href;
const SDLightVid = new URL("../assets/Video/SDLight.webm", import.meta.url).href;
const SDDarkVid = new URL("../assets/Video/DSDark.webm", import.meta.url).href;

interface PublicDashboardPreviewProps {
  companyCount: number;
  theme: "light" | "dark";
  onSignIn: () => void;
  onSignUp: () => void;
  onBrowseFrontend: () => void;
}

const quickStats = [
  { value: "20+", label: "Companies", icon: "🏢", accent: "var(--green)" },
  { value: "840+", label: "DSA Questions", icon: "⚡", accent: "var(--amber)" },
  { value: "150", label: "System Design", icon: "🏗️", accent: "var(--blue)" },
  { value: "275", label: "Frontend Qs", icon: "🎯", accent: "var(--purple)" },
];

const features = [
  {
    icon: "⚡",
    name: "DSA Practice",
    desc: "Company-wise sheets with frequency, topic tags, bookmarks, and solve tracking.",
    statA: "640+",
    labelA: "Questions",
    statB: "10+",
    labelB: "Companies",
    accent: "var(--green)",
  },
  {
    icon: "🏗️",
    name: "System Design",
    desc: "A 150-question roadmap with HLD + LLD depth, categories, and study tracking.",
    statA: "150",
    labelA: "Questions",
    statB: "9",
    labelB: "Categories",
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

export function PublicDashboardPreview({
  companyCount,
  theme,
  onSignIn,
  onSignUp,
  onBrowseFrontend,
}: PublicDashboardPreviewProps) {
  const isDark = theme === "dark";
  const dsaVid = isDark ? DSADarkVid : DSALightVid;
  const sdVid = isDark ? SDDarkVid : SDLightVid;

  return (
    <div className="dashboard dashboard--public">
      {/* Hero */}
      <section className="pd-hero-card">
        <div className="pd-badge">Free preview — no sign-in needed to explore Frontend</div>
        <h1 className="pd-title">
          Your complete <span>interview</span>
          <br />
          <span>prep</span> hub.
        </h1>
        <p className="pd-sub">
          One place for DSA company sheets, system design roadmaps, and frontend prep. Track what
          you&apos;ve solved, bookmark what matters, and stay consistent.
        </p>
        <div className="pd-ctas">
          <button type="button" className="lbtn-primary lbtn-lg" onClick={onSignIn}>
            Sign In
          </button>
          <button type="button" className="lbtn-outline lbtn-lg" onClick={onSignUp}>
            Get Started — it&apos;s free
          </button>
          <button type="button" className="pd-free-link" onClick={onBrowseFrontend}>
            Explore free Frontend →
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="pd-stats-row">
        {quickStats.map((s) => (
          <div key={s.label} className="pd-stat-card">
            <div className="pd-stat-icon" style={{ background: `${s.accent}1a`, color: s.accent }}>
              {s.icon}
            </div>
            <div>
              <div className="pd-stat-val">{s.value}</div>
              <div className="pd-stat-lbl">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Showcase */}
      <section className="pd-video-section">
        <div className="pd-section-eyebrow">See it in action</div>
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
      </section>

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

      {/* Bottom: unlock list + company wall */}
      <section className="pd-bottom">
        <div className="pd-unlock-card">
          <div className="pd-section-eyebrow" style={{ marginBottom: "14px" }}>
            What you unlock
          </div>
          <ul className="pd-unlock-list">
            <li>Company-wise DSA sheets with solve tracking and bookmarks.</li>
            <li>System design roadmap with structured study days and categories.</li>
            <li>Progress synced across devices — pick up where you left off.</li>
            <li>Premium unlocks deeper sorting, more companies, and full views.</li>
          </ul>
          <div className="pd-unlock-ctas">
            <button type="button" className="lbtn-primary" onClick={onSignUp}>
              Get Started Free
            </button>
            <button type="button" className="lbtn-outline" onClick={onSignIn}>
              Sign In
            </button>
          </div>
        </div>

        <div className="pd-company-card">
          <div className="pd-company-eyebrow">Companies included</div>
          <div className="pd-company-count">
            {companyCount}
            <span>+</span>
          </div>
          <div className="pd-chip-wrap">
            {[
              "Google",
              "Meta",
              "Amazon",
              "Apple",
              "Netflix",
              "Microsoft",
              "Uber",
              "Flipkart",
            ].map((c) => (
              <span key={c} className="pd-chip">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
