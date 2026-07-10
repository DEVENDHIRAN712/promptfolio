import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface HealthResponse {
  status: string;
  service: string;
  phase: string;
  timestamp: string;
  database: string;
}

export const useHealthQuery = () => {
  return useQuery<HealthResponse, Error>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get<HealthResponse>('/api/health');
      return response.data;
    },
    retry: false,
    refetchInterval: 5000,
  });
};
