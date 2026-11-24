import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        <div className="rounded-lg bg-lavender-100 p-2 text-brand-600">
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold text-brand-900">{value}</p>
    </div>
  );
}