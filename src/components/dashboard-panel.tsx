import { useState } from "react";
import { Boxes, Database } from "lucide-react";
import type { DsaCompany } from "@/types/maangco";
import { CompanyKitsModal } from "./company-kits-modal";
import { CompanyLogo } from "./ui/company-logo";
import { Skeleton } from "./ui/shimmer";

const FEATURED_COMPANY_NAMES = ["Google", "Amazon", "Meta", "Microsoft", "Uber"];

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
  companies: DsaCompany[];
  onOpenDsa: () => void;
  onOpenDsaCompany: (companyId: string) => void;
  onOpenFrontend: () => void;
  onOpenSystemDesign: () => void;
}

const tips = [
  { icon: "🔁", title: "Consistency beats intensity", copy: "1 hour daily beats 8 hours on weekends. Use the 45-day roadmap." },
  // { icon: "⚡", title: "JS fundamentals first", copy: "Closures, event loop, and prototypes appear in 90% of frontend rounds." },
  // { icon: "🏗️", title: "Build, don't just read", copy: "Implement debounce, throttle, and LRU cache from scratch — they ask this." },
  { icon: "🔥", title: "High-freq DSA first", copy: "Sliding window & two pointers cover ~40% of rounds. Start there." },
  { icon: "🎤", title: "Explain as you code", copy: "Interviewers value communication. Think out loud even when stuck." },
  // { icon: "📐", title: "System design matters", copy: "Autocomplete and infinite scroll are the most common frontend SD questions." },
];

export function DashboardPanel({
  isPremium,
  onBuyPremium,
  dsaProgress,
  frontendProgress: _frontendProgress,
  systemDesignProgress,
  solvedDsaCount,
  totalRoadmapDays: _totalRoadmapDays,
  completedSystemDesignCount,
  totalSystemDesignCount,
  companies,
  onOpenDsa,
  onOpenDsaCompany,
  onOpenFrontend: _onOpenFrontend,
  onOpenSystemDesign,
  isLoading,
}: DashboardPanelProps) {
  const [kitsModalOpen, setKitsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="dp-root">
        <div className="dp-kits">
          <div className="dp-kits-head">
            <div className="dp-kits-head-text">
              <Skeleton w={70} h={11} style={{ marginBottom: 10 }} />
              <Skeleton w={220} h={24} />
            </div>
            <Skeleton w={130} h={13} />
          </div>
          <div className="dp-kits-row">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="dp-kit-card" style={{ pointerEvents: "none" }}>
                <Skeleton w={44} h={44} radius={10} />
                <Skeleton w="70%" h={16} />
                <Skeleton w={60} h={12} />
              </div>
            ))}
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
  const featuredCompanies = FEATURED_COMPANY_NAMES
    .map((name) => companies.find((c) => c.name === name))
    .filter((c): c is DsaCompany => Boolean(c));

  const modules = [
    {
      key: "dsa",
      icon: Boxes,
      label: "DSA Practice",
      tag: "Company-wise",
      desc: "LeetCode questions sorted by company, frequency & topic tags.",
      progress: dsaProgress,
      color: "var(--green)",
      colorBg: "var(--green-bg)",
      stats: [
        { val: solvedDsaCount, lbl: "Solved" },
        { val: "730+", lbl: "Questions" },
        { val: "25+", lbl: "Companies" },
      ],
      onClick: onOpenDsa,
      locked: false,
    },
    {
      key: "sd",
      icon: Database,
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
    <>
      <div className="dp-root">

      {/* ── POPULAR COMPANY KITS ── */}
      <div className="dp-kits">
        <div className="dp-kits-head">
          <div className="dp-kits-head-text">
            <div className="dp-kits-eyebrow">Start here</div>
            <h1 className="dp-kits-title">Popular company sheets</h1>
          </div>
          <button type="button" className="dp-kits-viewall" onClick={() => setKitsModalOpen(true)}>
            <span>View all companies</span>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </button>
        </div>
        <div className="dp-kits-row">
          {featuredCompanies.map((c) => (
            <div
              key={c.id}
              className="dp-kit-card"
              style={{ "--kit-accent": c.accent } as React.CSSProperties}
              onClick={() => onOpenDsaCompany(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpenDsaCompany(c.id)}
            >
              <div className="dp-kit-logo">
                <CompanyLogo name={c.name} src={c.logo} alt={c.name} />
              </div>
              <div className="dp-kit-name">{c.name}</div>
              <div className="dp-kit-cta">
                Open 
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10">
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </div>
            </div>
          ))}
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
              <div className="dp-module-icon" style={{ color: m.color }}><m.icon size={20} strokeWidth={1.8} /></div>
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

      <CompanyKitsModal
        open={kitsModalOpen}
        onClose={() => setKitsModalOpen(false)}
        companies={companies}
        onSelectCompany={onOpenDsaCompany}
      />
    </>
  );
}
