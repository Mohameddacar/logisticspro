'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Key, 
  Loader2,
  Filter,
  FileText,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getAllUsers, toggleUserStatus, deleteUser, updateUserRole } from '@/services/userService';
import { getAllRoles } from '@/services/roleService';
import { register } from '@/services/authService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    companyName: ''
  });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'ACTIVE' | 'INACTIVE' }) => toggleUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string, roleId: string }) => updateUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update role');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    }
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(newUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      setIsAddModalOpen(false);
      setNewUser({ fullName: '', username: '', email: '', password: '', phoneNumber: '', companyName: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Users management</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Users</span>
          <span>|</span>
          <span>Users management</span>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search this table" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-gray-50 border-none rounded-xl"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-11 rounded-xl gap-2 text-blue-600 border-blue-100 hover:bg-blue-50">
                <Filter className="w-4 h-4" /> Filter
              </Button>
              <Button variant="outline" className="h-11 rounded-xl gap-2 text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                <FileText className="w-4 h-4" /> PDF
              </Button>
              <Button variant="outline" className="h-11 rounded-xl gap-2 text-rose-600 border-rose-100 hover:bg-rose-50">
                <FileSpreadsheet className="w-4 h-4" /> EXCEL
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="h-11 rounded-xl gap-2 bg-[#6366F1] hover:bg-[#4F46E5] shadow-lg shadow-indigo-200"
              >
                <Plus className="w-4 h-4" /> Create
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Full Name</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Username</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Email</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="text-left py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Role</th>
                  <th className="text-center py-4 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                      <p className="text-sm text-gray-500 mt-2">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.username}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={user.status === 'ACTIVE'} 
                          onCheckedChange={(checked) => toggleStatusMutation.mutate({ 
                            id: user.id, 
                            status: checked ? 'ACTIVE' : 'INACTIVE' 
                          })}
                        />
                        <span className={cn(
                          "text-[11px] font-bold uppercase",
                          user.status === 'ACTIVE' ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {user.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Select 
                        value={user.roleId || ''} 
                        onValueChange={(roleId) => updateRoleMutation.mutate({ userId: user.id, roleId })}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-[10px] font-bold uppercase rounded-lg border-blue-100 text-blue-600 bg-blue-50/50">
                          <SelectValue placeholder="Assign Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles?.map(role => (
                            <SelectItem key={role.id} value={role.id} className="text-[10px] font-bold uppercase">
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-emerald-100 text-emerald-600 hover:bg-emerald-50">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-blue-100 text-blue-600 hover:bg-blue-50">
                          <Key className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg border-rose-100 text-rose-600 hover:bg-rose-50"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              deleteMutation.mutate(user.id);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new system user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="Ahmed Muse" 
                  required 
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="ahmed123" 
                  required 
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ahmed@example.com" 
                required 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="617791499" 
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Dacar Logistics" 
                  value={newUser.companyName}
                  onChange={(e) => setNewUser({...newUser, companyName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>
            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
