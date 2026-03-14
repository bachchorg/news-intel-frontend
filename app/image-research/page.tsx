'use client';

import { useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Search, ExternalLink, Download, ChevronLeft, ChevronRight, X, Info } from 'lucide-react';

const PAGE_SIZE = 20;

interface ImageResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  contextLink?: string;
  thumbnailLink?: string;
  width?: number;
  height?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export default function ImageResearchPage() {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);

  const totalPages = Math.ceil(allResults.length / PAGE_SIZE);

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allResults.slice(start, start + PAGE_SIZE);
  }, [allResults, page]);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/image-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Search failed');
        setAllResults([]);
        return;
      }
      setAllResults(data.items ?? []);
      setSearchedQuery(q);
      setPage(1);
    } catch {
      setError('Network error. Please try again.');
      setAllResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold text-gray-900">Image Research</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Search for images using Brave Search. Results exclude Getty Images, AFP, and AP sources.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search bar */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-900 placeholder:font-bold placeholder:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Exclusion notice */}
          <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl">
            <Info size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              Images from <strong>Getty Images</strong>, <strong>AFP</strong>, and <strong>Associated Press (AP)</strong> are
              automatically excluded from results to avoid licensing restrictions.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 max-w-2xl">
              {error}
            </div>
          )}

          {/* Results info */}
          {searchedQuery && !loading && (
            <p className="text-sm text-gray-500 mb-4">
              {allResults.length} results for &quot;{searchedQuery}&quot;
              {totalPages > 1 && ` — Page ${page} of ${totalPages}`}
            </p>
          )}

          {/* Image grid */}
          {paginatedResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
              {paginatedResults.map((img, i) => (
                <div
                  key={`${img.link}-${i}`}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.thumbnailLink || img.link}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{img.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{img.displayLink}</p>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {searchedQuery && !loading && allResults.length === 0 && !error && (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images found for &quot;{searchedQuery}&quot;</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-6">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-sm text-gray-600 px-3">Page {page} of {totalPages}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image detail modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedImage(null)}>
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 truncate pr-4">{selectedImage.title}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center gap-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden max-h-[60vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.link}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              <div className="w-full space-y-2">
                <p className="text-sm text-gray-700">{selectedImage.snippet}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Source: {selectedImage.displayLink}</span>
                  {selectedImage.width && selectedImage.height && (
                    <span>• {selectedImage.width} × {selectedImage.height}</span>
                  )}
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <a
                href={selectedImage.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={14} /> Open Image
              </a>
              {selectedImage.contextLink && (
                <a
                  href={selectedImage.contextLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink size={14} /> Visit Page
                </a>
              )}
              <a
                href={selectedImage.link}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
