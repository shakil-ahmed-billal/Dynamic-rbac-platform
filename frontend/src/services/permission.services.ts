import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface IPermission {
  id: string;
  name: string;
  slug: string;
  action: string;
  moduleId: string;
  module: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getAllPermissions = async (params?: any): Promise<ApiResponse<IPermission[]>> => {
  const response = await axiosInstance.get("/permissions", { params });
  return response.data;
};

export const createPermission = async (data: any): Promise<ApiResponse<IPermission>> => {
  const response = await axiosInstance.post("/permissions", data);
  return response.data;
};

export const updatePermission = async (id: string, data: any): Promise<ApiResponse<IPermission>> => {
  const response = await axiosInstance.patch(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/permissions/${id}`);
  return response.data;
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/roles/${roleId}/permissions`, {
    permissionIds,
  });
  return response.data;
};
