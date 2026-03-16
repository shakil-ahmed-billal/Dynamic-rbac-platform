import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface IAuditLog {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  action: string;
  module: string;
  resourceId?: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export const getAllAuditLogs = async (params?: any): Promise<ApiResponse<IAuditLog[]>> => {
  const response = await axiosInstance.get("/audit-logs", { params });
  return response.data;
};

export const getAuditLogById = async (id: string): Promise<ApiResponse<IAuditLog>> => {
  const response = await axiosInstance.get(`/audit-logs/${id}`);
  return response.data;
};
