import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface ISystemModule {
  id: string;
  name: string;
  slug: string;
  permissions: any[];
  createdAt: string;
  updatedAt: string;
}

export const getAllModules = async (params?: any): Promise<ApiResponse<ISystemModule[]>> => {
  const response = await axiosInstance.get("/modules", { params });
  return response.data;
};

export const createModule = async (data: any): Promise<ApiResponse<ISystemModule>> => {
  const response = await axiosInstance.post("/modules", data);
  return response.data;
};

export const updateModule = async (id: string, data: any): Promise<ApiResponse<ISystemModule>> => {
  const response = await axiosInstance.patch(`/modules/${id}`, data);
  return response.data;
};

export const deleteModule = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/modules/${id}`);
  return response.data;
};
