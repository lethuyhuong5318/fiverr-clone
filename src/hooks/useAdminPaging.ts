import { useCallback, useEffect, useState } from 'react';
import type { PagedResult, PageParams } from '@/types/api';
import { getErrorMessage } from '@/utils/errors';
import { ADMIN_PAGE_SIZE } from '@/utils/constants';

interface Options<T> {
  fetcher: (params: PageParams) => Promise<PagedResult<T>>;
}

export function useAdminPaging<T>({ fetcher }: Options<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (opts?: { page?: number; keyword?: string }) => {
      const p = opts?.page ?? page;
      const k = opts?.keyword ?? keyword;
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher({ pageIndex: p, pageSize: ADMIN_PAGE_SIZE, keyword: k || undefined });
        setRows(res.data ?? []);
        setTotal(res.totalRow ?? 0);
        setPage(p);
      } catch (err) {
        setError(getErrorMessage(err));
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [fetcher, page, keyword],
  );

  useEffect(() => {
    load({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = (k: string) => {
    setKeyword(k);
    load({ page: 1, keyword: k });
  };

  const changePage = (p: number) => load({ page: p });
  const reload = () => load();

  return {
    rows,
    total,
    page,
    keyword,
    loading,
    error,
    pageSize: ADMIN_PAGE_SIZE,
    search,
    changePage,
    reload,
    setKeyword,
  };
}
