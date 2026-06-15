import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import type {
  FrontendQuestion,
  FrontendQuestionId,
  RoadmapWeek,
} from "@/types/maangco";

interface FrontendPanelProps {
  questions: FrontendQuestion[];
  roadmapWeeks: RoadmapWeek[];
  completedQuestionIds: FrontendQuestionId[];
  completedRoadmapDays: number[];
  onCompletedQuestionIdsChange: Dispatch<SetStateAction<FrontendQuestionId[]>>;
  onCompletedRoadmapDaysChange: Dispatch<SetStateAction<number[]>>;
  isPremium?: boolean;
  onBuyPremium?: () => void;
}

type FrontendTab = "roadmap" | "questions";
type QuestionDifficulty = "All" | "Basic" | "Intermediate" | "Advanced";

const trackChips: { label: string; color: string }[] = [
  { label: "JS Core", color: "#d4a53c" },
  { label: "React", color: "#3b82f6" },
  { label: "Redux", color: "#7c3aed" },
  { label: "TypeScript", color: "#0891b2" },
  { label: "Performance", color: "#16a34a" },
  { label: "Web APIs", color: "#0891b2" },
  { label: "Testing", color: "#dc2626" },
  { label: "DSA / Coding", color: "#6b7280" },
];

function weekTrackLabel(week: RoadmapWeek): string {
  const t = week.title.toLowerCase();
  if (t.includes("react")) return "React";
  if (t.includes("redux")) return "Redux";
  if (t.includes("typescript")) return "TypeScript";
  if (t.includes("performance")) return "Performance";
  if (t.includes("dom")) return "Web APIs";
  if (t.includes("testing")) return "Testing";
  return "JS Core";
}

function weekTrackColor(label: string): string {
  const chip = trackChips.find((c) => c.label === label);
  return chip?.color ?? "#6b7280";
}

const CAT_PALETTE = [
  "#3b82f6","#7c3aed","#0891b2","#16a34a","#f59e0b",
  "#ec4899","#10b981","#6366f1","#dc2626","#ea580c",
  "#0e7490","#7e22ce","#059669","#b45309","#be185d",
];

function catColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return CAT_PALETTE[Math.abs(h) % CAT_PALETTE.length];
}

