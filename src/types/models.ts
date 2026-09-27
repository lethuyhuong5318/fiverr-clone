export type Role = 'ADMIN' | 'USER' | string;

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: Role;
  skill: string[];
  certification: string[];
  avatar?: string;
  bookingJob?: BookingRef[];
}

export interface BookingRef {
  id: number;
  maCongViec: number;
  maNguoiThue: number;
  ngayThue: string;
  hoanThanh: boolean;
}

export interface Job {
  id: number;
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

export interface JobDetail {
  id: number;
  congViec: Job;
  tenLoaiCongViec: string;
  tenNhomChiTietLoai: string;
  tenChiTietLoai: string;
  avatar: string;
  tenNguoiTao: string;
}

export interface JobByName {
  id: number;
  tenLoaiCongViec: string;
  dsNhomChiTietLoai: {
    id: number;
    tenNhom: string;
    hinhAnh: string;
    maLoaiCongViec: number;
    dsChiTietLoai: { id: number; tenChiTiet: string }[];
  }[];
}

export interface JobType {
  id: number;
  tenLoaiCongViec: string;
}

export interface MenuJobType {
  id: number;
  tenLoaiCongViec: string;
  dsNhomChiTietLoai: MenuGroup[];
}

export interface MenuGroup {
  id: number;
  tenNhom: string;
  hinhAnh: string;
  maLoaiCongViec: number;
  dsChiTietLoai: MenuLeaf[];
}

export interface MenuLeaf {
  id: number;
  tenChiTiet: string;
}

export interface JobTypeDetail {
  id: number;
  tenChiTiet: string;
  maLoaiCongViec: number;
  danhSachChiTiet: number[];
}

export interface Comment {
  id: number;
  maCongViec: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  tenNguoiBinhLuan?: string;
  avatar?: string;
  isLocal?: boolean;
}

export interface Hire {
  id: number;
  maCongViec: number;
  maNguoiThue: number;
  ngayThue: string;
  hoanThanh: boolean;
  isLocal?: boolean;
}

export interface HiredJob {
  id: number;
  maCongViec: number;
  maNguoiThue: number;
  ngayThue: string;
  hoanThanh: boolean;
  isLocal?: boolean;
  congViec: Job;
  tenCongViec: string;
  danhGia: number;
  giaTien: number;
  nguoiTao: number;
  hinhAnh: string;
  moTa: string;
  moTaNgan: string;
  saoCongViec: number;
}
