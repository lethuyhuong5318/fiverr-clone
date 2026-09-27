import api from './api';
import type {
  ApiEnvelope,
  SignUpRequest,
  SignInRequest,
  SignInContentRaw,
  AuthResult,
} from '@/types/api';
import type { UserProfile } from '@/types/models';
import { normalizeUser } from './users';

const normalizeAuth = (raw: SignInContentRaw): AuthResult => {
  const token = 'token' in raw ? raw.token : '';
  const user = ('user' in raw ? raw.user : raw) as UserProfile;
  if (!token) throw new Error('Response đăng nhập không có token — kiểm tra lại API');
  return { user: normalizeUser(user), token };
};

export const authService = {
  signup: async (data: SignUpRequest): Promise<void> => {
    await api.post<ApiEnvelope<unknown>>('/auth/signup', data);
  },

  signin: async (data: SignInRequest): Promise<AuthResult> => {
    const res = await api.post<ApiEnvelope<SignInContentRaw>>('/auth/signin', data);
    return normalizeAuth(res.data.content);
  },
};
