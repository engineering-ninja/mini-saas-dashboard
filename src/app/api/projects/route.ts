import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, jsonError, validationError } from "@/lib/api";
import { projectSchema } from "@/lib/validation";
import { serializeProject } from "@/lib/projects";
import { PROJECT_STATUSES, type ProjectStatusValue } from "@/lib/constants";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const where: Prisma.ProjectWhereInput = { ownerId: user.id };

  if (statusParam && PROJECT_STATUSES.includes(statusParam as ProjectStatusValue)) {
    where.status = statusParam as ProjectStatusValue;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { assignee: { contains: search, mode: "insensitive" } },
    ];
  }

  const projects = await prisma.project.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ projects: projects.map(serializeProject) });
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const project = await prisma.project.create({
    data: { ...parsed.data, ownerId: user.id },
  });
  return NextResponse.json({ project: serializeProject(project) }, { status: 201 });
}
