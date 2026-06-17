import { AUTH_API_BASE_URL } from "./auth-api";
import type { DsaQuestion, SystemDesignQuestion, FrontendQuestion, RoadmapWeek } from "@/types/maangco";
import { COMPANY_LOGOS } from "./company-logos";

const BASE = AUTH_API_BASE_URL;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DsaCompanyMeta {
  id: string;
  name: string;
  accent: string;
}

// ── DSA ───────────────────────────────────────────────────────

export async function fetchDsaCompanies(): Promise<DsaCompanyMeta[]> {
  const res = await fetch(`${BASE}/api/questions/dsa/companies`);
  if (!res.ok) throw new Error("Failed to load companies");
  const data = await res.json() as { success: boolean; companies: DsaCompanyMeta[] };
  return data.companies;
}

export interface DsaCompanyWithQuestions extends DsaCompanyMeta {
  logo: string;
  questions: DsaQuestion[];
}

export async function fetchDsaGrouped(): Promise<DsaCompanyWithQuestions[]> {
  const res = await fetch(`${BASE}/api/questions/dsa/grouped`);
  if (!res.ok) throw new Error("Failed to load DSA data");
  const data = await res.json() as { success: boolean; companies: DsaCompanyWithQuestions[] };
  // Attach static logo assets (images can't be served from the backend)
  return data.companies.map((c) => ({ ...c, logo: COMPANY_LOGOS[c.name] ?? "" }));
}

export async function fetchDsaQuestions(params: {
  company?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: DsaQuestion[]; pagination: Pagination }> {
  const url = new URL(`${BASE}/api/questions/dsa`);
  if (params.company) url.searchParams.set("company", params.company);
  if (params.difficulty) url.searchParams.set("difficulty", params.difficulty);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load DSA questions");
  return res.json() as Promise<{ data: DsaQuestion[]; pagination: Pagination }>;
}

// ── System Design ─────────────────────────────────────────────

export async function fetchSystemDesignQuestions(params: {
  category?: string;
  frequency?: string;
  designLevel?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: SystemDesignQuestion[]; pagination: Pagination }> {
  const url = new URL(`${BASE}/api/questions/system-design`);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.frequency) url.searchParams.set("frequency", params.frequency);
  if (params.designLevel) url.searchParams.set("designLevel", params.designLevel);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load SD questions");
  return res.json() as Promise<{ data: SystemDesignQuestion[]; pagination: Pagination }>;
}

// ── Frontend ──────────────────────────────────────────────────

export async function fetchFrontendQuestions(params: {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: FrontendQuestion[]; pagination: Pagination }> {
  const url = new URL(`${BASE}/api/questions/frontend`);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.difficulty) url.searchParams.set("difficulty", params.difficulty);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load frontend questions");
  return res.json() as Promise<{ data: FrontendQuestion[]; pagination: Pagination }>;
}

// ── Roadmap ───────────────────────────────────────────────────

export async function fetchRoadmap(): Promise<RoadmapWeek[]> {
  const res = await fetch(`${BASE}/api/questions/roadmap`);
  if (!res.ok) throw new Error("Failed to load roadmap");
  const data = await res.json() as { success: boolean; weeks: RoadmapWeek[] };
  return data.weeks;
}
