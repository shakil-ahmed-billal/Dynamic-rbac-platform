"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllAuditLogs, IAuditLog } from "@/services/auditLog.services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, History, User, Activity, ExternalLink, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RBACGuard } from "@/components/auth/RBACGuard";

const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<IAuditLog | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["audit-logs", searchTerm],
    queryFn: () => getAllAuditLogs({ module: searchTerm }),
  });

  const logs = logsData?.data || [];

  const handleRowClick = (log: IAuditLog) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) return "bg-green-50/50 text-green-600 border-green-100";
    if (act.includes("UPDATE")) return "bg-blue-50/50 text-blue-600 border-blue-100";
    if (act.includes("DELETE")) return "bg-red-50/50 text-red-600 border-red-100";
    if (act.includes("LOGIN")) return "bg-purple-50/50 text-purple-600 border-purple-100";
    return "bg-gray-50/50 text-gray-600 border-gray-100";
  };

  return (
    <RBACGuard requiredModule="audit-logs" requiredAction="READ">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Audit Logs</h1>
            <p className="text-[#666C79] font-inter text-sm">
              Track all administrative actions and security events.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA0AB] h-4 w-4" />
              <Input
                placeholder="Search logs by module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-none rounded-xl h-11 focus-visible:ring-brand-primary"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-gray-200 h-11 px-6 flex gap-2">
              <Filter size={18} /> Filters
            </Button>
          </div>

          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#1F232A] h-14">User</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Action</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Module</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">IP Address</TableHead>
                <TableHead className="font-semibold text-[#1F232A]">Timestamp</TableHead>
                <TableHead className="text-right font-semibold text-[#1F232A]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-20 animate-pulse bg-gray-50/50" />
                  </TableRow>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(log)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-100">
                          <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                            {log.user?.name?.charAt(0) || <User size={14} />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1F232A] text-sm">
                            {log.user?.name || "System"}
                          </span>
                          <span className="text-[10px] text-[#9BA0AB]">{log.user?.email || "system@internal"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("rounded-lg border font-medium", getActionColor(log.action))}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-[#404857]">
                         <Activity size={14} className="text-gray-400" />
                         {log.module}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666C79] font-mono text-xs">{log.ipAddress || "::1"}</TableCell>
                    <TableCell className="text-[#9BA0AB] font-inter text-sm whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(log.createdAt).toLocaleString()}
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="text-brand-primary">
                          <ExternalLink size={16} />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#9BA0AB]">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Log Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-[32px] p-8">
            <DialogHeader>
              <DialogTitle className="font-onest text-2xl font-bold">Log Details</DialogTitle>
              <DialogDescription>
                Full context of the captured action.
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                   <div>
                      <Label className="text-[#9BA0AB]">Action</Label>
                      <p className="font-medium text-[#1F232A] mt-1">{selectedLog.action}</p>
                   </div>
                   <div>
                      <Label className="text-[#9BA0AB]">Timestamp</Label>
                      <p className="font-medium text-[#1F232A] mt-1">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                   </div>
                   <div>
                      <Label className="text-[#9BA0AB]">User</Label>
                      <p className="font-medium text-[#1F232A] mt-1">{selectedLog.user?.name} ({selectedLog.user?.email})</p>
                   </div>
                   <div>
                      <Label className="text-[#9BA0AB]">Module</Label>
                      <p className="font-medium text-[#1F232A] mt-1">{selectedLog.module}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   {selectedLog.previousState && (
                     <div className="space-y-2">
                        <Label>Previous State</Label>
                        <pre className="p-4 bg-gray-50 rounded-xl text-xs overflow-auto max-h-[150px]">
                           {JSON.stringify(selectedLog.previousState, null, 2)}
                        </pre>
                     </div>
                   )}
                   {selectedLog.newState && (
                     <div className="space-y-2">
                        <Label>New State</Label>
                        <pre className="p-4 bg-brand-primary/5 rounded-xl text-xs overflow-auto max-h-[150px]">
                           {JSON.stringify(selectedLog.newState, null, 2)}
                        </pre>
                     </div>
                   )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-[#9BA0AB]">User Agent:</span>
                      <span className="text-[#666C79] max-w-[400px] truncate">{selectedLog.userAgent}</span>
                   </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsDetailsModalOpen(false)} className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 px-8">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RBACGuard>
  );
};

export default AuditLogsPage;
