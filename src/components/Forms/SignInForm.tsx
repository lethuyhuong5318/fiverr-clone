import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signIn, clearAuthError } from '@/store/slices/authSlice';
import { signInSchema, type SignInFormData } from '@/utils/validators';
import { isAdmin } from '@/utils/auth';
import { ROUTES } from '@/utils/constants';
import { Input } from '@/components/Common/Input';
import { Button } from '@/components/Common/Button';

export const SignInForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useAppSelector((s) => s.auth.loading);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (form: SignInFormData) => {
    dispatch(clearAuthError());
    const result = await dispatch(signIn(form));

    if (signIn.fulfilled.match(result)) {
      toast.success('Đăng nhập thành công');
      const from = (location.state as { from?: string })?.from;
      if (isAdmin(result.payload.user)) navigate(ROUTES.adminUsers, { replace: true });
      else navigate(from || ROUTES.home, { replace: true });
    } else {
      toast.error((result.payload as string) ?? 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="relative">
        <Input
          label="Mật khẩu"
          type={showPw ? 'text' : 'password'}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-3 top-9 text-ink-faint hover:text-ink-soft"
          aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button type="submit" fullWidth loading={loading} className="mt-2 h-11">
        Đăng nhập
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Chưa có tài khoản?{' '}
        <Link to={ROUTES.signUp} className="font-medium text-primary hover:underline">
          Đăng ký →
        </Link>
      </p>
    </form>
  );
};
