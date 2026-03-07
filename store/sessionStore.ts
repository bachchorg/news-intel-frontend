import { create } from 'zustand';
import { CrawlSession } from '@/types/session';
import { KeywordFrequency, SourceDistribution, SentimentTrend, AnalyticsSnapshot } from '@/types/analytics';

interface SessionStore {
  activeSession: CrawlSession | null;
  sessions: CrawlSession[];
  keywordFrequencies: KeywordFrequency[];
  sourceDistribution: SourceDistribution[];
  sentimentTrend: SentimentTrend[];
  totalArticles: number;
  setActiveSession: (session: CrawlSession | null) => void;
  setSessions: (sessions: CrawlSession[]) => void;
  updateSession: (updated: CrawlSession) => void;
  updateSessionState: (id: string, state: string) => void;
  updateAnalytics: (data: AnalyticsSnapshot) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeSession: null,
  sessions: [],
  keywordFrequencies: [],
  sourceDistribution: [],
  sentimentTrend: [],
  totalArticles: 0,
  setActiveSession: (session) => set({ activeSession: session }),
  setSessions: (sessions) => set({ sessions }),
  updateSession: (updated) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === updated.id ? updated : s)),
      activeSession: state.activeSession?.id === updated.id ? updated : state.activeSession,
    })),
  updateSessionState: (id, newState) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, state: newState as any } : s
      ),
      activeSession:
        state.activeSession?.id === id
          ? { ...state.activeSession, state: newState as any }
          : state.activeSession,
    })),
  updateAnalytics: (data) =>
    set({
      keywordFrequencies: data.keywordFrequencies,
      sourceDistribution: data.sourceDistribution,
      sentimentTrend: data.sentimentTrend,
      totalArticles: data.totalArticles,
    }),
}));
