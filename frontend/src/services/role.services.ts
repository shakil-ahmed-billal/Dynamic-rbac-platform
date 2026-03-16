import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface IRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: any[];
  createdAt: string;
  updatedAt: string;
}

export const getAllRoles = async (params?: any): Promise<ApiResponse<IRole[]>> => {
  const response = await axiosInstance.get("/roles", { params });
  return response.data;
};

export const createRole = async (data: any): Promise<ApiResponse<IRole>> => {
  const response = await axiosInstance.post("/roles", data);
  return response.data;
};

export const updateRole = async (id: string, data: any): Promise<ApiResponse<IRole>> => {
  const response = await axiosInstance.patch(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/roles/${id}`);
  return response.data;
};
