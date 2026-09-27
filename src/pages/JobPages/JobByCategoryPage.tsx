import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { fetchJobsByDetailType } from '@/store/slices/jobSlice';
import { jobsService } from '@/services/jobs';
import { getErrorMessage } from '@/utils/errors';
import { ROUTES } from '@/utils/constants';
import { getCategoryBanner } from '@/utils/mockData';
import type { MenuGroup } from '@/types/models';
import { PageLoader } from '@/components/Common/Spinner';
import { EmptyState } from '@/components/Common/EmptyState';

/**
 * Trang danh sách nhóm chi tiết loại + chi tiết loại (vào từ menu header 1 LOẠI).
 * API: GET /cong-viec/lay-chi-tiet-loai-cong-viec/{MaLoaiCongViec}
 * Bấm 1 chi tiết loại -> nạp jobSlice + điều hướng sang trang danh sách.
 *
 * Banner + hàng "Phổ biến nhất" mô phỏng bố cục trang danh mục thật của Fiverr
 * (data cứng theo từng loại — không lấy ảnh/nội dung thật từ fiverr.com để tránh bản quyền).
 */
export const JobByCategoryPage = () => {
  const { maLoai } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tenLoai, setTenLoai] = useState('');
  const [groups, setGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    jobsService
      .getGroupsByType(Number(maLoai))
      .then((data) => {
        if (!alive) return;
        setTenLoai(data.tenLoaiCongViec);
        setGroups(data.groups);
      })
      .catch((err) => alive && setError(getErrorMessage(err)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [maLoai]);

  const openLeaf = (id: number, label: string) => {
    dispatch(fetchJobsByDetailType({ maChiTietLoai: id, label }));
    navigate(ROUTES.jobs);
  };

  if (loading) return <PageLoader label="Đang tải loại công việc..." />;
  if (error) return <div className="container-page py-10"><EmptyState title="Lỗi" description={error} /></div>;

  const banner = getCategoryBanner(tenLoai);
  const Icon = banner.icon;

  return (
    <div>
      {/* Banner — mô phỏng bố cục trang danh mục Fiverr, data cứng theo loại */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${banner.gradient} text-white`}>
        <Icon
          size={280}
          strokeWidth={1}
          className="pointer-events-none absolute -right-10 -top-10 text-white/10 sm:size-[360px]"
        />
        <div className="container-page relative py-14 sm:py-20">
          <h1 className="max-w-lg text-3xl font-extrabold sm:text-4xl">
            {tenLoai || 'Khám phá dịch vụ'}
          </h1>
          <p className="mt-3 max-w-md text-white/85">{banner.tagline}</p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/70 px-4 py-2 text-sm font-semibold hover:bg-white/10">
            <PlayCircle size={18} /> Cách Fiverr hoạt động
          </button>
        </div>
      </section>

      {/* Phổ biến nhất trong <loại> — data cứng */}
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="container-page">
          <h2 className="mb-4 text-lg font-bold text-ink">
            Phổ biến nhất trong {tenLoai || 'danh mục này'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {banner.popular.map((p) => (
              <span
                key={p}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-ink-soft"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Nhóm chi tiết loại + chi tiết loại — dữ liệu thật từ API */}
      <div className="container-page py-10">
        <h2 className="mb-2 text-xl font-bold text-ink">Chọn nhóm dịch vụ</h2>
        <p className="mb-8 text-sm text-ink-soft">Chọn một nhóm để xem danh sách công việc cụ thể.</p>

        {groups.length === 0 ? (
          <EmptyState title="Chưa có nhóm chi tiết loại nào" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.id} className="rounded-lg border border-gray-200 bg-white p-5">
                <p className="mb-3 font-bold text-ink">{group.tenNhom}</p>
                <ul className="space-y-1.5">
                  {group.dsChiTietLoai?.map((leaf) => (
                    <li key={leaf.id}>
                      <button
                        onClick={() => openLeaf(leaf.id, leaf.tenChiTiet)}
                        className="text-sm text-ink-soft hover:text-primary hover:underline"
                      >
                        {leaf.tenChiTiet}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
