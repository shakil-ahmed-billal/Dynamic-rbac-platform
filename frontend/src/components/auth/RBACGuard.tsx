"use client";

import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";

interface RBACGuardProps {
  children: React.ReactNode;
  requiredModule?: string;
  requiredAction?: "READ" | "WRITE" | "UPDATE" | "DELETE" | "MANAGE";
  fallback?: React.ReactNode;
}

/**
 * useRBAC - reads resolved permissions from the user object.
 * The backend now returns a flat `permissions` array on login & /auth/me.
 * Format: { id, action, moduleId, moduleName }[]
 */
export const useRBAC = () => {
  const { user } = useAuth();

  const hasPermission = (moduleName: string, action: string = "READ"): boolean => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    // Use the flat resolved permissions array from the backend
    const permissions: { action: string; moduleName: string }[] = user.permissions || [];

    return permissions.some(
      (p) =>
        p.moduleName?.toLowerCase() === moduleName.toLowerCase() &&
        (p.action === action || p.action === "MANAGE")
    );
  };

  return { hasPermission, isSuperAdmin: user?.isSuperAdmin };
};

const DefaultFallback = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold font-onest text-[#1F232A] mb-2">Access Denied</h2>
      <p className="text-[#666C79] font-inter max-w-md mb-8">
        You do not have the required permissions to view this page or perform this action.
        Please contact your administrator if you believe this is a mistake.
      </p>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-11 px-6"
      >
        Return to Dashboard
      </Button>
    </div>
  );
};

export const RBACGuard: React.FC<RBACGuardProps> = ({
  children,
  requiredModule,
  requiredAction = "READ",
  fallback,
}) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = useRBAC();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-brand-primary h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return null; // AuthProvider or Proxy will handle redirecting unauthenticated users
  }

  // If no specific module is required, just ensure they are logged in
  if (!requiredModule) {
    return <>{children}</>;
  }

  const isAllowed = hasPermission(requiredModule, requiredAction);

  if (!isAllowed) {
    return <>{fallback || <DefaultFallback />}</>;
  }

  return <>{children}</>;
};
