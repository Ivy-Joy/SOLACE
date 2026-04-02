"use client";

import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";

export default function AdminAuditPage() {
  return (
    <div>
      <AdminPageHeader
        title="Audit"
        description="Track admin actions, success/failure status, and object changes. Audit logs can be added with the same paginated search pattern used by members and prayers."
      />
      <div className="rounded-[28px] bg-white border border-gray-100 p-6 text-sm text-gray-600">
        Audit log table goes here.
      </div>
    </div>
  );
}