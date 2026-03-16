import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface IUserPermissionOverride {
  id: string;
  userId: string;
  permissionId: string;
  granted: boolean;
  grantedBy?: string;
  permission: {
    id: string;
    action: string;
    moduleId: string;
    module: { name: string };
  };
}

export interface IEffectivePermission {
  id: string;
  action: string;
  moduleId: string;
  moduleName: string;
}

export const getUserPermissionOverrides = async (
  userId: string
): Promise<ApiResponse<IUserPermissionOverride[]>> => {
  const response = await axiosInstance.get(`/user-permissions/${userId}`);
  return response.data;
};

export const getEffectivePermissions = async (
  userId: string
): Promise<ApiResponse<IEffectivePermission[]>> => {
  const response = await axiosInstance.get(`/user-permissions/${userId}/effective`);
  return response.data;
};

export const grantUserPermission = async (
  userId: string,
  permissionId: string
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/user-permissions/${userId}/grant`, {
    permissionId,
  });
  return response.data;
};

export const revokeUserPermission = async (
  userId: string,
  permissionId: string
): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.post(`/user-permissions/${userId}/revoke`, {
    permissionId,
  });
  return response.data;
};
