'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  PlusCircle, 
  X, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIncomeCategories, getExpenseCategories } from '@/services/categoryService';
import { createIncome, updateIncome } from '@/services/incomeService';
import { createExpense, updateExpense } from '@/services/expenseService';
import { format } from 'date-fns';
import { Transaction, Category } from '@/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  initialData?: Transaction;
}

export default function TransactionModal({ isOpen, onClose, type, initialData }: TransactionModalProps) {
  const queryClient = useQueryClient();
  const isIncome = type === 'income';

  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          categoryId: initialData.categoryId?.toString() || '',
          amount: initialData.amount?.toString() || '',
          date: initialData.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          description: initialData.description || ''
        });
      } else {
        setFormData({
          title: '',
          categoryId: '',
          amount: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          description: ''
        });
      }
    }
  }, [initialData, isOpen]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: [isIncome ? 'income-categories' : 'expense-categories'],
    queryFn: isIncome ? getIncomeCategories : getExpenseCategories,
    enabled: isOpen
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Transaction>) => {
      if (initialData?.id) {
        return isIncome ? updateIncome(initialData.id, data) : updateExpense(initialData.id, data);
      }
      return isIncome ? createIncome(data) : createExpense(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [isIncome ? 'incomes' : 'expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast.success(
        initialData 
          ? `${isIncome ? 'Income' : 'Expense'} updated successfully` 
          : `${isIncome ? 'Income' : 'Expense'} recorded successfully`
      );
      
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} record`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title: formData.title,
      categoryId: parseInt(formData.categoryId || '0'),
      amount: parseFloat(formData.amount || '0'),
      [isIncome ? 'incomeDate' : 'expenseDate']: new Date(formData.date).toISOString(),
      description: formData.description
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4 flex flex-row items-start justify-between bg-white border-b">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isIncome ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
            )}>
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {initialData ? `Edit ${isIncome ? 'Income' : 'Expense'}` : `Add New ${isIncome ? 'Income' : 'Expense'}`}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-1">
                Enter details to log this transaction to the database.
              </DialogDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100 h-8 w-8">
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Title / Description
              </Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Fuel Purchase, Swift Logistics Load" 
                className="h-11 rounded-lg bg-gray-50 border-gray-200 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">QAYBTA</Label>
                <Select value={formData.categoryId} onValueChange={(val) => {
                  if (val) setFormData({...formData, categoryId: val});
                }}>
                  <SelectTrigger className="h-11 rounded-lg bg-gray-50 border-gray-200 focus:bg-white transition-all w-full">
                    <SelectValue placeholder="Select Category">
                      {categories.find(c => c.id.toString() === formData.categoryId)?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <Input 
                    id="amount"
                    type="number" 
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00" 
                    className="pl-8 h-11 rounded-lg bg-gray-50 border-gray-200 focus:bg-white font-bold transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</Label>
                <Input 
                  id="date"
                  type="date" 
                  value={formData.date}
                  onChange={handleChange}
                  className="h-11 rounded-lg bg-gray-50 border-gray-200 focus:bg-white transition-all" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Notes</Label>
                <Input 
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional notes..." 
                  className="h-11 rounded-lg bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50/50 flex items-center justify-between sm:justify-between border-t">
            <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-gray-500 hover:text-gray-700">
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending}
              className={cn(
                "h-11 px-8 font-bold gap-2 shadow-lg rounded-lg transition-all",
                isIncome 
                  ? "bg-green-600 hover:bg-green-700 shadow-green-100" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              )}
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
              {initialData ? 'Update Record' : `Save ${isIncome ? 'Income' : 'Expense'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
