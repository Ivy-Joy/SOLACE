"use client";
import useSWR from "swr";

const BASE = process.env.NEXT_PUBLIC_API_BASE;

type Member = {
  _id: string;
  fullName: string;
  phone: string;
  preferredClass?: string;
  createdAt: string;
};

//const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` } }).then(r => r.json());
const fetcher = async (url: string): Promise<Member[]> => {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export default function MembersTable() {
  const { data, isLoading } = useSWR<Member[]>(`${BASE}/api/members`, fetcher, { refreshInterval: 10000 });

   if (isLoading) {
    return <div className="text-white/60">Loading members...</div>;
  }

  return (
    <div className="bg-white/5 p-4 rounded">
      <h3 className="font-semibold mb-3">Recent Members</h3>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead><tr className="text-xs text-white/60"><th>Name</th><th>Phone</th><th>Preferred</th><th>Created</th></tr></thead>
          <tbody>
            {data?.map((m) => (
              <tr key={m._id} className="border-t border-white/8">
                <td className="py-2">{m.fullName}</td>
                <td>{m.phone}</td>
                <td>{m.preferredClass}</td>
                <td className="text-xs text-white/60">{new Date(m.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}