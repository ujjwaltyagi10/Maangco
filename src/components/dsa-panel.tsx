import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Check, Search, SlidersHorizontal, Star, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DsaCompany, DsaQuestion, QuestionId } from "@/types/prepdoc";

interface DsaPanelProps {
  companies: DsaCompany[];
  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  onSolvedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onBookmarkedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
}

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";
type SortMode = "Frequency" | "Difficulty" | "Title";

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
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("All");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("Frequency");

  const deferredCompanySearch = useDeferredValue(companySearch);

  const selectedCompany = useMemo(
    () =>
      companies.find((company) => company.id === selectedCompanyId) ??
      companies[0],
    [companies, selectedCompanyId],
  );

  const visibleCompanies = useMemo(() => {
    const normalizedQuery = deferredCompanySearch.trim().toLowerCase();

    return companies.filter((company) =>
      company.name.toLowerCase().includes(normalizedQuery),
    );
  }, [companies, deferredCompanySearch]);

  const totalQuestionCount = useMemo(
    () =>
      companies.reduce((total, company) => total + company.questions.length, 0),
    [companies],
  );

  const visibleQuestions = useMemo(() => {
    if (!selectedCompany) {
      return [];
    }

    const filtered = selectedCompany.questions.filter((question) => {
      const matchesDifficulty =
        difficultyFilter === "All" || question.difficulty === difficultyFilter;
      const matchesBookmark =
        !showBookmarkedOnly || bookmarkedIds.includes(question.id);
      const matchesSolved =
        !showUnsolvedOnly || !solvedIds.includes(question.id);

      return matchesDifficulty && matchesBookmark && matchesSolved;
    });

    return filtered.sort((left, right) => {
      if (sortMode === "Title") {
        return left.title.localeCompare(right.title);
      }

      if (sortMode === "Difficulty") {
        const difficultyRank = { Easy: 0, Medium: 1, Hard: 2 } satisfies Record<
          DsaQuestion["difficulty"],
          number
        >;
        return (
          difficultyRank[left.difficulty] - difficultyRank[right.difficulty]
        );
      }

      return right.frequency - left.frequency || left.number - right.number;
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

  const selectedSolvedCount =
    selectedCompany?.questions.filter((question) =>
      solvedIds.includes(question.id),
    ).length ?? 0;
  const selectedProgress = selectedCompany
    ? Math.round((selectedSolvedCount / selectedCompany.questions.length) * 100)
    : 0;
  const solvedCount = solvedIds.length;

  const companyDifficultyCounts = useMemo(() => {
    if (!selectedCompany) {
      return { easy: 0, medium: 0, hard: 0 };
    }

    return selectedCompany.questions.reduce(
      (counts, question) => {
        if (question.difficulty === "Easy") counts.easy += 1;
        if (question.difficulty === "Medium") counts.medium += 1;
        if (question.difficulty === "Hard") counts.hard += 1;
        return counts;
      },
      { easy: 0, medium: 0, hard: 0 },
    );
  }, [selectedCompany]);

  const toggleSolved = (questionId: QuestionId) => {
    onSolvedIdsChange((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const toggleBookmark = (questionId: QuestionId) => {
    onBookmarkedIdsChange((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  return (
    <section className="space-y-4">
      <article className="rounded-[1.6rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] p-5 shadow-[0_16px_34px_-34px_rgba(48,31,13,0.35)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[2rem] font-semibold tracking-tight text-[#2d281f] sm:text-[2.35rem]">
              Browse Companies
            </h2>
            <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[#6f6658]">
              Pick one company to load its most frequent DSA interview
              questions.
            </p>
          </div>

          <label className="flex h-12 min-w-55 items-center gap-3 rounded-[0.95rem] border border-[#ddd4c1] bg-[#faf7f0] px-4 text-[#988f80] shadow-[0_8px_18px_-18px_rgba(48,31,13,0.3)] sm:min-w-62.5">
            <Search className="size-4" />
            <input
              value={companySearch}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setCompanySearch(nextValue));
              }}
              placeholder="Search company..."
              className="w-full bg-transparent text-[0.92rem] outline-none placeholder:text-[#aea490]"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {visibleCompanies.map((company) => {
            const companySolvedCount = company.questions.filter((question) =>
              solvedIds.includes(question.id),
            ).length;

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => setSelectedCompanyId(company.id)}
                className={cn(
                  "flex min-h-18 items-center gap-3 rounded-[1rem] border bg-[#faf7f0] px-3 py-3 text-left transition",
                  selectedCompany?.id === company.id
                    ? "border-[#8ab06e] bg-white shadow-[0_12px_24px_-26px_rgba(77,140,73,0.65)]"
                    : "border-[#ddd4c1] hover:border-[#c9c1b0] hover:bg-white/80",
                )}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="size-10 rounded-[0.8rem] bg-white object-contain p-1.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.92rem] font-medium text-[#2f2a23]">
                    {company.name}
                  </div>
                  <div className="text-[0.76rem] text-[#8f8574]">
                    {company.questions.length} questions
                  </div>
                </div>
                <div className="text-right text-[0.8rem] font-semibold text-[#6ca05c]">
                  {companySolvedCount}/{company.questions.length}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-[#ddd4c1] bg-[#faf7f0] p-4">
          <div className="flex items-center justify-between gap-3 text-[0.82rem] text-[#968a76]">
            <span className="font-medium">Overall progress</span>
            <span>
              <span className="font-semibold text-[#2f2a23]">
                {solvedCount} solved
              </span>
              <span className="px-1">•</span>
              {totalQuestionCount} total
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7dfd0]">
            <div
              className="h-full rounded-full bg-[#5f9a54]"
              style={{ width: `${selectedProgress}%` }}
            />
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-center">
        <div className="grid gap-3 sm:grid-cols-4">
          <SummaryCard label="Solved" value={solvedCount} tone="#5f9a54" />
          <SummaryCard
            label="Easy"
            value={companyDifficultyCounts.easy}
            tone="#51a06c"
          />
          <SummaryCard
            label="Medium"
            value={companyDifficultyCounts.medium}
            tone="#d18b22"
          />
          <SummaryCard
            label="Hard"
            value={companyDifficultyCounts.hard}
            tone="#d05f57"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <div className="min-w-45 flex-1 rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[0.8rem] text-[#968a76]">
                <SlidersHorizontal className="size-3.5" />
                Sort:
              </div>
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as SortMode)
                }
                className="bg-transparent text-[0.86rem] font-medium text-[#2f2a23] outline-none"
              >
                <option value="Frequency">Frequency</option>
                <option value="Difficulty">Difficulty</option>
                <option value="Title">Title</option>
              </select>
            </div>
          </div>

          {(["All", "Easy", "Medium", "Hard"] as const).map((difficulty) => (
            <FilterButton
              key={difficulty}
              active={difficultyFilter === difficulty}
              onClick={() => setDifficultyFilter(difficulty)}
            >
              {difficulty}
            </FilterButton>
          ))}

          <FilterButton
            active={showBookmarkedOnly}
            onClick={() => setShowBookmarkedOnly((current) => !current)}
          >
            Saved
          </FilterButton>
          <FilterButton
            active={showUnsolvedOnly}
            onClick={() => setShowUnsolvedOnly((current) => !current)}
          >
            Unsolved
          </FilterButton>
        </div>
      </div>

      <article className="overflow-hidden rounded-[1.5rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] shadow-[0_16px_34px_-34px_rgba(48,31,13,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-[0.92rem]">
            <thead className="border-b border-[#e6ddcd] bg-[#faf7f0] text-left text-[0.72rem] uppercase tracking-[0.24em] text-[#9a917e]">
              <tr>
                <th className="w-14 px-4 py-4"></th>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Difficulty</th>
                <th className="px-4 py-4">Frequency</th>
                <th className="px-4 py-4">Tags</th>
                <th className="px-4 py-4 text-right">*</th>
              </tr>
            </thead>
            <tbody>
              {visibleQuestions.map((question) => {
                const isSolved = solvedIds.includes(question.id);
                const isBookmarked = bookmarkedIds.includes(question.id);

                return (
                  <tr
                    key={question.id}
                    className="border-b border-[#ece3d4] last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => toggleSolved(question.id)}
                        className={cn(
                          "flex size-5 items-center justify-center rounded-xl border transition",
                          isSolved
                            ? "border-[#7aa862] bg-[#e8f2df] text-[#5f9a54]"
                            : "border-[#d8cfbd] bg-[#faf7f0] text-transparent",
                        )}
                        aria-label={
                          isSolved
                            ? `Mark ${question.title} unsolved`
                            : `Mark ${question.title} solved`
                        }
                      >
                        <Check className="size-3.5" />
                      </button>
                    </td>
                    <td className="px-4 py-4 text-[0.95rem] font-medium text-[#7a715f]">
                      {question.number}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#2f2a23]">
                        {question.title}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <DifficultyPill difficulty={question.difficulty} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[#5f9a54]">
                        <Trophy className="size-4" />
                        <span className="font-medium">
                          {question.frequency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-2.5 py-1 text-[0.74rem] text-[#8d816f]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleBookmark(question.id)}
                        className={cn(
                          "inline-flex size-8 items-center justify-center rounded-full border transition",
                          isBookmarked
                            ? "border-[#d9c8a7] bg-[#f2eadf] text-[#c08c2f]"
                            : "border-transparent text-[#c9bfaf] hover:border-[#ddd4c1] hover:bg-[#faf7f0] hover:text-[#a08e6d]",
                        )}
                        aria-label={
                          isBookmarked
                            ? `Remove bookmark for ${question.title}`
                            : `Bookmark ${question.title}`
                        }
                      >
                        <Star
                          className={cn(
                            "size-4",
                            isBookmarked && "fill-current",
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_10px_22px_-24px_rgba(48,31,13,0.35)]">
      <div className="flex items-center gap-2 text-[0.84rem] font-medium text-[#7d7465]">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: tone }}
        />
        {label}
      </div>
      <div
        className="mt-2 text-[1.6rem] font-semibold tracking-tight"
        style={{ color: tone }}
      >
        {value}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[0.84rem] font-medium transition",
        active
          ? "border-[#cdb58a] bg-[#f2eadf] text-[#7a5b21]"
          : "border-[#ddd4c1] bg-[#faf7f0] text-[#746a5c] hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function DifficultyPill({
  difficulty,
}: {
  difficulty: DsaCompany["questions"][number]["difficulty"];
}) {
  const className =
    difficulty === "Easy"
      ? "border-[#a7c89c] bg-[#eef6e9] text-[#5f9a54]"
      : difficulty === "Medium"
        ? "border-[#e4bf82] bg-[#fbf1de] text-[#c07d18]"
        : "border-[#e3a7a0] bg-[#f9e7e5] text-[#c05a50]";

  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[0.74rem] font-semibold",
        className,
      )}
    >
      {difficulty}
    </span>
  );
}
