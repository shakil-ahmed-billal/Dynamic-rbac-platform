import { axiosInstance } from "../lib/axios/axiosInstance";
import { ApiResponse } from "../types/api.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: {
    name: string;
  };
  isActive: boolean;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  createdAt: string;
  updatedAt: string;
}

export const getAllUsers = async (params?: any): Promise<ApiResponse<IUser[]>> => {
  const response = await axiosInstance.get("/users", { params });
  return response.data;
};

export const createUser = async (data: any): Promise<ApiResponse<IUser>> => {
  const response = await axiosInstance.post("/users", data);
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<IUser>> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: any): Promise<ApiResponse<IUser>> => {
  const response = await axiosInstance.patch(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const getMinimalUsers = async (): Promise<ApiResponse<{ id: string; name: string }[]>> => {
  const response = await axiosInstance.get("/users/minimal");
  return response.data;
};
