import axios from 'axios';
import type { ApiEnvelope } from '@/types/api';

/** Rút message thân thiện từ lỗi Axios / lỗi thường */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope<unknown> | undefined;
    const serverMsg =
      (typeof data?.content === 'string' && data.content) || data?.message;

    switch (error.response?.status) {
      case 400:
      case 422:
        return serverMsg || 'Dữ liệu không hợp lệ';
      case 401:
        return serverMsg || 'Phiên đăng nhập đã hết hạn';
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này';
      case 404:
        return serverMsg || 'Không tìm thấy dữ liệu';
      case 409:
        return serverMsg || 'Dữ liệu đã tồn tại';
      case 500:
        return 'Lỗi máy chủ, vui lòng thử lại sau';
      default:
        return serverMsg || error.message || 'Có lỗi xảy ra';
    }
  }
  return error instanceof Error ? error.message : 'Có lỗi không xác định';
};
