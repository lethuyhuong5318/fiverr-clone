import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { jobsService } from '@/services/jobs';
import { getErrorMessage } from '@/utils/errors';
import { PAGE_SIZE } from '@/utils/constants';
import type { Job } from '@/types/models';

export type JobSort = 'relevance' | 'best_selling' | 'newest' | 'rating';

interface JobState {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
  keyword: string;
  sort: JobSort;
  loading: boolean;
  error: string | null;
  /** Nguồn dữ liệu hiện tại để hiển thị tiêu đề */
  source: { type: 'all' | 'search' | 'detailType'; label: string };
}

const initialState: JobState = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  keyword: '',
  sort: 'relevance',
  loading: false,
  error: null,
  source: { type: 'all', label: 'tất cả' },
};

/** Danh sách phân trang (mặc định) */
export const fetchJobs = createAsyncThunk<
  { items: Job[]; total: number },
  { page: number; keyword?: string },
  { rejectValue: string }
>('jobs/fetch', async ({ page, keyword }, { rejectWithValue }) => {
  try {
    const res = await jobsService.getPaged({
      pageIndex: page,
      pageSize: PAGE_SIZE,
      keyword: keyword || undefined,
    });
    return { items: res.data, total: res.totalRow };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

/** Tìm theo tên (từ ô search header/hero) */
export const searchJobsByName = createAsyncThunk<Job[], string, { rejectValue: string }>(
  'jobs/searchByName',
  async (name, { rejectWithValue }) => {
    try {
      return await jobsService.searchByName(name);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

/** Lọc theo chi tiết loại (từ mega-menu) */
export const fetchJobsByDetailType = createAsyncThunk<
  { items: Job[]; label: string },
  { maChiTietLoai: number; label: string },
  { rejectValue: string }
>('jobs/byDetailType', async ({ maChiTietLoai, label }, { rejectWithValue }) => {
  try {
    const items = await jobsService.getByDetailType(maChiTietLoai);
    return { items, label };
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const applySort = (items: Job[], sort: JobSort): Job[] => {
  const copy = [...items];
  switch (sort) {
    case 'rating':
      return copy.sort((a, b) => b.saoCongViec - a.saoCongViec);
    case 'best_selling':
      return copy.sort((a, b) => b.danhGia - a.danhGia);
    case 'newest':
      return copy.sort((a, b) => b.id - a.id);
    default:
      return copy;
  }
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
      state.page = 1;
    },
    setSort: (state, action: PayloadAction<JobSort>) => {
      state.sort = action.payload;
      state.items = applySort(state.items, action.payload);
    },
    resetJobs: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = applySort(action.payload.items, state.sort);
        state.total = action.payload.total;
        state.source = {
          type: state.keyword ? 'search' : 'all',
          label: state.keyword || 'tất cả',
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Không tải được danh sách công việc';
      })
      .addCase(searchJobsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobsByName.fulfilled, (state, action) => {
        state.loading = false;
        state.items = applySort(action.payload, state.sort);
        state.total = action.payload.length;
        state.page = 1;
        state.source = { type: 'search', label: state.keyword || 'kết quả' };
      })
      .addCase(searchJobsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Không tìm được công việc';
      })
      .addCase(fetchJobsByDetailType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsByDetailType.fulfilled, (state, action) => {
        state.loading = false;
        state.items = applySort(action.payload.items, state.sort);
        state.total = action.payload.items.length;
        state.page = 1;
        state.source = { type: 'detailType', label: action.payload.label };
      })
      .addCase(fetchJobsByDetailType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Không tải được công việc theo loại';
      });
  },
});

export const { setPage, setKeyword, setSort, resetJobs } = jobSlice.actions;
export default jobSlice.reducer;
