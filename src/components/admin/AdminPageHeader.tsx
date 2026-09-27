import { Search, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface Props {
  searchPlaceholder?: string;
  onSearch?: (keyword: string) => void;
  onAdd?: () => void;
  addLabel?: string;
}

export const AdminPageHeader = ({
  searchPlaceholder = 'Tìm kiếm...',
  onSearch,
  onAdd,
  addLabel = 'Thêm mới',
}: Props) => {
  const [term, setTerm] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(term.trim());
  };

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onSearch && (
        <form onSubmit={submit} className="flex w-full max-w-sm">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-l-md border border-r-0 border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="rounded-r-md bg-ink px-3 text-white hover:bg-black"
            aria-label="Tìm"
          >
            <Search size={16} />
          </button>
        </form>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          <Plus size={16} /> {addLabel}
        </button>
      )}
    </div>
  );
};
