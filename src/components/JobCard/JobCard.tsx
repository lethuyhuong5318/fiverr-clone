import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Job } from '@/types/models';
import { ROUTES } from '@/utils/constants';
import { formatPrice } from '@/utils/formatters';
import { placeholderImg, placeholderAvatar } from '@/utils/mockData';
import { Rating } from '@/components/Common/Rating';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoriteSlice';

interface JobCardProps {
  job: Job;
  /** Vị trí trong danh sách — dùng để so le hiệu ứng xuất hiện (stagger), bỏ qua nếu không cần */
  index?: number;
}

export const JobCard = ({ job, index = 0 }: JobCardProps) => {
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.favorite.ids.includes(job.id));

  return (
    <Link
      to={ROUTES.jobDetail(job.id)}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white [animation-fill-mode:backwards] animate-page-in transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={job.hinhAnh || placeholderImg(job.id)}
          alt={job.tenCongViec}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholderImg(job.id);
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleFavorite(job.id));
          }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-110 hover:bg-white active:scale-90"
          aria-label={isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
        >
          <Heart
            size={18}
            className={
              isFav
                ? 'animate-pop-in fill-red-500 text-red-500'
                : 'text-ink-soft transition-colors'
            }
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <img
            src={placeholderAvatar(job.nguoiTao)}
            alt=""
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm font-semibold text-ink">Freelancer #{job.nguoiTao}</span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm text-ink group-hover:text-primary">
          {job.tenCongViec}
        </h3>

        <Rating value={job.saoCongViec} count={job.danhGia} />

        <div className="mt-auto border-t border-gray-100 pt-2 text-xs font-semibold uppercase text-ink-faint">
          Bắt đầu từ{' '}
          <span className="text-base font-bold normal-case text-ink">
            {formatPrice(job.giaTien)}
          </span>
        </div>
      </div>
    </Link>
  );
};
