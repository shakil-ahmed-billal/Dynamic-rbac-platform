"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllRoles, createRole, updateRole, deleteRole, IRole } from "@/services/role.services";
import { getAllModules } from "@/services/systemModule.services";
import { updateRolePermissions } from "@/services/permission.services";
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
  ShieldCheck,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Loader2,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { RBACGuard } from "@/components/auth/RBACGuard";

const RolesPage = () => {
  const queryClient = useQueryClient();
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Form State
  const [roleFormData, setRoleFormData] = useState({
    name: "",
    description: "",
  });

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles(),
  });

  const { data: modulesData } = useQuery({
    queryKey: ["modules"],
    queryFn: () => getAllModules(),
  });

  const roles = rolesData?.data || [];
  const modules = modulesData?.data || [];

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully");
      setIsRoleModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to create role"),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
      setIsRoleModalOpen(false);
      setSelectedRole(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update role"),
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete role"),
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      toast.success("Permissions updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsPermissionDialogOpen(false);
    },
    onError: () => toast.error("Failed to update permissions"),
  });

  // Handlers
  const handleOpenPermissions = (role: IRole) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map((p: any) => p.permissionId) || []);
    setIsPermissionDialogOpen(true);
  };

  const handleEditClick = (role: IRole) => {
    setSelectedRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description || "",
    });
    setIsRoleModalOpen(true);
  };

  const handleDeleteClick = (role: IRole) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      updateRoleMutation.mutate({ id: selectedRole.id, data: roleFormData });
    } else {
      createRoleMutation.mutate(roleFormData);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      updatePermissionsMutation.mutate({
        roleId: selectedRole.id,
        permissionIds: selectedPermissions,
      });
    }
  };

  return (
    <RBACGuard requiredModule="roles" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Roles</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Define roles and manage their dynamic permissions.
            </p>
          </div>
          <Button 
            onClick={() => { setSelectedRole(null); setRoleFormData({ name: "", description: "" }); setIsRoleModalOpen(true); }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <Plus size={20} /> Create New Role
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#1F232A] h-14">Role Name</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Description</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Permissions</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Type</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isRolesLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-20 animate-pulse bg-gray-50/50" />
                  </TableRow>
                ))
              ) : roles.map((role) => (
                <TableRow key={role.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-[#1F232A]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-brand-primary" />
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#666C79]">{role.description || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-brand-primary font-medium"
                      onClick={() => handleOpenPermissions(role)}
                    >
                      Manage {role.permissions?.length || 0} permissions
                    </Button>
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-none">
                        System
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">
                        Custom
                      </Badge>
                    )}
                  </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2 w-48">
                        <DropdownMenuItem 
                          onClick={() => handleEditClick(role)}
                          className="rounded-lg flex gap-2 py-2"
                        >
                          <Edit size={16} /> Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(role)}
                          className="rounded-lg flex gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          disabled={role.isSystem}
                        >
                          <Trash2 size={16} /> Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Role Create/Edit Modal */}
        <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">
                {selectedRole ? "Edit Role" : "Create New Role"}
              </DialogTitle>
              <DialogDescription className="font-inter">
                {selectedRole ? "Update role information." : "Define a new system or custom role."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRoleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  placeholder="e.g. Editor"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  placeholder="What can this role do?"
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {(createRoleMutation.isPending || updateRoleMutation.isPending) ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    selectedRole ? "Save Changes" : "Create Role"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-[32px]">
            <DialogHeader className="p-8 border-b border-gray-100">
              <DialogTitle className="text-2xl font-bold font-onest text-[#1F232A]">
                Permissions for {selectedRole?.name}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {modules.map((module: any) => (
                  <div key={module.id} className="space-y-4">
                    <h3 className="font-onest font-bold text-lg text-[#1F232A] flex items-center gap-2">
                      <Lock size={18} className="text-brand-primary" />
                      {module.name}
                    </h3>
                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      {(module.permissions ?? []).map((permission: any) => (
                        <div key={permission.id} className="flex items-center gap-3">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm font-medium text-[#404857] cursor-pointer"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
                      {(module.permissions?.length ?? 0) === 0 && (
                        <p className="text-xs text-[#9BA0AB]">No permissions defined.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter className="p-8 border-t border-gray-100 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={() => setIsPermissionDialogOpen(false)}
                className="rounded-xl h-11 px-8 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePermissions}
                className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 px-8"
                disabled={updatePermissionsMutation.isPending}
              >
                {updatePermissionsMutation.isPending ? <Loader2 className="animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete Role</DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete the role <span className="font-bold">{selectedRole?.name}</span>? Users assigned to this role may lose access.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button 
                onClick={() => selectedRole && deleteRoleMutation.mutate(selectedRole.id)} 
                disabled={deleteRoleMutation.isPending}
                variant="destructive" 
                className="flex-1 rounded-xl h-11"
              >
                {deleteRoleMutation.isPending ? <Loader2 className="animate-spin" /> : "Yes, Delete"}
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
    </RBACGuard>
  );
};

export default RolesPage;
