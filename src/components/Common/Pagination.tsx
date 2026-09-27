import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages: (number | 'dots')[] = [];
  const push = (p: number | 'dots') => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) push(i);
  } else {
    push(1);
    if (currentPage > 3) push('dots');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      push(i);
    if (currentPage < totalPages - 2) push('dots');
    push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Phân trang">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md border p-2 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`d${i}`} className="px-2 text-ink-faint">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage}
            className={`h-9 min-w-9 rounded-md px-2 text-sm font-semibold ${
              p === currentPage
                ? 'bg-primary text-white'
                : 'border hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md border p-2 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
