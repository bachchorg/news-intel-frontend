'use client';

import { useSessionStore } from '@/store/sessionStore';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function KeywordFrequencyChart() {
  const { keywordFrequencies } = useSessionStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-800">Keyword Frequency</span>
        </div>
      </CardHeader>
      <CardBody className="p-3">
        {keywordFrequencies.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={keywordFrequencies} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="keyword" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                formatter={(val) => [val, 'Articles']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {keywordFrequencies.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
