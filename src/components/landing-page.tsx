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

const faqs = [
  {
    q: "Is PrepDoc free to use?",
    a: "Yes — PrepDoc is completely free. Create an account to sync your progress across devices. No credit card required.",
  },
  {
    q: "What DSA questions are included?",
    a: "We curate 500+ LeetCode-style problems organised company-wise (Google, Meta, Amazon, Microsoft and more). Each question is tagged by difficulty and topic.",
  },
  {
    q: "What is the 90-day frontend roadmap?",
    a: "It's a structured daily plan covering 45 core frontend interview topics — from closures and event loops to React architecture and system design. Each day maps to a specific concept.",
  },
  {
    q: "Will my progress sync across devices?",
    a: "Yes. Sign in with Google or email and your solved problems, roadmap completion, and bookmarks persist anywhere you log in.",
  },
  {
    q: "Which companies' question lists are available?",
    a: "We have curated lists for Google, Meta, Amazon, Microsoft, Apple, Uber, Netflix, Atlassian, Adobe, Walmart, and more — updated regularly.",
  },
  {
    q: "Can I use PrepDoc without creating an account?",
    a: "You can browse the content as a guest, but progress is stored locally. Create a free account to sync and never lose your progress.",
  },
];

const testimonials = [
  {
    initials: "AR",
    name: "Arjun Rao",
    role: "SDE @ Amazon",
    text: "PrepDoc's DSA company filter is a game-changer. I focused on Amazon-tagged problems for 6 weeks and cleared my loop. The dashboard kept me honest about gaps.",
  },
  {
    initials: "PK",
    name: "Priya Kapoor",
    role: "Frontend Eng @ Flipkart",
    text: "The 90-day frontend roadmap is exactly what I was looking for. Went through all 45 topics systematically and walked into every interview fully confident.",
  },
  {
    initials: "SN",
    name: "Sahil Nair",
    role: "SDE-2 @ Google",
    text: "I've tried 4-5 prep platforms. PrepDoc is the cleanest and most focused. The progress dashboard showed me exactly where I was weak. Cleared Google in my first attempt.",
  },
  {
    initials: "MT",
    name: "Mihika Tiwari",
    role: "SWE @ Microsoft",
    text: "Love that everything is in one place. DSA tracker, frontend roadmap, overall progress score — no more juggling Notion docs and spreadsheets. Landed MSFT after 10 weeks.",
  },
  {
    initials: "RS",
    name: "Rohan Sharma",
    role: "SDE @ Uber",
    text: "The bookmark feature saved me. Bookmarked all hard problems, came back to them systematically. Solved 180 problems in 8 weeks and cleared Uber backend loop.",
  },
  {
    initials: "DG",
    name: "Divya Gupta",
    role: "Frontend @ Adobe",
    text: "The frontend roadmap coverage is the best I've seen. It's not just questions — the structured progression from basics to advanced really builds a solid foundation.",
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
    /* w-full fixes the blank space — #root is display:flex so children need w-full */
    <div className="landing w-full min-w-0">

      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-container">
          <div className="flex items-center h-16 gap-6">

            {/* Logo */}
            <a href="/" className="landing-logo flex-shrink-0">
              <div className="landing-logo-mark">
                <svg viewBox="0 0 20 20" width="16" height="16">
                  <path d="M10 1L2 6v8l8 5 8-5V6L10 1zm0 2.3L16 7v6l-6 3.7L4 13V7l6-3.7z" fill="white" />
                </svg>
              </div>
              <span className="landing-logo-text">Prep<em>Doc</em></span>
            </a>

            {/* Desktop nav links — hidden on mobile */}
            <div className="hidden lg:flex items-center gap-1 flex-1">
              <a href="#features" className="landing-nav-link">Features</a>
              <a href="#how-it-works" className="landing-nav-link">How it works</a>
              <a href="#testimonials" className="landing-nav-link">Reviews</a>
              <a href="#faq" className="landing-nav-link">FAQ</a>
            </div>

            {/* Desktop actions — hidden on mobile */}
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

            {/* Mobile actions */}
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

          {/* Mobile dropdown menu */}
          {mobileMenuOpen ? (
            <div className="lg:hidden pb-4 flex flex-col gap-1">
              {["#features", "#how-it-works", "#testimonials", "#faq"].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  className="landing-nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {["Features", "How it works", "Reviews", "FAQ"][i]}
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
            <div className="lhero-badge">
              <span className="lhero-badge-dot" />
              Free · No credit card required
            </div>
          </div>

          <h1 className="lhero-title">
            Interview prep,<br />
            <span className="lhero-accent">solved by structure.</span>
          </h1>

          <p className="lhero-sub">
            DSA company-wise question lists, a 90-day frontend roadmap, and a unified progress dashboard —
            everything you need to land your next software engineering role.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
              Start for free
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path d="M7 5l6 5-6 5V5z" />
              </svg>
            </button>
            <button type="button" className="lbtn-outline lbtn-lg" onClick={onSignIn}>Sign In</button>
          </div>

          {/* Stats — 2 cols on mobile, 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lhero-stats-grid">
            {[
              { v: "500+", l: "DSA Questions" },
              { v: "10+", l: "Companies" },
              { v: "45", l: "Frontend Topics" },
              { v: "90-Day", l: "Roadmap" },
            ].map((s, i, arr) => (
              <div
                key={s.l}
                className="lhero-stat"
                style={{
                  borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="lhero-stat-val">{s.v}</div>
                <div className="lhero-stat-lbl">{s.l}</div>
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
            <h2 className="lsection-title">Everything you need at one place</h2>
            <p className="lsection-sub">
              Three focused modules covering the full breadth of a modern software engineering interview.
            </p>
          </div>

          {/* Feature cards — stacked on mobile, 2-col on lg */}
          <div className="flex flex-col gap-5">

            {/* Feature 1 — DSA */}
            <div className="lfeat-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[380px]">
                <div className="lfeat-text">
                  <div className="lfeat-tag" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}>DSA Practice</div>
                  <h3 className="lfeat-title">Company-wise DSA question lists</h3>
                  <p className="lfeat-desc">
                    500+ curated LeetCode problems organised by company. Filter by Google, Meta, Amazon, Microsoft
                    and more. Track solved and bookmarked problems with a single click.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>Easy / Medium / Hard difficulty tags</li>
                    <li>Bookmark problems to revisit later</li>
                    <li>Progress auto-saved to your account</li>
                  </ul>
                  <button type="button" className="lfeat-cta" onClick={onGetStarted}>Try it free →</button>
                </div>
                <div className="lfeat-mockup lg:border-l lg:border-t-0 border-t border-[var(--border)]">
                  <div className="mock-header">
                    <div className="mock-dots"><span /><span /><span /></div>
                    <div className="mock-title">DSA Practice — Amazon</div>
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
                </div>
              </div>
            </div>

            {/* Feature 2 — Frontend */}
            <div className="lfeat-card">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-0 lg:min-h-[380px]">
                <div className="lfeat-mockup order-last lg:order-first lg:border-r lg:border-t-0 border-t border-[var(--border)]">
                  <div className="mock-header">
                    <div className="mock-dots"><span /><span /><span /></div>
                    <div className="mock-title">Frontend Prep — Week 3</div>
                  </div>
                  <div className="mock-roadmap">
                    {[
                      { d: "Day 15", t: "Event Loop & Call Stack", done: true },
                      { d: "Day 16", t: "Promises & Async/Await", done: true },
                      { d: "Day 17", t: "Closures & Scope Chain", done: true },
                      { d: "Day 18", t: "Prototype & Inheritance", done: false },
                      { d: "Day 19", t: "Virtual DOM Explained", done: false },
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
                    <div className="mock-pb-label"><span>Roadmap Progress</span><span>32%</span></div>
                    <div className="mock-pb-track"><div className="mock-pb-fill" style={{ width: "32%" }} /></div>
                  </div>
                </div>
                <div className="lfeat-text order-first lg:order-last">
                  <div className="lfeat-tag" style={{ color: "var(--blue)", background: "var(--blue-bg)" }}>Frontend Prep</div>
                  <h3 className="lfeat-title">90-day structured learning path</h3>
                  <p className="lfeat-desc">
                    45 core frontend interview topics broken into a day-by-day 90-day roadmap.
                    From JS fundamentals to React architecture — follow the plan and never miss a concept.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>Daily topic with clear focus</li>
                    <li>45 curated interview questions</li>
                    <li>Completion tracking per day</li>
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
                    See your overall prep score at a glance. Track DSA solve rate, roadmap completion,
                    and weekly momentum — all in one place. Know exactly where to focus next.
                  </p>
                  <ul className="lfeat-bullets">
                    <li>Overall prep score across all modules</li>
                    <li>DSA and frontend completion rates</li>
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
                    <div className="mock-dash-greeting">Good morning, Ujjwal 👋</div>
                    <div className="mock-dash-sub">Ready to practice?</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Overall", val: 62, color: "#4a7c41" },
                      { label: "DSA", val: 45, color: "#a06020" },
                      { label: "Frontend", val: 78, color: "#1a4a8a" },
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
                    {[["148", "LC Solved"], ["32", "Q Done"], ["10", "Companies"]].map(([v, l]) => (
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
          <p className="lcompanies-label">Questions from engineers at</p>
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
          <h2 className="lfaang-title">Your next FAANG offer starts here.</h2>
          <p className="lfaang-sub">
            Join hundreds of engineers who structured their prep with PrepDoc and landed roles at top companies.
          </p>
          <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
            Start preparing today →
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
          {/* 1 col mobile → 3 col md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: "👤", title: "Create your free account", desc: "Sign up with Google or email in under 30 seconds. Your progress syncs instantly across all your devices." },
              { num: "02", icon: "🎯", title: "Pick your track", desc: "Tackle company-specific DSA lists, follow the 90-day frontend roadmap, or work through both in parallel." },
              { num: "03", icon: "📈", title: "Track and get hired", desc: "Watch your dashboard fill up. Use your progress score to identify gaps and walk into every interview prepared." },
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
            <h2 className="lsection-title">Trusted by engineers worldwide</h2>
            <p className="lsection-sub">Used by engineers who got into Google, Meta, Amazon, Microsoft and more.</p>
          </div>
          {/* 1 col mobile → 2 col md → 3 col lg */}
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

      {/* ── FAQ ── */}
      <section className="lsection lsection--alt" id="faq">
        <div className="landing-container">
          <div className="lsection-header">
            <div className="lsection-tag">FAQ</div>
            <h2 className="lsection-title">Frequently asked questions</h2>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
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
          <h2 className="lfinal-title">Ready to transform your prep?</h2>
          <p className="lfinal-sub">
            Create your free account and start building a structured path to your dream role today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <button type="button" className="lbtn-primary lbtn-lg" onClick={onGetStarted}>
              Create free account →
            </button>
            <button type="button" className="lbtn-outline lbtn-lg" onClick={onSignIn}>Sign In</button>
          </div>
          <p className="lfinal-note">Free forever · No credit card · Sync across devices</p>
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
              <a href="#faq" className="lfooter-link">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
