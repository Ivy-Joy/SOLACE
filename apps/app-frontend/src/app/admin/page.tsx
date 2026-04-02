// Admin dahsboard entry(protected)
// apps/app-frontend/app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
    } else {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  return <div className="p-6">Checking authentication...</div>;
}