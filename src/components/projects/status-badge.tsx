import { STATUS_LABELS, type ProjectStatusValue } from "@/lib/constants";

const styles: Record<ProjectStatusValue, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  ON_HOLD: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-slate-200 text-slate-600",
};

export function StatusBadge({ status }: { status: ProjectStatusValue }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
