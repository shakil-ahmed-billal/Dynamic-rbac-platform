import { axiosInstance } from "../lib/axios/axiosInstance";

export const getAllTasks = async (params: any = {}) => {
  const response = await axiosInstance.get("/tasks", { params });
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await axiosInstance.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: any) => {
  const response = await axiosInstance.post("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: any) => {
  const response = await axiosInstance.patch(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};
