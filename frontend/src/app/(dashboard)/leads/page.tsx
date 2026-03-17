"use client";

import { RBACGuard } from "@/components/auth/RBACGuard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  createLead,
  deleteLead,
  getAllLeads,
  updateLead,
} from "@/services/lead.services";
import { getMinimalUsers } from "@/services/user.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Filter,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ILead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  source?: string;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const LeadsPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "NEW",
    source: "DIRECT",
    assignedTo: "",
  });

  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ["leads", searchTerm],
    queryFn: () => getAllLeads({ name: searchTerm }),
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-minimal"],
    queryFn: () => getMinimalUsers(),
  });

  const leads = leadsData?.data || [];
  const users = usersData?.data || [];

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to create lead"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead updated successfully");
      setIsEditModalOpen(false);
      setSelectedLead(null);
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update lead"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to delete lead"),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "NEW",
      source: "DIRECT",
      assignedTo: "",
    });
  };

  const handleEditClick = (lead: ILead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      status: lead.status,
      source: lead.source || "DIRECT",
      assignedTo: lead.assignedTo || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (lead: ILead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.assignedTo) delete (payload as any).assignedTo;
    createMutation.mutate(payload);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead) {
      const payload = { ...formData };
      if (!payload.assignedTo) (payload as any).assignedTo = null;
      updateMutation.mutate({ id: selectedLead.id, data: payload });
    }
  };

  return (
    <RBACGuard requiredModule="leads" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">
              Leads
            </h1>
            <p className="text-[#666C79] font-inter text-sm">
              Manage your potential customers and sales pipeline.
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <Plus size={20} /> Add New Lead
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-gray-200 h-11 px-6 flex gap-2"
              >
                <Filter size={18} /> Filters
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] font-semibold text-[#1F232A] h-14">
                  Lead
                </TableHead>
                <TableHead className="font-semibold text-[#1F232A]">
                  Company
                </TableHead>
                <TableHead className="font-semibold text-[#1F232A]">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-[#1F232A]">
                  Assigned To
                </TableHead>
                <TableHead className="font-semibold text-[#1F232A]">
                  Created At
                </TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLeadsLoading ? (
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
              ) : leads.length > 0 ? (
                leads.map((lead: ILead) => (
                  <TableRow
                    key={lead.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1F232A] font-inter">
                          {lead.name}
                        </span>
                        <span className="text-xs text-[#9BA0AB]">
                          {lead.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666C79] font-inter">
                      {lead.company || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-lg px-3 py-1 font-medium border-none",
                          lead.status === "WON"
                            ? "bg-green-50 text-green-600"
                            : lead.status === "LOST"
                              ? "bg-red-50 text-red-600"
                              : lead.status === "NEGOTIATION"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-orange-50 text-orange-600",
                        )}
                        variant="outline"
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.assignedToUser ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {lead.assignedToUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-[#666C79]">
                            {lead.assignedToUser.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#9BA0AB]">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-[#9BA0AB] font-inter">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-xl border-gray-100 shadow-xl p-2 w-48"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEditClick(lead)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2"
                          >
                            <Edit size={16} /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(lead)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-[#9BA0AB]"
                  >
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="p-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-[#9BA0AB] font-inter">
              Showing {leads.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-gray-200">
                Previous
              </Button>
              <Button variant="outline" className="rounded-xl border-gray-200">
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Add Lead Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">
                Add New Lead
              </DialogTitle>
              <DialogDescription className="font-inter">
                Capture a new potential customer.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Name</Label>
                <Input
                  id="lead-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full name"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lead-email">Email</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Phone</Label>
                  <Input
                    id="lead-phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-company">Company</Label>
                <Input
                  id="lead-company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Company name"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val as string })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="PROPOSAL">Proposal</SelectItem>
                      <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                      <SelectItem value="WON">Won</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(val) =>
                      setFormData({ ...formData, assignedTo: val as string })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Lead"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Lead Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">
                Edit Lead
              </DialogTitle>
              <DialogDescription className="font-inter">
                Update lead information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lead-name">Name</Label>
                <Input
                  id="edit-lead-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-email">Email</Label>
                  <Input
                    id="edit-lead-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-phone">Phone</Label>
                  <Input
                    id="edit-lead-phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lead-company">Company</Label>
                <Input
                  id="edit-lead-company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData({ ...formData, status: val as string})
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="PROPOSAL">Proposal</SelectItem>
                      <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                      <SelectItem value="WON">Won</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(val) =>
                      setFormData({ ...formData, assignedTo: val as string})
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-xl font-bold text-red-600">
                Delete Lead
              </DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete{" "}
                <span className="font-bold">{selectedLead?.name}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button
                onClick={() =>
                  selectedLead && deleteMutation.mutate(selectedLead.id)
                }
                disabled={deleteMutation.isPending}
                variant="destructive"
                className="flex-1 rounded-xl h-11"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
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

export default LeadsPage;
