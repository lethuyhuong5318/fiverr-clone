import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/auth';
import { usersService } from '@/services/users';
import { getErrorMessage } from '@/utils/errors';
import { STORAGE } from '@/utils/constants';
import type {
  SignUpRequest,
  SignInRequest,
  AuthResult,
  UpdateUserRequest,
} from '@/types/api';
import type { UserProfile } from '@/types/models';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(STORAGE.token),
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk<void, SignUpRequest, { rejectValue: string }>(
  'auth/signUp',
  async (payload, { rejectWithValue }) => {
    try {
      await authService.signup(payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const signIn = createAsyncThunk<AuthResult, SignInRequest, { rejectValue: string }>(
  'auth/signIn',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await authService.signin(payload);
      localStorage.setItem(STORAGE.token, result.token);
      return result;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

/** Cập nhật hồ sơ, đồng bộ lại state.user */
export const updateProfile = createAsyncThunk<
  UserProfile,
  { id: number; body: UpdateUserRequest },
  { rejectValue: string }
>('auth/updateProfile', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await usersService.update(id, body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem(STORAGE.token);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action: { payload: UserProfile }) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Đăng ký thất bại';
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Đăng nhập thất bại';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
