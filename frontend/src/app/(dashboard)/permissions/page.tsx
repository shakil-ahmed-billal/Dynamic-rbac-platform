"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPermissions, createPermission, updatePermission, deletePermission, IPermission } from "@/services/permission.services";
import { getAllModules } from "@/services/systemModule.services";
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
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Loader2,
} from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const PermissionsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    moduleId: "",
  });

  const { data: permissionsData, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ["permissions", searchTerm],
    queryFn: () => getAllPermissions({ search: searchTerm }),
  });

  const { data: modulesData } = useQuery({
    queryKey: ["modules"],
    queryFn: () => getAllModules(),
  });

  const permissions = permissionsData?.data || [];
  const modules = modulesData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission created successfully");
      setIsPermissionModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to create permission"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission updated successfully");
      setIsPermissionModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update permission"),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission deleted successfully");
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete permission"),
  });

  // Handlers
  const handleEditClick = (permission: IPermission) => {
    setSelectedPermission(permission);
    setFormData({ name: permission.name, slug: permission.slug, moduleId: permission.moduleId });
    setIsPermissionModalOpen(true);
  };

  const handleDeleteClick = (permission: IPermission) => {
    setSelectedPermission(permission);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPermission) {
      updateMutation.mutate({ id: selectedPermission.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Permissions</h1>
          <p className="text-[#666C79] font-inter text-sm">
            Manage granular permissions and assign them to system modules.
          </p>
        </div>
        <Button 
          onClick={() => { setSelectedPermission(null); setFormData({ name: "", slug: "", moduleId: "" }); setIsPermissionModalOpen(true); }}
          className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
        >
          <Plus size={20} /> Add New Permission
        </Button>
      </div>

      <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-[#1F232A] h-14">Permission Name</TableHead>
              <TableHead className="font-semibold text-[#1F232A]">Slug</TableHead>
              <TableHead className="font-semibold text-[#1F232A]">Module</TableHead>
              <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPermissionsLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4} className="h-20 animate-pulse bg-gray-50/50" />
                </TableRow>
              ))
            ) : permissions.length > 0 ? (
              permissions.map((permission) => (
                <TableRow key={permission.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-[#1F232A]">
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-brand-primary" />
                      {permission.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#666C79] font-mono text-xs">{permission.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50/50 text-blue-600 border-none rounded-lg px-3 py-1 font-medium">
                      {permission.module?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                        <MoreVertical size={18} className="text-[#666C79]" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2 w-48">
                        <DropdownMenuItem 
                          onClick={() => handleEditClick(permission)}
                          className="rounded-lg flex gap-2 py-2"
                        >
                          <Edit size={16} /> Edit Permission
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(permission)}
                          className="rounded-lg flex gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 size={16} /> Delete Permission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-[#9BA0AB]">
                  No permissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isPermissionModalOpen} onOpenChange={setIsPermissionModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
          <DialogHeader>
            <DialogTitle className="font-onest text-2xl font-bold">
              {selectedPermission ? "Edit Permission" : "Add New Permission"}
            </DialogTitle>
            <DialogDescription className="font-inter">
              Granular permissions for system modules.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="perm-name">Permission Name</Label>
              <Input
                id="perm-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                placeholder="e.g. Read Users"
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-slug">Slug</Label>
              <Input
                id="perm-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. READ_USERS"
                className="rounded-xl font-mono text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-module">System Module</Label>
              <Select 
                value={formData.moduleId} 
                onValueChange={(val: string | null) => setFormData({ ...formData, moduleId: val ?? "" })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  selectedPermission ? "Save Changes" : "Create Permission"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
          <DialogHeader>
            <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete Permission</DialogTitle>
            <DialogDescription className="text-base py-2">
              Are you sure you want to delete <span className="font-bold">{selectedPermission?.name}</span>? This will affect all roles that use this permission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:justify-start">
            <Button 
              onClick={() => selectedPermission && deleteMutation.mutate(selectedPermission.id)} 
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
    </div>
  );
};

export default PermissionsPage;
