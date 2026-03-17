"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTasks, createTask, updateTask, deleteTask } from "@/services/task.services";
import { getAllUsers, getMinimalUsers } from "@/services/user.services";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { RBACGuard } from "@/components/auth/RBACGuard";

interface ITask {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const TasksPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    dueDate: "",
    assignedTo: "",
  });

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", searchTerm],
    queryFn: () => getAllTasks({ title: searchTerm }),
  });

  const { data: usersData } = useQuery({
    queryKey: ["users-minimal"],
    queryFn: () => getMinimalUsers(),
  });

  const tasks = tasksData?.data || [];
  const users = usersData?.data || [];

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (error: any) => toast.error(error.message || "Failed to create task"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully");
      setIsEditModalOpen(false);
      setSelectedTask(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to update task"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    },
    onError: (error: any) => toast.error(error.message || "Failed to delete task"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "TODO",
      dueDate: "",
      assignedTo: "",
    });
  };

  const handleEditClick = (task: ITask) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      assignedTo: task.assignedTo || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (task: ITask) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.assignedTo) delete (payload as any).assignedTo;
    if (!payload.dueDate) delete (payload as any).dueDate;
    createMutation.mutate(payload);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      const payload = { ...formData };
      if (!payload.assignedTo) (payload as any).assignedTo = null;
      if (!payload.dueDate) (payload as any).dueDate = null;
      updateMutation.mutate({ id: selectedTask.id, data: payload });
    }
  };

  return (
    <RBACGuard requiredModule="tasks" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Tasks</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Keep track of work and team assignments.
            </p>
          </div>
          <Button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 flex gap-2"
          >
            <Plus size={20} /> New Task
          </Button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search tasks..."
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
                <TableHead className="w-[300px] font-semibold text-[#1F232A] h-14">Task</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Status</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Due Date</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Assigned To</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTasksLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} className="h-20 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="h-4 w-48 bg-gray-100 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : tasks.length > 0 ? (
                tasks.map((task: ITask) => (
                  <TableRow key={task.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1F232A] font-inter">
                          {task.title}
                        </span>
                        <span className="text-xs text-[#9BA0AB] line-clamp-1">{task.description || "No description"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-lg px-3 py-1 font-medium border-none",
                          task.status === "DONE" ? "bg-green-50 text-green-600" :
                          task.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-600" :
                          task.status === "CANCELLED" ? "bg-gray-50 text-gray-600" :
                          "bg-orange-50 text-orange-600"
                        )}
                        variant="outline"
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-sm text-[#666C79]">
                          <Calendar size={14} />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                       </div>
                    </TableCell>
                    <TableCell>
                      {task.assignedToUser ? (
                        <div className="flex items-center gap-2">
                           <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">
                                {task.assignedToUser.name.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <span className="text-sm text-[#666C79]">{task.assignedToUser.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#9BA0AB]">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
                          <MoreVertical size={18} className="text-[#666C79]" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl p-2 w-48">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(task)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2"
                          >
                            <Edit size={16} /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(task)}
                            className="rounded-lg flex gap-2 cursor-pointer py-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 size={16} /> Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#9BA0AB]">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="p-6 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-[#9BA0AB] font-inter">
              Showing {tasks.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl border-gray-200">Previous</Button>
              <Button variant="outline" className="rounded-xl border-gray-200">Next</Button>
            </div>
          </div>
        </div>

        {/* Add Task Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">New Task</DialogTitle>
              <DialogDescription className="font-inter">
                Create a new task and assign it to a team member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Task title"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What needs to be done?"
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val || "" })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="REVIEW">Review</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-date">Due Date</Label>
                  <Input
                    id="task-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(val) => setFormData({ ...formData, assignedTo: val || "" })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Task Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Edit Task</DialogTitle>
              <DialogDescription className="font-inter">
                Update task progress and assignment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-title">Title</Label>
                <Input
                  id="edit-task-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task-desc">Description</Label>
                <Textarea
                  id="edit-task-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val || "" })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="REVIEW">Review</SelectItem>
                      <SelectItem value="DONE">Done</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-task-date">Due Date</Label>
                  <Input
                    id="edit-task-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(val) => setFormData({ ...formData, assignedTo: val || "" })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <DialogTitle className="font-onest text-xl font-bold text-red-600">Delete Task</DialogTitle>
              <DialogDescription className="text-base py-2">
                Are you sure you want to delete <span className="font-bold">{selectedTask?.title}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3 sm:justify-start">
              <Button
                onClick={() => selectedTask && deleteMutation.mutate(selectedTask.id)}
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

export default TasksPage;
