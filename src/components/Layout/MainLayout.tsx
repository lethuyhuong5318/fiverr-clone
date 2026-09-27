import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* key theo pathname để mỗi lần chuyển trang chạy lại animation fade-in */}
      <main key={pathname} className="flex-1 animate-page-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
