import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronRight, Check, ChevronDown } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { jobsService } from '@/services/jobs';
import { commentsService } from '@/services/comments';
import { hiresService } from '@/services/hires';
import { getErrorMessage } from '@/utils/errors';
import { formatPrice, fromNow } from '@/utils/formatters';
import { placeholderImg, placeholderAvatar } from '@/utils/mockData';
import { ROUTES } from '@/utils/constants';
import { commentSchema, type CommentFormData } from '@/utils/validators';
import type { JobDetail, Comment } from '@/types/models';
import { PageLoader } from '@/components/Common/Spinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { Rating, RatingInput } from '@/components/Common/Rating';
import { Avatar } from '@/components/Common/Avatar';
import { Button } from '@/components/Common/Button';
import { Textarea } from '@/components/Common/Textarea';

const TABS = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'description', label: 'Mô tả' },
  { key: 'seller', label: 'Về người bán' },
  { key: 'faq', label: 'FAQ' },
  { key: 'reviews', label: 'Đánh giá' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

const buildTiers = (basePrice: number) => [
  {
    key: 'basic',
    name: 'Cơ bản',
    price: basePrice,
    delivery: '3 ngày',
    revisions: '1 lượt chỉnh sửa',
    features: ['1 concept ban đầu', 'File JPG/PNG', 'Hỗ trợ qua tin nhắn'],
  },
  {
    key: 'standard',
    name: 'Tiêu chuẩn',
    price: Math.round(basePrice * 2 * 0.95),
    delivery: '5 ngày',
    revisions: '3 lượt chỉnh sửa',
    features: ['2 concept ban đầu', 'File nguồn (source file)', 'Ưu tiên hỗ trợ', 'File JPG/PNG/PDF'],
  },
  {
    key: 'premium',
    name: 'Cao cấp',
    price: Math.round(basePrice * 3.5 * 0.9),
    delivery: '7 ngày',
    revisions: 'Chỉnh sửa không giới hạn',
    features: [
      '4 concept ban đầu',
      'File nguồn đầy đủ định dạng',
      'Hỗ trợ ưu tiên 24/7',
      'Bàn giao kèm hướng dẫn sử dụng',
    ],
  },
];

const FAQS = [
  {
    q: 'Bạn có hỗ trợ chỉnh sửa sau khi bàn giao không?',
    a: 'Có. Số lượt chỉnh sửa miễn phí tuỳ theo gói bạn chọn (xem chi tiết ở từng gói bên phải).',
  },
  {
    q: 'Tôi có nhận được file nguồn (source file) không?',
    a: 'Gói Tiêu chuẩn và Cao cấp bao gồm file nguồn đầy đủ định dạng. Gói Cơ bản chỉ gồm file thành phẩm.',
  },
  {
    q: 'Thời gian bàn giao có thể rút ngắn không?',
    a: 'Có thể liên hệ trực tiếp người bán để trao đổi thêm về gấp rút tiến độ (phụ phí có thể phát sinh).',
  },
  {
    q: 'Nếu không hài lòng với kết quả thì sao?',
    a: 'Bạn có thể yêu cầu chỉnh sửa trong số lượt được hỗ trợ, hoặc liên hệ người bán để thoả thuận thêm.',
  },
];

export const JobDetailPage = () => {
  const { maCongViec } = useParams();
  const id = Number(maCongViec);
  const navigate = useNavigate();
  const { token, user } = useAppSelector((s) => s.auth);

  const [detail, setDetail] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hiring, setHiring] = useState(false);
  const [tab, setTab] = useState<TabKey>('overview');
  const [tierIndex, setTierIndex] = useState(0);
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const loadComments = useCallback(() => {
    setCommentsLoading(true);
    commentsService
      .getByJob(id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [id]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    jobsService
      .getDetail(id)
      .then((data) => alive && setDetail(data[0] ?? null))
      .catch((err) => alive && setError(getErrorMessage(err)))
      .finally(() => alive && setLoading(false));
    loadComments();
    setTab('overview');
    setStarFilter(null);
    setTierIndex(0);
  }, [id, loadComments]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { noiDung: '', saoBinhLuan: 5 },
  });
  const stars = watch('saoBinhLuan');

  const ratingBreakdown = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: comments.filter((c) => c.saoBinhLuan === star).length,
    }));
    const total = comments.length;
    return { counts, total };
  }, [comments]);

  const filteredComments = useMemo(
    () => (starFilter ? comments.filter((c) => c.saoBinhLuan === starFilter) : comments),
    [comments, starFilter],
  );

  const onHire = async () => {
    if (!token || !user || !detail) {
      navigate(ROUTES.signIn, { state: { from: ROUTES.jobDetail(id) } });
      return;
    }
    try {
      setHiring(true);
      const { isLocal } = await hiresService.hireWithFallback(detail.congViec, user.id);
      toast.success(
        isLocal
          ? 'Đã đặt thuê (lưu tạm ở trình duyệt — server luyện tập đang chặn quyền ghi cho tài khoản thường)'
          : 'Đặt thuê công việc thành công!',
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setHiring(false);
    }
  };

  const onComment = async (form: CommentFormData) => {
    if (!token || !user) {
      navigate(ROUTES.signIn, { state: { from: ROUTES.jobDetail(id) } });
      return;
    }
    try {
      const { isLocal } = await commentsService.createWithFallback(
        {
          maCongViec: id,
          maNguoiBinhLuan: user.id,
          ngayBinhLuan: new Date().toISOString(),
          noiDung: form.noiDung,
          saoBinhLuan: form.saoBinhLuan,
        },
        { tenNguoiBinhLuan: user.name, avatar: user.avatar },
      );
      toast.success(
        isLocal
          ? 'Đã gửi (lưu tạm ở trình duyệt — server luyện tập đang chặn quyền ghi cho tài khoản thường)'
          : 'Đã gửi bình luận',
      );
      reset({ noiDung: '', saoBinhLuan: 5 });
      loadComments();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageLoader label="Đang tải chi tiết công việc..." />;
  if (error || !detail)
    return (
      <div className="container-page py-10">
        <EmptyState title="Không tìm thấy công việc" description={error ?? undefined} />
      </div>
    );

  const job = detail.congViec;
  const img = job.hinhAnh || placeholderImg(job.id, 800, 500);
  const tiers = buildTiers(job.giaTien || 5);
  const activeTier = tiers[tierIndex];

  const sellerBlock = (
    <section className="rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-4">
        <Avatar src={detail.avatar || placeholderAvatar(job.nguoiTao)} name={detail.tenNguoiTao} size={64} />
        <div>
          <p className="font-bold text-ink">{detail.tenNguoiTao}</p>
          <p className="text-sm text-ink-faint">Freelancer chuyên nghiệp</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        Mình có nhiều năm kinh nghiệm trong lĩnh vực {detail.tenLoaiCongViec.toLowerCase()}, cam kết
        chất lượng và đúng deadline.
      </p>
    </section>
  );

  return (
    <div className="container-page py-8">
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Left */}
        <div className="min-w-0 flex-1">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-ink-faint">
            <span>{detail.tenLoaiCongViec}</span>
            <ChevronRight size={14} />
            <span>{detail.tenNhomChiTietLoai}</span>
            <ChevronRight size={14} />
            <span className="text-ink-soft">{detail.tenChiTietLoai}</span>
          </nav>

          <h1 className="mt-3 text-2xl font-bold text-ink md:text-3xl">{job.tenCongViec}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Avatar src={detail.avatar || placeholderAvatar(job.nguoiTao)} name={detail.tenNguoiTao} size={40} />
            <div>
              <p className="text-sm font-semibold text-ink">{detail.tenNguoiTao}</p>
              <Rating value={job.saoCongViec} count={job.danhGia} />
            </div>
          </div>

          <img
            src={img}
            alt={job.tenCongViec}
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = placeholderImg(job.id, 800, 500))}
            className="mt-6 aspect-[16/10] w-full rounded-xl object-cover"
          />

          {/* Tabs */}
          <div className="mt-8 flex gap-1 overflow-x-auto border-b border-gray-200 no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab: Tổng quan */}
          {tab === 'overview' && (
            <div className="mt-6 space-y-8">
              <section>
                <h2 className="text-lg font-bold text-ink">Về dịch vụ này</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-soft">
                  {job.moTaNgan || job.moTa || 'Chưa có mô tả.'}
                </p>
              </section>
              {sellerBlock}
            </div>
          )}

          {/* Tab: Mô tả */}
          {tab === 'description' && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-ink">Mô tả chi tiết</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-soft">
                {job.moTa || job.moTaNgan || 'Chưa có mô tả.'}
              </p>
            </section>
          )}

          {/* Tab: Về người bán */}
          {tab === 'seller' && <div className="mt-6">{sellerBlock}</div>}

          {tab === 'faq' && (
            <div className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-200">
              {FAQS.map((f, i) => (
                <details key={i} className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-ink">
                    {f.q}
                    <ChevronDown size={16} className="shrink-0 text-ink-faint transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {/* Tab: Đánh giá */}
          {tab === 'reviews' && (
            <section className="mt-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold text-ink">{job.saoCongViec.toFixed(1)}</span>
                  <div>
                    <Rating value={job.saoCongViec} showValue={false} />
                    <p className="text-sm text-ink-faint">{ratingBreakdown.total} đánh giá</p>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  {ratingBreakdown.counts.map(({ star, count }) => {
                    const pct = ratingBreakdown.total ? Math.round((count / ratingBreakdown.total) * 100) : 0;
                    return (
                      <button
                        key={star}
                        onClick={() => setStarFilter(starFilter === star ? null : star)}
                        className={`flex w-full items-center gap-2 rounded px-1 text-xs ${
                          starFilter === star ? 'bg-primary-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="w-10 shrink-0 text-ink-soft">{star} sao</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                          <span className="block h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="w-8 shrink-0 text-right text-ink-faint">{count}</span>
                      </button>
                    );
                  })}
                  {starFilter && (
                    <button onClick={() => setStarFilter(null)} className="text-xs text-primary hover:underline">
                      Xoá lọc ({starFilter} sao)
                    </button>
                  )}
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onComment)}
                className="mt-6 space-y-3 rounded-xl border border-gray-200 p-4"
              >
                <div>
                  <p className="mb-1 text-sm font-semibold text-ink">Chấm điểm</p>
                  <RatingInput value={stars} onChange={(v) => setValue('saoBinhLuan', v)} />
                </div>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  error={errors.noiDung?.message}
                  {...register('noiDung')}
                />
                <div className="flex justify-end">
                  <Button type="submit" loading={isSubmitting}>
                    Gửi bình luận
                  </Button>
                </div>
              </form>

              <div className="mt-6 space-y-5">
                {commentsLoading ? (
                  <p className="text-sm text-ink-faint">Đang tải bình luận...</p>
                ) : filteredComments.length === 0 ? (
                  <p className="text-sm text-ink-faint">
                    {starFilter ? 'Không có đánh giá nào ở mức sao này.' : 'Chưa có bình luận nào.'}
                  </p>
                ) : (
                  filteredComments.map((c) => (
                    <div key={c.id} className="flex gap-3 border-b border-gray-100 pb-4">
                      <Avatar src={c.avatar} name={c.tenNguoiBinhLuan || `User ${c.maNguoiBinhLuan}`} size={40} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-ink">
                            {c.tenNguoiBinhLuan || `Người dùng #${c.maNguoiBinhLuan}`}
                          </p>
                          <span className="text-xs text-ink-faint">{fromNow(c.ngayBinhLuan)}</span>
                          {c.isLocal && (
                            <span
                              title="Lưu tạm ở trình duyệt này — server luyện tập đang chặn quyền ghi cho tài khoản thường"
                              className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
                            >
                              Chờ đồng bộ
                            </span>
                          )}
                        </div>
                        <Rating value={c.saoBinhLuan} showValue={false} size={12} />
                        <p className="mt-1 text-sm text-ink-soft">{c.noiDung}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:w-80 lg:shrink-0">
          <div className="rounded-xl border border-gray-200 p-5 lg:sticky lg:top-24">
            <div className="flex rounded-lg bg-gray-100 p-1 text-sm font-semibold">
              {tiers.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setTierIndex(i)}
                  className={`flex-1 rounded-md py-1.5 transition-colors ${
                    tierIndex === i ? 'bg-white text-ink shadow-card' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm text-ink-soft">{job.moTaNgan?.split('\n')[0] || 'Gói dịch vụ'}</p>
            <p className="mt-1 text-3xl font-extrabold text-ink">{formatPrice(activeTier.price)}</p>
            <p className="mt-1 text-xs text-ink-faint">
              Bàn giao trong {activeTier.delivery} · {activeTier.revisions}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {activeTier.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} className="text-primary" /> {f}
                </li>
              ))}
            </ul>

            <Button fullWidth className="mt-5 h-11" loading={hiring} onClick={onHire}>
              {token ? 'Thuê ngay' : 'Đăng nhập để thuê'}
            </Button>
            {!token && (
              <p className="mt-2 text-center text-xs text-ink-faint">
                Bạn cần <Link to={ROUTES.signIn} className="text-primary hover:underline">đăng nhập</Link> để đặt thuê
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
