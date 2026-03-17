import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios/axiosInstance';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/reports/dashboard-stats');
      return response.data.data;
    },
  });
};
