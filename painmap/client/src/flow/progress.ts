/**
 * Local exercise-completion log backing the My Routine page and streak.
 * Schema (localStorage `painmap.progress.v1`):
 *   { "<YYYY-MM-DD>": ["ex-id", ...], ... }  — local dates, deduped ids.
 */

const KEY = 'painmap.progress.v1';

export type CompletionLog = Record<string, string[]>;

export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function readCompletionLog(): CompletionLog {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as CompletionLog;
    }
  } catch {
    /* malformed or storage unavailable — treat as empty */
  }
  return {};
}

/** Streak lengths worth celebrating on the completion screen. */
export const STREAK_MILESTONES: readonly number[] = [3, 7, 14, 30];

/**
 * Log a completion (deduped per exercise per day).
 * Returns true when this was today's FIRST completion — i.e. the moment the
 * daily streak actually grew — so callers can trigger milestone celebrations.
 */
export function recordCompletion(exerciseId: string, when: Date = new Date()): boolean {
  if (typeof window === 'undefined') return false;
  const log = readCompletionLog();
  const key = localDateKey(when);
  const day = log[key] ?? [];
  if (day.includes(exerciseId)) return false;
  const dayWasEmpty = day.length === 0;
  log[key] = [...day, exerciseId];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(log));
  } catch {
    /* private mode or quota — progress is best-effort */
    return false;
  }
  return dayWasEmpty;
}

/**
 * Consecutive days with ≥1 completion, counting back from today.
 * An empty today doesn't break the streak yet (it starts from yesterday),
 * matching the usual "streak survives until the day ends" convention.
 */
export function computeStreak(log: CompletionLog, today: Date = new Date()): number {
  const cursor = new Date(today);
  if (!log[localDateKey(cursor)]?.length) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (log[localDateKey(cursor)]?.length) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface DayCell {
  key: string;
  date: Date;
  done: boolean;
  isToday: boolean;
}

/** Oldest-first list of the last `n` days with their completion state. */
export function lastNDays(log: CompletionLog, n: number, today: Date = new Date()): DayCell[] {
  const out: DayCell[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    out.push({ key, date: d, done: (log[key]?.length ?? 0) > 0, isToday: i === 0 });
  }
  return out;
}
