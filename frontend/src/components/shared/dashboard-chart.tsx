'use client';

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboardService";
import { Loader2 } from "lucide-react";

export default function DashboardChart() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const chartData = stats?.chartData || [];

  return (
    <Card className="col-span-2 border-none shadow-xl shadow-gray-100/50">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-lg font-bold text-gray-800">Financial Trends</CardTitle>
          <p className="text-xs text-gray-500 font-medium">Monthly performance tracking</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-all">Daily</button>
          <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-blue-600 text-white shadow-sm transition-all">Monthly</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] min-h-[350px] w-full flex items-center justify-center relative">
          {isLoading ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-100" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 4 }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="income" 
                  fill="#3b82f6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24}
                />
                <Bar 
                  dataKey="expense" 
                  fill="#e2e8f0" 
                  radius={[6, 6, 0, 0]} 
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400">No trend data available yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
