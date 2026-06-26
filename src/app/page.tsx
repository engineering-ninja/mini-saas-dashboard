import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mini SaaS Dashboard</h1>
        <p className="mt-2 text-slate-500">List, filter, search, add and edit your projects.</p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Go to dashboard
      </Link>
    </main>
  );
}
