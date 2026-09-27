import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import categoryReducer from './slices/categorySlice';
import favoriteReducer from './slices/favoriteSlice';
import uiReducer from './slices/uiSlice';
import { PERSIST_KEY } from '@/utils/constants';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  category: categoryReducer,
  favorite: favoriteReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(
  {
    key: PERSIST_KEY,
    storage,
    whitelist: ['auth', 'favorite'],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
