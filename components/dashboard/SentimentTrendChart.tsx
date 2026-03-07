'use client';

import { useSessionStore } from '@/store/sessionStore';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';

export function SentimentTrendChart() {
  const { sentimentTrend } = useSessionStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-800">Sentiment Trend</span>
        </div>
      </CardHeader>
      <CardBody className="p-3">
        {sentimentTrend.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={sentimentTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b98166" name="Positive" />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="#9ca3af" fill="#9ca3af66" name="Neutral" />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef444466" name="Negative" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
