import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({
  title = 'Không có dữ liệu',
  description,
  icon,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 py-16 text-center">
    <div className="text-ink-faint">{icon || <SearchX size={40} />}</div>
    <p className="text-base font-semibold text-ink">{title}</p>
    {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
    {action}
  </div>
);
