import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Shield, 
  User, 
  Trash2, 
  Edit2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Select } from "@/src/components/ui/select";

interface AdminUser {
  id: string;
  display_name: string;
  email: string;
  role: 'admin' | 'customer';
  created_at?: string;
  status: 'active' | 'inactive';
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();

    // Subscribe to profile changes
    const subscription = supabase
      .channel('profiles_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as unknown as AdminUser[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load royal members");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: editingUser.display_name,
          role: editingUser.role,
          status: editingUser.status 
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      toast.success("Royal member updated");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update royal member");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to remove this member from the registry?")) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast.success("Member removed from registry");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove member");
    }
  };

  const filteredUsers = users.filter(user => 
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Admin Users</h1>
          <p className="text-slate-500 mt-1">Manage royal members and their access levels</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Member</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-500 font-medium tracking-wide">Loading royal members...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <User className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium tracking-wide">No members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold uppercase">
                          {user.display_name?.charAt(0) || <User className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{user.display_name || 'Royal Member'}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.role === 'admin' ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
                      )}>
                        <Shield className="h-3 w-3" /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                        user.status === 'active' ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {user.status === 'active' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-primary"
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-none border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-primary">Edit Royal Member</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Full Name</Label>
                <Input 
                  value={editingUser.display_name || ''} 
                  onChange={(e) => setEditingUser({...editingUser, display_name: e.target.value})}
                  className="rounded-none border-muted focus-visible:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Email Address</Label>
                <Input 
                  value={editingUser.email} 
                  disabled
                  className="rounded-none border-muted bg-slate-50 opacity-70"
                />
                <p className="text-[10px] text-slate-400 italic">Email cannot be changed from admin panel</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Role</Label>
                  <Select
                    value={editingUser.role}
                    onValueChange={(value: any) => setEditingUser({...editingUser, role: value})}
                    className="rounded-none border-muted focus-visible:ring-primary/20 bg-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-secondary">Status</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value: any) => setEditingUser({...editingUser, status: value})}
                    className="rounded-none border-muted focus-visible:ring-primary/20 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 uppercase tracking-widest text-xs font-bold"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
