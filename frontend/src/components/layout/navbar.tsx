'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 bg-gray-50 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="h-6 w-[1px] bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-blue-600">Trucker</span>
          <span className="font-bold text-lg text-gray-900">Finance</span>
        </div>
      </div>
    </header>
  );
}
