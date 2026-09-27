import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  mobileMenuOpen: boolean;
  mobileFilterOpen: boolean;
}

const initialState: UIState = {
  mobileMenuOpen: false,
  mobileFilterOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileMenu: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    setMobileFilter: (state, action: PayloadAction<boolean>) => {
      state.mobileFilterOpen = action.payload;
    },
  },
});

export const { setMobileMenu, setMobileFilter } = uiSlice.actions;
export default uiSlice.reducer;
