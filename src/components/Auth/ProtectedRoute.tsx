import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/utils/constants';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((s) => s.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to={ROUTES.signIn} state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
};
