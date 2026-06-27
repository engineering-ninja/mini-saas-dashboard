import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { route } from "@/lib/api";

export const GET = route(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
});
