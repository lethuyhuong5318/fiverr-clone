import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale('vi');

/**
 * BE trả `ngayThue`/`ngayBinhLuan` không nhất quán format: có lúc ISO
 * ("2026-09-27T..."), có lúc "DD/MM/YYYY" (vd "14/02/2026"). dayjs parse
 * chuỗi có dấu "/" theo mặc định trình duyệt (MM/DD/YYYY, kiểu Mỹ) nên sẽ
 * đọc SAI ngày/tháng nếu không ép format tường minh — dẫn tới hiện sai
 * "X ngày trước". Hàm này thử ISO trước, rồi mới ép "DD/MM/YYYY".
 */
const parseApiDate = (value?: string): Dayjs | null => {
  if (!value) return null;
  if (value.includes('-')) {
    const iso = dayjs(value);
    if (iso.isValid()) return iso;
  }
  const strict = dayjs(value, ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY', 'D/M/YYYY'], true);
  if (strict.isValid()) return strict;
  const loose = dayjs(value);
  return loose.isValid() ? loose : null;
};

/** Giá tiền trên Swagger là USD (int) — hiển thị dạng $x */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value?: string): string => {
  const d = parseApiDate(value);
  return d ? d.format('DD/MM/YYYY') : '—';
};

export const formatDateTime = (value?: string): string => {
  const d = parseApiDate(value);
  return d ? d.format('HH:mm DD/MM/YYYY') : '—';
};

export const fromNow = (value?: string): string => {
  const d = parseApiDate(value);
  return d ? d.fromNow() : '';
};

export const formatRating = (value?: number): string =>
  typeof value === 'number' ? value.toFixed(1) : '0.0';

export const initials = (name?: string): string =>
  (name || '?')
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
