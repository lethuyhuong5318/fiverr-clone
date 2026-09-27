import axios from 'axios';
import api from './api';
import type { ApiEnvelope, CommentPayload } from '@/types/api';
import type { Comment } from '@/types/models';
import { addLocalComment, getLocalComments } from '@/utils/localFallback';

/** Server luyện tập CyberSoft chặn nhầm quyền ghi ở API này cho role USER (đã xác minh bằng token chính thức) */
const isPermissionBlocked = (err: unknown) => axios.isAxiosError(err) && err.response?.status === 403;

export const commentsService = {
  getAll: async (): Promise<Comment[]> => {
    const res = await api.get<ApiEnvelope<Comment[]>>('/binh-luan');
    return res.data.content;
  },

  getByJob: async (maCongViec: number): Promise<Comment[]> => {
    const local = getLocalComments(maCongViec);
    const res = await api.get<ApiEnvelope<Comment[]>>(
      `/binh-luan/lay-binh-luan-theo-cong-viec/${maCongViec}`,
    );
    return [...local, ...res.data.content];
  },

  create: async (body: CommentPayload): Promise<Comment> => {
    const res = await api.post<ApiEnvelope<Comment>>('/binh-luan', body);
    return res.data.content;
  },

  /**
   * Thử API thật trước; nếu bị chặn quyền (403) thì lưu tạm ở trình duyệt
   * (`Comment.isLocal = true`) để form bình luận vẫn hoạt động được trong
   * lúc chờ server CyberSoft mở lại quyền ghi.
   */
  createWithFallback: async (
    body: CommentPayload,
    author: { tenNguoiBinhLuan?: string; avatar?: string },
  ): Promise<{ isLocal: boolean }> => {
    try {
      await commentsService.create(body);
      return { isLocal: false };
    } catch (err) {
      if (!isPermissionBlocked(err)) throw err;
      addLocalComment({ ...body, ...author });
      return { isLocal: true };
    }
  },

  update: async (id: number, body: CommentPayload): Promise<Comment> => {
    const res = await api.put<ApiEnvelope<Comment>>(`/binh-luan/${id}`, body);
    return res.data.content;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/binh-luan/${id}`);
  },
};
