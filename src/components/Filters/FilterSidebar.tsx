import { useState } from 'react';
import { Button } from '@/components/Common/Button';

/**
 * Bộ lọc — wireframe ghi "data cứng như design". Lọc client-side trên danh sách hiện có.
 */
export interface FilterValue {
  budgetMax: number;
  minRating: number;
}

export const DEFAULT_FILTER: FilterValue = { budgetMax: 0, minRating: 0 };

interface Props {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}

const RATINGS = [
  { v: 0, label: 'Tất cả' },
  { v: 4, label: 'Từ 4 sao' },
  { v: 4.5, label: 'Từ 4.5 sao' },
];

export const FilterSidebar = ({ value, onChange }: Props) => {
  const [budget, setBudget] = useState(value.budgetMax || 1000);

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-base font-bold text-ink">Bộ lọc</h3>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-ink">Ngân sách tối đa</h4>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          onMouseUp={() => onChange({ ...value, budgetMax: budget })}
          onTouchEnd={() => onChange({ ...value, budgetMax: budget })}
          className="w-full accent-primary"
        />
        <p className="text-sm text-ink-soft">Đến ${budget}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-ink">Đánh giá</h4>
        <div className="space-y-1.5">
          {RATINGS.map((r) => (
            <label key={r.v} className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="radio"
                name="rating"
                checked={value.minRating === r.v}
                onChange={() => onChange({ ...value, minRating: r.v })}
                className="accent-primary"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="secondary"
        fullWidth
        onClick={() => {
          setBudget(1000);
          onChange(DEFAULT_FILTER);
        }}
      >
        Xoá bộ lọc
      </Button>
    </div>
  );
};
