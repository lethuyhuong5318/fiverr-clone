import type { UserProfile } from '@/types/models';

export const isAdmin = (user: UserProfile | null | undefined): boolean =>
  (user?.role ?? '').toLowerCase() === 'admin';
