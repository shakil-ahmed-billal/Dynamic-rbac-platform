"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutUser } from "@/services/auth.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: any;
  settings: Record<string, string> | null;
  isLoading: boolean;
  isSettingsLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
  refetchSettings: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { getPublicSettings } from "@/services/setting.services";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: settings, isLoading: isSettingsLoading, refetch: refetchSettings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: getPublicSettings,
    select: (res) => res?.data,
    retry: 1,
  });

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    select: (res) => res?.data,
  });

  const logout = async () => {
    try {
      await logoutUser();
      // Clear manual cookies
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      
      queryClient.setQueryData(["me"], null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings: settings || null,
        isLoading,
        isSettingsLoading,
        logout,
        refetchUser: refetch,
        refetchSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
