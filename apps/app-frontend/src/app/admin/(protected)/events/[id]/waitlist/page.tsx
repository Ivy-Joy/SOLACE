// app/admin/events/[id]/waitlist/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import WaitlistManager from "@/src/components/admin/events/WaitlistManager";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminLayout title="Waitlist" description="Promote or remove waitlisted people." eventId={id}>
      <WaitlistManager eventId={id} />
    </AdminLayout>
  );
}