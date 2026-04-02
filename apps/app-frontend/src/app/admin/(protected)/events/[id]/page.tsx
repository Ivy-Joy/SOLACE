// app/admin/(protected)/events/[id]/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import EventsEditor from "@/src/components/admin/events/EventsEditor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminLayout title="Edit event" description="Update event details and publish settings." eventId={id}>
      <EventsEditor eventId={id} />
    </AdminLayout>
  );
}