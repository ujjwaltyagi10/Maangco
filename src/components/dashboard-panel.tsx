interface DashboardPanelProps {
  dsaProgress: number;
  frontendProgress: number;
  overallProgress: number;
  solvedDsaCount: number;
  totalDsaCount: number;
  completedFrontendCount: number;
  totalFrontendCount: number;
  completedRoadmapDays: number;
  totalRoadmapDays: number;
  companyCount: number;
  onOpenDsa: () => void;
  onOpenFrontend: () => void;
}

const tips = [
  {
    icon: "🔁",
    title: "Consistency beats intensity",
    copy: "1 hour daily beats 8 hours on weekends. Use the 45-day roadmap.",
  },
  {
    icon: "⚡",
    title: "JS fundamentals first",
    copy: "Closures, event loop, and prototypes are asked in 90% of frontend rounds.",
  },
  {
    icon: "🏗️",
    title: "Build, don't just read",
    copy: "Implement debounce, throttle, and LRU cache from scratch — they ask this.",
  },
  {
    icon: "🔥",
    title: "High-freq DSA first",
    copy: "Focus on 80%+ frequency problems. Sliding window & two pointers cover 40% of rounds.",
  },
  {
    icon: "🎤",
    title: "Explain as you code",
    copy: "Interviewers value communication. Think out loud even when stuck.",
  },
  {
    icon: "📐",
    title: "System design matters",
    copy: "Autocomplete and infinite scroll are the most common frontend system design questions.",
  },
];

export function DashboardPanel({
  dsaProgress,
  frontendProgress,
  overallProgress,
  solvedDsaCount,
  completedFrontendCount,
  completedRoadmapDays,
  totalRoadmapDays,
  companyCount,
  onOpenDsa,
  onOpenFrontend,
}: DashboardPanelProps) {
  const totalSolved = solvedDsaCount + completedFrontendCount;

  return (
    <div className="dashboard">
      {/* Hero */}
      <div className="dash-hero">
        <div className="dash-hero-text">
          <h1>
            Welcome back,
            <br />
            <span>let&apos;s get interview ready 🚀</span>
          </h1>
          <p>
            Track your DSA practice across top companies and master frontend
            interview questions — all in one place.
          </p>
        </div>
        <div className="dash-hero-badge">
          <div className="streak-circle">
            <div className="streak-num">{totalSolved}</div>
            <div className="streak-label">SOLVED</div>
          </div>
          <p>problems done</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="dash-cards">
        <div className="dash-card dsa-card" onClick={onOpenDsa} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpenDsa()}>
          <div className="card-header">
            <div className="card-icon dsa">⚡</div>
            <span className="card-tag dsa">LeetCode</span>
          </div>
          <div>
            <div className="card-title">DSA Practice</div>
            <div className="card-desc">
              Company-wise LeetCode questions for Google, Meta, Amazon, Apple,
              Netflix and more. Track frequency and your solve status.
            </div>
          </div>
          <div className="card-footer">
            <div className="card-stats">
              <div className="card-stat">
                <div className="card-stat-val">{solvedDsaCount}</div>
                <div className="card-stat-label">Solved</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-val">640+</div>
                <div className="card-stat-label">Total</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-val">{companyCount}</div>
                <div className="card-stat-label">Companies</div>
              </div>
            </div>
            <button type="button" className="card-cta" onClick={(e) => { e.stopPropagation(); onOpenDsa(); }}>
              Open
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dash-card fe-card" onClick={onOpenFrontend} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpenFrontend()}>
          <div className="card-header">
            <div className="card-icon fe">🎯</div>
            <span className="card-tag fe">45-Day Roadmap</span>
          </div>
          <div>
            <div className="card-title">Frontend Interview Prep</div>
            <div className="card-desc">
              Structured 45-day roadmap covering JS, React, Redux, TypeScript,
              Testing, Performance + 275 real interview questions with progress
              tracking.
            </div>
          </div>
          <div className="card-footer">
            <div className="card-stats">
              <div className="card-stat">
                <div className="card-stat-val">{completedFrontendCount}</div>
                <div className="card-stat-label">Done</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-val">275</div>
                <div className="card-stat-label">Questions</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-val">45</div>
                <div className="card-stat-label">Days</div>
              </div>
            </div>
            <button type="button" className="card-cta" onClick={(e) => { e.stopPropagation(); onOpenFrontend(); }}>
              Open
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="dash-progress-section">
        <div className="section-title">
          <div className="dot" />
          Overall Progress
        </div>
        <div className="progress-rows">
          <div className="prog-row">
            <div className="prog-row-label">DSA Problems Solved</div>
            <div className="prog-row-bar">
              <div
                className="prog-row-fill"
                style={{ width: `${dsaProgress}%`, background: "linear-gradient(90deg, #6c63ff, #9b93ff)" }}
              />
            </div>
            <div className="prog-row-pct">{dsaProgress}%</div>
          </div>
          <div className="prog-row">
            <div className="prog-row-label">Frontend Questions Done</div>
            <div className="prog-row-bar">
              <div
                className="prog-row-fill"
                style={{ width: `${frontendProgress}%`, background: "linear-gradient(90deg, #4a7c41, #7cb870)" }}
              />
            </div>
            <div className="prog-row-pct">{frontendProgress}%</div>
          </div>
          <div className="prog-row">
            <div className="prog-row-label">Combined Progress</div>
            <div className="prog-row-bar">
              <div
                className="prog-row-fill"
                style={{ width: `${overallProgress}%`, background: "linear-gradient(90deg, #c07830, #e8a020)" }}
              />
            </div>
            <div className="prog-row-pct">{overallProgress}%</div>
          </div>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "11px", color: "var(--text3)", lineHeight: 1.6 }}>
          Roadmap: {completedRoadmapDays}/{totalRoadmapDays} days completed
        </p>
      </div>

      {/* Interview Tips */}
      <div className="section-title" style={{ marginBottom: "0.75rem" }}>
        <div className="dot" style={{ background: "var(--amber)" }} />
        Interview Tips
      </div>
      <div className="dash-tips">
        {tips.map((tip) => (
          <div key={tip.title} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <div className="tip-text">
              <strong>{tip.title}</strong>
              {tip.copy}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
