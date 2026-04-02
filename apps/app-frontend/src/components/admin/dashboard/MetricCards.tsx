//components/admin/dashboard/MetricCards.tsx
import type { AdminMetricTotals } from "@/src/lib/adminTypes";

function Card({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note?: string;
}) {
  return (
    <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-3xl font-black text-gray-900">{value}</span>
        {note ? <span className="text-right text-xs text-gray-500">{note}</span> : null}
      </div>
    </div>
  );
}

export default function MetricCards({ totals }: { totals: AdminMetricTotals }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
      <Card label="Members" value={totals.membersTotal} note="All members" />
      <Card label="Phone verified" value={totals.verifiedPhoneCount} note="OTP complete" />
      <Card label="Pending members" value={totals.pendingMembers} note="Awaiting review" />
      <Card label="Approved members" value={totals.approvedMembers} note="Active approval" />
      <Card label="Rejected members" value={totals.rejectedMembers} note="Not approved" />
      <Card label="Archived members" value={totals.archivedMembers} note="Inactive archive" />

      <Card label="Pending consents" value={totals.pendingConsents} note="Parent approval" />
      <Card label="Buddy assignments" value={totals.buddyAssignments} note="Assigned support" />
      <Card label="Prayers" value={totals.prayerTotal} note="All requests" />
      <Card label="Leads" value={totals.leadTotal} note="Vetting pipeline" />
      <Card label="Events" value={totals.eventsTotal} note="All events" />
      <Card label="Class enrollments" value={totals.classEnrollments} note="All applications" />

      <Card label="Counselling cases" value={totals.counsellingCases} note="Pastoral care" />
      <Card label="Donor records" value={totals.donorRecords} note="Giving history" />
      <Card label="Live sessions" value={totals.liveSessions} note="Scheduled/live" />
      <Card label="Chat messages" value={totals.chatMessages} note="Community activity" />
      <Card label="Audit entries today" value={totals.auditToday} note="Admin actions" />
      <Card label="Answered prayers" value={totals.answeredPrayers} note="Marked answered" />
    </div>
  );
}