import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { jsonError, validationError, route } from "@/lib/api";
import { loginSchema } from "@/lib/validation";

export const POST = route(async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return jsonError("Invalid email or password", 401);
  }

  await setAuthCookie(await signAuthToken(user.id));
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
});
