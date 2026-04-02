// app/admin/events/[id]/tickets/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import TicketEditor from "@/src/components/admin/events/TicketEditor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminLayout title="Tickets" description="Edit ticket pricing and capacity." eventId={id}>
      <TicketEditor eventId={id} />
    </AdminLayout>
  );
}