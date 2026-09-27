import { APP_NAME } from '@/utils/constants';

const COLUMNS = [
  { title: 'Danh mục', links: ['Graphics & Design', 'Digital Marketing', 'Writing & Translation', 'Video & Animation', 'Programming & Tech'] },
  { title: 'Về chúng tôi', links: ['Giới thiệu', 'Tuyển dụng', 'Điều khoản dịch vụ', 'Chính sách bảo mật', 'Đối tác'] },
  { title: 'Hỗ trợ', links: ['Trung tâm trợ giúp', 'Tin cậy & An toàn', 'Bán hàng trên Fiverr', 'Mua hàng trên Fiverr'] },
  { title: 'Cộng đồng', links: ['Sự kiện', 'Blog', 'Diễn đàn', 'Podcast', 'Ảnh hưởng'] },
];

export const Footer = () => (
  <footer className="mt-16 border-t border-gray-200 bg-gray-50">
    <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
      {COLUMNS.map((col) => (
        <div key={col.title}>
          <h4 className="mb-3 text-sm font-bold text-ink">{col.title}</h4>
          <ul className="space-y-2">
            {col.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-ink-soft hover:text-primary">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200">
      <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-sm text-ink-faint sm:flex-row">
        <p>
          {APP_NAME.toLowerCase()}
          <span className="text-primary">.</span> © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
);
