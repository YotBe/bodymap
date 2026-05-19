import type { ProgressSnapshot } from './types';

const STORAGE_KEY = 'physiodesk.progress.snapshot.v1';

export interface ProgressRepository {
  getSnapshot(): Promise<ProgressSnapshot>;
  saveSnapshot(snapshot: ProgressSnapshot): Promise<void>;
  clear(): Promise<void>;
}

function safeRead(): ProgressSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProgressSnapshot;
  } catch {
    return null;
  }
}

function safeWrite(snapshot: ProgressSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore write failures in private mode/quota */
  }
}

export class LocalProgressRepository implements ProgressRepository {
  constructor(private readonly fallback: ProgressSnapshot) {}

  async getSnapshot(): Promise<ProgressSnapshot> {
    return safeRead() ?? this.fallback;
  }

  async saveSnapshot(snapshot: ProgressSnapshot): Promise<void> {
    safeWrite(snapshot);
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

export class SupabaseProgressRepository implements ProgressRepository {
  async getSnapshot(): Promise<ProgressSnapshot> {
    throw new Error('SupabaseProgressRepository is not implemented yet.');
  }

  async saveSnapshot(_snapshot: ProgressSnapshot): Promise<void> {
    throw new Error('SupabaseProgressRepository is not implemented yet.');
  }

  async clear(): Promise<void> {
    throw new Error('SupabaseProgressRepository is not implemented yet.');
  }
}
