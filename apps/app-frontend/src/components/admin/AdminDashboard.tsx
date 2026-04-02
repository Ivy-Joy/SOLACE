"use client";
import useSWR from "swr";
import KpiCard from "./KpiCard";
import ApplicationsKanban from "./ApplicationsKanban";
import MembersTable from "./MembersTable";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminDashboard() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE}/api/admin/metrics`, fetcher, { refreshInterval: 15000 });

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="New Signups (30d)" value={data.newSignups} />
        <KpiCard title="Open Applications" value={data.openApplications} />
        <KpiCard title="Active Leads" value={data.activeLeads} />
        <KpiCard title="Buddy SLA" value={`${data.buddySLA}%`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ApplicationsKanban />
        <MembersTable />
      </div>
    </div>
  );
}