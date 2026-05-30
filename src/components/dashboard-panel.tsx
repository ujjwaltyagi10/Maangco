import { ArrowRight, BookOpenCheck, Code2, Sparkles, Target } from "lucide-react";

import heroImage from "@/assets/hero.png";
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
  onOpenDsa: () => void;
  onOpenFrontend: () => void;
}

const tips = [
  "Track only solved questions that you can explain out loud without notes.",
  "Convert repeated misses into topic buckets instead of random re-attempts.",
  "Keep one frontend answer bank for system design, React internals, and performance tradeoffs.",
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
  onOpenDsa,
  onOpenFrontend,
}: DashboardPanelProps) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(245,247,242,0.76))] p-6 shadow-[0_32px_80px_-52px_rgba(15,23,42,0.55)] dark:bg-[linear-gradient(135deg,rgba(24,24,27,0.9),rgba(18,28,22,0.85))]">
          <div className="absolute inset-y-0 right-0 hidden w-72 opacity-80 lg:block">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              Structured prep workspace
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                One surface for DSA prep, frontend depth, and weekly execution.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                The old static `PrepDoc` content is now migrated into a typed React app with persistent progress,
                filtered study flows, and reusable UI.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full" onClick={onOpenDsa}>
                Open DSA tracker
                <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" onClick={onOpenFrontend}>
                Open frontend workspace
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall completion</p>
              <h3 className="text-4xl font-semibold tracking-tight text-foreground">{overallProgress}%</h3>
            </div>
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="size-6" />
            </div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#166534,#4ade80)]" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-background/80 p-3">
              <p className="text-lg font-semibold">{solvedDsaCount}</p>
              <p className="text-xs text-muted-foreground">DSA solved</p>
            </div>
            <div className="rounded-2xl bg-background/80 p-3">
              <p className="text-lg font-semibold">{completedFrontendCount}</p>
              <p className="text-xs text-muted-foreground">FE completed</p>
            </div>
            <div className="rounded-2xl bg-background/80 p-3">
              <p className="text-lg font-semibold">{completedRoadmapDays}</p>
              <p className="text-xs text-muted-foreground">Roadmap days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Code2 className="size-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">DSA company tracker</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Filter by company, difficulty, and bookmark status with saved progress in local storage.
              </p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={onOpenDsa}>
              Open
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <ProgressRow label="Solved coverage" value={dsaProgress} details={`${solvedDsaCount}/${totalDsaCount}`} />
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookOpenCheck className="size-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Frontend workspace</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Study roadmap plus question bank for React, TypeScript, testing, performance, and Node.
              </p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={onOpenFrontend}>
              Open
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            <ProgressRow
              label="Question bank"
              value={frontendProgress}
              details={`${completedFrontendCount}/${totalFrontendCount}`}
            />
            <ProgressRow
              label="Roadmap execution"
              value={roadmapProgress}
              details={`${completedRoadmapDays}/${totalRoadmapDays}`}
            />
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {tips.map((tip) => (
          <article key={tip} className="rounded-[1.5rem] border border-border/70 bg-card/80 p-5">
            <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgressRow({ label, value, details }: { label: string; value: number; details: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {details} <span className="font-semibold text-foreground">{value}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#166534,#4ade80)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
