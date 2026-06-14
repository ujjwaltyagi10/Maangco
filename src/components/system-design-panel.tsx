import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";

import type {
  SystemDesignCategory,
  SystemDesignFrequency,
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
  const [showStudiedOnly, setShowStudiedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const deferredSearch = useDeferredValue(search);

  const filtered = useMemo(() => {
    let result = questions;
    if (selectedCat !== ALL_CAT) result = result.filter((q) => q.category === selectedCat);
    if (freqFilter !== "All") result = result.filter((q) => q.frequency === freqFilter);
    if (showStudiedOnly) result = result.filter((q) => completedIds.includes(q.id));
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
  }, [questions, selectedCat, freqFilter, showStudiedOnly, deferredSearch, completedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const highCount = questions.filter((q) => q.frequency === "High").length;
  const completedHighCount = questions.filter(
    (q) => q.frequency === "High" && completedIds.includes(q.id),
  ).length;

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
      {/* ── TOP: Filters (non-scrolling) ── */}
      <div className="sd-top">
        {/* Header row */}
        <div className="sd-header">
          <div className="sd-header-text">
            <h1 className="sd-title">System Design</h1>
            <p className="sd-subtitle">
              150 questions with company tags sourced from Glassdoor, Blind &amp; Exponent (2021–2026)
            </p>
          </div>
          <div className="sd-stats-row">
            <div className="stat-chip s">
              <div className="n">{completedIds.length}</div>
              <div className="l">Studied</div>
            </div>
            <div className="stat-chip e">
              <div className="n">{completedHighCount}</div>
              <div className="l">High done</div>
            </div>
            <div className="stat-chip m">
              <div className="n">{highCount}</div>
              <div className="l">High freq</div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sd-filter-bar">
          <input
            className="sd-filter-search"
            type="text"
            placeholder="Search questions or companies..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <div className="sd-filter-selects">
            <div className="sd-select-wrap">
              <label className="sd-select-label">Frequency</label>
              <select
                className="sort-select sd-select"
                value={freqFilter}
                onChange={(e) => {
                  startTransition(() => {
                    setFreqFilter(e.target.value as "All" | SystemDesignFrequency);
                    setCurrentPage(1);
                  });
                }}
              >
                <option value="All">All frequencies</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="sd-select-wrap">
              <label className="sd-select-label">Category</label>
              <select
                className="sort-select sd-select"
                value={selectedCat}
                onChange={(e) => {
                  startTransition(() => {
                    setSelectedCat(e.target.value as typeof ALL_CAT | SystemDesignCategory);
                    setCurrentPage(1);
                  });
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={`sd-studied-btn${showStudiedOnly ? " active" : ""}`}
              onClick={() => { setShowStudiedOnly((v) => !v); setCurrentPage(1); }}
            >
              {showStudiedOnly ? "★" : "☆"} Studied only
            </button>
          </div>
        </div>
      </div>

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
                <th>Category</th>
                <th>Companies</th>
                <th>Timeframe</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((q) => {
                const done = completedIds.includes(q.id);
                const fc = FREQ_COLORS[q.frequency];
                return (
                  <tr key={q.id} className={`q-row${done ? " solved" : ""}`}>
                    <td>
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
                      <span
                        className="diff-badge"
                        style={{ background: fc.bg, color: fc.text }}
                      >
                        {q.frequency}
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
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
