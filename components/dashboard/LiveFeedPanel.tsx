'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useArticleStore } from '@/store/articleStore';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Newspaper, Radio, ChevronLeft, ChevronRight, Search, Volume2, VolumeX, Calendar } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

export function LiveFeedPanel() {
  const { articles, totalCount } = useArticleStore();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sourceFilter, setSourceFilter] = useState('');
  const [keywordFilter, setKeywordFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevCountRef = useRef(articles.length);
  const audioRef = useRef<AudioContext | null>(null);

  // Unique sources and keywords for filter dropdowns
  const uniqueSources = useMemo(() => {
    const set = new Set(articles.map((a) => a.source));
    return Array.from(set).sort();
  }, [articles]);

  const uniqueKeywords = useMemo(() => {
    const set = new Set(articles.flatMap((a) => a.keywordsMatched));
    return Array.from(set).sort();
  }, [articles]);

  // Filtered articles
  const filtered = useMemo(() => {
    let result = articles;
    if (sourceFilter) {
      result = result.filter((a) => a.source === sourceFilter);
    }
    if (keywordFilter) {
      result = result.filter((a) => a.keywordsMatched.includes(keywordFilter));
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((a) => new Date(a.publishedAt).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime();
      result = result.filter((a) => new Date(a.publishedAt).getTime() <= to);
    }
    return result.slice().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles, sourceFilter, keywordFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reset to page 1 when filters or page size change
  useEffect(() => { setPage(1); }, [sourceFilter, keywordFilter, dateFrom, dateTo, pageSize]);

  // Clamp page when total pages shrinks
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // Play notification sound when new articles arrive
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext not available — ignore silently
    }
  }, []);

  useEffect(() => {
    if (articles.length > prevCountRef.current && soundEnabled) {
      playNotificationSound();
    }
    prevCountRef.current = articles.length;
  }, [articles.length, soundEnabled, playNotificationSound]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-800">Live Feed</span>
          {totalCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {totalCount} articles
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title={soundEnabled ? 'Mute notifications' : 'Unmute notifications'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </CardHeader>

      {/* Filters */}
      {articles.length > 0 && (
        <div className="px-3 py-2.5 border-b border-gray-200 bg-gray-50/50 flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[140px]">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-2 pr-6 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All sources</option>
              {uniqueSources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1 min-w-[140px]">
            <select
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-2 pr-6 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All keywords</option>
              {uniqueKeywords.map((kw) => (
                <option key={kw} value={kw}>{kw}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 min-w-[160px]">
            <Calendar size={14} className="text-gray-500 shrink-0" />
            <input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="From date"
            />
          </div>
          <div className="flex items-center gap-1.5 min-w-[160px]">
            <span className="text-xs text-gray-500 font-medium shrink-0">to</span>
            <input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="To date"
            />
          </div>
          {(sourceFilter || keywordFilter || dateFrom || dateTo) && (
            <button
              onClick={() => { setSourceFilter(''); setKeywordFilter(''); setDateFrom(''); setDateTo(''); }}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Article list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
            {articles.length === 0 ? (
              <>
                <Radio size={36} className="opacity-30" />
                <p className="text-sm">No articles yet. Start a crawl session.</p>
              </>
            ) : (
              <>
                <Search size={36} className="opacity-30" />
                <p className="text-sm">No articles match your filters.</p>
              </>
            )}
          </div>
        ) : (
          paginated.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-500">
            {filtered.length > 0 ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}` : '0 articles'}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-gray-600 px-2 font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
