'use client';

import { useSessionStore } from '@/store/sessionStore';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChartIcon } from 'lucide-react';

const COLORS = ['#1a1a1a', '#052962', '#e85d04', '#6b7280', '#9333ea'];

export function SourceDistributionChart() {
  const { sourceDistribution } = useSessionStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChartIcon size={16} className="text-gray-500" />
          <span className="font-semibold text-gray-800">Source Distribution</span>
        </div>
      </CardHeader>
      <CardBody className="p-3">
        {sourceDistribution.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={sourceDistribution}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={65}
                label={(props) => {
                  const pct = (props as { percentage?: number }).percentage;
                  return pct != null ? `${pct}%` : '';
                }}
                labelLine={false}
              >
                {sourceDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                formatter={(val, name) => [val, name]}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
}
