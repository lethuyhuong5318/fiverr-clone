import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm transition-all
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
