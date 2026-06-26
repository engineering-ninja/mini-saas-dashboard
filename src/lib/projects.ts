import type { ProjectStatusValue } from "./constants";

export type ProjectDTO = {
  id: string;
  name: string;
  status: ProjectStatusValue;
  deadline: string;
  assignee: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
};

// Prisma returns budget as a Decimal and dates as Date objects; normalise both
// into JSON-friendly primitives for the API response.
export function serializeProject(project: {
  id: string;
  name: string;
  status: ProjectStatusValue;
  deadline: Date;
  assignee: string;
  budget: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
}): ProjectDTO {
  return {
    id: project.id,
    name: project.name,
    status: project.status,
    deadline: project.deadline.toISOString(),
    assignee: project.assignee,
    budget: Number(project.budget),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}
