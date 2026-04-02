//Pagination.tsx
"use client";

type Props = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, limit, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}