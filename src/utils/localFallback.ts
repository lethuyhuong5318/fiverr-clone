import type { Comment, HiredJob } from '@/types/models';
import type { Job } from '@/types/models';

const HIRES_KEY = 'fiverr_local_hires';
const COMMENTS_KEY = 'fiverr_local_comments';

const localId = () => Date.now() + Math.floor(Math.random() * 1000);

const readAll = <T>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
};

const writeAll = <T>(key: string, items: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
};

export const getLocalHires = (maNguoiThue: number): HiredJob[] =>
  readAll<HiredJob>(HIRES_KEY).filter((h) => h.maNguoiThue === maNguoiThue);

export const addLocalHire = (job: Job, maNguoiThue: number): HiredJob => {
  const record: HiredJob = {
    id: localId(),
    maCongViec: job.id,
    maNguoiThue,
    ngayThue: new Date().toISOString(),
    hoanThanh: false,
    isLocal: true,
    congViec: job,
    tenCongViec: job.tenCongViec,
    danhGia: job.danhGia,
    giaTien: job.giaTien,
    nguoiTao: job.nguoiTao,
    hinhAnh: job.hinhAnh,
    moTa: job.moTa,
    moTaNgan: job.moTaNgan,
    saoCongViec: job.saoCongViec,
  };
  const all = readAll<HiredJob>(HIRES_KEY);
  all.unshift(record);
  writeAll(HIRES_KEY, all);
  return record;
};

export const completeLocalHire = (id: number): void => {
  const all = readAll<HiredJob>(HIRES_KEY).map((h) => (h.id === id ? { ...h, hoanThanh: true } : h));
  writeAll(HIRES_KEY, all);
};

export const getLocalComments = (maCongViec: number): Comment[] =>
  readAll<Comment>(COMMENTS_KEY).filter((c) => c.maCongViec === maCongViec);

export const addLocalComment = (
  input: Pick<Comment, 'maCongViec' | 'maNguoiBinhLuan' | 'noiDung' | 'saoBinhLuan'> & {
    tenNguoiBinhLuan?: string;
    avatar?: string;
  },
): Comment => {
  const record: Comment = {
    id: localId(),
    maCongViec: input.maCongViec,
    maNguoiBinhLuan: input.maNguoiBinhLuan,
    ngayBinhLuan: new Date().toISOString(),
    noiDung: input.noiDung,
    saoBinhLuan: input.saoBinhLuan,
    tenNguoiBinhLuan: input.tenNguoiBinhLuan,
    avatar: input.avatar,
    isLocal: true,
  };
  const all = readAll<Comment>(COMMENTS_KEY);
  all.unshift(record);
  writeAll(COMMENTS_KEY, all);
  return record;
};
