import { Suspense } from "react"; // 1. Import Suspense
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import DashboardPanels from "@/src/components/admin/events/DashboardPanels";
import EventsList from "@/src/components/admin/events/EventsList";

export default function Page() {
  return (
    <AdminLayout title="Events" description="Create, update, publish, and manage event operations.">
      {/* 2. Wrap components that use searchParams in Suspense */}
      <Suspense fallback={<div className="p-4 text-center">Loading dashboard...</div>}>
        <DashboardPanels />
        <EventsList />
      </Suspense>
    </AdminLayout>
  );
}