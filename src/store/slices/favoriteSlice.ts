import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Yêu thích công việc — API CyberSoft KHÔNG có endpoint này.
 * Lưu local, persist bằng redux-persist. Đây là tính năng mở rộng.
 */
interface FavoriteState {
  ids: number[];
}

const initialState: FavoriteState = { ids: [] };

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
