import type { UserProfile } from './models';

export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime?: string;
}

export interface PagedResult<T> {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  keywords: string | null;
  data: T[];
}

export interface PageParams {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: string;
  skill: string[];
  certification: string[];
}

export interface SignInRequest {
  email: string;
  password: string;
}

export type SignInContentRaw =
  | { user: UserProfile; token: string }
  | (UserProfile & { token: string });

export interface AuthResult {
  user: UserProfile;
  token: string;
}

export interface UpdateUserRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: string;
  skill: string[];
  certification: string[];
}

export interface JobPayload {
  id?: number;
  tenCongViec: string;
  danhGia: number;
  giaTien: number;
  nguoiTao: number;
  hinhAnh: string;
  moTa: string;
  maChiTietLoaiCongViec: number;
  moTaNgan: string;
  saoCongViec: number;
}

export interface JobTypePayload {
  id?: number;
  tenLoaiCongViec: string;
}

export interface JobTypeDetailPayload {
  id?: number;
  tenChiTiet: string;
  maLoaiCongViec: number;
  danhSachChiTiet: number[];
}

export interface CommentPayload {
  id?: number;
  maCongViec: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

export interface HirePayload {
  id?: number;
  maCongViec: number;
  maNguoiThue: number;
  ngayThue: string;
  hoanThanh: boolean;
}
