import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { route } from "@/lib/api";

export const POST = route(async () => {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
});
