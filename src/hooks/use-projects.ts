import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { ProjectDTO } from "@/lib/projects";
import type { ProjectStatusValue } from "@/lib/constants";

export type ProjectFilters = { status: ProjectStatusValue | ""; search: string };

export function projectsQueryKey(filters: ProjectFilters) {
  return ["projects", filters] as const;
}

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: projectsQueryKey(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      const qs = params.toString();
      const data = await apiFetch<{ projects: ProjectDTO[] }>(`/api/projects${qs ? `?${qs}` : ""}`);
      return data.projects;
    },
  });
}
