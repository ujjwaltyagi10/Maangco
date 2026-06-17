import { AUTH_API_BASE_URL } from "./auth-api";

export interface ProgressState {
  dsa: {
    solved: string[];
    bookmarked: string[];
  };
  system_design: {
    completed: string[];
  };
  frontend: {
    completed: string[];
  };
  roadmap: {
    completed: string[];
  };
}

export type ProgressQuestionType = "dsa" | "system_design" | "frontend" | "roadmap";
export type ProgressAction = "solved" | "bookmarked" | "completed";

const EMPTY_PROGRESS: ProgressState = {
  dsa: { solved: [], bookmarked: [] },
  system_design: { completed: [] },
  frontend: { completed: [] },
  roadmap: { completed: [] },
};

export function emptyProgress(): ProgressState {
  return structuredClone(EMPTY_PROGRESS);
}

export async function fetchProgress(token: string): Promise<ProgressState> {
  const res = await fetch(`${AUTH_API_BASE_URL}/api/progress`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch progress");

  const data = (await res.json()) as { success: boolean; progress: ProgressState };
  return data.progress;
}

export async function toggleProgress(
  token: string,
  item: {
    questionType: ProgressQuestionType;
    questionId: string;
    action: ProgressAction;
    active: boolean;
  },
): Promise<void> {
  const res = await fetch(`${AUTH_API_BASE_URL}/api/progress/toggle`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) throw new Error("Failed to update progress");
}
