import { initials } from '@/utils/formatters';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}

export const Avatar = ({ src, name, size = 32, className = '' }: AvatarProps) => {
  const style = { width: size, height: size, fontSize: size * 0.4 };
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      style={style}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 ${className}`}
    >
      {initials(name)}
    </span>
  );
};
