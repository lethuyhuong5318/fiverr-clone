import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { MainLayout } from '@/components/Layout/MainLayout';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { AdminRoute } from '@/components/Auth/AdminRoute';
import { PageLoader } from '@/components/Common/Spinner';
import { ROUTES } from '@/utils/constants';

import { HomePage } from '@/pages/HomePage';
import { SignInPage } from '@/pages/AuthPages/SignIn';
import { SignUpPage } from '@/pages/AuthPages/SignUp';
import { JobListingPage } from '@/pages/JobPages/JobListingPage';
import { JobByCategoryPage } from '@/pages/JobPages/JobByCategoryPage';
import { JobDetailPage } from '@/pages/JobPages/JobDetailPage';
import { ProfilePage } from '@/pages/UserPages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const AdminLayout = lazy(() =>
  import('@/components/Layout/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const ManageUsersPage = lazy(() =>
  import('@/pages/admin/ManageUsersPage').then((m) => ({ default: m.ManageUsersPage })),
);
const ManageJobsPage = lazy(() =>
  import('@/pages/admin/ManageJobsPage').then((m) => ({ default: m.ManageJobsPage })),
);
const ManageJobTypesPage = lazy(() =>
  import('@/pages/admin/ManageJobTypesPage').then((m) => ({ default: m.ManageJobTypesPage })),
);
const ManageJobDetailsPage = lazy(() =>
  import('@/pages/admin/ManageJobDetailsPage').then((m) => ({ default: m.ManageJobDetailsPage })),
);
const ManageHiresPage = lazy(() =>
  import('@/pages/admin/ManageHiresPage').then((m) => ({ default: m.ManageHiresPage })),
);
const ManageCommentsPage = lazy(() =>
  import('@/pages/admin/ManageCommentsPage').then((m) => ({ default: m.ManageCommentsPage })),
);

export const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Toaster position="top-right" richColors closeButton />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.signIn} element={<SignInPage />} />
        <Route path={ROUTES.signUp} element={<SignUpPage />} />

        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.jobs} element={<JobListingPage />} />
          <Route path="/cong-viec/loai/:maLoai" element={<JobByCategoryPage />} />
          <Route path="/cong-viec/chi-tiet/:maCongViec" element={<JobDetailPage />} />
          <Route
            path={ROUTES.profile}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path={ROUTES.admin}
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to={ROUTES.adminUsers} replace />} />
          <Route path="quan-ly-nguoi-dung" element={<ManageUsersPage />} />
          <Route path="quan-ly-cong-viec" element={<ManageJobsPage />} />
          <Route path="quan-ly-loai-cong-viec" element={<ManageJobTypesPage />} />
          <Route path="quan-ly-chi-tiet-loai" element={<ManageJobDetailsPage />} />
          <Route path="quan-ly-thue-cong-viec" element={<ManageHiresPage />} />
          <Route path="quan-ly-binh-luan" element={<ManageCommentsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
