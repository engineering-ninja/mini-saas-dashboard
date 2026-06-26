"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function DashboardHeader({ userName }: { userName: string }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-slate-900">Mini SaaS Dashboard</h1>
          <p className="text-xs text-slate-500">Projects</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:inline">{userName}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
