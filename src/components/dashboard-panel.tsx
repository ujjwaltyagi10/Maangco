import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Flame,
  Gauge,
  Lightbulb,
  Rocket,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardPanelProps {
  dsaProgress: number;
  frontendProgress: number;
  roadmapProgress: number;
  overallProgress: number;
  solvedDsaCount: number;
  totalDsaCount: number;
  completedFrontendCount: number;
  totalFrontendCount: number;
  completedRoadmapDays: number;
  totalRoadmapDays: number;
  companyCount: number;
  onOpenDsa: () => void;
  onOpenFrontend: () => void;
}

const tips = [
  {
    title: "Consistency beats intensity",
    copy: "1 hour daily beats 8 hours on weekends. Use the 45-day roadmap.",
    icon: Gauge,
  },
  {
    title: "JS fundamentals first",
    copy: "Closures, event loop, and prototypes are asked in most frontend rounds.",
    icon: Lightbulb,
  },
  {
    title: "Build, don't just read",
    copy: "Implement debounce, throttle, and LRU cache from scratch.",
    icon: Rocket,
  },
  {
    title: "High-freq DSA first",
    copy: "Focus on 80%+ frequency problems. Sliding window and two pointers cover many rounds.",
    icon: Flame,
  },
  {
    title: "Explain as you code",
    copy: "Interviewers value communication. Think out loud even when stuck.",
    icon: CheckCircle2,
  },
];

