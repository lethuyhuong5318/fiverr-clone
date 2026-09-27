import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsService } from '@/services/jobs';
import { getErrorMessage } from '@/utils/errors';
import type { MenuJobType } from '@/types/models';

interface CategoryState {
  menu: MenuJobType[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: CategoryState = {
  menu: [],
  loading: false,
  error: null,
  loaded: false,
};

export const fetchMenu = createAsyncThunk<MenuJobType[], void, { rejectValue: string }>(
  'category/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      return await jobsService.getMenu();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.menu = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Không tải được menu loại công việc';
      });
  },
});

export default categorySlice.reducer;
