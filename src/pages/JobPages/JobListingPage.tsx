import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchJobs,
  searchJobsByName,
  setPage,
  setKeyword,
  setSort,
  type JobSort,
} from '@/store/slices/jobSlice';
import { PAGE_SIZE } from '@/utils/constants';
import { JobCard } from '@/components/JobCard/JobCard';
import { JobCardSkeleton } from '@/components/JobCard/JobCardSkeleton';
import { Pagination } from '@/components/Common/Pagination';
import { EmptyState } from '@/components/Common/EmptyState';
import { Button } from '@/components/Common/Button';
import { FilterSidebar, DEFAULT_FILTER, type FilterValue } from '@/components/Filters/FilterSidebar';

const SORT_OPTIONS: { value: JobSort; label: string }[] = [
  { value: 'relevance', label: 'Độ phù hợp' },
  { value: 'best_selling', label: 'Bán chạy nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

export const JobListingPage = () => {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';

  const { items, total, page, loading, error, sort, source, keyword } = useAppSelector(
    (s) => s.jobs,
  );
  const [filter, setFilter] = useState<FilterValue>(DEFAULT_FILTER);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (q && q !== keyword) {
      dispatch(setKeyword(q));
      dispatch(searchJobsByName(q));
    } else if (!q && items.length === 0 && !loading) {
      dispatch(fetchJobs({ page: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const serverPaged = source.type === 'all';

  const handlePage = (p: number) => {
    dispatch(setPage(p));
    if (serverPaged) dispatch(fetchJobs({ page: p, keyword }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    let list = items;
    if (filter.budgetMax > 0) list = list.filter((j) => j.giaTien <= filter.budgetMax);
    if (filter.minRating > 0) list = list.filter((j) => j.saoCongViec >= filter.minRating);
    return list;
  }, [items, filter]);

  const totalPages = serverPaged
    ? Math.ceil(total / PAGE_SIZE)
    : Math.ceil(filtered.length / PAGE_SIZE);

  const pageItems = serverPaged
    ? filtered
    : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">
          {source.type === 'search'
            ? `Kết quả cho “${source.label}”`
            : source.type === 'detailType'
              ? source.label
              : 'Tất cả dịch vụ'}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {serverPaged ? total : filtered.length} dịch vụ
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <FilterSidebar value={filter} onChange={setFilter} />
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilter((v) => !v)}
            >
              <SlidersHorizontal size={15} /> Bộ lọc
            </Button>
            <select
              value={sort}
              onChange={(e) => dispatch(setSort(e.target.value as JobSort))}
              className="ml-auto rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Sắp xếp"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sắp xếp: {o.label}
                </option>
              ))}
            </select>
          </div>

          {showFilter && (
            <div className="mb-5 lg:hidden">
              <FilterSidebar value={filter} onChange={setFilter} />
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <JobCardSkeleton count={8} />
            </div>
          ) : error ? (
            <EmptyState
              title="Không tải được dữ liệu"
              description={error}
              action={
                <Button onClick={() => dispatch(fetchJobs({ page: 1 }))}>Thử lại</Button>
              }
            />
          ) : pageItems.length === 0 ? (
            <EmptyState
              title="Không tìm thấy dịch vụ phù hợp"
              description="Thử thay đổi từ khoá hoặc bộ lọc."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
