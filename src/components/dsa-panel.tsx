import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Bookmark, ExternalLink, Search, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DsaCompany, QuestionId } from "@/types/prepdoc";

interface DsaPanelProps {
  companies: DsaCompany[];
  solvedIds: QuestionId[];
  bookmarkedIds: QuestionId[];
  onSolvedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
  onBookmarkedIdsChange: Dispatch<SetStateAction<QuestionId[]>>;
}

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

export function DsaPanel({
  companies,
  solvedIds,
  bookmarkedIds,
  onSolvedIdsChange,
  onBookmarkedIdsChange,
}: DsaPanelProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id ?? "");
  const [companySearch, setCompanySearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showUnsolvedOnly, setShowUnsolvedOnly] = useState(false);

  const deferredCompanySearch = useDeferredValue(companySearch);
  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? companies[0],
    [companies, selectedCompanyId],
  );

  const visibleCompanies = useMemo(() => {
    const normalizedQuery = deferredCompanySearch.trim().toLowerCase();

    return companies.filter((company) => company.name.toLowerCase().includes(normalizedQuery));
  }, [companies, deferredCompanySearch]);

  const visibleQuestions = useMemo(() => {
    if (!selectedCompany) {
      return [];
    }

    return selectedCompany.questions.filter((question) => {
      const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter;
      const matchesBookmark = !showBookmarkedOnly || bookmarkedIds.includes(question.id);
      const matchesSolved = !showUnsolvedOnly || !solvedIds.includes(question.id);

      return matchesDifficulty && matchesBookmark && matchesSolved;
    });
  }, [bookmarkedIds, difficultyFilter, selectedCompany, showBookmarkedOnly, showUnsolvedOnly, solvedIds]);

  const solvedCount = selectedCompany?.questions.filter((question) => solvedIds.includes(question.id)).length ?? 0;
  const progress = selectedCompany ? Math.round((solvedCount / selectedCompany.questions.length) * 100) : 0;

  const toggleSolved = (questionId: QuestionId) => {
    onSolvedIdsChange((current) =>
      current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId],
    );
  };

  const toggleBookmark = (questionId: QuestionId) => {
    onBookmarkedIdsChange((current) =>
      current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId],
    );
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">DSA tracker</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Company-first interview prep</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The static company browser from your old `PrepDoc` has been migrated into a typed React flow with
              reusable filters and persistent state.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Companies" value={String(companies.length)} />
            <StatCard label="Solved" value={String(solvedIds.length)} />
            <StatCard label="Bookmarked" value={String(bookmarkedIds.length)} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] border border-border/70 bg-card/90 p-4">
          <label className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={companySearch}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => setCompanySearch(nextValue));
              }}
              placeholder="Search company"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="space-y-2">
            {visibleCompanies.map((company) => {
              const companySolvedCount = company.questions.filter((question) => solvedIds.includes(question.id)).length;

              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                    selectedCompany?.id === company.id
                      ? "border-primary/30 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-background/80",
                  )}
                >
                  <img src={company.logo} alt={`${company.name} logo`} className="size-11 rounded-xl bg-white object-contain p-2" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{company.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {companySolvedCount}/{company.questions.length} solved
                    </span>
                  </span>
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: company.accent }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4">
          {selectedCompany ? (
            <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedCompany.logo} alt={`${selectedCompany.name} logo`} className="size-16 rounded-2xl bg-white object-contain p-3" />
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">{selectedCompany.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {solvedCount}/{selectedCompany.questions.length} solved
                    </p>
                  </div>
                </div>
                <div className="min-w-[240px] flex-1">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: selectedCompany.accent }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {(["All", "Easy", "Medium", "Hard"] as const).map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={difficultyFilter === difficulty ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setDifficultyFilter(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
                <Button
                  variant={showBookmarkedOnly ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setShowBookmarkedOnly((current) => !current)}
                >
                  Bookmarked
                </Button>
                <Button
                  variant={showUnsolvedOnly ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setShowUnsolvedOnly((current) => !current)}
                >
                  Unsolved
                </Button>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-background/80 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Question</th>
                    <th className="px-4 py-3 font-medium">Difficulty</th>
                    <th className="px-4 py-3 font-medium">Frequency</th>
                    <th className="px-4 py-3 font-medium">Tags</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((question) => {
                    const isSolved = solvedIds.includes(question.id);
                    const isBookmarked = bookmarkedIds.includes(question.id);

                    return (
                      <tr key={question.id} className="border-t border-border/70">
                        <td className="px-4 py-4">
                          <div className="font-medium text-foreground">{question.title}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              question.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                              question.difficulty === "Medium" && "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                              question.difficulty === "Hard" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                            )}
                          >
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Trophy className="size-4" />
                            {question.frequency}%
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant={isSolved ? "default" : "outline"} className="rounded-full" onClick={() => toggleSolved(question.id)}>
                              {isSolved ? "Solved" : "Mark solved"}
                            </Button>
                            <Button
                              variant={isBookmarked ? "default" : "outline"}
                              size="icon"
                              className="rounded-full"
                              onClick={() => toggleBookmark(question.id)}
                              aria-label={`Bookmark ${question.title}`}
                            >
                              <Bookmark className={cn(isBookmarked && "fill-current")} />
                            </Button>
                            <Button asChild variant="outline" size="icon" className="rounded-full">
                              <a href={question.url} target="_blank" rel="noreferrer" aria-label={`Open ${question.title}`}>
                                <ExternalLink />
                              </a>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
