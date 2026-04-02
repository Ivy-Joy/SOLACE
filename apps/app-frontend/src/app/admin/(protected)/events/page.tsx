/*"use client";

import Link from "next/link";
import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";
import EventsList from "@/src/components/admin/events/EventsList";
import DashboardPanels from "@/src/components/admin/events/DashboardPanels";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events"
        description="Create, update, publish, manage tickets, check-ins, registrations, and waitlists."
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/events/new" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          New event
        </Link>
        <Link href="/admin/events?status=published" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold">
          Published
        </Link>
        <Link href="/admin/events?status=draft" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold">
          Drafts
        </Link>
        <Link href="/admin/events?status=archived" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold">
          Archived
        </Link>
      </div>

      <DashboardPanels />

      <EventsList />
    </div>
  );
}*/
// app/admin/(protected)/events/page.tsx
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import DashboardPanels from "@/src/components/admin/events/DashboardPanels";
import EventsList from "@/src/components/admin/events/EventsList";

export default function Page() {
  return (
    <AdminLayout title="Events" description="Create, update, publish, and manage event operations.">
      <DashboardPanels />
      <EventsList />
    </AdminLayout>
  );
}