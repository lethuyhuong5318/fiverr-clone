import api from './api';
import type {
  ApiEnvelope,
  PagedResult,
  PageParams,
  JobPayload,
} from '@/types/api';
import type { Job, JobDetail, MenuJobType, MenuGroup } from '@/types/models';

export const jobsService = {
  /** Danh sách + phân trang (dùng cho admin & trang danh sách) */
  getPaged: async (params: PageParams): Promise<PagedResult<Job>> => {
    const res = await api.get<ApiEnvelope<PagedResult<Job>>>(
      '/cong-viec/phan-trang-tim-kiem',
      { params },
    );
    return res.data.content;
  },

  getAll: async (): Promise<Job[]> => {
    const res = await api.get<ApiEnvelope<Job[]>>('/cong-viec');
    return res.data.content;
  },

  getById: async (id: number): Promise<Job> => {
    const res = await api.get<ApiEnvelope<Job>>(`/cong-viec/${id}`);
    return res.data.content;
  },

  /** Chi tiết đã join loại / nhóm / người tạo */
  getDetail: async (id: number): Promise<JobDetail[]> => {
    const res = await api.get<ApiEnvelope<JobDetail[]>>(
      `/cong-viec/lay-cong-viec-chi-tiet/${id}`,
    );
    return res.data.content;
  },

  /** BE trả về mảng đã join (giống shape JobDetail) — phải bóc `congViec` ra, giống getByDetailType. */
  searchByName: async (name: string): Promise<Job[]> => {
    const res = await api.get<ApiEnvelope<Array<{ congViec: Job }>>>(
      `/cong-viec/lay-danh-sach-cong-viec-theo-ten/${encodeURIComponent(name)}`,
    );
    return res.data.content.map((item) => item.congViec);
  },

  /**
   * BE trả về mảng đã join (giống shape JobDetail: { id, congViec: {...}, tenLoaiCongViec, ... })
   * chứ không phải mảng Job phẳng — phải bóc `congViec` ra.
   */
  getByDetailType: async (maChiTietLoai: number): Promise<Job[]> => {
    const res = await api.get<ApiEnvelope<Array<{ congViec: Job }>>>(
      `/cong-viec/lay-cong-viec-theo-chi-tiet-loai/${maChiTietLoai}`,
    );
    return res.data.content.map((item) => item.congViec);
  },

  getMenu: async (): Promise<MenuJobType[]> => {
    const res = await api.get<ApiEnvelope<MenuJobType[]>>(
      '/cong-viec/lay-menu-loai-cong-viec',
    );
    return res.data.content;
  },

  /**
   * BE trả về mảng bọc 1 lớp: [{ id, tenLoaiCongViec, dsNhomChiTietLoai: [...] }]
   * (giống shape của MenuJobType) — không phải mảng MenuGroup trực tiếp.
   */
  getGroupsByType: async (
    maLoaiCongViec: number,
  ): Promise<{ tenLoaiCongViec: string; groups: MenuGroup[] }> => {
    const res = await api.get<ApiEnvelope<MenuJobType[]>>(
      `/cong-viec/lay-chi-tiet-loai-cong-viec/${maLoaiCongViec}`,
    );
    const root = res.data.content?.[0];
    return { tenLoaiCongViec: root?.tenLoaiCongViec ?? '', groups: root?.dsNhomChiTietLoai ?? [] };
  },

  create: async (body: JobPayload): Promise<Job> => {
    const res = await api.post<ApiEnvelope<Job>>('/cong-viec', body);
    return res.data.content;
  },

  update: async (id: number, body: JobPayload): Promise<Job> => {
    const res = await api.put<ApiEnvelope<Job>>(`/cong-viec/${id}`, body);
    return res.data.content;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/cong-viec/${id}`);
  },

  uploadImage: async (maCongViec: number, file: File): Promise<Job> => {
    const form = new FormData();
    form.append('formFile', file);
    const res = await api.post<ApiEnvelope<Job>>(
      `/cong-viec/upload-hinh-cong-viec/${maCongViec}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data.content;
  },
};
