import { useState } from "react";

interface LandingPageProps {
  theme: "light" | "dark";
  onThemeChange: () => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

const companies = [
  "Google", "Meta", "Amazon", "Microsoft", "Apple",
  "Uber", "Netflix", "Atlassian", "Adobe", "Walmart",
];

const PLAN_FEATURES = [
  "500+ company-wise DSA questions",
  "System Design roadmap — 90-day, HLD + LLD",
  "Unified progress dashboard",
  "Daily fresh questions — new every 24 hours",
  "Bookmark & revisit any problem",
  "10+ FAANG company curated lists",
  "Progress sync across all devices",
];

const faqs = [
  {
    q: "What's included in a PrepDoc subscription?",
    a: "Everything FAANG interviews actually test: 500+ company-wise DSA problems, a 90-day System Design roadmap (HLD + LLD), a unified dashboard, and daily question updates. Not a single extra topic you won't need.",
  },
  {
    q: "How often are questions updated?",
    a: "Every single day. Our team adds new DSA problems and system design case studies daily, sourced from fresh interview reports at Google, Meta, Amazon, Microsoft and more. Your prep never goes stale.",
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

const testimonials = [
  {
    initials: "AR",
    name: "Arjun Rao",
    role: "SDE @ Amazon",
    text: "PrepDoc's company-filtered DSA list is a game-changer. Focused on Amazon-tagged problems for 6 weeks, cleared my loop. No noise — just the problems that actually showed up in my rounds.",
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    role: "SDE-2 @ Flipkart",
    text: "The System Design roadmap is exactly what I was missing. Went through HLD + LLD topics day by day and walked into every design round prepared. Offer in 8 weeks.",
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
    text: "Zero filler content — exactly the problems that show in real interviews. Bookmarked all hard problems, revisited them systematically. Cleared Uber backend loop in 8 weeks.",
  },
  {
    initials: "DG",
    name: "Divya Gupta",
    role: "SDE @ Adobe",
    text: "Best ₹249 I've spent. System Design coverage + DSA lists are unmatched. Daily question updates meant I was always solving fresh, interview-relevant content.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ width: 16, height: 16, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open ? <div className="faq-answer">{a}</div> : null}
    </div>
  );
}

export function LandingPage({ theme, onThemeChange, onSignIn, onGetStarted }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="landing w-full min-w-0">

      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-container">
          <div className="flex items-center h-16 gap-6">

            <a href="/" className="landing-logo flex-shrink-0">
              <div className="landing-logo-mark">
                <svg viewBox="0 0 20 20" width="16" height="16">
                  <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
                </svg>
              </div>
              <span className="landing-logo-text">Prep<em>Doc</em></span>
            </a>

            <div className="hidden lg:flex items-center gap-1 flex-1">
              <a href="#features" className="landing-nav-link">Features</a>
              <a href="#how-it-works" className="landing-nav-link">How it works</a>
              <a href="#pricing" className="landing-nav-link">Pricing</a>
              <a href="#testimonials" className="landing-nav-link">Reviews</a>
              <a href="#faq" className="landing-nav-link">FAQ</a>
            </div>

            <div className="hidden lg:flex items-center gap-2 ml-auto">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                    <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="15">
                    <circle cx="10" cy="10" r="3.2" /><path d="M10 2V4M10 16V18M2 10H4M16 10H18M4.9 4.9L6.3 6.3M13.7 13.7L15.1 15.1M4.9 15.1L6.3 13.7M13.7 6.3L15.1 4.9" />
                  </svg>
                )}
              </button>
              <button type="button" className="lnav-sign-in" onClick={onSignIn}>Sign In</button>
              <button type="button" className="lnav-get-started" onClick={onGetStarted}>Get Started →</button>
            </div>

            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <button type="button" className="lnav-theme-btn" onClick={onThemeChange} aria-label="Toggle theme">
                {theme === "light" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M14.8 12.9a6.7 6.7 0 1 1-7.7-9.8 7.2 7.2 0 0 0 7.7 9.8Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
                    <circle cx="10" cy="10" r="3.2" /><path d="M10 2V4M10 16V18M2 10H4M16 10H18" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="lnav-theme-btn"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                  {mobileMenuOpen
                    ? <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
                    : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen ? (
            <div className="lg:hidden pb-4 flex flex-col gap-1">
              {["#features", "#how-it-works", "#pricing", "#testimonials", "#faq"].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className="landing-nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {["Features", "How it works", "Pricing", "Reviews", "FAQ"][i]}
                </a>
              ))}
              <div className="flex gap-2 mt-2">
                <button type="button" className="lnav-sign-in flex-1" onClick={onSignIn}>Sign In</button>
                <button type="button" className="lnav-get-started flex-1" onClick={onGetStarted}>Get Started</button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lhero">
        <div className="lhero-glow" />
        <div className="landing-container relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="lhero-badge lhero-badge--live">
              <span className="lhero-badge-dot lhero-badge-dot--pulse" />
              Live · Questions updated every day with fresh FAANG interview reports
            </div>
          </div>

          <h1 className="lhero-title">
            Crack FAANG.<br />
            <span className="lhero-accent">Not a question more. Not a concept less.</span>
          </h1>

          <p className="lhero-sub">
            Exactly the prep material FAANG interviews demand — curated DSA lists and a 90-day System Design roadmap.
            Zero fluff. Zero gaps. Refreshed every single day. Built to get you hired, not overwhelmed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
              Start cracking FAANG
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path d="M7 5l6 5-6 5V5z" />
              </svg>
            </button>
            <a href="#pricing" className="lbtn-outline lbtn-lg">View Pricing</a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lhero-stats-grid">
            {[
              { v: "500+", l: "DSA Questions" },
              { v: "10+", l: "FAANG Companies" },
              { v: "Daily", l: "Question Updates" },
              { v: "90-Day", l: "System Design Plan" },
            ].map((s, i, arr) => (
              <div
                key={s.l}
                className="lhero-stat"
                style={{ borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div className="lhero-stat-val">{s.v}</div>
                <div className="lhero-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY STRIP ── */}
      <section className="lphil-strip">
        <div className="landing-container">
          <div className="lphil-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="22" height="22">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: "Zero fluff",
                desc: "Every question, every concept — chosen because FAANG actually tests it. Nothing extra to slow you down.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="22" height="22">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                  </svg>
                ),
                title: "Updated every day",
                desc: "Fresh problems added daily from real interview reports. Your prep is always current, always relevant.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="22" height="22">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
                  </svg>
                ),
                title: "Exactly what's needed",
                desc: "Not 2,000 random problems. The precise patterns, companies, and design topics that crack FAANG rounds.",
              },
            ].map((p) => (
              <div key={p.title} className="lphil-card">
                <div className="lphil-icon">{p.icon}</div>
                <h3 className="lphil-title">{p.title}</h3>
                <p className="lphil-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lsection" id="features">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Features</div>
            <h2 className="lsection-title">Everything you need. Nothing you don't.</h2>
            <p className="lsection-sub">
              Three focused modules covering the full breadth of a FAANG software engineering interview — DSA, System Design, and your progress dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-5">

            {/* Feature 1 — DSA */}
            <div className="lfeat-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[380px]">
                <div className="lfeat-text">
                  <div className="lfeat-tag" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}>DSA Practice</div>
                  <h3 className="lfeat-title">Company-wise DSA — only what they ask</h3>
                  <p className="lfeat-desc">
                    500+ curated problems organised by company. Filter by Google, Meta, Amazon, Microsoft and more.
                    Each question is hand-picked from real interview reports — no filler, no irrelevant problems.
                    New questions added every day.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>Easy / Medium / Hard difficulty tags</li>
                    <li>Bookmark problems to revisit later</li>
                    <li>Fresh questions added daily</li>
                  </ul>
                  <button type="button" className="lfeat-cta" onClick={onGetStarted}>Start practising →</button>
                </div>
                <div className="lfeat-mockup lg:border-l lg:border-t-0 border-t border-[var(--border)]">
                  <div className="mock-header">
                    <div className="mock-dots"><span /><span /><span /></div>
                    <div className="mock-title">DSA Practice — Amazon</div>
                    <span className="mock-live-dot" title="Updated today" />
                  </div>
                  <div className="mock-filter-row">
                    {["All", "Easy", "Medium", "Hard"].map((f) => (
                      <span key={f} className={`mock-filter${f === "Medium" ? " active" : ""}`}>{f}</span>
                    ))}
                  </div>
                  {[
                    { name: "Two Sum", diff: "easy", done: true },
                    { name: "LRU Cache", diff: "hard", done: false },
                    { name: "Merge Intervals", diff: "med", done: true },
                    { name: "Word Break", diff: "med", done: false },
                    { name: "Trapping Rain Water", diff: "hard", done: false },
                  ].map((q) => (
                    <div key={q.name} className={`mock-row${q.done ? " mock-row--done" : ""}`}>
                      <span className={`mock-diff mock-diff--${q.diff}`}>{q.diff}</span>
                      <span className="mock-name">{q.name}</span>
                      {q.done ? <span className="mock-check">✓</span> : <span className="mock-circle" />}
                    </div>
                  ))}
                  <div className="mock-daily-badge">+3 new problems added today</div>
                </div>
              </div>
            </div>

            {/* Feature 2 — System Design */}
            <div className="lfeat-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[380px]">
                <div className="lfeat-mockup order-last lg:order-first lg:border-r lg:border-t-0 border-t border-[var(--border)]">
                  <div className="mock-header">
                    <div className="mock-dots"><span /><span /><span /></div>
                    <div className="mock-title">System Design — Week 2</div>
                    <span className="mock-live-dot" title="Updated today" />
                  </div>
                  <div className="mock-roadmap">
                    {[
                      { d: "Day 8", t: "Consistent Hashing", done: true },
                      { d: "Day 9", t: "CAP Theorem & Tradeoffs", done: true },
                      { d: "Day 10", t: "Database Indexing Deep Dive", done: true },
                      { d: "Day 11", t: "Design YouTube Upload Flow", done: false },
                      { d: "Day 12", t: "Message Queues & Kafka", done: false },
                    ].map((item) => (
                      <div key={item.d} className={`mock-rd-item${item.done ? " done" : ""}`}>
                        <div className={`mock-rd-dot${item.done ? " done" : ""}`} />
                        <div className="flex-1 min-w-0">
                          <div className="mock-rd-day">{item.d}</div>
                          <div className="mock-rd-topic">{item.t}</div>
                        </div>
                        {item.done ? <span className="mock-check">✓</span> : null}
                      </div>
                    ))}
                  </div>
                  <div className="mock-progress-bar">
                    <div className="mock-pb-label"><span>System Design Progress</span><span>28%</span></div>
                    <div className="mock-pb-track"><div className="mock-pb-fill" style={{ width: "28%" }} /></div>
                  </div>
                </div>
                <div className="lfeat-text order-first lg:order-last">
                  <div className="lfeat-tag" style={{ color: "var(--blue)", background: "var(--blue-bg)" }}>System Design</div>
                  <h3 className="lfeat-title">90-day System Design mastery</h3>
                  <p className="lfeat-desc">
                    From CAP theorem to designing Twitter, YouTube, and distributed databases — every topic FAANG
                    actually asks, laid out day by day. HLD + LLD breakdown for each concept. Exactly the depth
                    senior engineering rounds expect.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>HLD + LLD breakdown for every topic</li>
                    <li>Real FAANG architecture patterns</li>
                    <li>Completion tracking per concept</li>
                  </ul>
                  <button type="button" className="lfeat-cta" onClick={onGetStarted}>Explore roadmap →</button>
                </div>
              </div>
            </div>

            {/* Feature 3 — Dashboard */}
            <div className="lfeat-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[340px]">
                <div className="lfeat-text">
                  <div className="lfeat-tag" style={{ color: "var(--green)", background: "var(--green-bg)" }}>Dashboard</div>
                  <h3 className="lfeat-title">Unified progress dashboard</h3>
                  <p className="lfeat-desc">
                    See your overall prep score at a glance. Track DSA solve rate, System Design completion,
                    and weekly momentum — all in one place. Know exactly where you stand, and exactly where to go next.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>Overall prep score across all modules</li>
                    <li>DSA and System Design completion rates</li>
                    <li>Quick-jump to any module</li>
                  </ul>
                  <button type="button" className="lfeat-cta" onClick={onGetStarted}>See dashboard →</button>
                </div>
                <div className="lfeat-mockup lg:border-l lg:border-t-0 border-t border-[var(--border)]">
                  <div className="mock-header">
                    <div className="mock-dots"><span /><span /><span /></div>
                    <div className="mock-title">Dashboard</div>
                  </div>
                  <div className="mock-dash-hero">
                    <div className="mock-dash-greeting">Good morning, Ujjwal</div>
                    <div className="mock-dash-sub">You're on a 6-day streak. Keep going.</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Overall", val: 62, color: "#4a7c41" },
                      { label: "DSA", val: 45, color: "#a06020" },
                      { label: "Sys Design", val: 78, color: "#1a4a8a" },
                    ].map((c) => (
                      <div key={c.label} className="mock-dash-card">
                        <div className="mock-dash-card-label">{c.label}</div>
                        <div className="mock-dash-card-val" style={{ color: c.color }}>{c.val}%</div>
                        <div className="mock-dash-card-bar">
                          <div className="mock-dash-card-fill" style={{ width: `${c.val}%`, background: c.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[["148", "LC Solved"], ["18", "Designs Done"], ["10", "Companies"]].map(([v, l]) => (
                      <div key={l} className="mock-dash-stat">
                        <strong>{v}</strong> {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANIES ── */}
      <section className="lcompanies-section">
        <div className="landing-container">
          <p className="lcompanies-label">Questions sourced from engineers at</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {companies.map((c) => (
              <div key={c} className="lcompany-chip">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAANG CTA ── */}
      <section className="lfaang-section">
        <div className="lfaang-glow" />
        <div className="landing-container relative z-10 text-center">
          <h2 className="lfaang-title">Your next FAANG offer. Exactly what it takes to get there.</h2>
          <p className="lfaang-sub">
            Stop over-preparing with 2,000 random problems. Get the exact DSA patterns and System Design topics
            FAANG interviews test — nothing extra, nothing missing.
          </p>
          <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
            Start your prep today →
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lsection lsection--alt" id="how-it-works">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">How it works</div>
            <h2 className="lsection-title">From zero to offer-ready in three steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: "👤", title: "Create your account", desc: "Sign up with Google or email in under 30 seconds. Your progress syncs instantly across all your devices." },
              { num: "02", icon: "🎯", title: "Pick your track", desc: "Tackle company-specific DSA lists, follow the 90-day System Design roadmap, or work through both in parallel. Everything is structured — no guesswork." },
              { num: "03", icon: "📈", title: "Track and get hired", desc: "Watch your dashboard fill up. Daily fresh questions keep your momentum going. Use your prep score to identify gaps and walk into every round prepared." },
            ].map((step) => (
              <div key={step.num} className="lhow-step">
                <div className="lhow-num">{step.num}</div>
                <div className="lhow-icon">{step.icon}</div>
                <h3 className="lhow-title">{step.title}</h3>
                <p className="lhow-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="lsection" id="testimonials">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Reviews</div>
            <h2 className="lsection-title">Engineers who cracked it with PrepDoc</h2>
            <p className="lsection-sub">Real results from engineers who got into Google, Meta, Amazon, Microsoft and more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="ltestimonial">
                <div className="ltestimonial-quote">"</div>
                <p className="ltestimonial-text">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="ltestimonial-avatar flex-shrink-0">{t.initials}</div>
                  <div>
                    <div className="ltestimonial-name">{t.name}</div>
                    <div className="ltestimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lsection lsection--alt" id="pricing">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">Pricing</div>
            <h2 className="lsection-title">One plan. Everything you need.</h2>
            <p className="lsection-sub">
              No tiers, no upsells. Every feature unlocked — DSA lists, System Design roadmap, daily updates, and your full dashboard.
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
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
                      <path d="M3 8l4 4 6-6" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button type="button" className="lbtn-outline lprice-btn" onClick={onGetStarted}>
                Start monthly →
              </button>
            </div>

            {/* Yearly — highlighted */}
            <div className="lprice-card lprice-card--highlight">
              <div className="lprice-popular-badge">Most Popular · Save 33%</div>
              <div className="lprice-plan-name">Yearly</div>
              <div className="lprice-amount">
                <span className="lprice-currency">₹</span>
                <span className="lprice-num">1,999</span>
                <span className="lprice-period">/year</span>
              </div>
              <p className="lprice-tagline">₹167/month · Save ₹989 vs monthly</p>
              <ul className="lprice-features">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="lprice-feature">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
                      <path d="M3 8l4 4 6-6" />
                    </svg>
                    {f}
                  </li>
                ))}
                <li className="lprice-feature lprice-feature--bonus">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="14" height="14">
                    <path d="M3 8l4 4 6-6" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button type="button" className="lbtn-primary lprice-btn" onClick={onGetStarted}>
                Get yearly access →
              </button>
            </div>
          </div>

          <p className="lprice-note">Secure payment · Cancel anytime · All major cards accepted</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lsection" id="faq">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">FAQ</div>
            <h2 className="lsection-title">Frequently asked questions</h2>
          </div>
          <div className="flex flex-col gap-3">
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
          <h2 className="lfinal-title">Stop winging your prep. Start cracking FAANG.</h2>
          <p className="lfinal-sub">
            Exactly the DSA and System Design material FAANG interviews test — structured, daily-updated, and nothing extra.
            Your next offer is a structured prep away.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
              Start your prep →
            </button>
            <a href="#pricing" className="lbtn-outline lbtn-lg">View Pricing</a>
          </div>
          <p className="lfinal-note">Secure payment · Cancel anytime · Questions updated daily</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="landing-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <a href="/" className="landing-logo">
              <div className="landing-logo-mark" style={{ width: 28, height: 28 }}>
                <svg viewBox="0 0 20 20" width="13" height="13">
                  <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
                </svg>
              </div>
              <span className="landing-logo-text" style={{ fontSize: 14 }}>Prep<em>Doc</em></span>
            </a>
            <p className="lfooter-copy">© 2025 PrepDoc. Built for engineers, by engineers.</p>
            <div className="flex items-center gap-1">
              <button type="button" className="lfooter-link" onClick={onSignIn}>Sign In</button>
              <button type="button" className="lfooter-link" onClick={onGetStarted}>Get Started</button>
              <a href="#features" className="lfooter-link">Features</a>
              <a href="#pricing" className="lfooter-link">Pricing</a>
              <a href="#faq" className="lfooter-link">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
