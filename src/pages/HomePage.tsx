import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setKeyword, searchJobsByName } from '@/store/slices/jobSlice';
import { ROUTES } from '@/utils/constants';
import {
  HERO_KEYWORDS,
  POPULAR_CATEGORIES,
  CATEGORY_GRID,
  TRUST_LOGOS,
  SELLER_BENEFITS,
  placeholderImg,
} from '@/utils/mockData';
import { Button } from '@/components/Common/Button';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const search = (q: string) => {
    const value = q.trim();
    if (!value) return;
    dispatch(setKeyword(value));
    dispatch(searchJobsByName(value));
    navigate(`${ROUTES.jobs}?q=${encodeURIComponent(value)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    search(term);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-500 text-white">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Tìm đúng freelancer, <br /> hoàn thành mọi công việc.
            </h1>
            <p className="mt-4 max-w-md text-white/85">
              Sàn dịch vụ freelance — kết nối bạn với hàng nghìn chuyên gia trên toàn thế giới.
            </p>

            <form onSubmit={onSubmit} className="mt-6 flex max-w-lg overflow-hidden rounded-md bg-white">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Thử 'thiết kế logo'"
                className="flex-1 px-4 py-3 text-ink placeholder:text-ink-faint focus:outline-none"
                aria-label="Tìm dịch vụ"
              />
              <button type="submit" className="bg-primary px-6 hover:bg-primary-600" aria-label="Tìm">
                <Search size={20} />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
              <span>Phổ biến:</span>
              {HERO_KEYWORDS.map((k) => (
                <button
                  key={k.label}
                  onClick={() => search(k.query)}
                  className="rounded-full border border-white/40 px-3 py-1 hover:bg-white/10"
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src={placeholderImg('hero', 640, 480)}
              alt="Freelancers"
              className="w-full rounded-xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-bold uppercase tracking-wide text-ink-faint">
          <span className="text-sm normal-case">Được tin dùng bởi:</span>
          {TRUST_LOGOS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </section>

      {/* Popular categories */}
      <section className="container-page py-14">
        <h2 className="mb-6 text-2xl font-bold text-ink">Dịch vụ phổ biến</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {POPULAR_CATEGORIES.map(({ icon: Icon, label, query, color }) => (
            <button
              key={label}
              onClick={() => search(query)}
              className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 p-5 text-center transition-shadow hover:shadow-card-hover"
            >
              <span className={`rounded-full p-3 ${color}`}>
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Benefits banner */}
      <section className="bg-gray-50 py-14">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <img
            src={placeholderImg('benefit', 560, 400)}
            alt=""
            className="w-full rounded-xl object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-ink">
              Cả một thế giới nhân tài freelance trong tầm tay
            </h2>
            <ul className="mt-5 space-y-3">
              {SELLER_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-ink-soft">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                  {b}
                </li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => navigate(ROUTES.signUp)}>
              Bắt đầu ngay <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container-page py-14">
        <h2 className="mb-6 text-2xl font-bold text-ink">Khám phá theo danh mục</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {CATEGORY_GRID.map(({ icon: Icon, label, jobs }) => (
            <button
              key={label}
              onClick={() => navigate(ROUTES.jobs)}
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 text-left transition-shadow hover:shadow-card-hover"
            >
              <span className="rounded-lg bg-primary-50 p-3 text-primary-700">
                <Icon size={22} />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{label}</span>
                <span className="block text-xs text-ink-faint">{jobs}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink py-16 text-center text-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Sẵn sàng bắt đầu?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Tạo tài khoản miễn phí và tìm freelancer phù hợp trong vài phút.
          </p>
          <Button className="mt-6" size="lg" onClick={() => navigate(ROUTES.signUp)}>
            Tham gia Fiverr
          </Button>
        </div>
      </section>
    </div>
  );
};
