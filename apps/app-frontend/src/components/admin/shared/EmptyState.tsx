//components/admin/shared/EmptyState.tsx
export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {description ? <p className="mt-2 text-sm text-gray-600">{description}</p> : null}
    </div>
  );
}