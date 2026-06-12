import type { Dispatch, SetStateAction } from "react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { DsaCompany, DsaQuestion, QuestionId } from "@/types/prepdoc";

const ALL_ID = "all";

interface DsaPanelProps {
  isPremium: boolean;
  onBuyPremium: () => void;
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
  isPremium,
  onBuyPremium,
  companies,
  solvedIds,
  bookmarkedIds,
  onSolvedIdsChange,
  onBookmarkedIdsChange,
}: DsaPanelProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(ALL_ID);
  const [companySearch, setCompanySearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>(
    isPremium ? "freq" : "num",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const deferredCompanySearch = useDeferredValue(companySearch);

  const allCompany = useMemo((): DsaCompany => {
    // Sort by frequency first so the highest-frequency entry wins the dedup
    const seen = new Map<number, DsaQuestion>();
    companies
      .flatMap((c) => c.questions)
      .forEach((q) => {
        const existing = seen.get(q.number);
        if (!existing || q.frequency > existing.frequency) {
          seen.set(q.number, q);
        }
      });
    const uniqueQuestions = Array.from(seen.values()).sort(
      (a, b) => b.frequency - a.frequency,
    );
    return {
      id: ALL_ID,
      name: "All",
      logo: "",
      accent: "#6c63ff",
      questions: uniqueQuestions,
    };
  }, [companies]);

  const displayCompanies = useMemo((): DsaCompany[] => {
    return [allCompany, ...companies];
  }, [companies, allCompany]);

  const selectedCompany = useMemo(
    () =>
      displayCompanies.find((c) => c.id === selectedCompanyId) ?? allCompany,
    [displayCompanies, selectedCompanyId, allCompany],
  );

  const visibleCompanies = useMemo(() => {
    const q = deferredCompanySearch.trim().toLowerCase();
    return displayCompanies.filter((c) => c.name.toLowerCase().includes(q));
  }, [displayCompanies, deferredCompanySearch]);

  const totalQuestionCount = allCompany.questions.length;
  const totalSolvedCount = solvedIds.length;

  const visibleQuestions = useMemo(() => {
    if (!selectedCompany) return [];

    const filtered = selectedCompany.questions.filter((q) => {
      const matchesDiff =
        difficultyFilter === "all" || q.difficulty === difficultyFilter;
      const matchesBm = !showBookmarkedOnly || bookmarkedIds.includes(q.id);
      const matchesUnsolved = !showUnsolvedOnly || !solvedIds.includes(q.id);
      return matchesDiff && matchesBm && matchesUnsolved;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "title") return a.title.localeCompare(b.title);
      if (sortMode === "diff") {
        const rank = { Easy: 0, Medium: 1, Hard: 2 } satisfies Record<
          DsaQuestion["difficulty"],
          number
        >;
        return rank[a.difficulty] - rank[b.difficulty];
      }
      if (sortMode === "num") return a.number - b.number;
      return b.frequency - a.frequency || a.number - b.number;
    });
  }, [
    bookmarkedIds,
    difficultyFilter,
    selectedCompany,
    showBookmarkedOnly,
    showUnsolvedOnly,
    solvedIds,
    sortMode,
  ]);

  // Reset to page 1 whenever filters or selected company change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCompanyId,
    difficultyFilter,
    showBookmarkedOnly,
    showUnsolvedOnly,
    sortMode,
    deferredCompanySearch,
  ]);

  const totalPages = Math.max(1, Math.ceil(visibleQuestions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedQuestions = visibleQuestions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const selectedSolvedCount =
    selectedCompany?.questions.filter((q) => solvedIds.includes(q.id)).length ??
    0;
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
      {/* LEFT: Stats + Table + Pagination */}
      <div className="dsa-main">
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
              <div
                className="prog-bar-fill"
                style={{ width: `${selectedProgress}%` }}
              />
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
              onChange={(e) => {
                const val = e.target.value as SortMode;
                if (val === "freq" && !isPremium) {
                  onBuyPremium();
                  return;
                }
                setSortMode(val);
              }}
            >
              {isPremium && <option value="freq">Sort: Frequency</option>}
              <option value="num">Sort: Number</option>
              <option value="diff">Sort: Difficulty</option>
              <option value="title">Sort: Title</option>
              {!isPremium && (
                <option value="freq" disabled>
                  Sort: Frequency 🔒
                </option>
              )}
            </select>
            <select
              className="sort-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={50}>50 / page</option>
              <option value={75}>75 / page</option>
              <option value={100}>100 / page</option>
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
              {paginatedQuestions.map((q) => {
                const isSolved = solvedIds.includes(q.id);
                const isBookmarked = bookmarkedIds.includes(q.id);
                const dots = freqToDots(q.frequency);

                return (
                  <tr
                    key={q.id}
                    className={`q-row${isSolved ? " solved" : ""}`}
                  >
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
                      <span className={`diff-badge ${q.difficulty}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td>
                      {isPremium ? (
                        <div className="freq-bar">
                          <div className="freq-dots">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`freq-dot${i <= dots ? " on" : ""}`}
                              />
                            ))}
                          </div>
                          <span className="freq-num">{q.frequency}%</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="tag-locked-btn"
                          onClick={onBuyPremium}
                          title="Unlock frequency data with Premium"
                        >
                          🔒 Premium
                        </button>
                      )}
                    </td>
                    <td>
                      {isPremium ? (
                        <div className="tag-list">
                          {q.tags.map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="tag-locked-btn"
                          onClick={onBuyPremium}
                          title="Unlock tags with Premium"
                        >
                          🔒 Premium
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className={`bm-btn${isBookmarked ? " active" : ""}`}
                        onClick={() => toggleBookmark(q.id)}
                        aria-label={
                          isBookmarked ? "Remove bookmark" : "Bookmark"
                        }
                      >
                        ★
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedQuestions.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "var(--muted)",
                      fontSize: 14,
                    }}
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <div className="page-info">
              Page {safePage} of {totalPages}
              <span className="page-count">
                · {visibleQuestions.length} questions
              </span>
            </div>
            <button
              type="button"
              className="page-btn"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
      {/* end .dsa-main */}

      {/* RIGHT: Company Browser Sidebar */}
      <aside
        className={`dsa-sidebar${sidebarCollapsed ? " dsa-sidebar--collapsed" : ""}`}
      >
        {sidebarCollapsed ? (
          /* ── COLLAPSED: logo strip ── */
          <>
            <div className="dsa-sidebar-collapse-toggle">
              <button
                type="button"
                className="dsa-sidebar-toggle-btn"
                onClick={() => setSidebarCollapsed(false)}
                aria-label="Expand companies"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  width="14"
                  height="14"
                >
                  <path d="M6 3l-4 5 4 5M10 3l4 5-4 5" />
                </svg>
              </button>
            </div>
            <div className="dsa-collapsed-logo-wrap">
              {!isPremium && (
                <div className="dsa-collapsed-gate">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="22"
                    height="22"
                  >
                    <rect x="3" y="9" width="14" height="10" rx="2" />
                    <path d="M7 9V6a3 3 0 0 1 6 0v3" />
                  </svg>
                </div>
              )}
              <div
                className={`dsa-sidebar-logo-strip${!isPremium ? " dsa-sidebar-logo-strip--blurred" : ""}`}
              >
                {displayCompanies.map((company) => {
                  const isAll = company.id === ALL_ID;
                  const isActive = selectedCompanyId === company.id;
                  return (
                    <button
                      key={company.id}
                      type="button"
                      className={`dsa-logo-pill${isActive ? " active" : ""}`}
                      title={company.name}
                      tabIndex={!isPremium ? -1 : undefined}
                      onClick={() => {
                        if (!isPremium) return;
                        setSelectedCompanyId(company.id);
                      }}
                    >
                      {isAll ? (
                        <span className="co-logo-all-icon co-logo-all-icon--pill">
                          <svg
                            viewBox="0 0 16 16"
                            width="18"
                            height="18"
                            fill="currentColor"
                          >
                            <rect x="1" y="1" width="6" height="6" rx="1.5" />
                            <rect x="9" y="1" width="6" height="6" rx="1.5" />
                            <rect x="1" y="9" width="6" height="6" rx="1.5" />
                            <rect x="9" y="9" width="6" height="6" rx="1.5" />
                          </svg>
                        </span>
                      ) : (
                        <img src={company.logo} alt={company.name} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="dsa-sidebar-collapsed-footer">
              <div className="dsa-collapsed-ratio">
                {totalSolvedCount}
                <span>/{totalQuestionCount}</span>
              </div>
            </div>
          </>
        ) : (
          /* ── EXPANDED: full sidebar ── */
          <>
            <div className="dsa-sidebar-head">
              <div className="dsa-sidebar-head-row">
                <div>
                  <div className="company-browser-title">Companies</div>
                  <div className="logo-sub">Select to filter questions</div>
                </div>
                <button
                  type="button"
                  className="dsa-sidebar-toggle-btn"
                  onClick={() => setSidebarCollapsed(true)}
                  aria-label="Collapse companies"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    width="14"
                    height="14"
                  >
                    <path d="M10 3l4 5-4 5M6 3L2 8l4 5" />
                  </svg>
                </button>
              </div>
              <input
                className="co-search co-search--sidebar"
                placeholder="Search..."
                value={companySearch}
                onChange={(e) => {
                  const v = e.target.value;
                  startTransition(() => setCompanySearch(v));
                }}
                autoComplete="off"
              />
            </div>

            <div className="dsa-sidebar-companies">
              {/* "All Companies" — only shown to premium users */}
              {isPremium &&
                visibleCompanies
                  .filter((c) => c.id === ALL_ID)
                  .map((company) => {
                    const solved = company.questions.filter((q) =>
                      solvedIds.includes(q.id),
                    ).length;
                    return (
                      <button
                        key={company.id}
                        type="button"
                        className={`co-item co-item--sidebar co-item--all${selectedCompanyId === company.id ? " active" : ""}`}
                        onClick={() => setSelectedCompanyId(company.id)}
                      >
                        <div className="co-logo co-logo--all">
                          <span className="co-logo-all-icon">
                            <svg
                              viewBox="0 0 16 16"
                              width="16"
                              height="16"
                              fill="currentColor"
                            >
                              <rect x="1" y="1" width="6" height="6" rx="1.5" />
                              <rect x="9" y="1" width="6" height="6" rx="1.5" />
                              <rect x="1" y="9" width="6" height="6" rx="1.5" />
                              <rect x="9" y="9" width="6" height="6" rx="1.5" />
                            </svg>
                          </span>
                        </div>
                        <div className="co-info">
                          <div className="co-name">{company.name}</div>
                        </div>
                        <div className="co-prog">
                          {solved}/{company.questions.length}
                        </div>
                      </button>
                    );
                  })}

              {/* Company-specific list — gated for non-premium */}
              <div className="dsa-companies-gate-wrap">
                {!isPremium && (
                  <div className="dsa-companies-gate">
                    <div className="dsa-gate-icon">
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 8l4 6 6-9 6 9 4-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z" />
                      </svg>
                    </div>
                    <div className="dsa-gate-title">Company Sheets</div>
                    <div className="dsa-gate-sub">
                      25+ company-wise lists with frequency data &amp; tags
                    </div>
                    <button
                      type="button"
                      className="dsa-gate-btn"
                      onClick={onBuyPremium}
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
                <div
                  className={
                    !isPremium
                      ? "dsa-companies-list dsa-companies-list--blurred"
                      : "dsa-companies-list"
                  }
                >
                  {visibleCompanies
                    .filter((c) => c.id !== ALL_ID)
                    .map((company) => {
                      const solved = isPremium
                        ? company.questions.filter((q) =>
                            solvedIds.includes(q.id),
                          ).length
                        : 0;
                      return (
                        <button
                          key={company.id}
                          type="button"
                          className={`co-item co-item--sidebar${selectedCompanyId === company.id ? " active" : ""}`}
                          onClick={() => {
                            if (!isPremium) return;
                            setSelectedCompanyId(company.id);
                          }}
                          tabIndex={!isPremium ? -1 : undefined}
                        >
                          <div className="co-logo">
                            <img src={company.logo} alt={company.name} />
                          </div>
                          <div className="co-info">
                            <div className="co-name">{company.name}</div>
                          </div>
                          <div className="co-prog">
                            {solved}/{company.questions.length}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="dsa-sidebar-footer">
              <div className="gs-label">Overall progress</div>
              <div className="gs-bar">
                <div className="gs-fill" style={{ width: `${globalPct}%` }} />
              </div>
              <div className="gs-nums">
                <span>{totalSolvedCount} solved</span>
                <span>{totalQuestionCount} total</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
