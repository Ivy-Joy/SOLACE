// apps/app-frontend/src/components/admin/layout/AdminShell.tsx
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  ScrollText,
  CalendarDays,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Bell,
  Layers3,
  BookOpen,
  HeartPulse,
  Settings2,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.replace("/admin/login");
  }, [router]);

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
      { label: "Members", href: "/admin/members", icon: <Users size={18} /> },
      { label: "Leads", href: "/admin/leads", icon: <HeartHandshake size={18} /> },
      { label: "Prayers", href: "/admin/prayers", icon: <ScrollText size={18} /> },
      { label: "Events", href: "/admin/events", icon: <CalendarDays size={18} /> },
      { label: "Audit Logs", href: "/admin/audit", icon: <ShieldCheck size={18} /> },
      { label: "Enrollments", href: "/admin/enrollments", icon: <Layers3 size={18} /> },
      { label: "Funnel", href: "/admin/funnel", icon: <BookOpen size={18} /> },
      { label: "Counselling", href: "/admin/counselling", icon: <HeartPulse size={18} /> },
      { label: "Policies", href: "/admin/policies", icon: <Settings2 size={18} /> },
      { label: "Live Sessions", href: "/admin/live-sessions", icon: <BadgeCheck size={18} /> },
      { label: "Chat Moderation", href: "/admin/chat", icon: <MessageSquare size={18} /> },
    ],
    []
  );

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const currentLabel =
    pathname === "/admin/dashboard"
      ? "Dashboard"
      : pathname.replace("/admin/", "").replaceAll("/", " / ");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 z-40 w-72 border-r border-slate-200 bg-white px-4 py-5 shadow-sm transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                SOLACE
              </div>
              <div className="text-xl font-bold">Admin Panel</div>
            </div>
            <button
              className="rounded-xl border border-slate-200 p-2 lg:hidden"
              onClick={() => setMobileOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl bg-slate-900 p-4 text-white">
            <div className="text-sm font-semibold">Admin control center</div>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Manage members, leads, prayers, events, enrolments, discipleship, counselling,
              class policies, live sessions, and chat moderation from one workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={18} />
              </button>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Admin workspace
                </div>
                <div className="text-sm text-slate-600">{currentLabel}</div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="rounded-xl border border-slate-200 p-2">
                  <Bell size={18} />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}