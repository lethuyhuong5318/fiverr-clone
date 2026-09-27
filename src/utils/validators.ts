import { z } from 'zod';

const phone = z.string().regex(/^0\d{9}$/, 'SĐT gồm 10 số, bắt đầu bằng 0');
const password = z
  .string()
  .min(6, 'Mật khẩu tối thiểu 6 ký tự')
  .regex(/[A-Za-z]/, 'Mật khẩu phải có ít nhất 1 chữ cái')
  .regex(/\d/, 'Mật khẩu phải có ít nhất 1 số');

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(50, 'Tối đa 50 ký tự'),
    email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    phone,
    birthday: z
      .string()
      .min(1, 'Vui lòng chọn ngày sinh')
      .refine((d) => new Date(d) < new Date(), 'Ngày sinh không hợp lệ'),
    gender: z.enum(['nam', 'nu']),
    password,
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword'],
  });
export type SignUpFormData = z.infer<typeof signUpSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự').max(50, 'Tối đa 50 ký tự'),
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  phone,
  birthday: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gender: z.enum(['nam', 'nu']),
  skill: z.string().optional(),
  certification: z.string().optional(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const commentSchema = z.object({
  noiDung: z.string().trim().min(3, 'Bình luận tối thiểu 3 ký tự').max(500, 'Tối đa 500 ký tự'),
  saoBinhLuan: z.number().min(1, 'Vui lòng chọn số sao').max(5),
});
export type CommentFormData = z.infer<typeof commentSchema>;
