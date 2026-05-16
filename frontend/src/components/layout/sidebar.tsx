'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '@/services/userService';
import { logout } from '@/services/authService';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', permission: 'dashboard.view' },
  { name: 'Income', icon: ArrowDownCircle, href: '/income', permission: 'income.view' },
  { name: 'Expenses', icon: ArrowUpCircle, href: '/expenses', permission: 'expenses.view' },
  { name: 'Users', icon: Users, href: '/users', permission: 'users.view' },
  { name: 'Group Permissions', icon: ShieldCheck, href: '/roles', permission: 'roles.view' },
  { name: 'Reports', icon: BarChart3, href: '/reports', permission: 'reports.view' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getProfile,
  });

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : '??';

  const hasPermission = (key: string | undefined) => {
    if (!key) return true; // Settings doesn't have a permission key
    if (!profile) return false;
    if (profile.role?.name === 'Superadmin') return true;
    return profile.role?.permissions?.some((p: any) => p.permission.key === key);
  };

  return (
    <aside className="w-64 bg-[#4A6CF7] text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Logistics Pro</h1>
            <p className="text-[10px] uppercase tracking-wider text-white/70 font-medium">Fleet Finance</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (!hasPermission(item.permission)) return null;

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/60")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>


      <div className="mt-auto p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-4 bg-white/5 rounded-xl mb-4 min-h-[72px]">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <Loader2 className="w-5 h-5 animate-spin text-white/50" />
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">{initials}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{profile?.fullName || 'User'}</p>
                <p className="text-[10px] text-white/60 truncate">{profile?.email || 'Driver'}</p>
              </div>
            </>
          )}
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
