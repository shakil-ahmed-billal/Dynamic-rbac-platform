"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Key,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useRBAC } from "@/components/auth/RBACGuard";
import { Button } from "@/components/ui/button";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  /** If set, the item is only shown when user has this permission */
  requiredModule?: string;
  requiredAction?: "READ" | "WRITE" | "UPDATE" | "DELETE" | "MANAGE";
  /** If true, always show (no permission gate) */
  alwaysVisible?: boolean;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    alwaysVisible: true,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    requiredModule: "users",
    requiredAction: "READ",
  },
  {
    name: "Roles",
    href: "/roles",
    icon: ShieldCheck,
    requiredModule: "roles",
    requiredAction: "READ",
  },
  {
    name: "Permissions",
    href: "/permissions",
    icon: Key,
    requiredModule: "permissions",
    requiredAction: "READ",
  },
  {
    name: "System Modules",
    href: "/modules",
    icon: Package,
    requiredModule: "system_modules",
    requiredAction: "READ",
  },
  {
    name: "Audit Logs",
    href: "/audit-logs",
    icon: History,
    requiredModule: "audit_logs",
    requiredAction: "READ",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    alwaysVisible: true,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { hasPermission, isSuperAdmin } = useRBAC();
  const [collapsed, setCollapsed] = React.useState(false);

  const visibleItems = menuItems.filter((item) => {
    if (item.alwaysVisible) return true;
    if (isSuperAdmin) return true;
    if (item.requiredModule) {
      return hasPermission(item.requiredModule, item.requiredAction ?? "READ");
    }
    return true;
  });

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header - Logo */}
      <div className="flex items-center justify-between p-6 h-20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-primary rounded-lg flex items-center justify-center">
               <ShieldCheck className="text-white h-5 w-5" />
            </div>
            <span className="font-onest font-bold text-xl text-[#1F232A]">RBAC</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl font-inter text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-primary text-white"
                  : "text-[#666C79] hover:bg-gray-50 hover:text-brand-primary"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100">
        {!collapsed && user && (
          <div className="mb-4 px-2">
            <p className="font-onest text-sm font-semibold text-[#1F232A] truncate">
              {user.name}
            </p>
            <p className="font-inter text-xs text-[#9BA0AB] truncate">
              {user.email}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 justify-start p-3 rounded-xl text-[#666C79] hover:bg-red-50 hover:text-red-500",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-inter text-sm font-medium">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
