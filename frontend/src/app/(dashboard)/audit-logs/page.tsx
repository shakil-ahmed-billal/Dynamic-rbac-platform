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
import { Search, Filter, History, User, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logsData, isLoading } = useQuery({
    queryKey: ["audit-logs", searchTerm],
    queryFn: () => getAllAuditLogs({ search: searchTerm }),
  });

  const logs = logsData?.data || [];

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-green-50/50 text-green-600 border-green-100";
      case "UPDATE": return "bg-blue-50/50 text-blue-600 border-blue-100";
      case "DELETE": return "bg-red-50/50 text-red-600 border-red-100";
      case "LOGIN": return "bg-purple-50/50 text-purple-600 border-purple-100";
      default: return "bg-gray-50/50 text-gray-600 border-gray-100";
    }
  };

  return (
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
              placeholder="Search logs by user or action..."
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-20 animate-pulse bg-gray-50/50" />
                </TableRow>
              ))
            ) : logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-gray-100">
                        <AvatarFallback className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                          <User size={14} />
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
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-[#9BA0AB]">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AuditLogsPage;
