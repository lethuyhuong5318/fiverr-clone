import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FolderTree,
  ListTree,
  ClipboardList,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { ROUTES, APP_NAME } from '@/utils/constants';
import { Avatar } from '@/components/Common/Avatar';

const NAV = [
  { to: ROUTES.adminUsers, label: 'Quản lý người dùng', icon: Users },
  { to: ROUTES.adminJobs, label: 'Quản lý công việc', icon: Briefcase },
  { to: ROUTES.adminJobTypes, label: 'Quản lý loại công việc', icon: FolderTree },
  { to: ROUTES.adminJobDetails, label: 'Quản lý chi tiết loại', icon: ListTree },
  { to: ROUTES.adminHires, label: 'Quản lý thuê công việc', icon: ClipboardList },
  { to: ROUTES.adminComments, label: 'Quản lý bình luận', icon: MessageSquare },
];

const titleFor = (path: string) => NAV.find((n) => path.startsWith(n.to))?.label ?? 'Dashboard';

export const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate(ROUTES.signIn);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
          <Link to={ROUTES.home} className="text-xl font-extrabold text-ink">
            {APP_NAME.toLowerCase()}
            <span className="text-primary">.</span>
          </Link>
          <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
            ADMIN
          </span>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-ink-soft hover:bg-gray-100'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div>
            <p className="text-xs text-ink-faint">Dashboard</p>
            <h1 className="text-lg font-bold text-ink">{titleFor(location.pathname)}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-ink-faint">{user?.email}</p>
            </div>
            <Avatar src={user?.avatar} name={user?.name} size={34} />
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
