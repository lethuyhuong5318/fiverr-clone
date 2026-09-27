import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { Button } from '@/components/Common/Button';

export const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="text-7xl font-extrabold text-primary">404</p>
    <h1 className="text-2xl font-bold text-ink">Không tìm thấy trang</h1>
    <p className="max-w-sm text-ink-soft">
      Trang bạn tìm không tồn tại hoặc đã được di chuyển.
    </p>
    <Link to={ROUTES.home}>
      <Button>Về trang chủ</Button>
    </Link>
  </div>
);
