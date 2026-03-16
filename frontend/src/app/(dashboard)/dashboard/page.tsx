"use client";

import React from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Users,
  ShieldCheck,
  Package,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-onest text-[#1F232A]">
          Welcome back, {user?.name || "Admin"} 👋
        </h1>
        <p className="text-[#666C79] font-inter mt-1">
          Here is what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="1,284"
          icon={Users}
          trend={{ value: 12, isUp: true }}
          description="Total registered users"
        />
        <StatsCard
          title="Active Roles"
          value="15"
          icon={ShieldCheck}
          description="Defined system roles"
        />
        <StatsCard
          title="System Modules"
          value="24"
          icon={Package}
          description="Operational modules"
        />
        <StatsCard
          title="API Requests"
          value="45.2k"
          icon={Activity}
          trend={{ value: 5, isUp: true }}
          description="Last 24 hours"
        />
      </div>

      {/* Main Content Area (Layout placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[20px] p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold font-onest text-[#1F232A]">
                Recent Audit Logs
             </h3>
             <button className="text-brand-primary text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
             </button>
          </div>
          <div className="space-y-4">
             {/* Placeholder logs */}
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                         <Activity size={18} className="text-brand-primary" />
                      </div>
                      <div>
                         <p className="text-sm font-medium text-[#1F232A]">
                            User login attempt
                         </p>
                         <p className="text-xs text-[#9BA0AB]">
                            2 minutes ago • admin@example.com
                         </p>
                      </div>
                   </div>
                   <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-md">
                      Success
                   </span>
                </div>
             ))}
          </div>
        </div>

        {/* Quick Actions / System Info */}
        <div className="bg-white rounded-[20px] p-8 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100">
           <h3 className="text-lg font-bold font-onest text-[#1F232A] mb-6">
              Quick Actions
           </h3>
           <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary font-medium hover:bg-brand-primary/10 transition-colors">
                 <Users size={20} /> Add New User
              </button>
              <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-600 font-medium hover:bg-blue-100 transition-colors">
                 <ShieldCheck size={20} /> Create New Role
              </button>
              <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-600 font-medium hover:bg-purple-100 transition-colors">
                 <Package size={20} /> New System Module
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
