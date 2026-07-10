import type {
  AttemptSummary,
  BankQuestion,
  Category,
  Stats,
  SubmitResult,
  TestForTaking,
  TestSummary,
} from "./types";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  categories: () => fetchJson<Category[]>("/api/categories"),

  tests: (params?: { category?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.difficulty) q.set("difficulty", params.difficulty);
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return fetchJson<TestSummary[]>(`/api/tests${qs ? `?${qs}` : ""}`);
  },

  test: (id: string) => fetchJson<TestForTaking>(`/api/tests/${id}`),

  submitTest: (
    id: string,
    body: { answers: { questionId: string; selectedOptionId: string | null }[]; timeSpentSec: number }
  ) =>
    fetchJson<SubmitResult>(`/api/tests/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  questions: (params?: { category?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.difficulty) q.set("difficulty", params.difficulty);
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return fetchJson<BankQuestion[]>(`/api/questions${qs ? `?${qs}` : ""}`);
  },

  attempts: () => fetchJson<AttemptSummary[]>("/api/attempts"),

  stats: () => fetchJson<Stats>("/api/stats"),
};
