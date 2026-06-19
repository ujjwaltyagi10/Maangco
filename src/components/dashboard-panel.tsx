import { Skeleton } from "./ui/shimmer";

interface DashboardPanelProps {
  isPremium: boolean;
  onBuyPremium: () => void;
  isLoading?: boolean;
  dsaProgress: number;
  frontendProgress: number;
  systemDesignProgress: number;
  overallProgress: number;
  solvedDsaCount: number;
  totalDsaCount: number;
  completedFrontendCount: number;
  totalFrontendCount: number;
  completedRoadmapDays: number;
  totalRoadmapDays: number;
  completedSystemDesignCount: number;
  totalSystemDesignCount: number;
  onOpenDsa: () => void;
  onOpenFrontend: () => void;
  onOpenSystemDesign: () => void;
}

const tips = [
  { icon: "🔁", title: "Consistency beats intensity", copy: "1 hour daily beats 8 hours on weekends. Use the 45-day roadmap." },
  { icon: "⚡", title: "JS fundamentals first", copy: "Closures, event loop, and prototypes appear in 90% of frontend rounds." },
  { icon: "🏗️", title: "Build, don't just read", copy: "Implement debounce, throttle, and LRU cache from scratch — they ask this." },
  { icon: "🔥", title: "High-freq DSA first", copy: "Sliding window & two pointers cover ~40% of rounds. Start there." },
  { icon: "🎤", title: "Explain as you code", copy: "Interviewers value communication. Think out loud even when stuck." },
  { icon: "📐", title: "System design matters", copy: "Autocomplete and infinite scroll are the most common frontend SD questions." },
];

