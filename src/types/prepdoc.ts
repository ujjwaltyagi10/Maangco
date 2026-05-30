import type { LucideIcon } from "lucide-react";

export type AppPanel = "dashboard" | "dsa" | "frontend";

export interface PanelDefinition {
  id: AppPanel;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface DsaQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  frequency: number;
  tags: string[];
  url: string;
}

export interface DsaCompany {
  id: string;
  name: string;
  logo: string;
  accent: string;
  questions: DsaQuestion[];
}

export interface FrontendQuestion {
  id: string;
  category:
    | "HTML & CSS"
    | "JavaScript"
    | "React"
    | "Redux"
    | "TypeScript"
    | "Testing"
    | "Performance & Web"
    | "Build & Tools"
    | "DSA & Coding"
    | "Node & Middleware";
  topic: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  prompt: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  topic: string;
  summary?: string;
  tag?: string;
}

export interface RoadmapWeek {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  accent: string;
  days: RoadmapDay[];
}

export type QuestionId = DsaQuestion["id"];
export type FrontendQuestionId = FrontendQuestion["id"];
