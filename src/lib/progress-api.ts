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
  queueBatch(token, item);
}

// ── Debounced batch sync ──────────────────────────────────────
// Collects toggles fired within 600ms and sends them as one request.
// localStorage is the immediate source of truth; this is background sync.

interface BatchItem {
  questionType: ProgressQuestionType;
  questionId: string;
  action: ProgressAction;
  active: boolean;
}

let _batchToken = "";
const _queue: BatchItem[] = [];
let _timer: ReturnType<typeof setTimeout> | null = null;

function queueBatch(token: string, item: BatchItem) {
  _batchToken = token;
  _queue.push(item);
  if (_timer) clearTimeout(_timer);
  _timer = setTimeout(flushBatch, 600);
}

function flushBatch() {
  if (_queue.length === 0) return;
  const items = _queue.splice(0);
  const token = _batchToken;
  sendWithRetry(token, items, 3);
}

function sendWithRetry(token: string, items: BatchItem[], retriesLeft: number) {
  fetch(`${AUTH_API_BASE_URL}/api/progress/batch`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  }).catch(() => {
    if (retriesLeft > 0) {
      setTimeout(() => sendWithRetry(token, items, retriesLeft - 1), 2000);
    }
  });
}
