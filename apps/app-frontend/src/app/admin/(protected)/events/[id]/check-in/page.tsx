// app/admin/events/[id]/check-in/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import CheckInPanel from "@/src/components/admin/events/CheckInPanel";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminLayout title="Check-in" description="Mark attendees present." eventId={id}>
      <CheckInPanel eventId={id} />
    </AdminLayout>
  );
}