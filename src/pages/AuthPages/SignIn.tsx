import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { SignInForm } from '@/components/Forms/SignInForm';

export const SignInPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <Link to={ROUTES.home} className="mb-6 block text-center text-2xl font-extrabold text-ink">
        {APP_NAME.toLowerCase()}
        <span className="text-primary">.</span>
      </Link>
      <h1 className="mb-1 text-center text-2xl font-bold text-ink">Đăng nhập</h1>
      <p className="mb-6 text-center text-sm text-ink-faint">
        Chào mừng quay lại! Đăng nhập để tiếp tục.
      </p>
      <SignInForm />
    </div>
  </div>
);
