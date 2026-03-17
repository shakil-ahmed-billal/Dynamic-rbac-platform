"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert, Home } from "lucide-react";
import { Button } from "../ui/button";
import { useRBAC } from "./RBACGuard";

interface RBACProxyProps {
  children: React.ReactNode;
}

// Map of routes to their required module permissions
const ROUTE_PERMISSION_MAP: Record<string, string> = {
  "/dashboard": "dashboard",
  "/users": "users",
  "/roles": "roles",
  "/permissions": "permissions",
  "/modules": "system_modules",
  "/leads": "leads",
  "/tasks": "tasks",
  "/reports": "reports",
  "/audit-logs": "audit_logs",
  "/settings": "settings",
  "/customer-portal": "portal",
};

const NoAccessScreen = ({ type = "inactive" }: { type?: "inactive" | "denied" }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const isDenied = type === "denied";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#F9FAFB]">
      <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <ShieldAlert className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold font-onest text-[#1F232A] mb-4">
        {isDenied ? "Access Denied" : "Account Inactive"}
      </h2>
      <p className="text-[#666C79] font-inter max-w-md mb-8 text-lg">
        {isDenied 
          ? "You do not have the required permissions to access this specific module. Please contact your administrator." 
          : "Your account currently has no permissions assigned. Please contact your administrator to grant you access."}
      </p>
      <div className="flex items-center gap-4">
        {isDenied && (
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="rounded-xl h-12 px-8 font-bold border-gray-200"
          >
            <Home className="mr-2" size={20} /> Dashboard
          </Button>
        )}
        <Button
          onClick={logout}
          className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-brand-primary/20"
        >
          {isDenied ? "Switch Account" : "Logout and Try Again"}
        </Button>
      </div>
    </div>
  );
};

export const RBACProxy: React.FC<RBACProxyProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = useRBAC();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-primary h-12 w-12" />
          <p className="text-[#666C79] font-medium animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // 1. Global Check: Must be SuperAdmin or have at least ONE permission
  const permissions = user.permissions || [];
  const hasGlobalAccess = user.isSuperAdmin || permissions.length > 0;

  if (!hasGlobalAccess) {
    return <NoAccessScreen type="inactive" />;
  }

  // 2. Granular Route Check:
  // Find if current path is in our map (e.g., starts with /users)
  const requiredModule = Object.entries(ROUTE_PERMISSION_MAP).find(([route]) => 
     pathname === route || pathname.startsWith(route + "/")
  )?.[1];

  if (requiredModule && !hasPermission(requiredModule, "READ")) {
    // If we're on the dashboard and don't have permission, try to find a fallback route
    if (pathname === "/dashboard") {
      const fallbackRoute = Object.keys(ROUTE_PERMISSION_MAP).find(route => 
        route !== "/dashboard" && hasPermission(ROUTE_PERMISSION_MAP[route], "READ")
      );
      
      if (fallbackRoute) {
        router.push(fallbackRoute);
        return null; // Return null while redirecting
      }
    }

    return <NoAccessScreen type="denied" />;
  }

  return <>{children}</>;
};

export default RBACProxy;
