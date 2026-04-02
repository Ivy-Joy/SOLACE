//components/admin/layout/AdminPageHeader.tsx
export default function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Admin</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}