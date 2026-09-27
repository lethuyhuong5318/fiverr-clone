type Tone = 'green' | 'gray' | 'amber' | 'red' | 'blue';

const tones: Record<Tone, string> = {
  green: 'bg-primary-50 text-primary-700',
  gray: 'bg-gray-100 text-ink-soft',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-sky-50 text-sky-700',
};

export const Badge = ({
  children,
  tone = 'gray',
  className = '',
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);
