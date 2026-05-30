import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { CheckCheck, Clock3, Layers3, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FrontendQuestion, FrontendQuestionId, RoadmapWeek } from "@/types/prepdoc";

interface FrontendPanelProps {
  questions: FrontendQuestion[];
  roadmapWeeks: RoadmapWeek[];
  completedQuestionIds: FrontendQuestionId[];
  completedRoadmapDays: number[];
  onCompletedQuestionIdsChange: Dispatch<SetStateAction<FrontendQuestionId[]>>;
  onCompletedRoadmapDaysChange: Dispatch<SetStateAction<number[]>>;
}

type FrontendTab = "roadmap" | "questions";
type QuestionDifficulty = "All" | "Basic" | "Intermediate" | "Advanced";
type CategoryFilter = "All" | FrontendQuestion["category"];

export function FrontendPanel({
  questions,
  roadmapWeeks,
  completedQuestionIds,
  completedRoadmapDays,
  onCompletedQuestionIdsChange,
  onCompletedRoadmapDaysChange,
}: FrontendPanelProps) {
  const [activeTab, setActiveTab] = useState<FrontendTab>("roadmap");
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty>("All");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const categories = useMemo(
    () => ["All", ...new Set(questions.map((question) => question.category))] as CategoryFilter[],
    [questions],
  );

  const deferredSearchValue = useDeferredValue(searchValue);
  const baseFilteredQuestions = useMemo(() => {
    const normalizedQuery = deferredSearchValue.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesCategory = categoryFilter === "All" || question.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        question.prompt.toLowerCase().includes(normalizedQuery) ||
        question.topic.toLowerCase().includes(normalizedQuery) ||
        question.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [categoryFilter, deferredSearchValue, difficultyFilter, questions]);

  const topicCards = useMemo(() => {
    const groupedTopics = new Map<
      string,
      { topic: string; total: number; completed: number; categories: Set<FrontendQuestion["category"]> }
    >();

    for (const question of baseFilteredQuestions) {
      const current = groupedTopics.get(question.topic) ?? {
        topic: question.topic,
        total: 0,
        completed: 0,
        categories: new Set<FrontendQuestion["category"]>(),
      };

      current.total += 1;
      current.completed += completedQuestionIds.includes(question.id) ? 1 : 0;
      current.categories.add(question.category);
      groupedTopics.set(question.topic, current);
    }

    return Array.from(groupedTopics.values()).sort((left, right) => {
      if (right.total !== left.total) {
        return right.total - left.total;
      }

      return left.topic.localeCompare(right.topic);
    });
  }, [baseFilteredQuestions, completedQuestionIds]);

  const activeTopic =
    selectedTopic !== "All Topics" && topicCards.some((topic) => topic.topic === selectedTopic)
      ? selectedTopic
      : "All Topics";

  const visibleQuestions = useMemo(() => {
    if (activeTopic === "All Topics") {
      return baseFilteredQuestions;
    }

    return baseFilteredQuestions.filter((question) => question.topic === activeTopic);
  }, [activeTopic, baseFilteredQuestions]);

  const completedQuestionCount = completedQuestionIds.length;
  const completedRoadmapCount = completedRoadmapDays.length;
  const roadmapDayCount = roadmapWeeks.reduce((total, week) => total + week.days.length, 0);
  const questionProgress = Math.round((completedQuestionCount / questions.length) * 100);
  const roadmapProgress = Math.round((completedRoadmapCount / roadmapDayCount) * 100);
  const visibleCompletedCount = visibleQuestions.filter((question) => completedQuestionIds.includes(question.id)).length;

  const activeTopicMeta =
    activeTopic === "All Topics" ? null : topicCards.find((topic) => topic.topic === activeTopic) ?? null;

  const toggleQuestionDone = (questionId: FrontendQuestionId) => {
    onCompletedQuestionIdsChange((current) =>
      current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId],
    );
  };

  const toggleRoadmapDay = (day: number) => {
    onCompletedRoadmapDaysChange((current) =>
      current.includes(day) ? current.filter((currentDay) => currentDay !== day) : [...current, day],
    );
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Frontend prep</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Roadmap plus question bank</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The old frontend interview section is now split into a cleaner study system with roadmap execution and
              searchable questions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Question bank" value={`${completedQuestionCount}/${questions.length}`} progress={questionProgress} />
            <StatCard label="Roadmap" value={`${completedRoadmapCount}/${roadmapDayCount}`} progress={roadmapProgress} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={activeTab === "roadmap" ? "default" : "outline"} className="rounded-full" onClick={() => setActiveTab("roadmap")}>
          Roadmap
        </Button>
        <Button variant={activeTab === "questions" ? "default" : "outline"} className="rounded-full" onClick={() => setActiveTab("questions")}>
          Questions
        </Button>
      </div>

      {activeTab === "roadmap" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {roadmapWeeks.map((week) => {
            const completedInWeek = week.days.filter((day) => completedRoadmapDays.includes(day.day)).length;
            const weekProgress = Math.round((completedInWeek / week.days.length) * 100);

            return (
              <article key={week.id} className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: week.accent }}>
                      {week.label}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Weekly block</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">{week.title}</h3>
                    {week.subtitle ? <p className="mt-2 text-sm text-muted-foreground">{week.subtitle}</p> : null}
                  </div>
                  <span className="size-3 rounded-full" style={{ backgroundColor: week.accent }} aria-hidden="true" />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${weekProgress}%`, backgroundColor: week.accent }} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{completedInWeek}/{week.days.length} complete</div>

                <div className="mt-5 space-y-3">
                  {week.days.map((day) => {
                    const isDone = completedRoadmapDays.includes(day.day);

                    return (
                      <button
                        key={day.day}
                        type="button"
                        onClick={() => toggleRoadmapDay(day.day)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
                          isDone ? "border-primary/30 bg-primary/10" : "border-border/70 bg-background/70 hover:bg-background",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                            isDone ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                          )}
                        >
                          {day.day}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{day.title}</span>
                          <span className="block text-xs leading-5 text-muted-foreground">{day.topic}</span>
                          {day.summary ? <span className="block pt-1 text-xs leading-5 text-muted-foreground/90">{day.summary}</span> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {activeTab === "questions" ? (
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-border/70 bg-card/90 p-4">
            <label className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={searchValue}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => setSearchValue(nextValue));
                }}
                placeholder="Search topic or question"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <div className="mb-4 flex flex-wrap gap-2">
              {(["All", "Basic", "Intermediate", "Advanced"] as const).map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={difficultyFilter === difficulty ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setDifficultyFilter(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedTopic("All Topics")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                  activeTopic === "All Topics"
                    ? "border-primary/30 bg-primary/10"
                    : "border-transparent hover:border-border hover:bg-background/80",
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                  <Layers3 className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">All Topics</span>
                  <span className="block text-xs text-muted-foreground">
                    {visibleCompletedCount}/{visibleQuestions.length} completed
                  </span>
                </span>
              </button>

              {topicCards.map((topic) => (
                <button
                  key={topic.topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic.topic)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                    activeTopic === topic.topic
                      ? "border-primary/30 bg-primary/10"
                      : "border-transparent hover:border-border hover:bg-background/80",
                  )}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                    <span className="text-sm font-semibold">{topic.total}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{topic.topic}</span>
                    <span className="block text-xs text-muted-foreground">
                      {topic.completed}/{topic.total} completed
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={categoryFilter === category ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">{activeTopic}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeTopicMeta
                      ? `${activeTopicMeta.categories.size} categories • ${activeTopicMeta.total} questions in this topic`
                      : `${visibleQuestions.length} questions across all matching topics`}
                  </p>
                </div>
                <div className="min-w-[240px] flex-1">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-semibold">
                      {visibleQuestions.length === 0 ? 0 : Math.round((visibleCompletedCount / visibleQuestions.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#166534,#4ade80)]"
                      style={{
                        width: `${visibleQuestions.length === 0 ? 0 : Math.round((visibleCompletedCount / visibleQuestions.length) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-background/80 text-left text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Question</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Difficulty</th>
                      <th className="px-4 py-3 font-medium">Topic</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQuestions.map((question) => {
                      const isDone = completedQuestionIds.includes(question.id);

                      return (
                        <tr key={question.id} className="border-t border-border/70">
                          <td className="px-4 py-4">
                            <div className="font-medium text-foreground">{question.prompt}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                              {question.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                question.difficulty === "Basic" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                                question.difficulty === "Intermediate" &&
                                  "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                                question.difficulty === "Advanced" && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                              )}
                            >
                              {question.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{question.topic}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant={isDone ? "default" : "outline"}
                                className="rounded-full"
                                onClick={() => toggleQuestionDone(question.id)}
                              >
                                {isDone ? <CheckCheck /> : <Clock3 />}
                                {isDone ? "Completed" : "Mark complete"}
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
      ) : null}
    </section>
  );
}

function StatCard({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#166534,#4ade80)]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
