"use client";

import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPermissions } from "@/services/permission.services";
import {
  getUserPermissionOverrides,
  grantUserPermission,
  revokeUserPermission,
} from "@/services/userPermission.services";
import { Loader2, Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ACTIONS = ["READ", "WRITE", "UPDATE", "DELETE", "MANAGE"] as const;
type PermAction = (typeof ACTIONS)[number];

interface PermissionEditorProps {
  userId: string;
  /** Permissions the current user already has from their roles (grant ceiling) */
  userEffectiveRolePermissions?: { moduleName: string; action: string }[];
}

type CellState = "role" | "granted" | "revoked" | "none";

const actionLabels: Record<PermAction, string> = {
  READ: "Read",
  WRITE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  MANAGE: "Manage",
};

const cellStyles: Record<CellState, string> = {
  role: "bg-blue-50 text-blue-600 border border-blue-100",
  granted: "bg-green-50 text-green-600 border border-green-100",
  revoked: "bg-red-50 text-red-400 border border-red-100 opacity-60",
  none: "bg-gray-50 text-gray-300 border border-gray-100",
};

const CellIcon = ({ state }: { state: CellState }) => {
  if (state === "role" || state === "granted") return <Check size={14} />;
  if (state === "revoked") return <X size={14} />;
  return <Minus size={14} />;
};

/**
 * PermissionEditor — visual toggle grid for user-specific permission overrides.
 *
 * Cells show 4 states:
 *  - "role"    → inherited from role (blue)
 *  - "granted" → explicitly granted to user (green)
 *  - "revoked" → explicitly revoked from user (red)
 *  - "none"    → not available at all (gray)
 *
 * Clicking a cell cycles: none → granted → revoked → none
 * If the permission is from a role, clicking will cycle: role → revoked → role
 */
export const PermissionEditor: React.FC<PermissionEditorProps> = ({
  userId,
  userEffectiveRolePermissions = [],
}) => {
  const queryClient = useQueryClient();

  const { data: permissionsRes, isLoading: permsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => getAllPermissions(),
  });

  const { data: overridesRes, isLoading: overridesLoading } = useQuery({
    queryKey: ["user-permission-overrides", userId],
    queryFn: () => getUserPermissionOverrides(userId),
    enabled: !!userId,
  });

  const grantMutation = useMutation({
    mutationFn: ({ permissionId }: { permissionId: string }) =>
      grantUserPermission(userId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-permission-overrides", userId] });
      toast.success("Permission granted");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to grant"),
  });

  const revokeMutation = useMutation({
    mutationFn: ({ permissionId }: { permissionId: string }) =>
      revokeUserPermission(userId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-permission-overrides", userId] });
      toast.success("Permission revoked");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to revoke"),
  });

  // Build a lookup: moduleId -> { action -> permission }
  const allPermissions: any[] = (permissionsRes as any)?.data || [];

  const moduleMap = useMemo(() => {
    const map = new Map<string, Map<PermAction, { id: string; moduleName: string }>>();
    for (const p of allPermissions) {
      const moduleName: string = p.module?.name ?? p.moduleId;
      if (!map.has(moduleName)) map.set(moduleName, new Map());
      map.get(moduleName)!.set(p.action as PermAction, { id: p.id, moduleName });
    }
    return map;
  }, [allPermissions]);

  // Build override lookup: permissionId -> { granted }
  const overrides = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const o of (overridesRes as any)?.data ?? []) {
      map.set(o.permissionId, o.granted);
    }
    return map;
  }, [overridesRes]);

  // Role permission lookup: "moduleName.action" -> true
  const rolePerms = useMemo(() => {
    const set = new Set<string>();
    for (const p of userEffectiveRolePermissions) {
      set.add(`${p.moduleName}.${p.action}`);
    }
    return set;
  }, [userEffectiveRolePermissions]);

  const getCellState = (moduleName: string, action: PermAction, permId: string): CellState => {
    const key = `${moduleName}.${action}`;
    const isFromRole = rolePerms.has(key);
    if (overrides.has(permId)) {
      return overrides.get(permId) ? "granted" : "revoked";
    }
    return isFromRole ? "role" : "none";
  };

  const handleCellClick = (permId: string, currentState: CellState) => {
    const isPending = grantMutation.isPending || revokeMutation.isPending;
    if (isPending) return;
    // Cycle: none/role → grant; granted → revoke; revoked → grant
    if (currentState === "granted") {
      revokeMutation.mutate({ permissionId: permId });
    } else {
      grantMutation.mutate({ permissionId: permId });
    }
  };

  const isLoading = permsLoading || overridesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-brand-primary h-6 w-6" />
      </div>
    );
  }

  const modules = Array.from(moduleMap.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50/70">
            <th className="text-left px-5 py-3.5 font-semibold text-[#1F232A] font-onest w-40">
              Module
            </th>
            {ACTIONS.map((action) => (
              <th
                key={action}
                className="px-4 py-3.5 text-center font-semibold text-[#1F232A] font-onest w-28"
              >
                {actionLabels[action]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {modules.map(([moduleName, actionMap]) => (
            <tr key={moduleName} className="hover:bg-gray-50/30 transition-colors">
              <td className="px-5 py-3 font-medium text-[#1F232A] font-inter capitalize">
                {moduleName.replace(/_/g, " ")}
              </td>
              {ACTIONS.map((action) => {
                const perm = actionMap.get(action);
                if (!perm) {
                  return (
                    <td key={action} className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gray-50 text-gray-200 border border-gray-100 cursor-not-allowed">
                        <Minus size={13} />
                      </span>
                    </td>
                  );
                }

                const state = getCellState(moduleName, action, perm.id);

                return (
                  <td key={action} className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleCellClick(perm.id, state)}
                      title={`${state === "role" ? "Inherited from role" : state === "granted" ? "Explicitly granted — click to revoke" : state === "revoked" ? "Explicitly revoked — click to re-grant" : "Not assigned — click to grant"}`}
                      className={cn(
                        "inline-flex items-center justify-center h-7 w-7 rounded-lg transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95",
                        cellStyles[state]
                      )}
                    >
                      <CellIcon state={state} />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
          {modules.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-[#9BA0AB] py-12 font-inter">
                No permissions defined yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-5 px-5 py-3 border-t border-gray-50 bg-gray-50/30">
        <span className="text-xs text-[#9BA0AB] font-inter font-medium">Legend:</span>
        {(
          [
            { state: "role", label: "From Role" },
            { state: "granted", label: "Explicitly Granted" },
            { state: "revoked", label: "Explicitly Revoked" },
            { state: "none", label: "Not Assigned" },
          ] as { state: CellState; label: string }[]
        ).map(({ state, label }) => (
          <div key={state} className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center justify-center h-5 w-5 rounded text-[10px]",
                cellStyles[state]
              )}
            >
              <CellIcon state={state} />
            </span>
            <span className="text-xs text-[#666C79] font-inter">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionEditor;
