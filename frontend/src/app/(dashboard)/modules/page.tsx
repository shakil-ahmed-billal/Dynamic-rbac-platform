"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllModules, createModule, updateModule, deleteModule, ISystemModule } from "@/services/systemModule.services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Package,
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
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { RBACGuard } from "@/components/auth/RBACGuard";

const ModulesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ISystemModule | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["modules", searchTerm],
    queryFn: () => getAllModules({ name: searchTerm }),
  });

  const modules = modulesData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module created successfully");
      setIsModuleModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to create module"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateModule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module updated successfully");
      setIsModuleModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update module"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      toast.success("Module deleted successfully");
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete module"),
  });

  // Handlers
  const handleEditClick = (module: ISystemModule) => {
    setSelectedModule(module);
    setFormData({ name: module.name, slug: module.slug });
    setIsModuleModalOpen(true);
  };

  const handleDeleteClick = (module: ISystemModule) => {
    setSelectedModule(module);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModule) {
      updateMutation.mutate({ id: selectedModule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <RBACGuard requiredModule="modules" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">System Modules</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Define system modules that can be protected with permissions.
            </p>
          </div>
          <Button 
            onClick={() => { setSelectedModule(null); setFormData({ name: "", slug: "" }); setIsModuleModalOpen(true); }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <Plus size={20} /> Add New Module
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#1F232A] h-14">Module Name</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Slug</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Permissions</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="h-20 animate-pulse bg-gray-50/50" />
                  </TableRow>
                ))
              ) : modules.length > 0 ? (
                modules.map((module: any) => (
                  <TableRow key={module.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-[#1F232A]">
                      <div className="flex items-center gap-2">
                        <Package size={18} className="text-brand-primary" />
                        {module.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666C79] font-mono text-xs">{module.slug}</TableCell>
                    <TableCell className="text-[#666C79]">
                      {module.permissions?.length || 0} permissions defined
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-2 w-48">
                          <DropdownMenuItem 
                            onClick={() => handleEditClick(module)}
                            className="rounded-lg flex gap-2 py-2"
                          >
                            <Edit size={16} /> Edit Module
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(module)}
                            className="rounded-lg flex gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete Module
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-[#9BA0AB]">
                    No modules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">
                {selectedModule ? "Edit Module" : "Add New Module"}
              </DialogTitle>
              <DialogDescription className="font-inter">
                System modules enable role-based access control.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g. Users"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-slug">Module Slug</Label>
                <Input
                  id="module-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. users"
                  className="rounded-xl font-mono text-sm"
                  required
                />
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
                    selectedModule ? "Save Changes" : "Create Module"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete Module</DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete <span className="font-bold">{selectedModule?.name}</span>? This will affect all associated permissions.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button 
                onClick={() => selectedModule && deleteMutation.mutate(selectedModule.id)} 
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
    </RBACGuard>
  );
};

export default ModulesPage;
