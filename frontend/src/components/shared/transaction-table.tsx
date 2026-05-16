'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'Settled' | 'Pending';
}

interface TransactionTableProps {
  data: Transaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TransactionTable({ data, onEdit, onDelete }: TransactionTableProps) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[120px] font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold text-right">Amount</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="text-sm text-gray-600">{item.date}</TableCell>
              <TableCell>
                <span className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  item.type === 'income' ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                )}>
                  {item.category}
                </span>
              </TableCell>
              <TableCell className="text-sm font-medium text-gray-700">{item.description}</TableCell>
              <TableCell className={cn(
                "text-sm font-bold text-right",
                item.type === 'income' ? "text-green-600" : "text-gray-900"
              )}>
                {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  item.status === 'Settled' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                )}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit?.(item.id)} className="gap-2 cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(item.id)} 
                      className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
