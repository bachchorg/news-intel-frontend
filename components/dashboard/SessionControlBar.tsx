'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CrawlSession } from '@/types/session';
import { Button } from '@/components/ui/Button';
import { sessionsApi } from '@/lib/api/sessions';
import { downloadFile } from '@/lib/utils';
import { Play, Pause, Square, Download, FileText, ChevronDown, Pencil, Trash2 } from 'lucide-react';

interface SessionControlBarProps {
  session: CrawlSession;
  onStateChange?: () => void;
}

const STATE_BADGE: Record<string, string> = {
  Idle: 'bg-gray-100 text-gray-600',
  Backfilling: 'bg-blue-100 text-blue-700',
  Live: 'bg-green-100 text-green-700',
  Paused: 'bg-yellow-100 text-yellow-700',
  Stopped: 'bg-red-100 text-red-700',
};

export function SessionControlBar({ session, onStateChange }: SessionControlBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);

  async function doAction(action: 'start' | 'pause' | 'stop') {
    setLoading(true);
    try {
      if (action === 'start') await sessionsApi.start(session.id);
      else if (action === 'pause') await sessionsApi.pause(session.id);
      else await sessionsApi.stop(session.id);
      onStateChange?.();
    } finally {
      setLoading(false);
    }
  }

  async function exportData(format: 'csv' | 'json') {
    setExportOpen(false);
    const res = format === 'csv'
      ? await sessionsApi.exportCsv(session.id)
      : await sessionsApi.exportJson(session.id);
    await downloadFile(res, `session-${session.id.slice(0, 8)}-export.${format}`);
  }

  async function getSummary() {
    const { summary } = await sessionsApi.getSummary(session.id);
    setSummaryText(summary);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm">
      <div>
        <p className="text-xs text-gray-500">Session</p>
        <p className="font-semibold text-gray-900 text-sm">{session.name}</p>
      </div>

      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATE_BADGE[session.state] ?? 'bg-gray-100 text-gray-600'}`}>
        {session.state === 'Live' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />}
        {session.state}
      </span>

      <div className="flex items-center gap-2 ml-auto">
        {(session.state === 'Idle' || session.state === 'Paused' || session.state === 'Stopped') && (
          <Button size="sm" onClick={() => doAction('start')} disabled={loading}>
            <Play size={14} className="mr-1" /> {session.state === 'Paused' ? 'Resume' : 'Start'}
          </Button>
        )}
        {(session.state === 'Live' || session.state === 'Backfilling') && (
          <Button size="sm" variant="secondary" onClick={() => doAction('pause')} disabled={loading}>
            <Pause size={14} className="mr-1" /> Pause
          </Button>
        )}
        {(session.state === 'Live' || session.state === 'Backfilling' || session.state === 'Paused') && (
          <Button size="sm" variant="danger" onClick={() => doAction('stop')} disabled={loading}>
            <Square size={14} className="mr-1" /> Stop
          </Button>
        )}

        <div className="relative">
          <Button size="sm" variant="secondary" onClick={() => setExportOpen(!exportOpen)}>
            <Download size={14} className="mr-1" /> Export <ChevronDown size={12} className="ml-1" />
          </Button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button onClick={() => exportData('csv')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">CSV</button>
              <button onClick={() => exportData('json')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">JSON</button>
            </div>
          )}
        </div>

        <Link href={`/sessions/${session.id}/edit`}>
          <Button size="sm" variant="secondary">
            <Pencil size={14} className="mr-1" /> Edit
          </Button>
        </Link>

        <Button size="sm" variant="ghost" onClick={getSummary}>
          <FileText size={14} className="mr-1" /> Summary
        </Button>

        <Button size="sm" variant="danger" onClick={async () => {
          if (!confirm('Delete this session and all its articles?')) return;
          await sessionsApi.delete(session.id);
          router.push('/sessions');
        }}>
          <Trash2 size={14} className="mr-1" /> Delete
        </Button>
      </div>

      {summaryText && (
        <div className="w-full mt-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600">Intelligence Brief</span>
              <button onClick={() => setSummaryText(null)} className="text-gray-400 hover:text-gray-600 text-xs">&#x2715;</button>
            </div>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{summaryText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
