import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

export const PageLoader = ({ label = 'Đang tải...' }: { label?: string }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-soft">
    <Spinner size={32} className="text-primary" />
    <p className="text-sm">{label}</p>
  </div>
);
