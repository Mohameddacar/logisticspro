'use client';

import StatCard from "@/components/shared/stat-card";
import TransactionLedgerTable from "@/components/shared/transaction-ledger-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Search,
  Download,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionModal from "@/components/shared/transaction-modal";
import { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getIncomes } from "@/services/incomeService";
import { getExpenses } from "@/services/expenseService";
import { getDashboardStats } from "@/services/dashboardService";
import { format } from "date-fns";
import { Transaction, DashboardStats } from "@/types";
import { exportToPDF, exportToExcel } from "@/lib/exportUtils";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export default function ReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const { data: incomes = [], isLoading: isLoadingIncomes } = useQuery<Transaction[]>({
    queryKey: ['incomes'],
    queryFn: () => getIncomes(),
  });

  const { data: expenses = [], isLoading: isLoadingExpenses } = useQuery<Transaction[]>({
    queryKey: ['expenses'],
    queryFn: () => getExpenses(),
  });

  const combinedData = useMemo(() => {
    let combined = [
      ...incomes.map((t: Transaction) => {
        const rawDate = t.incomeDate || t.date || new Date();
        const parsedDate = new Date(rawDate);
        return {
          ...t,
          type: 'income' as const,
          date: format(isNaN(parsedDate.getTime()) ? new Date() : parsedDate, 'MMM dd, yyyy'),
          title: t.title,
          subtext: t.description || 'Income record',
          category: t.category?.name || 'General',
          amount: Number(t.amount || 0),
          status: 'SETTLED' as const
        };
      }),
      ...expenses.map((t: Transaction) => {
        const rawDate = t.expenseDate || t.date || new Date();
        const parsedDate = new Date(rawDate);
        return {
          ...t,
          type: 'expense' as const,
          date: format(isNaN(parsedDate.getTime()) ? new Date() : parsedDate, 'MMM dd, yyyy'),
          title: t.title,
          subtext: t.description || 'Expense record',
          category: t.category?.name || 'General',
          amount: -Number(t.amount || 0),
          status: 'PROCESSED' as const
        };
      })
    ].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    if (typeFilter !== 'all') {
      combined = combined.filter(t => t.type === typeFilter);
    }

    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      combined = combined.filter(t => 
        t.title.toLowerCase().includes(lowSearch) || 
        t.category.toLowerCase().includes(lowSearch) ||
        t.description?.toLowerCase().includes(lowSearch)
      );
    }

    return combined;
  }, [incomes, expenses, typeFilter, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return combinedData.slice(start, start + ITEMS_PER_PAGE).map(t => ({
      ...t,
      date: format(new Date(t.date), 'MMM dd, yyyy')
    }));
  }, [combinedData, currentPage]);

  const totalPages = Math.ceil(combinedData.length / ITEMS_PER_PAGE);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoadingIncomes || isLoadingExpenses) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Ledger</h1>
        <p className="text-sm text-gray-500">Manage and audit your fleet's consolidated cash flow in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Cash Flow" amount={formatCurrency(stats?.balance || 0)} trend="8.4%" trendDirection="up" color="blue" />
        <StatCard title="Monthly Income" amount={formatCurrency(stats?.totalIncome || 0)} subtitle="Total settled" color="green" />
        <StatCard title="Monthly Expenses" amount={formatCurrency(stats?.totalExpenses || 0)} trend="4%" trendDirection="down" color="red" />
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Date Range</label>
            <Select defaultValue="all">
              <SelectTrigger className="h-10">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
            <Select value={typeFilter} onValueChange={(val) => {
              if (val) setTypeFilter(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search by title, category, or description..." 
              className="pl-10 h-10" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="h-10 gap-2 border-red-100 text-red-600 hover:bg-red-50 font-bold"
              onClick={() => {
                exportToPDF(combinedData, 'fleet-ledger');
                toast.success('PDF report exported successfully');
              }}
            >
              <FileText className="w-4 h-4" /> Export PDF
            </Button>
            <Button 
              variant="outline" 
              className="h-10 gap-2 border-green-100 text-green-600 hover:bg-green-50 font-bold"
              onClick={() => {
                exportToExcel(combinedData, 'fleet-ledger');
                toast.success('Excel report exported successfully');
              }}
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </Button>
          </div>
        </div>

        <TransactionLedgerTable data={paginatedData} />

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-gray-500 font-medium">
            Showing {combinedData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, combinedData.length)} of {combinedData.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === 1} 
              className="w-8 h-8 rounded-md"
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button 
                key={page}
                variant="outline" 
                size="icon" 
                className={cn(
                  "w-8 h-8 rounded-md font-bold",
                  currentPage === page ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "hover:bg-gray-100"
                )}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="w-8 h-8 rounded-md"
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalType} 
      />
    </div>
  );
}
