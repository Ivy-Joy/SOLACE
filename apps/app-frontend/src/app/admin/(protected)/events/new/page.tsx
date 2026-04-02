// app/admin/(protected)/events/new/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import EventsEditor from "@/src/components/admin/events/EventsEditor";

export default function Page() {
  return (
    <AdminLayout title="Create event" description="Create a new event and publish it when ready.">
      <EventsEditor />
    </AdminLayout>
  );
}