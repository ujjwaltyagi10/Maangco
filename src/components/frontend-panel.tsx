import type { Dispatch, SetStateAction } from "react";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Layers3,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
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
}

type FrontendTab = "roadmap" | "questions";
type QuestionDifficulty = "All" | "Basic" | "Intermediate" | "Advanced";
type CategoryFilter = "All" | FrontendQuestion["category"];

const roadmapTrackChips = [
  "JS Core",
  "React",
  "Redux",
  "TypeScript",
  "Performance",
  "Web APIs",
  "Testing",
  "DSA / Coding",
] as const;

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
  const [difficultyFilter, setDifficultyFilter] =
    useState<QuestionDifficulty>("All");
  const [selectedCategory, setSelectedCategory] =
    useState<FrontendQuestion["category"]>("JavaScript");
  const [expandedWeekId, setExpandedWeekId] = useState(
    roadmapWeeks[0]?.id ?? "",
  );

  const categories = useMemo(
    () =>
      [
        "All",
        ...new Set(questions.map((question) => question.category)),
      ] as CategoryFilter[],
    [questions],
  );

  const deferredSearchValue = useDeferredValue(searchValue);

  const selectedCategoryQuestions = useMemo(
    () =>
      questions.filter((question) => question.category === selectedCategory),
    [questions, selectedCategory],
  );

  const visibleQuestions = useMemo(() => {
    const normalizedQuery = deferredSearchValue.trim().toLowerCase();

    return selectedCategoryQuestions.filter((question) => {
      const matchesCategory =
        categoryFilter === "All" || question.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "All" || question.difficulty === difficultyFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        question.prompt.toLowerCase().includes(normalizedQuery) ||
        question.topic.toLowerCase().includes(normalizedQuery) ||
        question.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [
    categoryFilter,
    deferredSearchValue,
    difficultyFilter,
    selectedCategoryQuestions,
  ]);

  const completedQuestionCount = completedQuestionIds.length;
  const completedRoadmapCount = completedRoadmapDays.length;
  const roadmapDayCount = roadmapWeeks.reduce(
    (total, week) => total + week.days.length,
    0,
  );
  const questionProgress = Math.round(
    (completedQuestionCount / questions.length) * 100,
  );
  const roadmapProgress = Math.round(
    (completedRoadmapCount / roadmapDayCount) * 100,
  );
  const visibleCompletedCount = visibleQuestions.filter((question) =>
    completedQuestionIds.includes(question.id),
  ).length;

  const questionStats = useMemo(() => {
    const selectedQuestions = selectedCategoryQuestions;

    return {
      total: selectedQuestions.length,
      basic: selectedQuestions.filter(
        (question) => question.difficulty === "Basic",
      ).length,
      intermediate: selectedQuestions.filter(
        (question) => question.difficulty === "Intermediate",
      ).length,
      advanced: selectedQuestions.filter(
        (question) => question.difficulty === "Advanced",
      ).length,
    };
  }, [selectedCategoryQuestions]);

  const roadmapOverlapCount = useMemo(() => {
    const roadmapTokens = new Set(
      roadmapWeeks.flatMap((week) =>
        week.days.flatMap((day) =>
          normalizeTopicTokens([day.title, day.topic, day.summary ?? ""]),
        ),
      ),
    );

    return selectedCategoryQuestions.filter((question) => {
      const tokens = normalizeTopicTokens([question.prompt, question.topic]);
      return tokens.some((token) => roadmapTokens.has(token));
    }).length;
  }, [roadmapWeeks, selectedCategoryQuestions]);

  const selectedWeek =
    roadmapWeeks.find((week) => week.id === expandedWeekId) ?? roadmapWeeks[0];

  const toggleQuestionDone = (questionId: FrontendQuestionId) => {
    onCompletedQuestionIdsChange((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const toggleRoadmapDay = (day: number) => {
    onCompletedRoadmapDaysChange((current) =>
      current.includes(day)
        ? current.filter((currentDay) => currentDay !== day)
        : [...current, day],
    );
  };

  return (
    <section className="space-y-4">
      <article className="rounded-[1.6rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] p-5 shadow-[0_16px_34px_-34px_rgba(48,31,13,0.35)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-[1rem] bg-[#e8f0df] text-[#4f8a49] shadow-[0_8px_18px_-18px_rgba(48,31,13,0.3)]">
              <Layers3 className="size-5" />
            </div>
            <div>
              <h2 className="text-[1.95rem] font-semibold tracking-tight text-[#2d281f] sm:text-[2.2rem]">
                Frontend Interview Prep
              </h2>
              <p className="mt-2 max-w-2xl text-[0.92rem] leading-6 text-[#6f6658]">
                Structured 45-day roadmap covering JS, React, Redux, TypeScript,
                Testing, Performance and 242 real interview questions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <InfoPill label="45 days" />
            <InfoPill label={`${formatWeeks(roadmapDayCount)} weeks`} />
            <InfoPill label={`${roadmapWeeks.length} tracks`} />
            <InfoPill label={`${questions.length} questions`} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "roadmap"}
            onClick={() => setActiveTab("roadmap")}
          >
            Roadmap
          </TabButton>
          <TabButton
            active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
          >
            Interview Questions
          </TabButton>
          <span className="ml-1 rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-3 py-2 text-[0.78rem] font-medium text-[#7c7261]">
            {questions.length}
          </span>
        </div>
        <p className="mt-3 text-xs leading-6 text-[#9b9080]">
          Question bank progress {questionProgress}% • roadmap execution{" "}
          {roadmapProgress}%
        </p>
      </article>

      {activeTab === "roadmap" ? (
        <>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {roadmapTrackChips.map((chip) => (
              <TrackChipButton key={chip} active={chip === "JS Core"}>
                {chip}
              </TrackChipButton>
            ))}
          </div>

          <div className="space-y-4">
            {roadmapWeeks.map((week) => {
              const expanded = week.id === selectedWeek?.id;
              const completedInWeek = week.days.filter((day) =>
                completedRoadmapDays.includes(day.day),
              ).length;
              const weekProgress = Math.round(
                (completedInWeek / week.days.length) * 100,
              );

              return (
                <article
                  key={week.id}
                  className="overflow-hidden rounded-[1.35rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] shadow-[0_16px_34px_-34px_rgba(48,31,13,0.32)]"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedWeekId((current) =>
                        current === week.id ? current : week.id,
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 items-center justify-center rounded-[0.95rem] bg-[#f4efe4] text-[0.78rem] font-semibold text-[#7a715f]">
                        {week.label}
                      </div>
                      <div>
                        <h3 className="text-[1.12rem] font-semibold tracking-tight text-[#2f2a23]">
                          {week.title}
                        </h3>
                        <p className="mt-1 text-[0.84rem] text-[#938a79]">
                          {week.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-3 py-1 text-[0.74rem] font-semibold text-[#7e725f]">
                        {weekTrackLabel(week)}
                      </span>
                      {expanded ? (
                        <ChevronDown className="size-4 text-[#8f8574]" />
                      ) : (
                        <ChevronRight className="size-4 text-[#8f8574]" />
                      )}
                    </div>
                  </button>

                  {expanded ? (
                    <div className="border-t border-[#e6ddcd] px-5 py-4">
                      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#ede4d6]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${weekProgress}%`,
                            backgroundColor: week.accent,
                          }}
                        />
                      </div>
                      <div className="grid gap-px overflow-hidden rounded-[1.15rem] border border-[#e7dfd1] bg-[#e7dfd1] sm:grid-cols-2 xl:grid-cols-4">
                        {week.days.map((day) => {
                          const isDone = completedRoadmapDays.includes(day.day);
                          const showAsked =
                            week.id === "w1" && [1, 3, 4, 5].includes(day.day);

                          return (
                            <button
                              key={day.day}
                              type="button"
                              onClick={() => toggleRoadmapDay(day.day)}
                              className={cn(
                                "min-h-31.5 bg-[#fbfaf5] p-4 text-left transition hover:bg-white",
                                isDone && "bg-[#f1f7ec]",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#b2a58f]">
                                    Day {day.day}
                                  </div>
                                  {showAsked ? (
                                    <span className="mt-1 inline-flex rounded-full bg-[#fff2e6] px-2.5 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.2em] text-[#ef8d34]">
                                      Asked
                                    </span>
                                  ) : null}
                                </div>
                                <span
                                  className={cn(
                                    "mt-1 flex size-6 items-center justify-center rounded-full border text-[0.72rem] font-semibold",
                                    isDone
                                      ? "border-[#86b36d] bg-[#86b36d] text-white"
                                      : "border-[#d5ccb9] bg-white text-transparent",
                                  )}
                                >
                                  ✓
                                </span>
                              </div>
                              <h4 className="mt-3 text-[1rem] font-semibold leading-5 text-[#2f2a23]">
                                {day.title}
                              </h4>
                              <p className="mt-2 text-[0.82rem] leading-6 text-[#7d7465]">
                                {day.summary}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      ) : null}

      {activeTab === "questions" ? (
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[1.35rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_16px_34px_-34px_rgba(48,31,13,0.32)]">
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryQuestions = questions.filter(
                  (question) => question.category === category,
                );
                const count =
                  category === "All"
                    ? questions.length
                    : categoryQuestions.length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category === "All" ? "JavaScript" : category,
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between rounded-[0.95rem] border px-3 py-2.5 text-left transition",
                      category === "All"
                        ? "border-[#ddd4c1] bg-[#faf7f0] text-[#655b4d]"
                        : selectedCategory === category
                          ? "border-[#a8c896] bg-[#e9f2e2] text-[#355238]"
                          : "border-transparent text-[#6c6253] hover:border-[#ddd4c1] hover:bg-[#faf7f0]",
                    )}
                  >
                    <span className="text-[0.9rem] font-medium">
                      {category}
                    </span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[0.74rem] font-semibold text-[#a1947f]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="space-y-4">
            <article className="rounded-[1.35rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] p-5 shadow-[0_16px_34px_-34px_rgba(48,31,13,0.32)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <TabButton
                        key={category}
                        active={categoryFilter === category}
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category}
                      </TabButton>
                    ))}
                  </div>
                  <h3 className="mt-4 text-[1.55rem] font-semibold tracking-tight text-[#2f2a23]">
                    {selectedCategory}
                  </h3>
                  <p className="mt-1 text-[0.88rem] text-[#8e8574]">
                    Core JS: closures, async, event loop, prototypes, patterns
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:min-w-[320px]">
                  <label className="flex h-11 items-center gap-3 rounded-[0.95rem] border border-[#ddd4c1] bg-[#faf7f0] px-4 text-[#988f80]">
                    <Search className="size-4" />
                    <input
                      value={searchValue}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        startTransition(() => setSearchValue(nextValue));
                      }}
                      placeholder="Search questions..."
                      className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-[#aea490]"
                    />
                  </label>
                  <div className="flex items-center justify-end gap-2">
                    {(["All", "Basic", "Mid", "Adv"] as const).map(
                      (difficulty) => (
                        <button
                          key={difficulty}
                          type="button"
                          onClick={() =>
                            setDifficultyFilter(
                              difficulty === "Mid"
                                ? "Intermediate"
                                : difficulty === "Adv"
                                  ? "Advanced"
                                  : (difficulty as QuestionDifficulty),
                            )
                          }
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[0.8rem] font-medium transition",
                            (
                              difficulty === "Mid"
                                ? difficultyFilter === "Intermediate"
                                : difficultyFilter === difficulty
                            )
                              ? "border-[#cdb58a] bg-[#f2eadf] text-[#7a5b21]"
                              : "border-[#ddd4c1] bg-[#faf7f0] text-[#746a5c] hover:bg-white",
                          )}
                        >
                          {difficulty}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.82rem] text-[#8e8574]">
                <StatPill label={`${questionStats.total} shown`} />
                <StatPill label={`${questionStats.basic} basic`} />
                <StatPill
                  label={`${questionStats.intermediate} intermediate`}
                />
                <StatPill label={`${questionStats.advanced} advanced`} />
                <StatPill label={`${roadmapOverlapCount} in roadmap`} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-[0.84rem] text-[#968a76]">
                <span>
                  {visibleCompletedCount}/{visibleQuestions.length} completed
                </span>
                <span>
                  {visibleQuestions.length === 0
                    ? 0
                    : Math.round(
                        (visibleCompletedCount / visibleQuestions.length) * 100,
                      )}
                  %
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7dfd0]">
                <div
                  className="h-full rounded-full bg-[#5f9a54]"
                  style={{
                    width: `${visibleQuestions.length === 0 ? 0 : Math.round((visibleCompletedCount / visibleQuestions.length) * 100)}%`,
                  }}
                />
              </div>
            </article>

            <article className="overflow-hidden rounded-[1.35rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.78)] shadow-[0_16px_34px_-34px_rgba(48,31,13,0.32)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-[0.92rem]">
                  <thead className="border-b border-[#e6ddcd] bg-[#faf7f0] text-left text-[0.72rem] uppercase tracking-[0.24em] text-[#9a917e]">
                    <tr>
                      <th className="px-4 py-4"></th>
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4">Title</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Difficulty</th>
                      <th className="px-4 py-4">Topic</th>
                      <th className="px-4 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQuestions.map((question, index) => {
                      const isDone = completedQuestionIds.includes(question.id);

                      return (
                        <tr
                          key={question.id}
                          className="border-b border-[#ece3d4] last:border-b-0"
                        >
                          <td className="px-4 py-4 text-[#b5aa97]">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 text-[#7a715f]">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-[#2f2a23]">
                              {question.prompt}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-3 py-1 text-[0.74rem] font-medium text-[#8c816f]">
                              {question.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <DifficultyPill difficulty={question.difficulty} />
                          </td>
                          <td className="px-4 py-4 text-[#7d7465]">
                            {question.topic}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => toggleQuestionDone(question.id)}
                              className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[0.82rem] font-medium transition",
                                isDone
                                  ? "border-[#a7c89c] bg-[#e9f2e2] text-[#4f8a49]"
                                  : "border-[#ddd4c1] bg-[#faf7f0] text-[#786f5f] hover:bg-white",
                              )}
                            >
                              {isDone ? "Completed" : "Mark complete"}
                              <Clock3 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function TabButton({
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
          ? "border-[#b8d1a8] bg-[#e9f2e2] text-[#355238]"
          : "border-[#ddd4c1] bg-[#faf7f0] text-[#73695b] hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function TrackChipButton({
  active,
  children,
}: {
  active: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-[0.84rem] font-medium transition",
        active
          ? "border-[#d6a93d] bg-[#fff4db] text-[#b47a09]"
          : "border-[#ddd4c1] bg-[#faf7f0] text-[#726758] hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="inline-flex h-10 items-center rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-4 text-[0.84rem] font-medium text-[#746a5c]">
      {label}
    </span>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 items-center rounded-full border border-[#ddd4c1] bg-[#faf7f0] px-3 text-[0.76rem] font-medium text-[#746a5c]">
      {label}
    </span>
  );
}

function DifficultyPill({
  difficulty,
}: {
  difficulty: FrontendQuestion["difficulty"];
}) {
  const className =
    difficulty === "Basic"
      ? "border-[#b6d3a8] bg-[#eef6e9] text-[#5f9a54]"
      : difficulty === "Intermediate"
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

function weekTrackLabel(week: RoadmapWeek) {
  const title = week.title.toLowerCase();
  if (title.includes("react")) return "React";
  if (title.includes("redux")) return "Redux";
  if (title.includes("typescript")) return "TypeScript";
  if (title.includes("performance")) return "Performance";
  if (title.includes("dom")) return "Web APIs";
  if (title.includes("testing")) return "Testing";
  return "JS Core";
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
