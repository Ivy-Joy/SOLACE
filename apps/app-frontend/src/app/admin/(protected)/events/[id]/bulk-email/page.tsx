"use client";

import { useState } from "react";
import AdminLayout from "@/src/components/admin/events/AdminLayout";
import BulkEmailModal from "@/src/components/admin/events/BulkEmailModal";

export default function Page({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(true);

  return (
    <AdminLayout
      title="Bulk email"
      description="Send email to event audiences."
      eventId={params.id}
    >
      <BulkEmailModal
        eventId={params.id}
        open={open}
        onClose={() => setOpen(false)}
      />
    </AdminLayout>
  );
}