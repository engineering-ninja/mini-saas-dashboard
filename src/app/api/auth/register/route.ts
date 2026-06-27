import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signAuthToken, setAuthCookie } from "@/lib/auth";
import { jsonError, validationError, tooManyRequests, route } from "@/lib/api";
import { registerSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const POST = route(async (request: Request) => {
  const limit = rateLimit(`register:${getClientIp(request)}`, 5, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return jsonError("An account with this email already exists", 409);

  const user = await prisma.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
    select: { id: true, name: true, email: true },
  });

  await setAuthCookie(await signAuthToken(user.id));
  return NextResponse.json({ user }, { status: 201 });
});
