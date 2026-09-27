import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { SignUpForm } from '@/components/Forms/SignUpForm';

export const SignUpPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <Link to={ROUTES.home} className="mb-6 block text-center text-2xl font-extrabold text-ink">
        {APP_NAME.toLowerCase()}
        <span className="text-primary">.</span>
      </Link>
      <h1 className="mb-1 text-center text-2xl font-bold text-ink">Đăng ký tài khoản</h1>
      <p className="mb-6 text-center text-sm text-ink-faint">
        Tạo tài khoản để thuê hoặc cung cấp dịch vụ
      </p>
      <SignUpForm />
      <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-ink-faint">
        Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.
      </p>
    </div>
  </div>
);
