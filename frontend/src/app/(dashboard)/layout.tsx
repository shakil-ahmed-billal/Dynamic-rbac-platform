import { RBACProxy } from "@/components/auth/RBACProxy";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React from "react";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RBACProxy>
      <DashboardLayout>{children}</DashboardLayout>
    </RBACProxy>
  );
}
