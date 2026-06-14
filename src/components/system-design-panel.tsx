import type { Dispatch, SetStateAction } from "react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SystemDesignCategory,
  SystemDesignFrequency,
  SystemDesignLevel,
  SystemDesignQuestion,
  SystemDesignQuestionId,
} from "@/types/maangco";

interface SystemDesignPanelProps {
  questions: SystemDesignQuestion[];
  completedIds: SystemDesignQuestionId[];
  onCompletedIdsChange: Dispatch<SetStateAction<SystemDesignQuestionId[]>>;
}

const ALL_CAT = "All";
const CATEGORIES: (typeof ALL_CAT | SystemDesignCategory)[] = [
  ALL_CAT,
  "Infrastructure",
  "Distributed Systems",
  "Messaging & Streaming",
  "Storage & Data",
  "Product & Social",
  "Search & Geo",
  "Finance & Payments",
  "AI & ML Systems",
];

const FREQ_ORDER: Record<SystemDesignFrequency, number> = { High: 0, Medium: 1, Low: 2 };

const LEVEL_COLORS: Record<SystemDesignLevel, { bg: string; text: string }> = {
  HLD: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  LLD: { bg: "rgba(168,85,247,0.12)", text: "#a855f7" },
  Both: { bg: "rgba(20,184,166,0.12)", text: "#14b8a6" },
};

const FREQ_COLORS: Record<SystemDesignFrequency, { bg: string; text: string }> = {
  High: { bg: "rgba(22,163,74,0.12)", text: "#16a34a" },
  Medium: { bg: "rgba(217,119,6,0.12)", text: "#d97706" },
  Low: { bg: "rgba(107,114,128,0.12)", text: "#6b7280" },
};

const CAT_COLORS: Record<SystemDesignCategory, string> = {
  Infrastructure: "#3b82f6",
  "Distributed Systems": "#7c3aed",
  "Messaging & Streaming": "#0891b2",
  "Storage & Data": "#16a34a",
  "Product & Social": "#f59e0b",
  "Search & Geo": "#ec4899",
  "Finance & Payments": "#10b981",
  "AI & ML Systems": "#6366f1",
};

