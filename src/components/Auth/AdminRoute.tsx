import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { isAdmin } from '@/utils/auth';
import { ROUTES } from '@/utils/constants';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAppSelector((s) => s.auth);

  if (!token) return <Navigate to={ROUTES.signIn} replace />;
  if (!isAdmin(user)) return <Navigate to={ROUTES.home} replace />;
  return <>{children}</>;
};
