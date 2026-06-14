export type AppPanel = "dashboard" | "dsa" | "system-design" | "frontend";

export type SystemDesignFrequency = "High" | "Medium" | "Low";

export type SystemDesignLevel = "HLD" | "LLD" | "Both";

export type SystemDesignCategory =
  | "Infrastructure"
  | "Messaging & Streaming"
  | "Storage & Data"
  | "Product & Social"
  | "Search & Geo"
  | "Finance & Payments"
  | "Distributed Systems"
  | "AI & ML Systems";

export interface SystemDesignQuestion {
  id: string;
  number: number;
  title: string;
  companies: string[];
  frequency: SystemDesignFrequency;
  designLevel: SystemDesignLevel;
  category: SystemDesignCategory;
  timeframe: string;
  articleUrl: string;
}

export type SystemDesignQuestionId = SystemDesignQuestion["id"];

export interface DsaQuestion {
  id: string;
  number: number;
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
