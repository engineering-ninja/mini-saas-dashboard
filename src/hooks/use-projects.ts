import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type { ProjectDTO } from "@/lib/projects";
import type { ProjectStatusValue } from "@/lib/constants";

export type ProjectFilters = {
  status: ProjectStatusValue | "";
  search: string;
  page: number;
};

export type ProjectsResponse = {
  projects: ProjectDTO[];
  total: number;
  page: number;
  pageSize: number;
};

export function projectsQueryKey(filters: ProjectFilters) {
  return ["projects", filters] as const;
}

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: projectsQueryKey(filters),
    placeholderData: keepPreviousData,
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      params.set("page", String(filters.page));
      return apiFetch<ProjectsResponse>(`/api/projects?${params.toString()}`);
    },
  });
}