function ProgressRing({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

export function DashboardPanel({
  isPremium,
  onBuyPremium,
  dsaProgress,
  frontendProgress,
  systemDesignProgress,
  overallProgress,
  solvedDsaCount,
  completedFrontendCount,
  completedRoadmapDays,
  totalRoadmapDays,
  completedSystemDesignCount,
  totalSystemDesignCount,
  onOpenDsa,
  onOpenFrontend,
  onOpenSystemDesign,
  isLoading,
}: DashboardPanelProps) {
  if (isLoading) {
    return (
      <div className="dp-root">
        <div className="dp-hero">
          <div className="dp-hero-left" style={{ flex: 1 }}>
            <Skeleton w={80} h={12} style={{ marginBottom: 12 }} />
            <Skeleton w="70%" h={28} style={{ marginBottom: 10 }} />
            <Skeleton w="50%" h={14} />
          </div>
          <div className="dp-hero-stats">
            <Skeleton w={80} h={80} radius={999} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginLeft: 16 }}>
              <Skeleton w={90} h={36} />
              <Skeleton w={90} h={36} />
            </div>
          </div>
        </div>
        <div className="dp-modules">
          {[0, 1, 2].map((i) => (
            <div key={i} className="dp-module-card" style={{ pointerEvents: "none", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Skeleton w={32} h={32} radius={8} />
                <Skeleton w={70} h={14} />
              </div>
              <Skeleton w="60%" h={18} />
              <Skeleton w="100%" h={12} />
              <Skeleton w="100%" h={6} radius={3} />
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                <Skeleton w={50} h={30} />
                <Skeleton w={50} h={30} />
                <Skeleton w={50} h={30} />
              </div>
            </div>
          ))}
        </div>
        <div className="dp-section-head">
          <Skeleton w={120} h={14} />
        </div>
        <div className="dp-tips">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="dp-tip">
              <Skeleton w={36} h={36} radius={8} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton w="50%" h={13} />
                <Skeleton w="85%" h={11} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const totalSolved = solvedDsaCount + completedFrontendCount + completedSystemDesignCount;

  const modules = [
    {
      key: "dsa",
      icon: "⚡",
      label: "DSA Practice",
      tag: "Company-wise",
      desc: "LeetCode questions sorted by company, frequency & topic tags.",
      progress: dsaProgress,
      color: "#6c63ff",
      colorBg: "rgba(108,99,255,0.1)",
      stats: [
        { val: solvedDsaCount, lbl: "Solved" },
        { val: "840+", lbl: "Questions" },
        { val: "25+", lbl: "Companies" },
      ],
      onClick: onOpenDsa,
      locked: false,
    },
    {
      key: "sd",
      icon: "🏗️",
      label: "System Design",
      tag: "HLD + LLD",
      desc: "150-question roadmap with deep dives into distributed systems.",
      progress: systemDesignProgress,
      color: "var(--amber)",
      colorBg: "var(--amber-bg)",
      stats: [
        { val: completedSystemDesignCount, lbl: "Done" },
        { val: totalSystemDesignCount, lbl: "Questions" },
        { val: "9", lbl: "Categories" },
      ],
      onClick: onOpenSystemDesign,
      locked: !isPremium,
    },
    // { key: "fe", icon: "🎯", label: "Frontend Prep", tag: "45-Day Roadmap",
    //   desc: "Structured plan covering JS, React, TypeScript + 275 interview Qs.",
    //   progress: frontendProgress, color: "var(--green)", colorBg: "var(--green-bg)",
    //   stats: [{ val: completedFrontendCount, lbl: "Done" }, { val: "275", lbl: "Questions" },
    //           { val: `${completedRoadmapDays}/${totalRoadmapDays}`, lbl: "Days" }],
    //   onClick: onOpenFrontend, locked: false },
  ];

  return (
    <div className="dp-root">

      {/* ── HERO ── */}
      <div className="dp-hero">
        <div className="dp-hero-left">
          <div className="dp-hero-eyebrow">Your prep hub</div>
          <h1 className="dp-hero-title">
            Welcome back —{" "}
            <span className="dp-hero-accent">let&apos;s keep the streak alive.</span>
          </h1>
          <p className="dp-hero-sub">
            Track DSA and System Design progress all in one place.
          </p>
        </div>
        <div className="dp-hero-stats">
          <div className="dp-hero-ring">
            <ProgressRing pct={overallProgress} color="var(--green)" size={80} />
            <div className="dp-ring-inner">
              <div className="dp-ring-pct">{overallProgress}%</div>
              <div className="dp-ring-lbl">overall</div>
            </div>
          </div>
          <div className="dp-hero-counters">
            <div className="dp-counter">
              <div className="dp-counter-val">{totalSolved}</div>
              <div className="dp-counter-lbl">problems solved</div>
            </div>
            <div className="dp-counter">
              <div className="dp-counter-val">{completedRoadmapDays}</div>
              <div className="dp-counter-lbl">roadmap days done</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODULES ── */}
      <div className="dp-modules">
        {modules.map((m) => (
          <div
            key={m.key}
            className={`dp-module-card${m.locked ? " dp-module-card--locked" : ""}`}
            style={{ "--module-color": m.color, "--module-bg": m.colorBg } as React.CSSProperties}
            onClick={m.onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && m.onClick()}
          >
            <div className="dp-module-top">
              <div className="dp-module-icon">{m.icon}</div>
              <span className="dp-module-tag">{m.tag}</span>
              {m.locked && (
                <span className="dp-module-lock-pill">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
                    <rect x="2" y="6" width="10" height="7" rx="1.5" />
                    <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" />
                  </svg>
                  Premium
                </span>
              )}
            </div>

            <div className="dp-module-title">{m.label}</div>
            <div className="dp-module-desc">{m.desc}</div>

            <div className="dp-module-bar-wrap">
              <div className="dp-module-bar">
                <div className="dp-module-bar-fill" style={{ width: `${m.progress}%` }} />
              </div>
              <span className="dp-module-pct">{m.progress}%</span>
            </div>

            <div className="dp-module-footer">
              <div className="dp-module-stats">
                {m.stats.map((s) => (
                  <div key={s.lbl} className="dp-module-stat">
                    <div className="dp-module-stat-val">{s.val}</div>
                    <div className="dp-module-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
              {m.locked ? (
                <button
                  type="button"
                  className="dp-module-cta dp-module-cta--lock"
                  onClick={(e) => { e.stopPropagation(); onBuyPremium(); }}
                >
                  Unlock
                </button>
              ) : (
                <button
                  type="button"
                  className="dp-module-cta"
                  onClick={(e) => { e.stopPropagation(); m.onClick(); }}
                >
                  Open
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── TIPS ── */}
      <div className="dp-section-head">
        <div className="dp-section-dot" style={{ background: "var(--amber)" }} />
        Interview Tips
      </div>
      <div className="dp-tips">
        {tips.map((t) => (
          <div key={t.title} className="dp-tip">
            <div className="dp-tip-icon">{t.icon}</div>
            <div className="dp-tip-body">
              <div className="dp-tip-title">{t.title}</div>
              <div className="dp-tip-copy">{t.copy}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
