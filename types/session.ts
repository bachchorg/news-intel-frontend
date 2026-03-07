export type SessionState = 'Idle' | 'Backfilling' | 'Live' | 'Paused' | 'Stopped';

export interface SessionKeyword {
  id: number;
  term: string;
  logic: 'and' | 'or' | 'not';
}

export interface SessionSource {
  id: number;
  sourceName: string;
  isEnabled: boolean;
}

export interface CrawlSession {
  id: string;
  name: string;
  state: SessionState;
  createdAt: string;
  startedAt?: string;
  stoppedAt?: string;
  dateRangeFrom?: string;
  dateRangeTo?: string;
  pollIntervalSeconds: number;
  keywords: SessionKeyword[];
  sources: SessionSource[];
}

export interface UpdateSessionRequest {
  name?: string;
  keywords?: { term: string; logic: string }[];
  sources?: string[];
  dateRangeFrom?: string;
  dateRangeTo?: string;
  pollIntervalSeconds?: number;
}

export interface CreateSessionRequest {
  name: string;
  keywords: { term: string; logic: string }[];
  sources: string[];
  dateRangeFrom?: string;
  dateRangeTo?: string;
  pollIntervalSeconds: number;
}
