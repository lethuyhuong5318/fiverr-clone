import api from './api';
import type {
  ApiEnvelope,
  PagedResult,
  PageParams,
  JobTypePayload,
  JobTypeDetailPayload,
} from '@/types/api';
import type { JobType, JobTypeDetail } from '@/types/models';

export const jobTypeService = {
  getAll: async (): Promise<JobType[]> => {
    const res = await api.get<ApiEnvelope<JobType[]>>('/loai-cong-viec');
    return res.data.content;
  },
  getPaged: async (params: PageParams): Promise<PagedResult<JobType>> => {
    const res = await api.get<ApiEnvelope<PagedResult<JobType>>>(
      '/loai-cong-viec/phan-trang-tim-kiem',
      { params },
    );
    return res.data.content;
  },
  getById: async (id: number): Promise<JobType> => {
    const res = await api.get<ApiEnvelope<JobType>>(`/loai-cong-viec/${id}`);
    return res.data.content;
  },
  create: async (body: JobTypePayload): Promise<JobType> => {
    const res = await api.post<ApiEnvelope<JobType>>('/loai-cong-viec', body);
    return res.data.content;
  },
  update: async (id: number, body: JobTypePayload): Promise<JobType> => {
    const res = await api.put<ApiEnvelope<JobType>>(`/loai-cong-viec/${id}`, body);
    return res.data.content;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/loai-cong-viec/${id}`);
  },
};

export const jobTypeDetailService = {
  getAll: async (): Promise<JobTypeDetail[]> => {
    const res = await api.get<ApiEnvelope<JobTypeDetail[]>>('/chi-tiet-loai-cong-viec');
    return res.data.content;
  },
  getPaged: async (params: PageParams): Promise<PagedResult<JobTypeDetail>> => {
    const res = await api.get<ApiEnvelope<PagedResult<JobTypeDetail>>>(
      '/chi-tiet-loai-cong-viec/phan-trang-tim-kiem',
      { params },
    );
    return res.data.content;
  },
  getById: async (id: number): Promise<JobTypeDetail> => {
    const res = await api.get<ApiEnvelope<JobTypeDetail>>(`/chi-tiet-loai-cong-viec/${id}`);
    return res.data.content;
  },
  create: async (body: JobTypeDetailPayload): Promise<JobTypeDetail> => {
    const res = await api.post<ApiEnvelope<JobTypeDetail>>('/chi-tiet-loai-cong-viec', body);
    return res.data.content;
  },
  update: async (id: number, body: JobTypeDetailPayload): Promise<JobTypeDetail> => {
    const res = await api.put<ApiEnvelope<JobTypeDetail>>(
      `/chi-tiet-loai-cong-viec/${id}`,
      body,
    );
    return res.data.content;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/chi-tiet-loai-cong-viec/${id}`);
  },
};
