# Fiverr Clone

Ứng dụng web clone Fiverr được xây dựng bằng React 18 và TypeScript.

## Tech Stack

| Nhóm | Công nghệ |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State Management | Redux Toolkit + Redux Persist |
| Routing | React Router v6 |
| Form Validation | React Hook Form + Zod |
| HTTP Client | Axios |
| UI Component Library | Ant Design 5 |
| Icons & Toasts | Lucide React / Sonner |

## Cấu Trúc Thư Mục

```
src/
├── components/
│   ├── Common/      Button, Input, Select, Modal, Rating, Pagination, ...
│   ├── Layout/      Header, Footer, CategoryMenu, MainLayout, AdminLayout
│   ├── Auth/        ProtectedRoute, AdminRoute
│   ├── Forms/       SignInForm, SignUpForm
│   ├── JobCard/     JobCard, JobCardSkeleton
│   ├── Filters/     FilterSidebar
│   └── admin/       AdminPageHeader
├── pages/
│   ├── HomePage.tsx
│   ├── AuthPages/   SignIn, SignUp
│   ├── JobPages/    JobListingPage, JobByCategoryPage, JobDetailPage
│   ├── UserPages/   ProfilePage
│   └── admin/       ManageUsers / Jobs / JobTypes / JobDetails / Hires / Comments
├── store/
│   ├── store.ts     configureStore + persist (whitelist: auth, favorite)
│   ├── hooks.ts     useAppDispatch / useAppSelector
│   └── slices/      auth, job, category, favorite, ui
├── services/        api (axios) + auth, users, jobs, categories, comments, hires, skills
├── hooks/           useAdminPaging
├── types/           models.ts, api.ts
└── utils/           constants, errors, formatters, validators, auth, mockData
```

## Hướng Dẫn Chạy

```bash
# Cài đặt thư viện
npm install

# Chạy giao diện ở môi trường phát triển
npm run dev
```
