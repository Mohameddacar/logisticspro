'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Check,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllRoles, getAllPermissions, updateRolePermissions, Role, Permission } from '@/services/roleService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
  });

  const { data: allPermissions, isLoading: permsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
  });

  const updateMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string, permissionIds: string[] }) => 
      updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Permissions updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update permissions');
    }
  });

  if (isEditing && selectedRole && allPermissions) {
    return (
      <EditPermissionsView 
        role={selectedRole} 
        allPermissions={allPermissions} 
        onCancel={() => setIsEditing(false)}
        onSave={(permissionIds) => updateMutation.mutate({ roleId: selectedRole.id, permissionIds })}
        isSaving={updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Group Permissions</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Users</span>
          <span>|</span>
          <span>Group Permissions</span>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-700">Roles & Access Levels</h3>
            <Button className="rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] gap-2">
              <Plus className="w-4 h-4" /> Create Role
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-8 text-[11px] font-bold uppercase tracking-wider text-gray-400">Role</th>
                  <th className="text-left py-4 px-8 text-[11px] font-bold uppercase tracking-wider text-gray-400">Description</th>
                  <th className="text-center py-4 px-8 text-[11px] font-bold uppercase tracking-wider text-gray-400">Permissions</th>
                  <th className="text-right py-4 px-8 text-[11px] font-bold uppercase tracking-wider text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rolesLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                    </td>
                  </tr>
                ) : roles?.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-8">
                      <span className="text-sm font-bold text-gray-700">{role.name}</span>
                    </td>
                    <td className="py-5 px-8 text-sm text-gray-500">{role.description || '-'}</td>
                    <td className="py-5 px-8 text-center">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold">
                        {role.permissions.length}
                      </Badge>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EditPermissionsView({ role, allPermissions, onCancel, onSave, isSaving }: { 
  role: Role, 
  allPermissions: Permission[], 
  onCancel: () => void,
  onSave: (ids: string[]) => void,
  isSaving: boolean
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    role.permissions.map(p => p.permission.id)
  );

  const modules = Array.from(new Set(allPermissions.map(p => p.module)));

  const togglePermission = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleModule = (module: string, checked: boolean) => {
    const modulePermIds = allPermissions.filter(p => p.module === module).map(p => p.id);
    if (checked) {
      setSelectedIds(prev => Array.from(new Set([...prev, ...modulePermIds])));
    } else {
      setSelectedIds(prev => prev.filter(id => !modulePermIds.includes(id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Permissions</h1>
          <p className="text-sm text-gray-500">Configure access levels for <span className="font-bold text-indigo-600">{role.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">Cancel</Button>
          <Button 
            className="rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] min-w-[120px]"
            onClick={() => onSave(selectedIds)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(module => {
              const modulePerms = allPermissions.filter(p => p.module === module);
              const isAllChecked = modulePerms.every(p => selectedIds.includes(p.id));
              
              return (
                <Card key={module} className="border-gray-100 shadow-none">
                  <CardHeader className="bg-gray-50/50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold text-gray-700">{module}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">All</span>
                      <Checkbox 
                        checked={isAllChecked}
                        onCheckedChange={(checked) => toggleModule(module, !!checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {modulePerms.map(perm => (
                      <div key={perm.id} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{perm.name}</span>
                        <Checkbox 
                          checked={selectedIds.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
