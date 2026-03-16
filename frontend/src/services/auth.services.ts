import { axiosInstance } from "../lib/axios/axiosInstance";

export const loginUser = async (data: any) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};
