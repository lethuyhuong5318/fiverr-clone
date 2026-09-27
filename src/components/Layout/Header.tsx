import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { setKeyword, searchJobsByName } from '@/store/slices/jobSlice';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { isAdmin } from '@/utils/auth';
import { Avatar } from '@/components/Common/Avatar';
import { CategoryMenu } from './CategoryMenu';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((s) => s.auth);
  const [term, setTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    dispatch(setKeyword(q));
    dispatch(searchJobsByName(q));
    navigate(`${ROUTES.jobs}?q=${encodeURIComponent(q)}`);
  };

  const onLogout = () => {
    dispatch(logout());
    setUserMenu(false);
    navigate(ROUTES.home);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="container-page flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to={ROUTES.home} className="shrink-0 text-2xl font-extrabold text-ink">
          {APP_NAME.toLowerCase()}
          <span className="text-primary">.</span>
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="hidden flex-1 md:flex">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Bạn đang tìm dịch vụ gì?"
            className="w-full rounded-l-md border border-r-0 border-gray-300 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Tìm kiếm dịch vụ"
          />
          <button
            type="submit"
            className="rounded-r-md bg-ink px-4 text-white hover:bg-black"
            aria-label="Tìm"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to={ROUTES.signIn}
                className="hidden text-sm font-semibold text-ink-soft hover:text-primary sm:block"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.signUp}
                className="rounded-md border border-primary px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Join
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenu((v) => !v)}
                className="flex items-center gap-2"
                aria-label="Menu người dùng"
              >
                <Avatar src={user?.avatar} name={user?.name} size={34} />
              </button>
              {userMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-100 bg-white py-1 shadow-xl"
                  onMouseLeave={() => setUserMenu(false)}
                >
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                    <p className="truncate text-xs text-ink-faint">{user?.email}</p>
                  </div>
                  <MenuItem to={ROUTES.profile} icon={<User size={16} />} onClick={() => setUserMenu(false)}>
                    Cập nhật thông tin
                  </MenuItem>
                  <MenuItem to={ROUTES.profile} icon={<Briefcase size={16} />} onClick={() => setUserMenu(false)}>
                    Công việc đã thuê
                  </MenuItem>
                  {isAdmin(user) && (
                    <MenuItem
                      to={ROUTES.adminUsers}
                      icon={<LayoutDashboard size={16} />}
                      onClick={() => setUserMenu(false)}
                    >
                      Trang quản trị
                    </MenuItem>
                  )}
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search + links */}
      {menuOpen && (
        <div className="border-t border-gray-100 p-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 flex">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Tìm dịch vụ..."
              className="w-full rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="rounded-r-md bg-ink px-3 text-white">
              <Search size={16} />
            </button>
          </form>
          {!token && (
            <div className="flex gap-2">
              <Link
                to={ROUTES.signIn}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-md border py-2 text-center text-sm font-semibold"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.signUp}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-semibold text-white"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}

      <CategoryMenu />
    </header>
  );
};

const MenuItem = ({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 text-sm text-ink-soft hover:bg-gray-50"
  >
    {icon} {children}
  </Link>
);
