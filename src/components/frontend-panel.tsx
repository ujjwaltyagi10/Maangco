import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";

import type {
  FrontendQuestion,
  FrontendQuestionId,
  RoadmapWeek,
} from "@/types/prepdoc";

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

function formatWeeks(dayCount: number) {
  return Math.ceil((dayCount / 7) * 2) / 2;
}

function normalizeTopicTokens(parts: string[]) {
  return parts
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
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

  const categories = useMemo(
    () => [...new Set(questions.map((q) => q.category))] as FrontendQuestion["category"][],
    [questions],
  );

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const q of questions) {
      map[q.category] = (map[q.category] ?? 0) + 1;
    }
    return map;
  }, [questions]);

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

  const roadmapOverlapCount = useMemo(() => {
    const roadmapTokens = new Set(
      roadmapWeeks.flatMap((w) =>
        w.days.flatMap((d) =>
          normalizeTopicTokens([d.title, d.topic, d.summary ?? ""]),
        ),
      ),
    );
    return selectedCategoryQuestions.filter((q) => {
      const tokens = normalizeTopicTokens([q.prompt, q.topic]);
      return tokens.some((t) => roadmapTokens.has(t));
    }).length;
  }, [roadmapWeeks, selectedCategoryQuestions]);

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

  return (
    <div className="frontend-panel">
      {/* Header */}
      <div className="frontend-header">
        <div className="frontend-header-top">
          <div className="frontend-header-left">
            <div className="frontend-icon">🏠</div>
            <div>
              <div className="frontend-title">Frontend Interview Prep</div>
              <div className="frontend-subtitle">45-Day Roadmap</div>
            </div>
          </div>
          <div className="frontend-pills">
            <span className="info-pill">45 days</span>
            <span className="info-pill">{formatWeeks(roadmapDayCount)} weeks</span>
            <span className="info-pill">{roadmapWeeks.length} tracks</span>
            <span className="info-pill">{questions.length} questions</span>
          </div>
        </div>

        <div className="frontend-tabs">
          <button
            type="button"
            className={`fe-tab${activeTab === "roadmap" ? " active" : ""}`}
            onClick={() => setActiveTab("roadmap")}
          >
            🗺 Roadmap
          </button>
          <button
            type="button"
            className={`fe-tab${activeTab === "questions" ? " active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            💬 Interview Questions
            {isPremium ? (
              <span className="fe-tab-count">{questions.length}</span>
            ) : (
              <span className="fe-tab-lock">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                  <rect x="2.5" y="7" width="11" height="8" rx="1.5" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="frontend-content">
        {/* ROADMAP TAB */}
        {activeTab === "roadmap" ? (
          <>
            <div className="track-chips">
              {trackChips.map((chip) => (
                <button key={chip.label} type="button" className="track-chip">
                  <span className="tc-dot" style={{ background: chip.color }} />
                  {chip.label}
                </button>
              ))}
            </div>

            <div>
              {roadmapWeeks.map((week) => {
                const expanded = week.id === expandedWeekId;
                const completedInWeek = week.days.filter((d) =>
                  completedRoadmapDays.includes(d.day),
                ).length;
                const weekProgress = Math.round(
                  (completedInWeek / week.days.length) * 100,
                );
                const trackLabel = weekTrackLabel(week);
                const trackColor = weekTrackColor(trackLabel);

                return (
                  <div key={week.id} className="week-card">
                    <button
                      type="button"
                      className="week-card-header"
                      onClick={() =>
                        setExpandedWeekId((cur) => (cur === week.id ? "" : week.id))
                      }
                    >
                      <div
                        className="week-label-badge"
                        style={{ background: `${trackColor}18`, color: trackColor }}
                      >
                        {week.label}
                      </div>
                      <div className="week-card-info">
                        <div className="week-card-title">{week.title}</div>
                        {week.subtitle ? (
                          <div className="week-card-subtitle">{week.subtitle}</div>
                        ) : null}
                      </div>
                      <div className="week-card-actions">
                        <span
                          className="week-track-tag"
                          style={{ color: trackColor, borderColor: `${trackColor}40`, background: `${trackColor}10` }}
                        >
                          {trackLabel}
                        </span>
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          style={{
                            width: 16,
                            height: 16,
                            color: "var(--text3)",
                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          <path d="M5 8l5 5 5-5" />
                        </svg>
                      </div>
                    </button>

                    {expanded ? (
                      <div className="week-card-body">
                        <div
                          style={{
                            height: 4,
                            borderRadius: 2,
                            background: "var(--border)",
                            overflow: "hidden",
                            marginBottom: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              borderRadius: 2,
                              background: trackColor,
                              width: `${weekProgress}%`,
                              transition: "width 0.4s",
                            }}
                          />
                        </div>
                        <div className="day-grid">
                          {week.days.map((day) => {
                            const isDone = completedRoadmapDays.includes(day.day);
                            return (
                              <button
                                key={day.day}
                                type="button"
                                className={`day-card${isDone ? " done" : ""}`}
                                onClick={() => toggleRoadmapDay(day.day)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: 8,
                                  }}
                                >
                                  <span className="day-num">Day {day.day}</span>
                                  <div className={`day-check${isDone ? " done" : ""}`}>
                                    {isDone ? "✓" : ""}
                                  </div>
                                </div>
                                <div className="day-title">{day.title}</div>
                                {day.summary ? (
                                  <div className="day-summary">{day.summary}</div>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}

        {/* INTERVIEW QUESTIONS TAB */}
        {activeTab === "questions" ? (
          <>
          {!isPremium ? (
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
          <>
            {/* Progress bar */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "0.9rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text1)", fontFamily: '"DM Mono", monospace' }}>
                  {completedQuestionIds.length}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>Done</span>
              </div>
              <div>
                <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text1)", fontFamily: '"DM Mono", monospace' }}>
                  {questions.length}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 6 }}>Total</span>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--muted)",
                    marginBottom: 4,
                    fontFamily: '"DM Mono", monospace',
                  }}
                >
                  <span>Progress</span>
                  <span>
                    {questions.length
                      ? Math.round((completedQuestionIds.length / questions.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: "var(--accent)",
                      width: `${questions.length ? Math.round((completedQuestionIds.length / questions.length) * 100) : 0}%`,
                      transition: "width 0.4s",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="questions-layout">
              {/* Categories Sidebar */}
              <aside className="categories-sidebar">
                <div className="categories-label">Categories</div>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-item${selectedCategory === cat ? " active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="cat-count">{categoryCounts[cat] ?? 0}</span>
                  </button>
                ))}
              </aside>

              {/* Questions Main */}
              <div className="questions-main">
                {/* Category Header */}
                <div className="questions-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="q-cat-dot" />
                        <span className="q-cat-title">{selectedCategory}</span>
                      </div>
                      <div className="q-cat-subtitle" style={{ marginLeft: 18, marginTop: 2 }}>
                        {selectedCategory === "JavaScript"
                          ? "Core JS: closures, async, event loop, prototypes, patterns"
                          : selectedCategory === "React"
                            ? "Component model, hooks, state, and rendering patterns"
                            : selectedCategory === "TypeScript"
                              ? "Type system, generics, utility types"
                              : `${selectedCategory} interview questions`}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input
                        className="qs-search"
                        placeholder="Search questions..."
                        value={searchValue}
                        onChange={(e) => {
                          const v = e.target.value;
                          startTransition(() => setSearchValue(v));
                        }}
                      />
                      {(["All", "Basic", "Mid", "Adv"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`qs-filter-btn${
                            (d === "Mid"
                              ? difficultyFilter === "Intermediate"
                              : d === "Adv"
                                ? difficultyFilter === "Advanced"
                                : difficultyFilter === d)
                              ? " active"
                              : ""
                          }`}
                          onClick={() =>
                            setDifficultyFilter(
                              d === "Mid"
                                ? "Intermediate"
                                : d === "Adv"
                                  ? "Advanced"
                                  : (d as QuestionDifficulty),
                            )
                          }
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="q-stat-tag">{questionStats.total} shown</span>
                    <span className="q-stat-tag">{questionStats.basic} basic</span>
                    <span className="q-stat-tag">{questionStats.intermediate} intermediate</span>
                    <span className="q-stat-tag">{questionStats.advanced} advanced</span>
                    <span className="q-stat-tag">{roadmapOverlapCount} in roadmap</span>
                  </div>
                </div>

                {/* Questions List */}
                <div className="questions-list">
                  {visibleQuestions.map((q, idx) => {
                    const isDone = completedQuestionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`q-list-item${isDone ? " done" : ""}`}
                        onClick={() => toggleQuestionDone(q.id)}
                      >
                        <div className={`q-list-num${isDone ? " done" : ""}`}>{idx + 1}</div>
                        <div className="q-list-content">
                          <div className="q-list-text">{q.prompt}</div>
                          <div className="q-list-tags">
                            <span
                              className={`q-tag ${q.difficulty.toLowerCase()}`}
                            >
                              {q.difficulty.toLowerCase()}
                            </span>
                            <span className="q-tag topic">{q.topic}</span>
                          </div>
                        </div>
                        <div
                          className={`q-list-check${isDone ? " done" : ""}`}
                          role="checkbox"
                          aria-checked={isDone}
                          onClick={(e) => { e.stopPropagation(); toggleQuestionDone(q.id); }}
                        />
                      </div>
                    );
                  })}
                  {visibleQuestions.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem 1rem",
                        color: "var(--muted)",
                        fontSize: 14,
                      }}
                    >
                      No questions match the current filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
          )}
          </>
        ) : null}
      </div>
    </div>
  );
}
