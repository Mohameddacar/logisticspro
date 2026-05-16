'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
  color: 'blue' | 'green' | 'dark-green' | 'red';
  progress?: number;
}

const colorMap = {
  blue: {
    border: 'border-blue-500',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    progress: 'bg-blue-500',
  },
  green: {
    border: 'border-green-500',
    text: 'text-green-600',
    bg: 'bg-green-50',
    progress: 'bg-green-500',
  },
  'dark-green': {
    border: 'border-emerald-700',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    progress: 'bg-emerald-700',
  },
  red: {
    border: 'border-rose-400',
    text: 'text-rose-500',
    bg: 'bg-rose-50',
    progress: 'bg-rose-500',
  },
};

export default function StatCard({ 
  title, 
  amount, 
  trend, 
  trendDirection, 
  subtitle, 
  color,
  progress 
}: StatCardProps) {
  const styles = colorMap[color];

  return (
    <Card className={cn("p-6 relative overflow-hidden border-l-4", styles.border)}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        {trend && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
            trendDirection === 'up' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{amount}</h3>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>

      {progress !== undefined ? (
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", styles.progress)} 
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : (
        <div className="flex gap-1 h-8 items-end">
          {[40, 70, 45, 90, 65, 80].map((h, i) => (
            <div 
              key={i} 
              className={cn("w-full rounded-sm opacity-30", styles.progress)} 
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
