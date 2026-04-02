// apps/app-frontend/src/components/admin/shared/AdminModuleLayout.tsx
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export type AdminTab = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type AdminModuleLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  tabs?: AdminTab[];
};

export default function AdminModuleLayout({
  title,
  description,
  children,
  backHref = "/admin/dashboard",
  backLabel = "Dashboard",
  primaryAction,
  secondaryAction,
  tabs = [],
}: AdminModuleLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link
                href={backHref}
                className="inline-flex items-center gap-1 font-semibold hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                {backLabel}
              </Link>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                {secondaryAction.label}
              </Link>
            ) : null}

            {primaryAction ? (
              <Link
                href={primaryAction.href}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {primaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        {tabs.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>

      {children}
    </div>
  );
}