// app/admin/(protected)/events/[id]/registrations/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import RegistrationsTable from "@/src/components/admin/events/RegistrationsTable";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminLayout title="Registrations" description="Review and manage registrations." eventId={id}>
      <RegistrationsTable eventId={id} />
    </AdminLayout>
  );
}