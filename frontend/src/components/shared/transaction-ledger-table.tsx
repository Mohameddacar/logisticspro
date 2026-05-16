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
import { ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  date: string;
  title: string;
  subtext: string;
  asset?: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'SETTLED' | 'PROCESSED' | 'PENDING';
}

interface TransactionLedgerTableProps {
  data: Transaction[];
}

const statusColors = {
  SETTLED: "bg-green-50 text-green-700 border-green-200",
  PROCESSED: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function TransactionLedgerTable({ data }: TransactionLedgerTableProps) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="w-[100px] font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Transaction Details</TableHead>
            <TableHead className="font-semibold">Asset</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold text-right">Amount</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell className="text-sm font-medium text-gray-600">{item.date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    item.type === 'income' ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
                  )}>
                    {item.type === 'income' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{item.subtext}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium text-gray-700">{item.asset || 'N/A'}</TableCell>
              <TableCell className="text-sm text-gray-600">{item.category}</TableCell>
              <TableCell className={cn(
                "text-sm font-bold text-right",
                item.type === 'income' ? "text-green-600" : "text-gray-900"
              )}>
                {item.type === 'income' ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                  statusColors[item.status]
                )}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
