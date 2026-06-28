import type { PoolConfig } from "pg";

export function pgPoolConfig(connectionString: string): PoolConfig {
  const url = new URL(connectionString);
  const sslmode = url.searchParams.get("sslmode");

  if (!sslmode || sslmode === "disable") {
    return { connectionString };
  }

  url.searchParams.delete("sslmode");
  return { connectionString: url.toString(), ssl: { rejectUnauthorized: false } };
}
