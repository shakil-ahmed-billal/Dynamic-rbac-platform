"use client";

import React from "react";
import StatsCard from "@/components/dashboard/StatsCard";
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
  Users,
  ShieldCheck,
  Package,
  Activity,
  ArrowUpRight,
  CheckCircle,
  History,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

import { useDashboardStats } from "@/services/report.service";
import { getAllAuditLogs } from "@/services/auditLog.services";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RBACGuard, useRBAC } from "@/components/auth/RBACGuard";
import { getAllTasks } from "@/services/task.services";
import { cn } from "@/lib/utils";

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { hasPermission } = useRBAC();
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();

  const isAdmin = user?.isSuperAdmin || hasPermission("users", "READ");

  const { data: auditLogsData, isLoading: isLogsLoading } = useQuery({
    queryKey: ["recent-audit-logs"],
    queryFn: () => getAllAuditLogs({ limit: 4, sortBy: "createdAt", sortOrder: "desc" }),
    enabled: isAdmin,
  });

  const { data: userTasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["my-recent-tasks"],
    queryFn: () => getAllTasks({ limit: 4, sortBy: "createdAt", sortOrder: "desc" }),
    enabled: !isAdmin,
  });

  const auditLogs = auditLogsData?.data || [];
  const userTasks = userTasksData?.data || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-onest text-[#1F232A]">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-[#666C79] font-inter mt-1">
            {isAdmin 
              ? "Here is what's happening across the platform today." 
              : "Here are your current assignments and tasks."}
          </p>
        </div>
        {!isAdmin && (
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/tasks")} className="bg-brand-primary text-white rounded-xl">
              View My Tasks
            </Button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatsCard
              title="Total Users"
              value={isStatsLoading ? "..." : stats?.totalUsers || 0}
              icon={Users}
              description="Total registered users"
            />
            <StatsCard
              title="Active Roles"
              value={isStatsLoading ? "..." : stats?.activeRoles || 0}
              icon={ShieldCheck}
              description="Defined system roles"
            />
            <StatsCard
              title="Total Leads"
              value={isStatsLoading ? "..." : stats?.totalLeads || 0}
              icon={Activity}
              description="Leads in pipeline"
            />
            <StatsCard
              title="Tasks Created"
              value={isStatsLoading ? "..." : stats?.totalTasks || 0}
              icon={Package}
              description="Total active tasks"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Assigned Leads"
              value={isStatsLoading ? "..." : stats?.totalLeads || 0}
              icon={Activity}
              description="Leads waiting for you"
            />
            <StatsCard
              title="Active Tasks"
              value={isStatsLoading ? "..." : stats?.totalTasks || 0}
              icon={Package}
              description="Tasks assigned to you"
            />
            <StatsCard
              title="Tasks Done"
              value={isStatsLoading ? "..." : stats?.completedTasks || 0}
              icon={CheckCircle}
              description="Successfully completed"
            />
            <StatsCard
              title="Follow-up Leads"
              value={isStatsLoading ? "..." : stats?.contactedLeads || 0}
              icon={History}
              description="Already contacted"
            />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (Admin View: Audit Logs) */}
        {isAdmin && (
          <RBACGuard requiredModule="dashboard" requiredAction="READ" fallback={null}>
            <div className="lg:col-span-2 bg-white rounded-[20px] p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold font-onest text-[#1F232A]">
                    Recent Audit Logs
                 </h3>
                 <button 
                    onClick={() => router.push("/audit-logs")}
                    className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1"
                 >
                    View All <ArrowUpRight size={16} />
                 </button>
              </div>
              <div className="space-y-4">
                 {isLogsLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                       <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl" />
                    ))
                 ) : auditLogs.length > 0 ? (
                    auditLogs.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                               <Activity size={18} className="text-brand-primary" />
                            </div>
                            <div>
                               <p className="text-sm font-semibold text-[#1F232A]">
                                  {log.action.replace(/_/g, " ")}
                               </p>
                               <p className="text-xs text-[#666C79]">
                                  {formatTimeAgo(new Date(log.createdAt))} • {log.user?.email || "System"}
                                </p>
                            </div>
                         </div>
                         <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-white border-gray-200 text-gray-500">
                            {log.module}
                         </Badge>
                      </div>
                    ))
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                       <p className="text-gray-400 font-medium">No recent activity logs found.</p>
                    </div>
                 )}
              </div>
            </div>
          </RBACGuard>
        )}

        {/* Recent Activity (User View: Tasks) */}
        {!isAdmin && (
          <div className="lg:col-span-2 bg-white rounded-[20px] p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold font-onest text-[#1F232A]">
                  My Recent Tasks
               </h3>
               <button 
                  onClick={() => router.push("/tasks")}
                  className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1"
               >
                  View All Tasks <ArrowUpRight size={16} />
               </button>
            </div>
            <div className="space-y-4">
               {isTasksLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                     <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-xl" />
                  ))
               ) : userTasks.length > 0 ? (
                  userTasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                             <Package size={18} className="text-blue-500" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-[#1F232A]">
                                {task.title}
                             </p>
                             <p className="text-xs text-[#666C79]">
                                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}
                             </p>
                          </div>
                       </div>
                       <Badge className={cn(
                         "rounded-lg px-3 py-1 font-medium border-none text-[10px]",
                         task.status === "DONE" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                       )}>
                          {task.status}
                       </Badge>
                    </div>
                  ))
               ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                     <p className="text-gray-400 font-medium">You have no tasks assigned at the moment.</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* Quick Actions Container */}
        {(() => {
          const canAddUser = hasPermission("users", "WRITE");
          const canManageRoles = hasPermission("roles", "WRITE");
          const canManageModules = hasPermission("system_modules", "WRITE");
          const canAddLead = hasPermission("leads", "WRITE");
          const canAddTask = hasPermission("tasks", "WRITE");
          const canViewReports = hasPermission("reports", "READ");
          const canViewLogs = hasPermission("audit_logs", "READ");

          return (
            <div className="bg-white rounded-[20px] p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 h-fit">
              <h3 className="text-lg font-bold font-onest text-[#1F232A] mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {isAdmin && (
                  <>
                    {canAddUser && (
                      <button onClick={() => router.push("/users")} className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary font-bold hover:bg-brand-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Users size={20} /> Add New User
                      </button>
                    )}
                    {canManageRoles && (
                      <button onClick={() => router.push("/roles")} className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-600 font-bold hover:bg-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <ShieldCheck size={20} /> Manage Roles
                      </button>
                    )}
                  </>
                )}
                
                {/* Regular User Actions / Operational Actions */}
                {canAddLead && (
                  <button onClick={() => router.push("/leads")} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 text-green-600 font-bold hover:bg-green-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Activity size={20} /> New Lead
                  </button>
                )}
                {canAddTask && (
                  <button onClick={() => router.push("/tasks")} className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-600 font-bold hover:bg-orange-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <Package size={20} /> Create Task
                  </button>
                )}
                {canViewReports && (
                  <button onClick={() => router.push("/reports")} className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-600 font-bold hover:bg-purple-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <BarChart3 size={20} /> View Reports
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DashboardPage;
