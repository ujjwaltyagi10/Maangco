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

export interface DsaTopicTag {
  name: string;
  slug: string;
}

// A frequency signal split by recency window — either side can be null if
// the question doesn't currently appear in that window's data.
export interface DsaFrequencyWindow {
  last30d: number | null;
  last3m: number | null;
}

export interface DsaQuestion {
  id: string;
  number: number;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: DsaTopicTag[];
  frequency: DsaFrequencyWindow;
  url: string;
  // Only present on questions in the "All companies" pseudo-view — the
  // cross-company breadth signal a single company's question list doesn't have.
  companiesAsked?: number;
  companyFrequencies?: Record<string, DsaFrequencyWindow>;
}

export interface DsaCompany {
  id: string;
  name: string;
  logo: string;
  accent: string;
  questions: DsaQuestion[];
}

// The canonical "All companies" catalog entry — one per unique question,
// carrying the full cross-company breakdown rather than one company's slice.
export interface DsaAllQuestion {
  id: string;
  number: number;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: DsaTopicTag[];
  globalFrequency: DsaFrequencyWindow;
  frequencyData: {
    companiesAsked: number;
    companyFrequencies: Record<string, DsaFrequencyWindow>;
  };
  url: string;
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
