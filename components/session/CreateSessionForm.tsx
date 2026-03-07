'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionsApi } from '@/lib/api/sessions';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { KeywordBuilder } from './KeywordBuilder';
import { getSourcesByCategory, getDefaultSourceIds } from '@/lib/newsSources';

const SOURCE_CATEGORIES = getSourcesByCategory();

export function CreateSessionForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateTo, setShowDateTo] = useState(false);
  const [keywords, setKeywords] = useState<{ term: string; logic: string }[]>([]);
  const [sources, setSources] = useState<string[]>(getDefaultSourceIds());
  const [pollInterval, setPollInterval] = useState(60);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    aggregator: true,
    rss: true,
  });

  function toggleSource(id: string) {
    setSources((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }

  function toggleCategory(key: string) {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || keywords.length === 0) return;
    setLoading(true);
    try {
      const session = await sessionsApi.create({
        name,
        keywords,
        sources,
        dateRangeFrom: dateFrom || undefined,
        dateRangeTo: dateTo || undefined,
        pollIntervalSeconds: pollInterval,
      });
      router.push(`/dashboard?session=${session.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="font-semibold text-gray-800">Create Crawl Session</h2>
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-1.5 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., sếp Huyên xinh đẹp"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:italic"
                />
              </div>
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
              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} disabled={!name}>Next &#8594;</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <p className="text-xs text-gray-500 mb-3">Add keywords to monitor. Use OR (include), AND (require), NOT (exclude).</p>
                <KeywordBuilder keywords={keywords} onChange={setKeywords} />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>&#8592; Back</Button>
                <Button type="button" onClick={() => setStep(3)} disabled={keywords.length === 0}>Next &#8594;</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">News Sources</label>
                  <span className="text-xs text-gray-400">{sources.length} selected</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
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
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-900">{src.label}</p>
                                  {src.auth === 'none' && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded">FREE</span>
                                  )}
                                  {src.auth === 'oauth' && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-700 rounded">OAuth</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{src.description}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {src.newspapers.join(' / ')}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>&#8592; Back</Button>
                <Button type="submit" disabled={loading || sources.length === 0}>
                  {loading ? 'Creating...' : 'Create & Go to Dashboard'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
