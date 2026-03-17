"use client";

import React from "react";
import { useDashboardStats } from "@/services/report.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Briefcase,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { RBACGuard } from "@/components/auth/RBACGuard";

const COLORS = ["#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

const ReportsPage = () => {
  const { data: stats, isLoading } = useDashboardStats();

  const chartData = [
    { name: "Users", value: stats?.totalUsers || 0 },
    { name: "Leads", value: stats?.totalLeads || 0 },
    { name: "Tasks", value: stats?.totalTasks || 0 },
    { name: "Roles", value: stats?.activeRoles || 0 },
  ];

  return (
    <RBACGuard requiredModule="reports" requiredAction="READ">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-onest text-[#1F232A]">Platform Reports</h1>
          <p className="text-[#666C79] font-inter mt-1">
            Visual data and system analytics summary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={isLoading ? "..." : stats?.totalUsers || 0}
            icon={Users}
            description="Active accounts"
          />
          <StatsCard
            title="Active Leads"
            value={isLoading ? "..." : stats?.totalLeads || 0}
            icon={Briefcase}
            description="Sales funnel"
          />
          <StatsCard
            title="Total Tasks"
            value={isLoading ? "..." : stats?.totalTasks || 0}
            icon={ClipboardList}
            description="Operations"
          />
          <StatsCard
            title="System Roles"
            value={isLoading ? "..." : stats?.activeRoles || 0}
            icon={ShieldCheck}
            description="Access control"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[24px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100">
            <h3 className="text-lg font-bold font-onest text-[#1F232A] mb-8 flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-primary" /> Module Distribution
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9BA0AB", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9BA0AB", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#F8FAFC' }}
                  />
                  <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100">
             <h3 className="text-lg font-bold font-onest text-[#1F232A] mb-8">System Ratios</h3>
             <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                   <span className="text-2xl font-bold font-onest">Total</span>
                   <span className="text-sm text-[#9BA0AB] font-inter">Units</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </RBACGuard>
  );
};

export default ReportsPage;
