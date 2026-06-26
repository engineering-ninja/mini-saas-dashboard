import type { ProjectDTO } from "@/lib/projects";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "./status-badge";

type Props = {
  projects: ProjectDTO[];
  onEdit: (project: ProjectDTO) => void;
  onDelete: (project: ProjectDTO) => void;
};

export function ProjectsTable({ projects, onEdit, onDelete }: Props) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Deadline</th>
              <th className="px-4 py-3 font-medium">Assignee</th>
              <th className="px-4 py-3 text-right font-medium">Budget</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{project.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(project.deadline)}</td>
                <td className="px-4 py-3 text-slate-600">{project.assignee}</td>
                <td className="px-4 py-3 text-right text-slate-900">
                  {formatCurrency(project.budget)}
                </td>
                <td className="px-4 py-3 text-right">
                  <RowActions project={project} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-slate-900">{project.name}</p>
              <StatusBadge status={project.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <Detail label="Deadline" value={formatDate(project.deadline)} />
              <Detail label="Assignee" value={project.assignee} />
              <Detail label="Budget" value={formatCurrency(project.budget)} />
            </dl>
            <div className="mt-3 flex justify-end">
              <RowActions project={project} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

function RowActions({
  project,
  onEdit,
  onDelete,
}: {
  project: ProjectDTO;
  onEdit: (project: ProjectDTO) => void;
  onDelete: (project: ProjectDTO) => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => onEdit(project)}
        className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(project)}
        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
