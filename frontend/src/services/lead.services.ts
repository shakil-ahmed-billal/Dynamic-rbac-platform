import { axiosInstance } from "../lib/axios/axiosInstance";

export const getAllLeads = async (params: any = {}) => {
  const response = await axiosInstance.get("/leads", { params });
  return response.data;
};

export const getLeadById = async (id: string) => {
  const response = await axiosInstance.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (data: any) => {
  const response = await axiosInstance.post("/leads", data);
  return response.data;
};

export const updateLead = async (id: string, data: any) => {
  const response = await axiosInstance.patch(`/leads/${id}`, data);
  return response.data;
};

export const deleteLead = async (id: string) => {
  const response = await axiosInstance.delete(`/leads/${id}`);
  return response.data;
};
