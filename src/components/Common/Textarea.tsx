import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const areaId = id || props.name;
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={areaId} className="block text-sm font-semibold text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={4}
          className={`w-full rounded-md border px-3.5 py-2.5 text-sm transition-all placeholder:text-ink-faint
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} ${className}`}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
