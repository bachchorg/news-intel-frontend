'use client';

import { useAlertStore } from '@/store/alertStore';
import { AlertTriangle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function SpikeAlertBanner() {
  const { alerts, dismissAlert } = useAlertStore();

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {alerts.map((alert) => (
        <div key={alert.keyword} className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg">
          <AlertTriangle className="text-amber-500 shrink-0" size={18} />
          <div className="flex-1 text-sm">
            <span className="font-semibold text-amber-800">Spike detected:</span>{' '}
            <span className="text-amber-700">
              &quot;{alert.keyword}&quot; jumped from {alert.previousCount} to {alert.currentCount} articles (+{alert.increasePercent}%) in the last hour
            </span>
            <span className="text-amber-500 text-xs ml-2">{formatDate(alert.detectedAt)}</span>
          </div>
          <button onClick={() => dismissAlert(alert.keyword)} className="text-amber-500 hover:text-amber-700">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
