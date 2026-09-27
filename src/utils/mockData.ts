import {
  Palette,
  TrendingUp,
  PenTool,
  Video,
  Music,
  Code2,
  Camera,
  Megaphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const HERO_KEYWORDS = [
  { label: 'Thiết kế logo', query: 'logo' },
  { label: 'WordPress', query: 'website' },
  { label: 'Dịch thuật', query: 'translation' },
  { label: 'Voice Over', query: 'voice' },
  { label: 'SEO', query: 'seo' },
];

export const POPULAR_CATEGORIES = [
  { icon: PenTool, label: 'Xây dựng thương hiệu', query: 'brand', color: 'bg-rose-50 text-rose-600' },
  { icon: Code2, label: 'Phát triển website', query: 'website', color: 'bg-sky-50 text-sky-600' },
  { icon: Megaphone, label: 'Digital Marketing', query: 'marketing', color: 'bg-amber-50 text-amber-600' },
  { icon: Video, label: 'Chỉnh sửa video', query: 'video', color: 'bg-violet-50 text-violet-600' },
  { icon: Camera, label: 'Nhiếp ảnh sản phẩm', query: 'photo', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Music, label: 'Sản xuất âm nhạc', query: 'music', color: 'bg-indigo-50 text-indigo-600' },
];

export const CATEGORY_GRID = [
  { icon: Palette, label: 'Graphics & Design', jobs: '1.2k dịch vụ' },
  { icon: TrendingUp, label: 'Digital Marketing', jobs: '860 dịch vụ' },
  { icon: PenTool, label: 'Writing & Translation', jobs: '640 dịch vụ' },
  { icon: Video, label: 'Video & Animation', jobs: '410 dịch vụ' },
  { icon: Music, label: 'Music & Audio', jobs: '220 dịch vụ' },
  { icon: Code2, label: 'Programming & Tech', jobs: '980 dịch vụ' },
];

export const TRUST_LOGOS = ['meta', 'google', 'netflix', 'paypal', 'payoneer'];

export interface CategoryBanner {
  icon: LucideIcon;
  gradient: string;
  tagline: string;
  popular: string[];
}

export const CATEGORY_BANNERS: Record<string, CategoryBanner> = {
  'graphics & design': {
    icon: Palette,
    gradient: 'from-rose-600 to-orange-500',
    tagline: 'Thiết kế nổi bật, gây ấn tượng ngay từ cái nhìn đầu tiên.',
    popular: ['Thiết kế Logo', 'Nhận diện thương hiệu', 'Thiết kế Website', 'Minh hoạ', 'Thiết kế bao bì'],
  },
  'digital marketing': {
    icon: TrendingUp,
    gradient: 'from-sky-600 to-blue-500',
    tagline: 'Tiếp cận đúng khách hàng, tăng trưởng đúng cách.',
    popular: ['SEO', 'Social Media', 'Quảng cáo trả phí', 'Email Marketing', 'Influencer Marketing'],
  },
  'writing & translation': {
    icon: PenTool,
    gradient: 'from-lime-700 to-emerald-600',
    tagline: 'Truyền tải đúng thông điệp — bằng bất kỳ ngôn ngữ nào.',
    popular: ['Viết bài & Blog', 'Dịch thuật', 'Ghostwriting', 'Hiệu đính', 'Viết CV'],
  },
  'video & animation': {
    icon: Video,
    gradient: 'from-violet-700 to-purple-500',
    tagline: 'Kể câu chuyện của bạn bằng hình ảnh chuyển động.',
    popular: ['Video quảng cáo', 'Hoạt hình 2D', 'Chỉnh sửa video', 'Video Intro', 'Lồng tiếng'],
  },
  'music & audio': {
    icon: Music,
    gradient: 'from-indigo-700 to-blue-600',
    tagline: 'Âm thanh chuẩn, cảm xúc trọn vẹn.',
    popular: ['Sản xuất nhạc', 'Thu âm giọng hát', 'Mixing & Mastering', 'Nhạc nền', 'Sound Design'],
  },
  'programming & tech': {
    icon: Code2,
    gradient: 'from-slate-800 to-slate-600',
    tagline: 'Biến ý tưởng thành sản phẩm công nghệ thật.',
    popular: ['Lập trình Website', 'Lập trình App', 'WordPress', 'Chatbot & AI', 'Sửa lỗi & Bảo trì'],
  },
  'business & ai services': {
    icon: Sparkles,
    gradient: 'from-teal-700 to-emerald-600',
    tagline: 'Tối ưu vận hành với giải pháp kinh doanh & AI.',
    popular: ['Tư vấn kinh doanh', 'Chatbot AI', 'Phân tích dữ liệu', 'Tự động hoá quy trình', 'Lập kế hoạch tài chính'],
  },
};

export const DEFAULT_CATEGORY_BANNER: CategoryBanner = {
  icon: Megaphone,
  gradient: 'from-primary-700 to-primary-500',
  tagline: 'Tìm đúng freelancer cho công việc này.',
  popular: ['Dịch vụ nổi bật', 'Được đánh giá cao', 'Mới đăng', 'Giá tốt', 'Bàn giao nhanh'],
};

export const getCategoryBanner = (tenLoaiCongViec: string): CategoryBanner =>
  CATEGORY_BANNERS[tenLoaiCongViec.trim().toLowerCase()] ?? DEFAULT_CATEGORY_BANNER;

export const SELLER_BENEFITS = [
  'Tiếp cận hàng nghìn người mua tiềm năng mỗi ngày',
  'Tự do định giá cho từng gói dịch vụ',
  'Thanh toán an toàn, rút tiền linh hoạt',
  'Xây dựng thương hiệu freelancer chuyên nghiệp',
];

export const placeholderImg = (seed: string | number, w = 400, h = 300) =>
  `https://picsum.photos/seed/fiverr-${seed}/${w}/${h}`;

export const placeholderAvatar = (seed: string | number) =>
  `https://i.pravatar.cc/80?u=fiverr-${seed}`;
