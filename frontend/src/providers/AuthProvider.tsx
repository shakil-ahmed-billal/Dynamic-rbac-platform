"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, logoutUser } from "@/services/auth.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    select: (res) => res?.data,
  });

  const logout = async () => {
    try {
      await logoutUser();
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
        isLoading,
        logout,
        refetchUser: refetch,
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
