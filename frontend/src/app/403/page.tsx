"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFD] px-6 py-12 font-inter text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 scale-150 animate-pulse" />
        <div className="relative h-24 w-24 bg-red-50 rounded-[24px] flex items-center justify-center border border-red-100 shadow-sm">
          <ShieldAlert className="text-red-500 h-12 w-12" />
        </div>
      </div>

      <h1 className="font-onest text-4xl font-bold text-[#1F232A] mb-4 tracking-tight">
        403 - Forbidden Access
      </h1>
      <p className="max-w-md text-[#666C79] text-lg mb-10 leading-relaxed">
        You don&apos;t have the necessary permissions to access this page. Please contact your administrator if you believe this is a mistake.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/dashboard">
          <Button
            className="bg-brand-primary hover:bg-brand-dark text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Home size={18} />
              Back to Dashboard
            </div>
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="rounded-xl h-12 px-8 border-gray-200 text-[#404857] hover:bg-gray-50 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Go Back
          </span>
        </Button>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 w-full max-w-sm">
        <p className="text-xs text-[#9BA0AB] uppercase tracking-widest font-bold mb-2">
          Technical Details
        </p>
        <p className="text-[10px] text-gray-400 font-mono bg-gray-50 p-2 rounded-lg">
          Error: PERMISSION_DENIED<br />
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
};

export default ForbiddenPage;