export function DashboardPanel({
  dsaProgress,
  frontendProgress,
  roadmapProgress,
  overallProgress,
  solvedDsaCount,
  totalDsaCount,
  completedFrontendCount,
  totalFrontendCount,
  completedRoadmapDays,
  totalRoadmapDays,
  companyCount,
  onOpenDsa,
  onOpenFrontend,
}: DashboardPanelProps) {
  const solvedProblemsCount = solvedDsaCount + completedFrontendCount;

  return (
    <section className="space-y-4">
      <article className="grid gap-4 rounded-[2rem] border border-[#ddd4c1] bg-[linear-gradient(180deg,#fbfaf5_0%,#f7f2e7_100%)] p-6 shadow-[0_22px_50px_-44px_rgba(48,31,13,0.45)] lg:grid-cols-[minmax(0,1fr)_148px] lg:items-center lg:p-7">
        <div className="space-y-3">
          <h2 className="text-[2.15rem] font-semibold leading-[1.02] tracking-tight text-[#28231d] sm:text-[2.75rem]">
            Welcome back,
            <span className="block text-[#4f8a49]">
              let&apos;s get interview ready 🚀
            </span>
          </h2>
          <p className="max-w-2xl text-[0.95rem] leading-7 text-[#6f6658] sm:text-[1.02rem]">
            Track your DSA practice across top companies and master frontend
            interview questions - all in one place.
          </p>
        </div>

        <div className="justify-self-start lg:justify-self-end">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#b9d8ae] bg-[#f7faf4] text-center text-[#4f8a49] shadow-[0_16px_36px_-30px_rgba(77,140,73,0.75)]">
            <div>
              <div className="text-3xl font-semibold leading-none">
                {solvedProblemsCount}
              </div>
              <div className="mt-1 text-[0.78rem] font-semibold uppercase tracking-[0.18em]">
                Solved
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[0.8rem] text-[#a1947f]">
            problems done
          </p>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <FeatureCard
          tag="LeetCode"
          icon={<Code2 className="size-5 text-[#f2ab3a]" />}
          title="DSA Practice"
          description="Company-wise LeetCode questions for Google, Meta, Amazon, Apple, Netflix and more. Track frequency and your solve status."
          stats={[
            { value: solvedDsaCount, label: "Solved" },
            { value: 640, label: "Total" },
            { value: companyCount, label: "Companies" },
          ]}
          accent="#5f9a54"
          onOpen={onOpenDsa}
        />

        <FeatureCard
          tag="45-Day Roadmap"
          icon={<BookOpenCheck className="size-5 text-[#0e8e8a]" />}
          title="Frontend Interview Prep"
          description="Structured 45-day roadmap covering JS, React, Redux, TypeScript, Testing, Performance + real interview questions."
          stats={[
            { value: completedFrontendCount, label: "Done" },
            { value: totalFrontendCount, label: "Questions" },
            { value: totalRoadmapDays, label: "Days" },
          ]}
          accent="#4d8c49"
          onOpen={onOpenFrontend}
        />
      </div>

      <article className="rounded-[1.5rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_16px_36px_-34px_rgba(48,31,13,0.35)]">
        <div className="flex items-center gap-2 text-[0.95rem] font-semibold text-[#3f3529]">
          <span className="size-2 rounded-full bg-[#4f8a49]" />
          Overall Progress
        </div>
        <div className="mt-4 space-y-3">
          <ProgressRow label="DSA Problems Solved" value={dsaProgress} />
          <ProgressRow
            label="Frontend Questions Done"
            value={frontendProgress}
          />
          <ProgressRow
            label="Combined Progress"
            value={overallProgress}
            accent="#d18b22"
          />
        </div>
        <p className="mt-3 text-xs leading-6 text-[#9b9080]">
          DSA set: {solvedDsaCount}/{totalDsaCount} solved • Roadmap:{" "}
          {completedRoadmapDays}/{totalRoadmapDays} days • Roadmap completion{" "}
          {roadmapProgress}%
        </p>
      </article>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[0.95rem] font-semibold text-[#3f3529]">
          <span className="size-2 rounded-full bg-[#c8892b]" />
          Interview Tips
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {tips.map((tip) => (
            <article
              key={tip.title}
              className="rounded-[1.25rem] border border-[#e3d8c4] bg-white/75 p-4 shadow-[0_16px_30px_-32px_rgba(48,31,13,0.32)]"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[#f4efe4] text-[#c8892b]">
                <tip.icon className="size-4" />
              </div>
              <h3 className="mt-3 text-[0.94rem] font-semibold text-[#30271f]">
                {tip.title}
              </h3>
              <p className="mt-2 text-[0.84rem] leading-6 text-[#6f6658]">
                {tip.copy}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function FeatureCard({
  tag,
  icon,
  title,
  description,
  stats,
  accent,
  onOpen,
}: {
  tag: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: Array<{ value: number; label: string }>;
  accent: string;
  onOpen: () => void;
}) {
  return (
    <article className="rounded-[1.5rem] border border-[#ddd4c1] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_18px_40px_-34px_rgba(48,31,13,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[#f4efe4] shadow-[0_8px_16px_-14px_rgba(48,31,13,0.3)]">
          {icon}
        </div>
        <span className="rounded-full border border-[#ddd4c1] bg-[#faf6ef] px-3 py-1 text-[0.72rem] font-semibold text-[#8a806f]">
          {tag}
        </span>
      </div>

      <h3 className="mt-5 text-[1.15rem] font-semibold tracking-tight text-[#2c261f]">
        {title}
      </h3>
      <p className="mt-2 text-[0.84rem] leading-6 text-[#6f6658]">
        {description}
      </p>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex items-end gap-5">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-[1.05rem] font-semibold text-[#2c261f]">
                {formatCardStat(stat.label, stat.value)}
              </div>
              <div className="mt-0.5 text-[0.72rem] text-[#a1947f]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="h-10 rounded-full border-[#a7c497] bg-[#eff7e9] px-4 text-[#4f8a49] hover:bg-[#e7f1df]"
          onClick={onOpen}
        >
          Open
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ece3d5]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(22, Math.min(100, stats[0].value))}%`,
            backgroundColor: accent,
          }}
        />
      </div>
    </article>
  );
}

function ProgressRow({
  label,
  value,
  accent = "#5f9a54",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="grid grid-cols-[170px_minmax(0,1fr)_40px] items-center gap-4 text-[0.9rem] sm:grid-cols-[210px_minmax(0,1fr)_44px]">
      <span className="font-medium text-[#5b5247]">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e9e1d4]">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: accent }}
        />
      </div>
      <span className="text-right font-semibold text-[#a1947f]">{value}%</span>
    </div>
  );
}

function formatCardStat(label: string, value: number) {
  if (label === "Total" && value >= 640) {
    return `${Math.floor(value / 10) * 10}+`;
  }

  return value;
}
