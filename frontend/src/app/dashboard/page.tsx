'use client';

import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight, Plus } from "lucide-react";

import StatCard from "@/components/shared/stat-card";
import DashboardChart from "@/components/shared/dashboard-chart";
import TransactionTable from "@/components/shared/transaction-table";
import TransactionModal from "@/components/shared/transaction-modal";
import ErrorBoundary from "@/components/shared/error-boundary";
import DashboardSkeleton from "@/components/shared/dashboard-skeleton";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { getDashboardStats } from "@/services/dashboardService";
import { Transaction } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');

  const { data: stats, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    retry: 1,
    staleTime: 10000,
  });

  const openModal = (type: 'income' | 'expense') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    const is401 = (error as any).response?.status === 401;
    if (is401) {
      if (typeof window !== 'undefined') window.location.href = '/login?expired=true';
      return null;
    }

    return (
      <div className="p-12 text-center bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center">
        <h2 className="text-xl font-bold text-red-700">Service Unavailable</h2>
        <p className="text-red-600 mt-2">Error: {(error as Error).message}</p>
        <Button className="mt-6 bg-red-600 hover:bg-red-700 font-bold px-8 h-11" onClick={() => refetch()}>
          Retry Request
        </Button>
      </div>
    );
  }

  // Handle case where API returns success but empty/null data
  if (!stats && !isFetching) {
    return (
      <div className="p-12 text-center bg-blue-50 rounded-2xl border border-blue-100">
        <h2 className="text-xl font-bold text-blue-700">No Dashboard Data</h2>
        <p className="text-blue-600 mt-2">The server returned an empty response. Please check your data or try again.</p>
        <Button className="mt-6 bg-blue-600" onClick={() => refetch()}>Refresh Data</Button>
      </div>
    );
  }

  const formatCurrency = (amount: number | string | undefined) => {
    const val = Number(amount || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const formattedTransactions = stats?.recentTransactions?.map((t: Transaction) => ({
    ...t,
    date: format(new Date(t.date || new Date()), 'MMM dd, yyyy'),
    status: 'Settled' as const,
    amount: t.type === 'expense' ? -Number(t.amount) : Number(t.amount),
    category: t.category?.name || 'General', // Match TransactionTable's expectation
    description: t.description || 'No description'
  })) || [];

  const profitMargin = stats?.totalIncome 
    ? Math.round(((Number(stats.balance || 0)) / (Number(stats.totalIncome || 1))) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fleet Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time financial overview of your logistics operations.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => openModal('expense')}
            variant="outline" 
            className="h-11 px-6 border-blue-200 text-blue-700 font-bold gap-2 hover:bg-blue-50 transition-all rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
          <Button 
            onClick={() => openModal('income')}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200 transition-all rounded-xl"
          >
            <Plus className="w-4 h-4" /> Add Income
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          amount={formatCurrency(stats?.totalIncome || 0)} 
          trend="12.5%" 
          trendDirection="up" 
          color="green" 
        />
        <StatCard 
          title="Total Expenses" 
          amount={formatCurrency(stats?.totalExpenses || 0)} 
          trend="4.2%" 
          trendDirection="down" 
          color="blue" 
        />
        <StatCard 
          title="Net Balance" 
          amount={formatCurrency(stats?.balance || 0)} 
          trend="8.1%" 
          trendDirection="up" 
          color="dark-green" 
        />
        <StatCard 
          title="Profit Margin" 
          amount={`${profitMargin}%`}
          subtitle="Operating Margin"
          color="red" 
          progress={profitMargin}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        
        <Card className="border-none shadow-xl shadow-gray-100/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formattedTransactions.length > 0 ? (
              formattedTransactions.slice(0, 5).map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", 
                    item.type === 'income' ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                  )}>
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-transparent text-[10px] font-bold">
                        {item.type === 'income' ? 'IN' : 'EX'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.date} • {formatCurrency(Math.abs(Number(item.amount)))}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-400">No recent activity found.</p>
              </div>
            )}
            <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 font-bold text-sm">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Recent Transactions</h2>
          <Button variant="link" className="text-blue-600 font-bold flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <TransactionTable data={formattedTransactions} />
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType} 
      />
    </div>
  );
}
