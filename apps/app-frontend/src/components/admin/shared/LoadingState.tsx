//components/admin/shared/LoadingState.tsx
export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
      {label}
    </div>
  );
}