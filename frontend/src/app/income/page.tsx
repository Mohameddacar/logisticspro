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
  Download,
  FileSpreadsheet,
  FileText,
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
import { Card } from "@/components/ui/card";
import TransactionModal from "@/components/shared/transaction-modal";
import DeleteConfirmDialog from "@/components/shared/delete-confirm-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIncomes, deleteIncome } from "@/services/incomeService";
import { getIncomeCategories } from "@/services/categoryService";
import { format } from "date-fns";
import { Transaction, Category } from "@/types";

const ITEMS_PER_PAGE = 5;

export default function IncomePage() {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: incomes = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['incomes', { search, categoryId }],
    queryFn: () => getIncomes({ 
      search: search || undefined, 
      categoryId: categoryId === 'all' ? undefined : categoryId 
    }),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['income-categories'],
    queryFn: getIncomeCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Income record deleted successfully');
      setIsDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete income record');
    }
  });

  const handleEdit = (id: string) => {
    setSelectedTransaction(incomes.find((t: Transaction) => t.id === id) || null);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedTransaction(incomes.find((t: Transaction) => t.id === id) || null);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransaction?.id) {
      deleteMutation.mutate(selectedTransaction.id);
    }
  };

  // Stats calculation
  const totalIncome = incomes.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);
  const pendingPayments = 0; // Backend doesn't have status yet, using 0 for now

  // Pagination logic
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return incomes.slice(start, start + ITEMS_PER_PAGE).map((t: Transaction) => ({
      ...t,
      date: format(new Date(t.incomeDate || new Date()), 'MMM dd, yyyy'),
      category: t.category?.name || 'General',
      amount: Number(t.amount),
      status: 'Settled' as const,
      type: 'income' as const,
      description: t.description || ''
    }));
  }, [incomes, currentPage]);

  const totalPages = Math.ceil(incomes.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
          <p className="text-sm text-gray-500">Track and manage your fleet's earnings and receivables.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white gap-2 h-11 px-6 rounded-lg font-bold shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Income
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Period Income" 
          amount={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalIncome)} 
          trend="8%" 
          trendDirection="up" 
          color="green" 
        />
        <StatCard title="Pending Payments" amount="$0.00" subtitle="0 Loads" color="blue" />
        <StatCard title="Average Per Load" amount={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(incomes.length ? totalIncome / incomes.length : 0)} color="dark-green" />
        <StatCard title="Total Transactions" amount={incomes.length.toString()} color="green" />
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search Load ID, client, or Method..." 
              className="pl-10 h-11" 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <Select defaultValue="all" onValueChange={(val) => {
            if (val) setCategoryId(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[180px] h-11">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="QAYBTA">
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

          <Button variant="outline" className="h-11 w-11 p-0" onClick={() => {
            setSearch('');
            setCategoryId('all');
            setCurrentPage(1);
          }}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
            Showing {incomes.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, incomes.length)} of {incomes.length} transactions
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button 
                key={page}
                variant="outline" 
                size="sm" 
                className={currentPage === page ? "bg-green-600 text-white border-green-600" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#112233] text-white p-8 relative overflow-hidden group">
          <div className="relative z-10 space-y-4 max-w-md">
            <h3 className="text-2xl font-bold">Automate your reporting</h3>
            <p className="text-gray-400 text-sm">Connect your ELD to automatically generate income reports and load settlements.</p>
            <Button className="bg-white text-[#112233] hover:bg-gray-100 font-bold rounded-full px-8">
              Set Up Integration
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
        </Card>

        <Card className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <Download className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Export Data</h3>
            <p className="text-sm text-gray-500 mt-1">Download your filtered income list for tax accounting.</p>
          </div>
          <div className="flex gap-4 w-full pt-2">
            <Button variant="outline" className="flex-1 gap-2 h-11 font-bold">
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-11 font-bold">
              <FileText className="w-4 h-4" /> PDF
            </Button>
          </div>
        </Card>
      </div>

      <TransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        type="income" 
      />

      {selectedTransaction && (
        <TransactionModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }} 
          type="income" 
          initialData={{
            ...selectedTransaction,
            amount: Number(selectedTransaction.amount),
            date: selectedTransaction.incomeDate
          }}
        />
      )}

      <DeleteConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={confirmDelete}
        title="Delete Income Record"
        description="Are you sure you want to delete this income record? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
