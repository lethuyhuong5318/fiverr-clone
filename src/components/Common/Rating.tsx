import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
  showValue?: boolean;
}

/** Hiển thị sao (read-only) */
export const Rating = ({ value, count, size = 14, showValue = true }: RatingProps) => (
  <span className="inline-flex items-center gap-1 text-sm">
    <Star size={size} className="fill-amber-400 text-amber-400" />
    {showValue && <span className="font-semibold text-ink">{(value || 0).toFixed(1)}</span>}
    {typeof count === 'number' && <span className="text-ink-faint">({count})</span>}
  </span>
);

interface RatingInputProps {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}

/** Chọn sao (dùng trong form bình luận) */
export const RatingInput = ({ value, onChange, size = 24 }: RatingInputProps) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} sao`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            size={size}
            className={
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }
          />
        </button>
      ))}
    </div>
  );
};
