import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signUp, clearAuthError } from '@/store/slices/authSlice';
import { signUpSchema, type SignUpFormData } from '@/utils/validators';
import { ROUTES } from '@/utils/constants';
import type { SignUpRequest } from '@/types/api';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Button } from '@/components/Common/Button';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.loading);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    defaultValues: { gender: 'nam' },
  });

  const onSubmit = async (form: SignUpFormData) => {
    dispatch(clearAuthError());
    const payload: SignUpRequest = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone,
      birthday: form.birthday,
      gender: form.gender === 'nam',
      role: 'user',
      skill: [],
      certification: [],
    };

    const result = await dispatch(signUp(payload));
    if (signUp.fulfilled.match(result)) {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate(ROUTES.signIn, { replace: true });
    } else {
      toast.error((result.payload as string) ?? 'Đăng ký thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Họ và tên"
        placeholder="Nguyễn Văn A"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Số điện thoại"
          type="tel"
          inputMode="numeric"
          placeholder="0901234567"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Ngày sinh"
          type="date"
          error={errors.birthday?.message}
          {...register('birthday')}
        />
      </div>

      <Select
        label="Giới tính"
        error={errors.gender?.message}
        options={[
          { value: 'nam', label: 'Nam' },
          { value: 'nu', label: 'Nữ' },
        ]}
        {...register('gender')}
      />

      <div className="relative">
        <Input
          label="Mật khẩu"
          type={showPw ? 'text' : 'password'}
          placeholder="Tối thiểu 6 ký tự"
          helperText="Ít nhất 6 ký tự, gồm chữ và số"
          autoComplete="new-password"
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

      <div className="relative">
        <Input
          label="Nhập lại mật khẩu"
          type={showPw2 ? 'text' : 'password'}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowPw2((v) => !v)}
          className="absolute right-3 top-9 text-ink-faint hover:text-ink-soft"
          aria-label={showPw2 ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button type="submit" fullWidth loading={loading} className="mt-2 h-11">
        Đăng ký
      </Button>

      <p className="text-center text-sm text-ink-soft">
        Đã có tài khoản?{' '}
        <Link to={ROUTES.signIn} className="font-medium text-primary hover:underline">
          Đăng nhập →
        </Link>
      </p>
    </form>
  );
};
