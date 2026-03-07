'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface KeywordBuilderProps {
  keywords: { term: string; logic: string }[];
  onChange: (keywords: { term: string; logic: string }[]) => void;
}

export function KeywordBuilder({ keywords, onChange }: KeywordBuilderProps) {
  const [term, setTerm] = useState('');
  const [logic, setLogic] = useState('or');

  function add() {
    if (!term.trim()) return;
    // Split on commas, semicolons, or newlines to allow bulk entry
    const parts = term.split(/[,;\n]+/).map((t) => t.trim()).filter(Boolean);
    const newKeywords = parts.map((t) => ({ term: t, logic }));
    onChange([...keywords, ...newKeywords]);
    setTerm('');
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <select
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-20"
        >
          <option value="or">OR</option>
          <option value="and">AND</option>
          <option value="not">NOT</option>
        </select>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Enter keyword(s) — separate with commas..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:italic"
        />
        <Button size="sm" onClick={add} type="button">
          <Plus size={14} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-blue-50 border border-blue-200 text-blue-800">
            <span className="text-blue-400 text-xs font-bold uppercase">{kw.logic}</span>
            {kw.term}
            <button type="button" onClick={() => onChange(keywords.filter((_, j) => j !== i))}>
              <X size={12} className="text-blue-400 hover:text-blue-700" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
