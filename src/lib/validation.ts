import { z } from "zod";
import { PROJECT_STATUSES } from "./constants";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  status: z.enum(PROJECT_STATUSES),
  deadline: z.coerce.date({ message: "Enter a valid date" }),
  assignee: z.string().trim().min(1, "Assignee is required").max(80),
  budget: z.coerce.number().min(0, "Budget cannot be negative").max(1_000_000_000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
