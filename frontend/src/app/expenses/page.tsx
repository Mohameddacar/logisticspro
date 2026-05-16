'use client';

import { useState, useMemo } from 'react';
import StatCard from "@/components/shared/stat-card";
import TransactionTable from "@/components/shared/transaction-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  Trash2,
  Download,
  Info,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TransactionModal from "@/components/shared/transaction-modal";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, deleteExpense } from "@/services/expenseService";
import { getExpenseCategories } from "@/services/categoryService";
import { format } from "date-fns";
import { Transaction, Category } from "@/types";

const ITEMS_PER_PAGE = 5;

export default function ExpensePage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: expenses = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['expenses', { search, categoryId }],
    queryFn: () => getExpenses({ 
      search: search || undefined, 
      categoryId: categoryId === 'all' ? undefined : categoryId 
    }),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['expense-categories'],
    queryFn: getExpenseCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Expense record deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete expense record');
    }
  });

  const handleEdit = (id: string) => {
    setSelectedTransaction(expenses.find((t: Transaction) => t.id === id) || null);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedTransaction(expenses.find((t: Transaction) => t.id === id) || null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction?.id) {
      deleteMutation.mutate(selectedTransaction.id);
    }
  };

  // Pagination logic
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return expenses.slice(start, start + ITEMS_PER_PAGE).map((t: Transaction) => ({
      ...t,
      date: format(new Date(t.expenseDate || new Date()), 'MMM dd, yyyy'),
      category: t.category?.name || 'General',
      amount: -Number(t.amount),
      status: 'Settled' as const,
      type: 'expense' as const,
      description: t.description || ''
    }));
  }, [expenses, currentPage]);

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  // Stats for Pie Chart
  const pieData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((t: Transaction) => {
      const name = t.category?.name || 'General';
      totals[name] = (totals[name] || 0) + Number(t.amount);
    });
    
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    const colors = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];
    
    return Object.entries(totals).map(([name, value], i) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: colors[i % colors.length]
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [expenses]);

  const totalExpenseAmount = expenses.reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-sm text-gray-500">Monitor and categorize your fleet's operational costs.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-6 rounded-lg font-bold shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Expense
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-500 uppercase">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search description..." 
                className="pl-10 h-11" 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-gray-500 uppercase">QAYBTA</label>
            <Select value={categoryId} onValueChange={(val) => {
              if (val) setCategoryId(val);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="All">
                  {categoryId === 'all' ? 'All' : categories.find(c => c.id.toString() === categoryId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-5">
            <Button 
              variant="outline" 
              className="h-11 text-blue-600 border-blue-100 hover:bg-blue-50 font-bold"
              onClick={() => {
                setSearch('');
                setCategoryId('all');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                Recent Transactions <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{expenses.length} items</span>
              </h3>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <TransactionTable 
                data={paginatedData} 
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
              />
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-500">
                Showing {expenses.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, expenses.length)} of {expenses.length}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Expense Breakdown</CardTitle>
              <Info className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px] min-h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-400 uppercase font-bold">Total</span>
                  <span className="text-xl font-bold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExpenseAmount)}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white p-6">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Monthly Total</p>
            <h3 className="text-2xl font-bold mt-1">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalExpenseAmount)}</h3>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full font-bold">
                Live
              </div>
              <span className="opacity-80">from database</span>
            </div>
          </Card>
        </div>
      </div>

      <TransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        type="expense" 
      />

      {selectedTransaction && (
        <TransactionModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }} 
          type="expense" 
          initialData={{
            ...selectedTransaction,
            amount: Number(selectedTransaction.amount),
            date: selectedTransaction.expenseDate
          }}
        />
      )}

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={confirmDelete}
        title="Delete Expense Record"
        description="Are you sure you want to delete this expense record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
