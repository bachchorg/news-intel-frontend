'use client';

import { useState, useEffect } from 'react';
import { sessionsApi, RateLimitInfo } from '@/lib/api/sessions';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const SOURCE_LABELS: Record<string, string> = {
  newsapi: 'NewsAPI.org',
  gnews: 'GNews.io',
  thenewsapi: 'TheNewsAPI',
};

export function RateLimitPanel() {
  const [limits, setLimits] = useState<RateLimitInfo[]>([]);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const data = await sessionsApi.getRateLimits();
        setLimits(data);
      } catch {}
    }
    fetchLimits();
    const interval = setInterval(fetchLimits, 30000);
    return () => clearInterval(interval);
  }, []);

  if (limits.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold text-gray-600 mb-2">API Rate Limits</p>
      <div className="flex flex-wrap gap-3">
        {limits.map((info) => (
          <div
            key={info.sourceName}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              info.isExhausted
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}
          >
            {info.isExhausted ? (
              <AlertTriangle size={14} className="text-red-500" />
            ) : (
              <CheckCircle size={14} className="text-green-500" />
            )}
            <span>{SOURCE_LABELS[info.sourceName] ?? info.sourceName}</span>
            {info.isExhausted ? (
              <span className="text-red-600">
                Exhausted
                {info.resetsAt && (
                  <span className="ml-1 text-red-400">
                    (resets {new Date(info.resetsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-green-600">
                {info.dailyLimit ? `${info.dailyLimit}/day` : 'OK'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
