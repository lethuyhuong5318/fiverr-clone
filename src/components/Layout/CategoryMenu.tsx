import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenu } from '@/store/slices/categorySlice';
import { fetchJobsByDetailType } from '@/store/slices/jobSlice';
import { ROUTES } from '@/utils/constants';
import type { MenuJobType, MenuLeaf } from '@/types/models';

/** Thanh menu loại công việc + mega-menu hover (wireframe: header) */
export const CategoryMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { menu, loaded } = useAppSelector((s) => s.category);
  const [openId, setOpenId] = useState<number | null>(null);
  const closeTimer = useRef<number>();

  useEffect(() => {
    if (!loaded) dispatch(fetchMenu());
  }, [loaded, dispatch]);

  const open = (id: number) => {
    window.clearTimeout(closeTimer.current);
    setOpenId(id);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setOpenId(null), 120);
  };

  const goType = (t: MenuJobType) => {
    navigate(ROUTES.jobsByType(t.id));
    setOpenId(null);
  };

  const goLeaf = (leaf: MenuLeaf) => {
    dispatch(
      fetchJobsByDetailType({ maChiTietLoai: leaf.id, label: leaf.tenChiTiet }),
    );
    navigate(ROUTES.jobs);
    setOpenId(null);
  };

  if (!menu.length) return null;

  return (
    <nav className="hidden border-t border-gray-100 bg-white lg:block">
      <div className="container-page flex items-center gap-6 overflow-x-auto no-scrollbar">
        {menu.slice(0, 9).map((type) => (
          <div
            key={type.id}
            className="relative"
            onMouseEnter={() => open(type.id)}
            onMouseLeave={scheduleClose}
          >
            <button
              onClick={() => goType(type)}
              className="whitespace-nowrap py-3 text-sm font-medium text-ink-soft hover:text-primary"
            >
              {type.tenLoaiCongViec}
            </button>

            {openId === type.id && type.dsNhomChiTietLoai?.length > 0 && (
              <div
                className="absolute left-0 top-full z-40 grid w-[640px] grid-cols-3 gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-xl"
                onMouseEnter={() => open(type.id)}
                onMouseLeave={scheduleClose}
              >
                {type.dsNhomChiTietLoai.map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-sm font-bold text-ink">{group.tenNhom}</p>
                    <ul className="space-y-1">
                      {group.dsChiTietLoai?.map((leaf) => (
                        <li key={leaf.id}>
                          <button
                            onClick={() => goLeaf(leaf)}
                            className="text-left text-sm text-ink-soft hover:text-primary hover:underline"
                          >
                            {leaf.tenChiTiet}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
