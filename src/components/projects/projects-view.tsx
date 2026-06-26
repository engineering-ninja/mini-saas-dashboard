"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { ProjectStatusValue } from "@/lib/constants";
import type { ProjectDTO } from "@/lib/projects";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsTable } from "./projects-table";

export function ProjectsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatusValue | "">("");
  const debouncedSearch = useDebouncedValue(search, 300);

  const {
    data: projects,
    isPending,
    isError,
    refetch,
  } = useProjects({
    status,
    search: debouncedSearch,
  });

  // Wired to the add/edit modal and delete flow in later phases.
  const handleAdd = () => {};
  const handleEdit = (_project: ProjectDTO) => {};
  const handleDelete = (_project: ProjectDTO) => {};

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
        <ProjectsTable projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
      )}
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
