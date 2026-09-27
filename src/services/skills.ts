import api from './api';
import type { ApiEnvelope } from '@/types/api';

export const skillsService = {
  getAll: async (): Promise<string[]> => {
    const res = await api.get<ApiEnvelope<string[]>>('/skill');
    return res.data.content;
  },
};