export function FrontendPanel({
  questions,
  roadmapWeeks,
  completedQuestionIds,
  completedRoadmapDays,
  onCompletedQuestionIdsChange,
  onCompletedRoadmapDaysChange,
  isPremium = false,
  onBuyPremium,
}: FrontendPanelProps) {
  const [activeTab, setActiveTab] = useState<FrontendTab>("roadmap");
  const [searchValue, setSearchValue] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty>("All");
  const [selectedCategory, setSelectedCategory] = useState<FrontendQuestion["category"]>("JavaScript");
  const [expandedWeekId, setExpandedWeekId] = useState(roadmapWeeks[0]?.id ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const tabMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
      if (tabMenuRef.current && !tabMenuRef.current.contains(e.target as Node)) {
        setTabMenuOpen(false);
      }
    }
    if (filtersOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filtersOpen]);

  const categories = useMemo(
    () => [...new Set(questions.map((q) => q.category))] as FrontendQuestion["category"][],
    [questions],
  );

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) map[q.category] = (map[q.category] ?? 0) + 1;
    return map;
  }, [questions]);

  const categoryDoneCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) {
      if (completedQuestionIds.includes(q.id))
        map[q.category] = (map[q.category] ?? 0) + 1;
    }
    return map;
  }, [questions, completedQuestionIds]);

  const deferredSearch = useDeferredValue(searchValue);

  const selectedCategoryQuestions = useMemo(
    () => questions.filter((q) => q.category === selectedCategory),
    [questions, selectedCategory],
  );

  const visibleQuestions = useMemo(() => {
    const norm = deferredSearch.trim().toLowerCase();
    return selectedCategoryQuestions.filter((q) => {
      const matchesDiff = difficultyFilter === "All" || q.difficulty === difficultyFilter;
      const matchesSearch =
        norm.length === 0 ||
        q.prompt.toLowerCase().includes(norm) ||
        q.topic.toLowerCase().includes(norm);
      return matchesDiff && matchesSearch;
    });
  }, [deferredSearch, difficultyFilter, selectedCategoryQuestions]);

  const roadmapDayCount = roadmapWeeks.reduce((t, w) => t + w.days.length, 0);

  const questionStats = useMemo(() => ({
    total: selectedCategoryQuestions.length,
    basic: selectedCategoryQuestions.filter((q) => q.difficulty === "Basic").length,
    intermediate: selectedCategoryQuestions.filter((q) => q.difficulty === "Intermediate").length,
    advanced: selectedCategoryQuestions.filter((q) => q.difficulty === "Advanced").length,
  }), [selectedCategoryQuestions]);

  const toggleQuestionDone = (id: FrontendQuestionId) => {
    onCompletedQuestionIdsChange((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const toggleRoadmapDay = (day: number) => {
    onCompletedRoadmapDaysChange((cur) =>
      cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day],
    );
  };

  // Mini arc ring — roadmap progress
  const doneDays = completedRoadmapDays.length;
  const roadmapPct = roadmapDayCount > 0 ? Math.round((doneDays / roadmapDayCount) * 100) : 0;
  const feArcR = 22;
  const feArcCirc = 2 * Math.PI * feArcR;
  const feArcLen = feArcCirc * 0.75;
  const feArcGap = feArcCirc - feArcLen;
  const feArcFill = feArcLen * (doneDays / Math.max(1, roadmapDayCount));

  const doneQuestions = completedQuestionIds.length;
  const questionsPct = questions.length > 0 ? Math.round((doneQuestions / questions.length) * 100) : 0;
  const qArcFill = feArcLen * (doneQuestions / Math.max(1, questions.length));

  const arcFill = activeTab === "questions" ? qArcFill : feArcFill;
  const arcPct = activeTab === "questions" ? questionsPct : roadmapPct;
  const arcDone = activeTab === "questions" ? doneQuestions : doneDays;
  const arcTotal = activeTab === "questions" ? questions.length : roadmapDayCount;
  const arcLabel = activeTab === "questions" ? "✓ Studied" : "✓ Days";

  return (
    <div className="frontend-panel">

      {/* ── Left: header + content ── */}
      <div className="fe-main">

      {/* Header (same pattern as DSA/SD) */}
      <div className="dsa-progress-header">
        <div className="dsa-header-identity">
          <div className="dsa-header-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="dsa-header-title-group">
            <h2 className="dsa-header-title">Frontend Prep</h2>
            <span className="dsa-header-sub">45-day roadmap · {roadmapWeeks.length} tracks · {questions.length} interview questions</span>
          </div>
        </div>

        <div className="dsa-progress-card">
          <div className="dsa-mini-ring">
            <svg viewBox="0 0 56 56" className="dsa-mini-ring-svg">
              <circle cx="28" cy="28" r={feArcR} fill="none" stroke="var(--border2)" strokeWidth="3"
                strokeDasharray={`${feArcLen} ${feArcGap}`} strokeLinecap="round"
                transform="rotate(135, 28, 28)" />
              <circle cx="28" cy="28" r={feArcR} fill="none" stroke="var(--accent)" strokeWidth="3"
                strokeDasharray={`${arcFill} ${feArcCirc - arcFill}`} strokeLinecap="round"
                transform="rotate(135, 28, 28)"
                style={{ transition: "stroke-dasharray 0.5s ease" }} />
            </svg>
            <div className="dsa-mini-ring-label">{arcPct}%</div>
          </div>
          <div className="dsa-progress-info">
            <span className="dsa-progress-count">
              {arcDone}<span className="dsa-progress-total">/{arcTotal}</span>
            </span>
            <span className="dsa-progress-label">{arcLabel}</span>
          </div>
          <div className="dsa-progress-sep" />
          <div className="dsa-diff-stats">
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--text3)" }}>Tracks</span>
              <span className="dsa-diff-stat-val">{roadmapWeeks.length}</span>
            </div>
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--text3)" }}>Days</span>
              <span className="dsa-diff-stat-val">{roadmapDayCount}</span>
            </div>
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--text3)" }}>Qs</span>
              <span className="dsa-diff-stat-val">{questions.length}</span>
            </div>
          </div>
        </div>

        <div className="dsa-header-bottom">
          {/* Desktop tab strip — hidden on mobile, replaced by fe-tab-menu */}
          <div className={`fe-tab-strip${activeTab === "questions" ? " fe-tab-strip--hide-mobile" : ""}`}>
            <button
              type="button"
              className={`fe-tab${activeTab === "roadmap" ? " active" : ""}`}
              onClick={() => setActiveTab("roadmap")}
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="2" width="14" height="12" rx="2" />
                <path d="M1 6h14" />
                <path d="M5 10h6" />
              </svg>
              <span className="fe-tab-label">Roadmap</span>
            </button>
            <button
              type="button"
              className={`fe-tab${activeTab === "questions" ? " active" : ""}`}
              onClick={() => setActiveTab("questions")}
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                <path d="M4 6h8M4 9h5" />
              </svg>
              <span className="fe-tab-label">Interview Questions</span>
              {isPremium && <span className="fe-tab-count">{questions.length}</span>}
            </button>
          </div>

          {/* Search + filter dropdown — questions tab only */}
          {activeTab === "questions" && isPremium && (
            <>
              <div className="dsa-search-wrap">
                <svg className="dsa-search-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="6.5" cy="6.5" r="5" />
                  <path d="M10.5 10.5L14 14" />
                </svg>
                <input
                  className="dsa-search-input"
                  type="text"
                  placeholder="Search questions..."
                  value={searchValue}
                  onChange={(e) => { startTransition(() => setSearchValue(e.target.value)); }}
                />
              </div>
              <div className="dsa-filter-wrap" ref={filtersRef}>
                <button
                  type="button"
                  className={`dsa-filter-btn${filtersOpen ? " open" : ""}${difficultyFilter !== "All" ? " has-active" : ""}`}
                  onClick={() => setFiltersOpen((o) => !o)}
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M2 4h12M4 8h8M6 12h4" />
                  </svg>
                  <span className="filter-btn-label">Filters</span>
                  {difficultyFilter !== "All" && <span className="dsa-filter-badge">1</span>}
                  <svg className="filter-btn-chevron" viewBox="0 0 12 12" width="10" height="10" fill="currentColor" style={{ marginLeft: 2, opacity: 0.6, transform: filtersOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M2 4l4 4 4-4H2z" />
                  </svg>
                </button>
                {filtersOpen && (
                  <div className="dsa-filter-panel">
                    <div className="dsa-filter-row">
                      <span className="dsa-filter-label">Difficulty</span>
                      <select
                        className="sort-select dsa-filter-select"
                        value={difficultyFilter}
                        onChange={(e) => {
                          startTransition(() => setDifficultyFilter(e.target.value as QuestionDifficulty));
                        }}
                      >
                        <option value="All">All</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile tab menu — questions tab only, shows after search/filter */}
          {activeTab === "questions" && <div className="fe-tab-menu" ref={tabMenuRef}>
            <button
              type="button"
              className={`fe-tab-menu-btn${tabMenuOpen ? " open" : ""}`}
              onClick={() => setTabMenuOpen((o) => !o)}
              aria-label="Switch view"
            >
              <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </button>
            {tabMenuOpen && (
              <div className="fe-tab-dropdown">
                <button
                  type="button"
                  className={`fe-tab-option${activeTab === "roadmap" ? " active" : ""}`}
                  onClick={() => { setActiveTab("roadmap"); setTabMenuOpen(false); }}
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="2" width="14" height="12" rx="2" />
                    <path d="M1 6h14" />
                    <path d="M5 10h6" />
                  </svg>
                  Roadmap
                </button>
                <button
                  type="button"
                  className={`fe-tab-option${activeTab === "questions" ? " active" : ""}`}
                  onClick={() => { setActiveTab("questions"); setTabMenuOpen(false); }}
                >
                  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
                    <path d="M4 6h8M4 9h5" />
                  </svg>
                  Interview Questions
                  {isPremium && <span className="fe-tab-count">{questions.length}</span>}
                </button>
              </div>
            )}
          </div>}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="frontend-content">

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div className="fe-roadmap">
            {roadmapWeeks.map((week) => {
              const expanded = week.id === expandedWeekId;
              const completedInWeek = week.days.filter((d) => completedRoadmapDays.includes(d.day)).length;
              const weekProgress = Math.round((completedInWeek / week.days.length) * 100);
              const trackLabel = weekTrackLabel(week);
              const trackColor = weekTrackColor(trackLabel);

              return (
                <div key={week.id} className="week-card">
                  <button
                    type="button"
                    className="week-card-header"
                    onClick={() => setExpandedWeekId((cur) => (cur === week.id ? "" : week.id))}
                  >
                    <div
                      className="week-label-badge"
                      style={{ background: `${trackColor}18`, color: trackColor }}
                    >
                      {week.label}
                    </div>
                    <div className="week-card-info">
                      <div className="week-card-title">{week.title}</div>
                      {week.subtitle && <div className="week-card-subtitle">{week.subtitle}</div>}
                    </div>
                    <div className="week-card-actions">
                      <span className="week-prog-count">{completedInWeek}/{week.days.length}</span>
                      <span
                        className="week-track-tag"
                        style={{ color: trackColor, borderColor: `${trackColor}40`, background: `${trackColor}10` }}
                      >
                        {trackLabel}
                      </span>
                      <svg
                        viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
                        style={{ width: 15, height: 15, color: "var(--text3)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                      >
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </div>
                  </button>

                  {expanded && (
                    <div className="week-card-body">
                      <div className="week-prog-bar">
                        <div className="week-prog-fill" style={{ width: `${weekProgress}%`, background: trackColor }} />
                      </div>
                      <div className="fe-day-list">
                        {week.days.map((day) => {
                          const isDone = completedRoadmapDays.includes(day.day);
                          return (
                            <button
                              key={day.day}
                              type="button"
                              className={`fe-day-row${isDone ? " done" : ""}`}
                              onClick={() => toggleRoadmapDay(day.day)}
                            >
                              <div className={`q-cb${isDone ? " checked" : ""}`} />
                              <span className="fe-day-num">Day {day.day}</span>
                              <div className="fe-day-info">
                                <span className="fe-day-title">{day.title}</span>
                                {day.summary && <span className="fe-day-summary">{day.summary}</span>}
                              </div>
                              {day.topic && (
                                <span className="fe-day-topic">{day.topic}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === "questions" && (
          !isPremium ? (
            <div className="fe-questions-gate">
              <div className="dsa-gate-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8l4 6 6-9 6 9 4-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z" />
                </svg>
              </div>
              <div className="fe-gate-title">Interview Questions</div>
              <div className="fe-gate-sub">275 curated questions across JS, React, TypeScript, Testing &amp; more — unlock with Premium.</div>
              <button type="button" className="dsa-gate-btn fe-gate-btn" onClick={onBuyPremium}>
                Upgrade to Premium
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="q-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }} />
                    <th>#</th>
                    <th>Question</th>
                    <th>Difficulty</th>
                    <th>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((q, idx) => {
                    const isDone = completedQuestionIds.includes(q.id);
                    const diffBg =
                      q.difficulty === "Basic" ? "var(--easy-bg)" :
                      q.difficulty === "Intermediate" ? "rgba(217,119,6,0.12)" :
                      "var(--hard-bg)";
                    const diffText =
                      q.difficulty === "Basic" ? "var(--easy)" :
                      q.difficulty === "Intermediate" ? "#d97706" :
                      "var(--hard)";
                    return (
                      <tr
                        key={q.id}
                        className={`q-row${isDone ? " solved" : ""}`}
                        onClick={() => toggleQuestionDone(q.id)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <div
                            className={`q-cb${isDone ? " checked" : ""}`}
                            role="checkbox"
                            aria-checked={isDone}
                            tabIndex={0}
                            onClick={() => toggleQuestionDone(q.id)}
                            onKeyDown={(e) => e.key === " " && toggleQuestionDone(q.id)}
                          />
                        </td>
                        <td className="q-num">{idx + 1}</td>
                        <td className="q-title">{q.prompt}</td>
                        <td>
                          <span className="diff-badge" style={{ background: diffBg, color: diffText }}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td>
                          <span className="diff-badge" style={{ background: "var(--surface3)", color: "var(--text3)", border: "1px solid var(--border)" }}>
                            {q.topic}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {visibleQuestions.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", fontSize: 14 }}>
                        No questions match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
      {/* end .fe-main */}
      </div>

      {/* ── Right: Category sidebar (panel-level, same as SD/DSA) ── */}
      {activeTab === "questions" && isPremium && (
        <aside className={`fe-cat-sidebar${sidebarCollapsed ? " fe-cat-sidebar--collapsed" : ""}`}>
          {sidebarCollapsed ? (
            /* Collapsed: icon pills strip */
            <>
              <div className="sd-cosb-collapse-toggle">
                <button type="button" className="sd-cosb-toggle-btn" onClick={() => setSidebarCollapsed(false)} aria-label="Expand categories">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                    <path d="M6 3l-4 5 4 5M10 3l4 5-4 5" />
                  </svg>
                </button>
              </div>
              <div className="sd-cosb-initials-strip">
                {categories.map((cat) => {
                  const color = catColor(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`sd-cosb-initial-pill${selectedCategory === cat ? " active" : ""}`}
                      title={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{ background: selectedCategory === cat ? color : undefined, color: selectedCategory === cat ? "#fff" : color }}
                    >
                      {cat[0].toUpperCase()}
                    </button>
                  );
                })}
              </div>
              <div className="sd-cosb-collapsed-footer">
                <div className="dsa-collapsed-ratio">
                  {doneQuestions}<span>/{questions.length}</span>
                </div>
              </div>
            </>
          ) : (
            /* Expanded */
            <>
              <div className="sd-cosb-head">
                <div className="sd-cosb-head-row">
                  <div>
                    <div className="sd-cosb-title">Categories</div>
                    <div className="sd-cosb-sub">{categories.length} categories</div>
                  </div>
                  <button type="button" className="sd-cosb-toggle-btn" onClick={() => setSidebarCollapsed(true)} aria-label="Collapse categories">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                      <path d="M10 3l4 5-4 5M6 3L2 8l4 5" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="sd-cosb-list">
                {categories.map((cat) => {
                  const color = catColor(cat);
                  const total = categoryCounts[cat] ?? 0;
                  const done = categoryDoneCounts[cat] ?? 0;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`sd-cosb-item${selectedCategory === cat ? " active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <div className="sd-cosb-avatar" style={{ background: color + "22", color }}>
                        {cat[0].toUpperCase()}
                      </div>
                      <div className="sd-cosb-info">
                        <div className="sd-cosb-name">{cat}</div>
                      </div>
                      <div className="sd-cosb-count">{done}/{total}</div>
                    </button>
                  );
                })}
              </div>

              <div className="sd-cosb-footer">
                <div className="gs-label">Overall progress</div>
                <div className="gs-bar">
                  <div className="gs-fill" style={{ width: `${questions.length ? Math.round((doneQuestions / questions.length) * 100) : 0}%` }} />
                </div>
                <div className="gs-nums">
                  <span>{doneQuestions} solved</span>
                  <span>{questions.length} total</span>
                </div>
              </div>
            </>
          )}
        </aside>
      )}

    </div>
  );
}
