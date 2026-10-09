import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./drizzle/schema";

const connectionString = process.env.DATABASE_URL || "";

let client: any = null;
let db: any = null;

if (connectionString && !connectionString.includes("[YOUR-PASSWORD]")) {
  try {
    client = postgres(connectionString, { prepare: false });
    db = drizzle(client);
  } catch {
    console.warn("[AI Studio] Database not connected — using mock");
  }
}

if (!db) {
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy(
    {
      select: () => ({
        from: () => ({
          catch: async () => [],
        }),
      }),
    },
    {
      get: (target: any, prop) => {
        if (prop in target) return target[prop];
        return prop === "query"
          ? new Proxy({}, { get: () => noOp })
          : async () => [];
      },
    },
  );
}

export const allUsers: any[] =
  connectionString && !connectionString.includes("[YOUR-PASSWORD]") && client
    ? await db
        .select()
        .from(users)
        .catch((err: any) => {
          console.warn("[Drizzle] Could not query users table:", err.message);
          return [];
        })
    : [];

export { db, client, users };
