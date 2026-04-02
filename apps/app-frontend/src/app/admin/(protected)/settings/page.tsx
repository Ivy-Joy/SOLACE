"use client";

import AdminPageHeader from "@/src/components/admin/layout/AdminPageHeader";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Use this for roles, permissions, bootstrap token rotation, and moderation preferences."
      />
      <div className="rounded-[28px] bg-white border border-gray-100 p-6 text-sm text-gray-600">
        Settings page placeholder.
      </div>
    </div>
  );
}