import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Camera, Pencil, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, updateProfile } from '@/store/slices/authSlice';
import { usersService, normalizeUser } from '@/services/users';
import { hiresService } from '@/services/hires';
import { getErrorMessage } from '@/utils/errors';
import { formatDate, formatPrice } from '@/utils/formatters';
import { profileSchema, type ProfileFormData } from '@/utils/validators';
import type { UpdateUserRequest } from '@/types/api';
import type { HiredJob } from '@/types/models';
import { Avatar } from '@/components/Common/Avatar';
import { Badge } from '@/components/Common/Badge';
import { Button } from '@/components/Common/Button';
import { Input } from '@/components/Common/Input';
import { Select } from '@/components/Common/Select';
import { Modal } from '@/components/Common/Modal';
import { PageLoader } from '@/components/Common/Spinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { placeholderImg } from '@/utils/mockData';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(!user);
  const [editing, setEditing] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [hired, setHired] = useState<HiredJob[]>([]);
  const [hiredLoading, setHiredLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    usersService
      .getById(user.id)
      .then((fresh) => dispatch(setUser(fresh)))
      .catch(() => void 0)
      .finally(() => setLoading(false));
  }, [user?.id, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    hiresService
      .getMyHired(user.id)
      .then(setHired)
      .catch(() => setHired([]))
      .finally(() => setHiredLoading(false));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSavingAvatar(true);
      const updated = await usersService.uploadAvatar(file);
      dispatch(setUser(updated));
      toast.success('Cập nhật ảnh đại diện thành công');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingAvatar(false);
    }
  };

  const onComplete = async (hireId: number, isLocal?: boolean) => {
    try {
      await hiresService.completeWithFallback(hireId, isLocal);
      setHired((prev) =>
        prev.map((h) => (h.id === hireId ? { ...h, hoanThanh: true } : h)),
      );
      toast.success('Đã đánh dấu hoàn thành');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading || !user) return <PageLoader label="Đang tải hồ sơ..." />;

  const { skill: skills, certification: certs } = normalizeUser(user);

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Profile card */}
        <div className="h-fit rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar src={user.avatar} name={user.name} size={96} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={savingAvatar}
                className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-white shadow hover:bg-primary-600 disabled:opacity-60"
                aria-label="Đổi ảnh đại diện"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onAvatar}
              />
            </div>
            <h2 className="mt-3 text-lg font-bold text-ink">{user.name}</h2>
            <p className="text-sm text-ink-faint">{user.email}</p>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Số điện thoại" value={user.phone || '—'} />
            <Row label="Ngày sinh" value={formatDate(user.birthday)} />
            <Row label="Giới tính" value={user.gender ? 'Nam' : 'Nữ'} />
          </dl>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-ink">Kỹ năng</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.length ? (
                skills.map((s) => <Badge key={s} tone="green">{s}</Badge>)
              ) : (
                <span className="text-sm text-ink-faint">Chưa cập nhật</span>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold text-ink">Chứng chỉ</p>
            <div className="flex flex-wrap gap-1.5">
              {certs.length ? (
                certs.map((c) => <Badge key={c} tone="blue">{c}</Badge>)
              ) : (
                <span className="text-sm text-ink-faint">Chưa cập nhật</span>
              )}
            </div>
          </div>

          <Button variant="secondary" fullWidth className="mt-6" onClick={() => setEditing(true)}>
            <Pencil size={15} /> Chỉnh sửa hồ sơ
          </Button>
        </div>

        {/* Hired jobs */}
        <div>
          <h1 className="mb-4 text-xl font-bold text-ink">Công việc đã thuê</h1>
          {hiredLoading ? (
            <PageLoader label="Đang tải..." />
          ) : hired.length === 0 ? (
            <EmptyState title="Bạn chưa thuê công việc nào" />
          ) : (
            <div className="space-y-3">
              {hired.map((h) => (
                <div
                  key={h.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  <img
                    src={h.hinhAnh || placeholderImg(h.maCongViec)}
                    alt=""
                    className="h-16 w-24 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-ink">{h.tenCongViec}</p>
                      {h.isLocal && (
                        <span
                          title="Lưu tạm ở trình duyệt này — server luyện tập đang chặn quyền ghi cho tài khoản thường"
                          className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
                        >
                          Chờ đồng bộ
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-faint">
                      Ngày thuê: {formatDate(h.ngayThue)} · {formatPrice(h.giaTien)}
                    </p>
                  </div>
                  {h.hoanThanh ? (
                    <Badge tone="green">
                      <Check size={12} className="mr-1" /> Hoàn thành
                    </Badge>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => onComplete(h.id, h.isLocal)}>
                      Đánh dấu hoàn thành
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfileModal open={editing} onClose={() => setEditing(false)} />
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-2">
    <dt className="text-ink-faint">{label}</dt>
    <dd className="font-medium text-ink">{value}</dd>
  </div>
);

const EditProfileModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;

  const defaults = useMemo<ProfileFormData>(
    () => ({
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      birthday: (user.birthday ?? '').slice(0, 10),
      gender: user.gender ? 'nam' : 'nu',
      skill: normalizeUser(user).skill.join(', '),
      certification: normalizeUser(user).certification.join(', '),
    }),
    [user],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema), values: defaults });

  const onSubmit = async (form: ProfileFormData) => {
    const body: UpdateUserRequest = {
      id: user.id,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      birthday: form.birthday,
      gender: form.gender === 'nam',
      role: user.role,
      skill: (form.skill ?? '').split(',').map((s) => s.trim()).filter(Boolean),
      certification: (form.certification ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    };
    const result = await dispatch(updateProfile({ id: user.id, body }));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Cập nhật hồ sơ thành công');
      onClose();
    } else {
      toast.error((result.payload as string) ?? 'Cập nhật thất bại');
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        reset(defaults);
        onClose();
      }}
      title="Chỉnh sửa hồ sơ"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Họ và tên" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Số điện thoại" error={errors.phone?.message} {...register('phone')} />
          <Input label="Ngày sinh" type="date" error={errors.birthday?.message} {...register('birthday')} />
        </div>
        <Select
          label="Giới tính"
          options={[
            { value: 'nam', label: 'Nam' },
            { value: 'nu', label: 'Nữ' },
          ]}
          {...register('gender')}
        />
        <Input label="Kỹ năng (phân tách bằng dấu phẩy)" placeholder="React, Figma, SEO" {...register('skill')} />
        <Input
          label="Chứng chỉ (phân tách bằng dấu phẩy)"
          placeholder="AWS, Google Ads"
          {...register('certification')}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
