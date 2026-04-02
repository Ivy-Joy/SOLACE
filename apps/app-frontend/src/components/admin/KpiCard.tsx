type KpiValue = number | string;
export default function KpiCard({ title, value }: { title: string; value: KpiValue }) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}