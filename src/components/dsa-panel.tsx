import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";

import type { DsaCompany, DsaQuestion, QuestionId } from "@/types/prepdoc";

interface DsaPanelProps {
  companies: DsaCompany[];
  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  onSolvedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onBookmarkedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
}

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard";
type SortMode = "freq" | "num" | "diff" | "title";

function freqToDots(freq: number): number {
  if (freq >= 90) return 5;
  if (freq >= 75) return 4;
  if (freq >= 60) return 3;
  if (freq >= 40) return 2;
  return 1;
}

export function DsaPanel({
  companies,
  solvedIds,
  bookmarkedIds,
  onSolvedIdsChange,
  onBookmarkedIdsChange,
}: DsaPanelProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    companies[0]?.id ?? "",
  );
  const [companySearch, setCompanySearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("freq");

  const deferredCompanySearch = useDeferredValue(companySearch);

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId) ?? companies[0],
    [companies, selectedCompanyId],
  );

  const visibleCompanies = useMemo(() => {
    const q = deferredCompanySearch.trim().toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q));
  }, [companies, deferredCompanySearch]);

  const totalQuestionCount = useMemo(
    () => companies.reduce((t, c) => t + c.questions.length, 0),
    [companies],
  );

  const totalSolvedCount = solvedIds.length;

  const visibleQuestions = useMemo(() => {
    if (!selectedCompany) return [];

    const filtered = selectedCompany.questions.filter((q) => {
      const matchesDiff = difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesBm = !showBookmarkedOnly || bookmarkedIds.includes(q.id);
      const matchesUnsolved = !showUnsolvedOnly || !solvedIds.includes(q.id);
      return matchesDiff && matchesBm && matchesUnsolved;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "title") return a.title.localeCompare(b.title);
      if (sortMode === "diff") {
        const rank = { Easy: 0, Medium: 1, Hard: 2 } satisfies Record<DsaQuestion["difficulty"], number>;
        return rank[a.difficulty] - rank[b.difficulty];
      }
      if (sortMode === "num") return a.number - b.number;
      return b.frequency - a.frequency || a.number - b.number;
    });
  }, [bookmarkedIds, difficultyFilter, selectedCompany, showBookmarkedOnly, showUnsolvedOnly, solvedIds, sortMode]);

  const selectedSolvedCount = selectedCompany?.questions.filter((q) => solvedIds.includes(q.id)).length ?? 0;
  const selectedProgress = selectedCompany
    ? Math.round((selectedSolvedCount / selectedCompany.questions.length) * 100)
    : 0;

  const difficultyCounts = useMemo(() => {
    if (!selectedCompany) return { easy: 0, medium: 0, hard: 0 };
    return selectedCompany.questions.reduce(
      (acc, q) => {
        if (q.difficulty === "Easy") acc.easy++;
        if (q.difficulty === "Medium") acc.medium++;
        if (q.difficulty === "Hard") acc.hard++;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 },
    );
  }, [selectedCompany]);

  const toggleSolved = (id: QuestionId) => {
    onSolvedIdsChange((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const toggleBookmark = (id: QuestionId) => {
    onBookmarkedIdsChange((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const globalPct = totalQuestionCount
    ? Math.round((totalSolvedCount / totalQuestionCount) * 100)
    : 0;

  return (
    <div className="dsa-panel">
      {/* Company Browser */}
      <section className="company-browser">
        <div className="company-browser-head">
          <div className="company-browser-copy">
            <div className="company-browser-title">Browse Companies</div>
            <div className="logo-sub">
              Pick one company to load its most frequent DSA interview questions.
            </div>
          </div>
          <div className="company-browser-tools">
            <div className="search-wrap company-search">
            <input
              className="co-search"
              placeholder="Search company..."
              value={companySearch}
              onChange={(e) => {
                const v = e.target.value;
                startTransition(() => setCompanySearch(v));
              }}
              autoComplete="off"
            />
            </div>
          </div>
        </div>

        <div className="company-list">
          {visibleCompanies.map((company) => {
            const solved = company.questions.filter((q) => solvedIds.includes(q.id)).length;
            return (
              <button
                key={company.id}
                type="button"
                className={`co-item${selectedCompanyId === company.id ? " active" : ""}`}
                onClick={() => setSelectedCompanyId(company.id)}
              >
                <div className="co-logo">
                  <img src={company.logo} alt={company.name} />
                </div>
                <div className="co-info">
                  <div className="co-name">{company.name}</div>
                  <div className="co-count">{company.questions.length} questions</div>
                </div>
                <div className="co-prog">
                  {solved}/{company.questions.length}
                </div>
              </button>
            );
          })}
        </div>

        <div className="company-progress">
          <div className="global-stats">
            <div className="gs-label">Overall progress</div>
            <div className="gs-bar">
              <div className="gs-fill" style={{ width: `${globalPct}%` }} />
            </div>
            <div className="gs-nums">
              <span>{totalSolvedCount} solved</span>
              <span>{totalQuestionCount} total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-chip s">
          <div className="n">{selectedSolvedCount}</div>
          <div className="l">Solved</div>
        </div>
        <div className="stat-chip e">
          <div className="n">{difficultyCounts.easy}</div>
          <div className="l">Easy</div>
        </div>
        <div className="stat-chip m">
          <div className="n">{difficultyCounts.medium}</div>
          <div className="l">Medium</div>
        </div>
        <div className="stat-chip h">
          <div className="n">{difficultyCounts.hard}</div>
          <div className="l">Hard</div>
        </div>
        <div className="prog-bar-wrap">
          <div className="prog-bar">
            <div className="prog-bar-fill" style={{ width: `${selectedProgress}%` }} />
          </div>
          <div className="prog-pct">{selectedProgress}%</div>
        </div>
        <div className="toolbar-block">
          {(["all", "Easy", "Medium", "Hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`filter-btn${d !== "all" ? ` ${d.toLowerCase().slice(0, d === "Medium" ? 3 : d.length)}` : ""}${difficultyFilter === d ? " active" : ""}`}
              onClick={() => setDifficultyFilter(d)}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
          <button
            type="button"
            className={`filter-btn${showBookmarkedOnly ? " active" : ""}`}
            onClick={() => setShowBookmarkedOnly((v) => !v)}
          >
            ★ Saved
          </button>
          <button
            type="button"
            className={`filter-btn${showUnsolvedOnly ? " active" : ""}`}
            onClick={() => setShowUnsolvedOnly((v) => !v)}
          >
            Unsolved
          </button>
          <select
            className="sort-select"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
          >
            <option value="freq">Sort: Frequency</option>
            <option value="num">Sort: #Number</option>
            <option value="diff">Sort: Difficulty</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
      </div>

      {/* Question Table */}
      <div className="table-wrap">
        <table className="q-table">
          <thead>
            <tr>
              <th style={{ width: 36 }} />
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Frequency</th>
              <th>Tags</th>
              <th style={{ textAlign: "right" }}>★</th>
            </tr>
          </thead>
          <tbody>
            {visibleQuestions.map((q) => {
              const isSolved = solvedIds.includes(q.id);
              const isBookmarked = bookmarkedIds.includes(q.id);
              const dots = freqToDots(q.frequency);

              return (
                <tr key={q.id} className={`q-row${isSolved ? " solved" : ""}`}>
                  <td>
                    <div
                      className={`q-cb${isSolved ? " checked" : ""}`}
                      role="checkbox"
                      aria-checked={isSolved}
                      tabIndex={0}
                      onClick={() => toggleSolved(q.id)}
                      onKeyDown={(e) => e.key === " " && toggleSolved(q.id)}
                    />
                  </td>
                  <td className="q-num">{q.number}</td>
                  <td className="q-title">
                    <a href={q.url} target="_blank" rel="noopener noreferrer">
                      {q.title}
                    </a>
                  </td>
                  <td>
                    <span className={`diff-badge ${q.difficulty}`}>{q.difficulty}</span>
                  </td>
                  <td>
                    <div className="freq-bar">
                      <div className="freq-dots">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`freq-dot${i <= dots ? " on" : ""}`} />
                        ))}
                      </div>
                      <span className="freq-num">{q.frequency}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="tag-list">
                      {q.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className={`bm-btn${isBookmarked ? " active" : ""}`}
                      onClick={() => toggleBookmark(q.id)}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                      ★
                    </button>
                  </td>
                </tr>
              );
            })}
            {visibleQuestions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--muted)", fontSize: 14 }}>
                  No questions match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
