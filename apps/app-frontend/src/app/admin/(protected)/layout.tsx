// apps/app-frontend/app/admin/(protected)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/src/components/admin/layout/AdminShell";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  return <AdminShell>{children}</AdminShell>;
}