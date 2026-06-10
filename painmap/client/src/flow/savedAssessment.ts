import type { AssessmentAnswers, AssessmentResult } from './types';

/** The assessment snapshot persisted by "Save Routine to Favorites". */
export interface SavedAssessment {
  answers: AssessmentAnswers;
  result: AssessmentResult;
}

const KEY = 'painmap.assessment.result';

export function readSavedAssessment(): SavedAssessment | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedAssessment) : null;
    if (parsed?.result?.primaryTrack) return parsed;
  } catch {
    /* malformed save — treat as absent */
  }
  return null;
}

export function saveAssessment(answers: AssessmentAnswers, result: AssessmentResult): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ answers, result }));
  } catch {
    /* private mode or quota — saving is best-effort */
  }
}
