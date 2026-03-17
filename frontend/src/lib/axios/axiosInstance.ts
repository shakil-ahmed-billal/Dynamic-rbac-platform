import axios from "axios";
import Cookies from "js-cookie";
import { isTokenExpiringSoon } from "../tokenUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for attaching tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear manual cookies
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });

      // Redirect to login if not already on a public page
      const publicPaths = ["/login", "/register", "/forgot-password"];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath)) {
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({
      ...error,
      message,
    });
  },
);
