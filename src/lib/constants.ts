// Keep in sync with the Prisma `ProjectStatus` enum.
export const PROJECT_STATUSES = ["ACTIVE", "ON_HOLD", "COMPLETED"] as const;
export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatusValue, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
};

export const DEMO_USER = {
  email: "demo@example.com",
  password: "demo1234",
  name: "Demo User",
} as const;
