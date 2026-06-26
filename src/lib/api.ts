import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser } from "./auth";

export function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function unauthorized() {
  return jsonError("Unauthorized", 401);
}

// Maps a ZodError to a { field: message } object for the client to display.
export function validationError(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    fieldErrors[key] ??= issue.message;
  }
  return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 422 });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, response: unauthorized() as NextResponse };
  return { user, response: null };
}
