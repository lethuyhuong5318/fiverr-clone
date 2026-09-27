import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-all placeholder:text-ink-faint
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error ? (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle size={14} /> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-faint">{helperText}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
