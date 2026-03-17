"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllSettings, createSetting, updateSetting, deleteSetting } from "@/services/setting.services";
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
  MoreVertical,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Settings as SettingsIcon,
  Info,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { RBACGuard } from "@/components/auth/RBACGuard";

interface ISetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<ISetting | null>(null);

  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
  });

  const { data: settingsData, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getAllSettings(),
  });

  const settings = settingsData?.data || [];
  
  const filteredSettings = settings.filter((s: ISetting) => 
    s.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createMutation = useMutation({
    mutationFn: createSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message || "Failed to create setting"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting updated successfully");
      setIsEditModalOpen(false);
      setSelectedSetting(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update setting"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Setting deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedSetting(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete setting"),
  });

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      description: "",
    });
  };

  const handleEditClick = (setting: ISetting) => {
    setSelectedSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value,
      description: setting.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (setting: ISetting) => {
    setSelectedSetting(setting);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSetting) {
      const { key, ...updateData } = formData;
      updateMutation.mutate({ id: selectedSetting.key, data: updateData });
    }
  };

  return (
    <RBACGuard requiredModule="settings" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">System Settings</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Configure platform-wide variables and preferences.
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <Plus size={20} /> Add New Setting
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] font-semibold text-[#1F232A] h-14">Key</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Value</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Description</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Last Updated</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSettingsLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-16 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredSettings.length > 0 ? (
                filteredSettings.map((setting: ISetting) => (
                  <TableRow key={setting.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded text-brand-primary font-semibold">
                        {setting.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-[#1F232A] break-all">
                        {setting.value}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#666C79]">
                        {setting.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#9BA0AB] font-inter text-sm">
                      {new Date(setting.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl p-2 w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(setting)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2"
                          >
                            <Edit size={16} /> Edit Setting
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(setting)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete Setting
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#9BA0AB]">
                    No settings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Setting Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">New System Setting</DialogTitle>
              <DialogDescription className="font-inter">
                Create a new configuration key.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="setting-key">Key</Label>
                <Input
                  id="setting-key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                  placeholder="APP_NAME"
                  className="rounded-xl font-mono text-sm"
                  required
                />
                <p className="text-[10px] text-[#9BA0AB]">Use uppercase and underscores (e.g., API_TIMEOUT)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="setting-value">Value</Label>
                <Input
                  id="setting-value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Setting value"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setting-desc">Description</Label>
                <Textarea
                  id="setting-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this setting for?"
                  className="rounded-xl min-h-[80px]"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Setting"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Setting Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Edit Setting</DialogTitle>
              <DialogDescription className="font-inter">
                Update the value for <code className="text-brand-primary font-bold">{selectedSetting?.key}</code>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-setting-value">Value</Label>
                <Input
                  id="edit-setting-value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-setting-desc">Description</Label>
                <Textarea
                  id="edit-setting-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl min-h-[80px]"
                />
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

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete Setting</DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete <code className="font-bold">{selectedSetting?.key}</code>? This might affect platform behavior.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button
                onClick={() => selectedSetting && deleteMutation.mutate(selectedSetting.key)}
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

export default SettingsPage;
