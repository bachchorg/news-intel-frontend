'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionsApi } from '@/lib/api/sessions';
import { CrawlSession } from '@/types/session';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { KeywordBuilder } from './KeywordBuilder';
import { getSourcesByCategory } from '@/lib/newsSources';

const SOURCE_CATEGORIES = getSourcesByCategory();

interface EditSessionFormProps {
  sessionId: string;
}

export function EditSessionForm({ sessionId }: EditSessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState<CrawlSession | null>(null);
  const [name, setName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateTo, setShowDateTo] = useState(false);
  const [keywords, setKeywords] = useState<{ term: string; logic: string }[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [pollInterval, setPollInterval] = useState(60);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    aggregator: true,
    rss: true,
  });

  useEffect(() => {
    sessionsApi.get(sessionId).then((s) => {
      setSession(s);
      setName(s.name);
      setDateFrom(s.dateRangeFrom ? s.dateRangeFrom.slice(0, 16) : '');
      setDateTo(s.dateRangeTo ? s.dateRangeTo.slice(0, 16) : '');
      setShowDateTo(!!s.dateRangeTo);
      setKeywords(s.keywords.map((k) => ({ term: k.term, logic: k.logic })));
      setSources(s.sources.filter((src) => src.isEnabled).map((src) => src.sourceName));
      setPollInterval(s.pollIntervalSeconds);
      setLoading(false);
    }).catch(() => {
      router.push('/sessions');
    });
  }, [sessionId, router]);

  function toggleSource(id: string) {
    setSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function toggleCategory(key: string) {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || keywords.length === 0) return;
    setSaving(true);
    try {
      await sessionsApi.update(sessionId, {
        name,
        keywords,
        sources,
        dateRangeFrom: dateFrom || undefined,
        dateRangeTo: dateTo || undefined,
        pollIntervalSeconds: pollInterval,
      });
      router.push(`/dashboard?session=${sessionId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardBody className="flex justify-center py-12">
          <Spinner className="w-8 h-8" />
        </CardBody>
      </Card>
    );
  }

  const isRunning = session?.state === 'Live' || session?.state === 'Backfilling';

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="font-semibold text-gray-800">Edit Session</h2>
        {isRunning && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            Session is running — changes apply on next poll
          </span>
        )}
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input type="datetime-local" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date (optional)</label>
              {showDateTo ? (
                <div className="flex gap-2">
                  <input type="datetime-local" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={() => { setShowDateTo(false); setDateTo(''); }}
                    className="px-2 text-gray-400 hover:text-gray-600 text-sm" title="Remove end date">&#x2715;</button>
                </div>
              ) : (
                <button type="button" onClick={() => setShowDateTo(true)}
                  className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors text-left">
                  + Set end date
                </button>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
            <KeywordBuilder keywords={keywords} onChange={setKeywords} />
          </div>

          {/* Sources */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">News Sources</label>
              <span className="text-xs text-gray-400">{sources.length} selected</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {(Object.entries(SOURCE_CATEGORIES) as [string, { label: string; sources: typeof SOURCE_CATEGORIES.aggregator.sources }][]).map(([key, cat]) => (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(key)}
                    className="flex items-center gap-2 w-full text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-1 hover:text-gray-700"
                  >
                    <span className={`transition-transform ${expandedCategories[key] ? 'rotate-90' : ''}`}>&#9654;</span>
                    {cat.label}
                    <span className="text-gray-400 font-normal normal-case">
                      ({cat.sources.filter((s) => sources.includes(s.id)).length}/{cat.sources.length})
                    </span>
                  </button>
                  {expandedCategories[key] && (
                    <div className="space-y-1.5 mt-1">
                      {cat.sources.map((src) => (
                        <label key={src.id} className="flex items-start gap-3 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={sources.includes(src.id)}
                            onChange={() => toggleSource(src.id)}
                            className="mt-0.5"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">{src.label}</p>
                            <p className="text-xs text-gray-500">{src.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Poll interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poll Interval: {pollInterval}s
            </label>
            <input type="range" min={30} max={300} step={30} value={pollInterval} onChange={(e) => setPollInterval(+e.target.value)}
              className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30s (faster)</span><span>300s (slower)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={saving || !name || keywords.length === 0 || sources.length === 0}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