export function SystemDesignPanel({
  questions,
  completedIds,
  onCompletedIdsChange,
}: SystemDesignPanelProps) {
  const [selectedCat, setSelectedCat] = useState<typeof ALL_CAT | SystemDesignCategory>(ALL_CAT);
  const [freqFilter, setFreqFilter] = useState<"All" | SystemDesignFrequency>("All");
  const [levelFilter, setLevelFilter] = useState<"All" | "HLD" | "LLD" | "Both">("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const pageSize = 50;

  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }
    if (filtersOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    let result = questions;
    if (selectedCat !== ALL_CAT) result = result.filter((q) => q.category === selectedCat);
    if (freqFilter !== "All") result = result.filter((q) => q.frequency === freqFilter);
    if (levelFilter !== "All") result = result.filter((q) => q.designLevel === levelFilter || q.designLevel === "Both");
    if (deferredSearch.trim()) {
      const term = deferredSearch.trim().toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(term) ||
          q.companies.some((c) => c.toLowerCase().includes(term)),
      );
    }
    return [...result].sort(
      (a, b) => FREQ_ORDER[a.frequency] - FREQ_ORDER[b.frequency] || a.number - b.number,
    );
  }, [questions, selectedCat, freqFilter, levelFilter, deferredSearch, completedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Frequency breakdown counts
  const freqCounts = useMemo(() => {
    return questions.reduce(
      (acc, q) => {
        const done = completedIds.includes(q.id);
        if (q.frequency === "High") { acc.high++; if (done) acc.highDone++; }
        if (q.frequency === "Medium") { acc.med++; if (done) acc.medDone++; }
        if (q.frequency === "Low") { acc.low++; if (done) acc.lowDone++; }
        return acc;
      },
      { high: 0, med: 0, low: 0, highDone: 0, medDone: 0, lowDone: 0 },
    );
  }, [questions, completedIds]);

  // Filtered progress (respects all active filters)
  const visibleDoneCount = filtered.filter((q) => completedIds.includes(q.id)).length;
  const visibleTotal = filtered.length;
  const visiblePct = visibleTotal > 0 ? Math.round((visibleDoneCount / visibleTotal) * 100) : 0;

  const activeFilterCount = [
    freqFilter !== "All",
    selectedCat !== ALL_CAT,
    levelFilter !== "All",
  ].filter(Boolean).length;

  // Mini arc ring (56×56 viewBox, r=22)
  const sdArcR = 22;
  const sdArcCirc = 2 * Math.PI * sdArcR;
  const sdArcLen = sdArcCirc * 0.75;
  const sdArcGap = sdArcCirc - sdArcLen;
  const sdArcFill = sdArcLen * (visibleDoneCount / Math.max(1, visibleTotal));

  function toggleComplete(id: SystemDesignQuestionId) {
    startTransition(() => {
      onCompletedIdsChange((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    });
  }

  function goPage(n: number) {
    setCurrentPage(Math.max(1, Math.min(totalPages, n)));
  }

  return (
    <div className="sd-panel">

      {/* ── HEADER — same grid layout as DSA panel ── */}
      <div className="dsa-progress-header">

        {/* Cell 1: Identity */}
        <div className="dsa-header-identity">
          <div className="dsa-header-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div className="dsa-header-title-group">
            <h2 className="dsa-header-title">System Design</h2>
            <span className="dsa-header-sub">150 questions sourced from Glassdoor, Blind &amp; Exponent (2021–2026)</span>
          </div>
        </div>

        {/* Cell 2: Progress strip */}
        <div className="dsa-progress-card">
          <div className="dsa-mini-ring">
            <svg viewBox="0 0 56 56" className="dsa-mini-ring-svg">
              <circle cx="28" cy="28" r={sdArcR} fill="none" stroke="var(--border2)" strokeWidth="3"
                strokeDasharray={`${sdArcLen} ${sdArcGap}`} strokeLinecap="round"
                transform="rotate(135, 28, 28)" />
              <circle cx="28" cy="28" r={sdArcR} fill="none" stroke="var(--accent)" strokeWidth="3"
                strokeDasharray={`${sdArcFill} ${sdArcCirc - sdArcFill}`} strokeLinecap="round"
                transform="rotate(135, 28, 28)"
                style={{ transition: "stroke-dasharray 0.5s ease" }} />
            </svg>
            <div className="dsa-mini-ring-label">{visiblePct}%</div>
          </div>
          <div className="dsa-progress-info">
            <span className="dsa-progress-count">
              {visibleDoneCount}<span className="dsa-progress-total">/{visibleTotal}</span>
            </span>
            <span className="dsa-progress-label">✓ Studied</span>
          </div>
          <div className="dsa-progress-sep" />
          <div className="dsa-diff-stats">
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--easy)" }}>High</span>
              <span className="dsa-diff-stat-val">{freqCounts.highDone}/{freqCounts.high}</span>
            </div>
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--med)" }}>Med.</span>
              <span className="dsa-diff-stat-val">{freqCounts.medDone}/{freqCounts.med}</span>
            </div>
            <div className="dsa-diff-stat">
              <span className="dsa-diff-stat-label" style={{ color: "var(--muted)" }}>Low</span>
              <span className="dsa-diff-stat-val">{freqCounts.lowDone}/{freqCounts.low}</span>
            </div>
          </div>
        </div>

        {/* Cell 3: Search + Filters */}
        <div className="dsa-header-bottom">
          <div className="dsa-search-wrap">
            <svg className="dsa-search-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="5" />
              <path d="M10.5 10.5L14 14" />
            </svg>
            <input
              className="dsa-search-input"
              type="text"
              placeholder="Search questions or companies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="dsa-filter-wrap" ref={filtersRef}>
            <button
              type="button"
              className={`dsa-filter-btn${filtersOpen ? " open" : ""}${activeFilterCount > 0 ? " has-active" : ""}`}
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 4h12M4 8h8M6 12h4" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="dsa-filter-badge">{activeFilterCount}</span>
              )}
              <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor" style={{ marginLeft: 2, opacity: 0.6, transform: filtersOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                <path d="M2 4l4 4 4-4H2z" />
              </svg>
            </button>
            {filtersOpen && (
              <div className="dsa-filter-panel">
                <div className="dsa-filter-row">
                  <span className="dsa-filter-label">Frequency</span>
                  <select className="sort-select dsa-filter-select" value={freqFilter}
                    onChange={(e) => { startTransition(() => { setFreqFilter(e.target.value as "All" | SystemDesignFrequency); setCurrentPage(1); }); }}>
                    <option value="All">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="dsa-filter-row">
                  <span className="dsa-filter-label">Category</span>
                  <select className="sort-select dsa-filter-select" value={selectedCat}
                    onChange={(e) => { startTransition(() => { setSelectedCat(e.target.value as typeof ALL_CAT | SystemDesignCategory); setCurrentPage(1); }); }}>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="dsa-filter-row">
                  <span className="dsa-filter-label">Level</span>
                  <select className="sort-select dsa-filter-select" value={levelFilter}
                    onChange={(e) => { startTransition(() => { setLevelFilter(e.target.value as "All" | "HLD" | "LLD" | "Both"); setCurrentPage(1); }); }}>
                    <option value="All">All levels</option>
                    <option value="HLD">HLD only</option>
                    <option value="LLD">LLD only</option>
                    <option value="Both">Both (HLD + LLD)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      {/* end header */}

      {/* ── MAIN: Scrollable table ── */}
      <div className="sd-main">
        <div className="table-wrap">
          <table className="q-table">
            <thead>
              <tr>
                <th style={{ width: 36 }} />
                <th>#</th>
                <th>Title</th>
                <th>Frequency</th>
                <th>Design Level</th>
                <th>Category</th>
                <th>Companies</th>
                <th>Timeframe</th>
                <th>Resource</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((q) => {
                const done = completedIds.includes(q.id);
                const fc = FREQ_COLORS[q.frequency];
                const lc = LEVEL_COLORS[q.designLevel];
                return (
                  <tr
                    key={q.id}
                    className={`q-row${done ? " solved" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => window.open(q.articleUrl, "_blank", "noopener,noreferrer")}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <div
                        className={`q-cb${done ? " checked" : ""}`}
                        role="checkbox"
                        aria-checked={done}
                        tabIndex={0}
                        onClick={() => toggleComplete(q.id)}
                        onKeyDown={(e) => e.key === " " && toggleComplete(q.id)}
                      />
                    </td>
                    <td className="q-num">{q.number}</td>
                    <td className="q-title">{q.title}</td>
                    <td>
                      <span className="diff-badge" style={{ background: fc.bg, color: fc.text }}>
                        {q.frequency}
                      </span>
                    </td>
                    <td>
                      <span className="diff-badge" style={{ background: lc.bg, color: lc.text }}>
                        {q.designLevel}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span
                        className="diff-badge"
                        style={{
                          background: CAT_COLORS[q.category] + "18",
                          color: CAT_COLORS[q.category],
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.category}
                      </span>
                    </td>
                    <td>
                      <div className="tag-list">
                        {q.companies.map((c) => (
                          <span key={c} className="tag">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="q-num">{q.timeframe}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <a
                        href={q.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "var(--text2)", textDecoration: "none", fontSize: 13 }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
                      >
                        📖 Read
                      </a>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", fontSize: 14 }}
                  >
                    No questions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="page-btn"
              disabled={safePage <= 1}
              onClick={() => goPage(safePage - 1)}
            >
              ← Prev
            </button>
            <div className="page-info">
              Page {safePage} of {totalPages}
              <span className="page-count">· {filtered.length} questions</span>
            </div>
            <button
              type="button"
              className="page-btn"
              disabled={safePage >= totalPages}
              onClick={() => goPage(safePage + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
