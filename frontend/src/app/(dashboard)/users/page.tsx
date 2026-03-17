"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, createUser, updateUser, deleteUser, IUser } from "@/services/user.services";
import { getAllRoles } from "@/services/role.services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Loader2,
  Shield,
} from "lucide-react";
import { PermissionEditor } from "@/components/permissions/PermissionEditor";

import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { RBACGuard } from "@/components/auth/RBACGuard";

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    isActive: true,
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: () => getAllUsers({ name: searchTerm }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(),
  });

  const users = usersData?.data || [];
  const roles = rolesData?.data || [];

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message || "Failed to create user"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update user"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete user"),
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", roleId: "", isActive: true });
  };

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.roleId || "",
      isActive: user.status === "ACTIVE",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: IUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handlePermissionsClick = (user: IUser) => {
    setSelectedUser(user);
    setIsPermissionsModalOpen(true);
  };


  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      const { password, isActive, ...updateData } = formData;
      const dataToSubmit: any = password ? { ...formData } : { ...updateData };
      
      // Map isActive to status enum for backend
      dataToSubmit.status = isActive ? "ACTIVE" : "BLOCKED";
      delete dataToSubmit.isActive;

      updateMutation.mutate({ id: selectedUser.id, data: dataToSubmit });
    }
  };

  return (
    <RBACGuard requiredModule="users" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Users</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Manage your platform users and their roles.
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <UserPlus size={20} /> Add New User
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 flex gap-2">
                <Filter size={18} /> Filters
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] font-semibold text-[#1F232A] h-14">User</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Email</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Role</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Status</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Created At</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isUsersLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-20 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="h-4 w-32 bg-gray-100 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-semibold">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[#1F232A] font-inter">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666C79] font-inter">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50/50 text-blue-600 border-none rounded-lg px-3 py-1 font-medium">
                        {user.role?.name || "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-lg px-3 py-1 font-medium border-none",
                          user.status === "ACTIVE" ? "bg-green-50/50 text-green-600" : "bg-red-50/50 text-red-600"
                        )}
                        variant="outline"
                      >
                        {user.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#9BA0AB] font-inter">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl p-2 w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(user)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2"
                          >
                            <Edit size={16} /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePermissionsClick(user)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2 text-brand-primary focus:text-brand-primary focus:bg-brand-primary/5"
                          >
                            <Shield size={16} /> Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(user)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete User
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#9BA0AB]">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="p-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-[#9BA0AB] font-inter">
              Showing {users.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-gray-200">Previous</Button>
              <Button variant="outline" className="rounded-xl border-gray-200">Next</Button>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Add New User</DialogTitle>
              <DialogDescription className="font-inter">
                Create a new user and assign them a role.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email Address</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Role</Label>
                <Select
                  value={formData.roleId || ""}
                  onValueChange={(val: string | null) => setFormData({ ...formData, roleId: val ?? "" })}
                >
                  <SelectTrigger className="rounded-xl w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Edit User</DialogTitle>
              <DialogDescription className="font-inter">
                Update user details or change their role.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Role</Label>
                <Select
                  value={formData.roleId || ""}
                  onValueChange={(val: string | null) => setFormData({ ...formData, roleId: val ?? "" })}
                >
                  <SelectTrigger className="rounded-xl w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {roles.map((role: any) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="edit-status"
                  checked={!!formData.isActive}
                  onCheckedChange={(val) => setFormData({ ...formData, isActive: !!val })}
                />
                <Label htmlFor="edit-status">User is Active</Label>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {updateMutation.isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          {/* ... existing content ... */}
          <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete User</DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete <span className="font-bold">{selectedUser?.name}</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button
                onClick={() => selectedUser && deleteMutation.mutate(selectedUser.id)}
                disabled={deleteMutation.isPending}
                variant="destructive"
                className="flex-1 rounded-xl h-11"
              >
                {deleteMutation.isPending ? <Loader2 className="animate-spin" /> : "Yes, Delete"}
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="flex-1 rounded-xl h-11 border-gray-200"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permissions Management Modal */}
        <Dialog open={isPermissionsModalOpen} onOpenChange={setIsPermissionsModalOpen}>
          <DialogContent className="sm:max-w-[700px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Manage User Permissions</DialogTitle>
              <DialogDescription className="font-inter">
                Manage granular permission overrides for <span className="font-bold text-brand-primary">{selectedUser?.name}</span>.
                These settings will override their role-based defaults.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              {selectedUser && (
                <PermissionEditor 
                  userId={selectedUser.id} 
                  userEffectiveRolePermissions={[]} // We could fetch this but PermissionEditor handles role state via backend logic usually
                />
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsPermissionsModalOpen(false)}
                className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 px-8"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </RBACGuard>
  );
};

export default UsersPage;
