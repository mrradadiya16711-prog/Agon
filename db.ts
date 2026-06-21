import { neon } from "@neondatabase/serverless";

/**
 * Neon serverless Postgres — free tier, never sleeps.
 * Get your connection string from https://neon.tech
 * Put it in Vercel env var: DATABASE_URL
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️  DATABASE_URL not set — API routes will fail. Create a free database at neon.tech");
}

const sql = connectionString ? neon(connectionString) : null;

let initialized = false;

/** Ensure tables exist. Runs once per function instance. */
export async function ensureDB() {
  if (!sql || initialized) return;
  initialized = true;

  await sql`CREATE TABLE IF NOT EXISTS keys (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    metric TEXT NOT NULL,
    value INTEGER NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    caption TEXT NOT NULL,
    platform TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS rules (
    id SERIAL PRIMARY KEY,
    metric TEXT NOT NULL,
    insight TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  console.log("✅ Database tables ensured");
}

/** Run a parameterized query. Returns { rows } for compatibility. */
export async function query(text: string, params: any[] = []) {
  if (!sql) throw new Error("DATABASE_URL not set");
  await ensureDB();
  const rows = await sql(text, params);
  return { rows };
}

/** Get a setting value by key. */
export async function getSetting(key: string): Promise<string | null> {
  const { rows } = await query("SELECT value FROM settings WHERE key = $1", [key]);
  return rows[0]?.value ?? null;
}

/** Set a setting value. */
export async function setSetting(key: string, value: string) {
  await query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value]
  );
}
