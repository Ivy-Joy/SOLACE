//StatusBadge.tsx
export default function StatusBadge({ status }: { status: string }) {
  const color =
    status === "approved" || status === "answered" || status === "verified" || status === "success" || status === "live" || status === "active" || status === "published" || status === "resolved"
      ? "bg-green-50 text-green-700"
      : status === "rejected" || status === "hidden" || status === "failure" || status === "deleted" || status === "cancelled"
        ? "bg-red-50 text-red-700"
        : status === "escalated" || status === "urgent" || status === "pending"
        ? "bg-yellow-50 text-yellow-800"
        : status === "draft" || status === "paused" || status === "triaged" || status === "assigned" || status === "waitlisted" || status === "submitted"
        ? "bg-slate-100 text-slate-700"
        : "bg-gray-100 text-gray-700";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${color}`}>{status}</span>;
}