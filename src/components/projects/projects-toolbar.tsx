import { PROJECT_STATUSES, STATUS_LABELS, type ProjectStatusValue } from "@/lib/constants";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: ProjectStatusValue | "";
  onStatusChange: (value: ProjectStatusValue | "") => void;
  onAdd: () => void;
};

export function ProjectsToolbar({ search, onSearchChange, status, onStatusChange, onAdd }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or assignee…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400 sm:max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ProjectStatusValue | "")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onAdd}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Add project
      </button>
    </div>
  );
}
