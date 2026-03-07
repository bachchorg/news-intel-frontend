'use client';

import { useEffect } from 'react';
import { getHubConnection, startConnection } from './hubConnection';
import { useArticleStore } from '@/store/articleStore';
import { useSessionStore } from '@/store/sessionStore';
import { useAlertStore } from '@/store/alertStore';
import { Article } from '@/types/article';
import { SpikeAlert, AnalyticsSnapshot } from '@/types/analytics';

export function useSignalR(sessionId: string | null | undefined) {
  const addArticles = useArticleStore((s) => s.addArticles);
  const updateSessionState = useSessionStore((s) => s.updateSessionState);
  const updateAnalytics = useSessionStore((s) => s.updateAnalytics);
  const addAlert = useAlertStore((s) => s.addAlert);

  useEffect(() => {
    if (!sessionId) return;
    const conn = getHubConnection();

    startConnection()
      .then(() => conn.invoke('JoinSession', sessionId))
      .catch(console.error);

    const onNewArticles = (articles: Article[]) => addArticles(articles);
    const onStateChanged = (data: { sessionId: string; state: string }) =>
      updateSessionState(data.sessionId, data.state);
    const onAnalytics = (data: AnalyticsSnapshot) => updateAnalytics(data);
    const onSpike = (alert: SpikeAlert) => addAlert(alert);

    conn.on('NewArticles', onNewArticles);
    conn.on('SessionStateChanged', onStateChanged);
    conn.on('AnalyticsUpdated', onAnalytics);
    conn.on('SpikeAlert', onSpike);

    return () => {
      conn.invoke('LeaveSession', sessionId).catch(console.error);
      conn.off('NewArticles', onNewArticles);
      conn.off('SessionStateChanged', onStateChanged);
      conn.off('AnalyticsUpdated', onAnalytics);
      conn.off('SpikeAlert', onSpike);
    };
  }, [sessionId, addArticles, updateSessionState, updateAnalytics, addAlert]);
}
