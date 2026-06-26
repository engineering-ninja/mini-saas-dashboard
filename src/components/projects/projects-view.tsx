"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { ProjectStatusValue } from "@/lib/constants";
import type { ProjectDTO } from "@/lib/projects";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsTable } from "./projects-table";
import { ProjectFormModal } from "./project-form-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useDeleteProject } from "@/hooks/use-project-mutations";

export function ProjectsView() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatusValue | "">("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectDTO | null>(null);
  const [deleting, setDeleting] = useState<ProjectDTO | null>(null);
  const deleteProject = useDeleteProject();

  const {
    data: projects,
    isPending,
    isError,
    refetch,
  } = useProjects({
    status,
    search: debouncedSearch,
  });

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const handleEdit = (project: ProjectDTO) => {
    setEditing(project);
    setModalOpen(true);
  };
  const handleDelete = (project: ProjectDTO) => setDeleting(project);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteProject.mutateAsync(deleting.id);
      toast("Project deleted");
    } catch {
      toast("Failed to delete project", "error");
    } finally {
      setDeleting(null);
    }
  };

  const hasFilters = search !== "" || status !== "";

  return (
    <div className="flex flex-col gap-4">
      <ProjectsToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onAdd={handleAdd}
      />

      {isPending ? (
        <State message="Loading projects…" />
      ) : isError ? (
        <State message="Failed to load projects.">
          <button
            onClick={() => refetch()}
            className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Retry
          </button>
        </State>
      ) : projects.length === 0 ? (
        <State message={hasFilters ? "No projects match your filters." : "No projects yet."} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
          <ProjectsTable projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        project={editing}
        onClose={() => setModalOpen(false)}
        onSaved={(message) => toast(message)}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Delete project"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
        loading={deleteProject.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

function State({ message, children }: { message: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
      <p>{message}</p>
      {children}
    </div>
  );
}
