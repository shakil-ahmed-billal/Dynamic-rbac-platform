"use client";

import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  Bell,
  Search,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const TopNav = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for anything..."
          className="pl-10 bg-gray-50 border-none rounded-xl h-10 focus-visible:ring-brand-primary"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-brand-primary rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
           <div className=" flex-col items-end hidden sm:flex">
              <span className="font-onest text-sm font-semibold text-[#1F232A]">
                {user?.name || "User"}
              </span>
              <span className="font-inter text-xs text-[#9BA0AB]">
                {user?.role || "Role"}
              </span>
           </div>
           <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
              <UserIcon size={20} />
           </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
