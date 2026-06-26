import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, jsonError, validationError } from "@/lib/api";
import { projectSchema } from "@/lib/validation";
import { serializeProject } from "@/lib/projects";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const project = await prisma.project.findFirst({ where: { id, ownerId: user.id } });
  if (!project) return jsonError("Project not found", 404);

  return NextResponse.json({ project: serializeProject(project) });
}

export async function PATCH(request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const existing = await prisma.project.findFirst({ where: { id, ownerId: user.id } });
  if (!existing) return jsonError("Project not found", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ project: serializeProject(project) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const { count } = await prisma.project.deleteMany({ where: { id, ownerId: user.id } });
  if (count === 0) return jsonError("Project not found", 404);

  return new NextResponse(null, { status: 204 });
}
