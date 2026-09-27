import api from './api';
import type { ApiEnvelope, PagedResult, PageParams, UpdateUserRequest } from '@/types/api';
import type { UserProfile } from '@/types/models';

/**
 * BE trả skill/certification không nhất quán: GET trả mảng, nhưng PUT / POST
 * lại trả chuỗi JSON (vd `"[\"React\"]"`). Nếu đưa thẳng chuỗi vào store,
 * trang Hồ sơ gọi `.map()` trên chuỗi và crash trắng trang — nên chuẩn hoá ở đây.
 */
const toArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return v.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export const normalizeUser = (u: UserProfile): UserProfile => ({
  ...u,
  skill: toArray(u.skill),
  certification: toArray(u.certification),
});

export const usersService = {
  getById: async (id: number): Promise<UserProfile> => {
    const res = await api.get<ApiEnvelope<UserProfile>>(`/users/${id}`);
    return normalizeUser(res.data.content);
  },

  getPaged: async (params: PageParams): Promise<PagedResult<UserProfile>> => {
    const res = await api.get<ApiEnvelope<PagedResult<UserProfile>>>(
      '/users/phan-trang-tim-kiem',
      { params },
    );
    const page = res.data.content;
    return { ...page, data: page.data.map(normalizeUser) };
  },

  search: async (name: string): Promise<UserProfile[]> => {
    const res = await api.get<ApiEnvelope<UserProfile[]>>(
      `/users/search/${encodeURIComponent(name)}`,
    );
    return res.data.content.map(normalizeUser);
  },

  update: async (id: number, body: UpdateUserRequest): Promise<UserProfile> => {
    const res = await api.put<ApiEnvelope<UserProfile>>(`/users/${id}`, body);
    return normalizeUser(res.data.content);
  },

  create: async (body: Partial<UpdateUserRequest> & { password: string }): Promise<UserProfile> => {
    const res = await api.post<ApiEnvelope<UserProfile>>('/users', body);
    return normalizeUser(res.data.content);
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/users`, { params: { id } });
  },

  uploadAvatar: async (file: File): Promise<UserProfile> => {
    const form = new FormData();
    form.append('formFile', file);
    const res = await api.post<ApiEnvelope<UserProfile>>('/users/upload-avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeUser(res.data.content);
  },
};
