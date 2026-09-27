export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Fiverr';

export const ROUTES = {
  home: '/',
  signIn: '/dangnhap',
  signUp: '/dangky',
  jobs: '/cong-viec',
  jobsByType: (id: number | string = ':maLoai') => `/cong-viec/loai/${id}`,
  jobDetail: (id: number | string = ':maCongViec') => `/cong-viec/chi-tiet/${id}`,
  profile: '/thong-tin-ca-nhan',
  admin: '/admin',
  adminUsers: '/admin/quan-ly-nguoi-dung',
  adminJobs: '/admin/quan-ly-cong-viec',
  adminJobTypes: '/admin/quan-ly-loai-cong-viec',
  adminJobDetails: '/admin/quan-ly-chi-tiet-loai',
  adminHires: '/admin/quan-ly-thue-cong-viec',
  adminComments: '/admin/quan-ly-binh-luan',
} as const;

export const PERSIST_KEY = 'fiverr';
export const PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 10;

export const STORAGE = {
  token: 'fiverr_token',
} as const;
