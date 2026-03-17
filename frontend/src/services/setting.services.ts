import { axiosInstance } from "@/lib/axios/axiosInstance";
import { ApiResponse } from "@/types/api.types";

export interface ISystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export const getAllSettings = async (params?: any): Promise<ApiResponse<ISystemSetting[]>> => {
  const response = await axiosInstance.get("/settings", { params });
  return response.data;
};

export const createSetting = async (data: any): Promise<ApiResponse<ISystemSetting>> => {
  const response = await axiosInstance.post("/settings", data);
  return response.data;
};

export const updateSetting = async (idOrKey: string, data: any): Promise<ApiResponse<ISystemSetting>> => {
  const response = await axiosInstance.patch(`/settings/${idOrKey}`, data);
  return response.data;
};

export const deleteSetting = async (idOrKey: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/settings/${idOrKey}`);
  return response.data;
};

export const getPublicSettings = async (): Promise<ApiResponse<Record<string, string>>> => {
  const response = await axiosInstance.get("/settings/public");
  return response.data;
};
