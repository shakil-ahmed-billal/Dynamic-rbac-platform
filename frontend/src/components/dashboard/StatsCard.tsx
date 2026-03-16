"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-[20px] p-6 shadow-[0px_8px_24px_rgba(149,157,165,0.05)] border border-gray-100 flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-primary">
          <Icon size={24} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              trend.isUp
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            )}
          >
            {trend.isUp ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[#666C79] text-sm font-medium font-inter">
          {title}
        </h3>
        <p className="text-[#1F232A] text-2xl font-bold font-onest mt-1">
          {value}
        </p>
        {description && (
          <p className="text-[#9BA0AB] text-xs font-inter mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
