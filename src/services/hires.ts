import axios from 'axios';
import api from './api';
import type { ApiEnvelope, PagedResult, PageParams, HirePayload } from '@/types/api';
import type { Hire, HiredJob, Job } from '@/types/models';
import { addLocalHire, completeLocalHire, getLocalHires } from '@/utils/localFallback';

/** Server luyện tập CyberSoft chặn nhầm quyền ghi ở 2 API này cho role USER (đã xác minh bằng token chính thức) */
const isPermissionBlocked = (err: unknown) => axios.isAxiosError(err) && err.response?.status === 403;

export const hiresService = {
  getAll: async (): Promise<Hire[]> => {
    const res = await api.get<ApiEnvelope<Hire[]>>('/thue-cong-viec');
    return res.data.content;
  },

  getPaged: async (params: PageParams): Promise<PagedResult<Hire>> => {
    const res = await api.get<ApiEnvelope<PagedResult<Hire>>>(
      '/thue-cong-viec/phan-trang-tim-kiem',
      { params },
    );
    return res.data.content;
  },

  /**
   * Công việc user đang đăng nhập đã thuê. GET /thue-cong-viec/lay-danh-sach-da-thue
   * cũng bị chặn quyền cho USER thường -> nếu lỗi 403 thì chỉ trả phần lưu local
   * (không throw, để trang Hồ sơ vẫn hiển thị được các đơn thuê tạm).
   */
  getMyHired: async (maNguoiThue: number): Promise<HiredJob[]> => {
    const local = getLocalHires(maNguoiThue);
    try {
      const res = await api.get<ApiEnvelope<HiredJob[]>>('/thue-cong-viec/lay-danh-sach-da-thue');
      return [...local, ...res.data.content];
    } catch (err) {
      if (isPermissionBlocked(err)) return local;
      throw err;
    }
  },

  hire: async (maCongViec: number, maNguoiThue: number): Promise<Hire> => {
    const body: HirePayload = {
      maCongViec,
      maNguoiThue,
      ngayThue: new Date().toISOString(),
      hoanThanh: false,
    };
    const res = await api.post<ApiEnvelope<Hire>>('/thue-cong-viec', body);
    return res.data.content;
  },

  /**
   * Thử API thật trước; nếu bị chặn quyền (403) thì lưu tạm ở trình duyệt
   * (`HiredJob.isLocal = true`) để nút "Thuê ngay" vẫn hoạt động được cho
   * người dùng trong lúc chờ server CyberSoft mở lại quyền ghi.
   */
  hireWithFallback: async (job: Job, maNguoiThue: number): Promise<{ isLocal: boolean }> => {
    try {
      await hiresService.hire(job.id, maNguoiThue);
      return { isLocal: false };
    } catch (err) {
      if (!isPermissionBlocked(err)) throw err;
      addLocalHire(job, maNguoiThue);
      return { isLocal: true };
    }
  },

  complete: async (maThueCongViec: number): Promise<Hire> => {
    const res = await api.post<ApiEnvelope<Hire>>(
      `/thue-cong-viec/hoan-thanh-cong-viec/${maThueCongViec}`,
    );
    return res.data.content;
  },

  /** Đơn local thì đánh dấu hoàn thành ngay tại chỗ, không gọi API thật */
  completeWithFallback: async (id: number, isLocal?: boolean): Promise<void> => {
    if (isLocal) {
      completeLocalHire(id);
      return;
    }
    try {
      await hiresService.complete(id);
    } catch (err) {
      if (!isPermissionBlocked(err)) throw err;
      completeLocalHire(id);
    }
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/thue-cong-viec/${id}`);
  },
};
