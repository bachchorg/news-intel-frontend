'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { LiveFeedPanel } from '@/components/dashboard/LiveFeedPanel';
import { KeywordFrequencyChart } from '@/components/dashboard/KeywordFrequencyChart';
import { SourceDistributionChart } from '@/components/dashboard/SourceDistributionChart';
import { SentimentTrendChart } from '@/components/dashboard/SentimentTrendChart';
import { SpikeAlertBanner } from '@/components/dashboard/SpikeAlertBanner';
import { SessionControlBar } from '@/components/dashboard/SessionControlBar';
import { RateLimitPanel } from '@/components/dashboard/RateLimitPanel';
import { useSignalR } from '@/lib/signalr/useSignalR';
import { useSessionStore } from '@/store/sessionStore';
import { useArticleStore } from '@/store/articleStore';
import { sessionsApi } from '@/lib/api/sessions';
import { articlesApi } from '@/lib/api/articles';
import { Spinner } from '@/components/ui/Spinner';

function DashboardContent() {
  const searchParams = useSearchParams();
  const sessionIdParam = searchParams.get('session');
  const { activeSession, setActiveSession, setSessions, sessions, updateAnalytics } = useSessionStore();
  const { addArticles, clearArticles, setTotalCount } = useArticleStore();
  const [loading, setLoading] = useState(true);

  const currentSessionId = activeSession?.id ?? sessionIdParam ?? undefined;

  useSignalR(currentSessionId);

  useEffect(() => {
    async function loadSessions() {
      try {
        const all = await sessionsApi.list();
        setSessions(all);
        if (sessionIdParam) {
          const found = all.find((s) => s.id === sessionIdParam);
          if (found) setActiveSession(found);
        } else if (all.length > 0) {
          setActiveSession(all[0]);
        }
      } catch (err) {
        console.error('Failed to load sessions', err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeSession?.id) return;
    clearArticles();
    async function loadInitialData() {
      try {
        // First fetch to get total count
        const first = await articlesApi.list(activeSession!.id, 1, 50);
        addArticles(first.articles);
        // Load remaining pages if any
        const totalPages = Math.ceil(first.total / 50);
        for (let p = 2; p <= totalPages; p++) {
          const { articles } = await articlesApi.list(activeSession!.id, p, 50);
          addArticles(articles);
        }
        setTotalCount(first.total);
        const analytics = await sessionsApi.getAnalytics(activeSession!.id);
        updateAnalytics(analytics);
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    }
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?.id]);

  async function refreshSession() {
    if (!activeSession?.id) return;
    try {
      const updated = await sessionsApi.get(activeSession.id);
      setActiveSession(updated);
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        {activeSession ? (
          <SessionControlBar session={activeSession} onStateChange={refreshSession} />
        ) : (
          <div className="text-center py-2">
            <p className="text-gray-500 text-sm">No active session. <a href="/sessions/new" className="text-blue-600 hover:underline">Create one &#8594;</a></p>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="mb-4">
          <RateLimitPanel />
        </div>
        <SpikeAlertBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          <div className="lg:col-span-2 flex flex-col" style={{ minHeight: '600px' }}>
            <LiveFeedPanel />
          </div>
          <div className="flex flex-col gap-4">
            {sessions.length > 1 && (
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">SESSIONS</p>
                <div className="space-y-1">
                  {sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSession(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSession?.id === s.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${s.state === 'Live' ? 'bg-green-500' : s.state === 'Paused' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <KeywordFrequencyChart />
            <SourceDistributionChart />
            <SentimentTrendChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><Spinner className="w-8 h-8" /></div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
