/**
 * scripts/gen-seed-sql.ts
 * ---------------------------------------------------------------------------
 * Membuat `supabase/seed.sql` (data awal) dari sumber kebenaran yang sama
 * dengan aplikasi: src/lib/seed.ts  ->  buildSeed().
 *
 * Jalankan  : node scripts/gen-seed-sql.ts > supabase/seed.sql
 * Tujuan    : supabase/seed.sql ditempel di Supabase SQL Editor supaya database
 *             free-tier langsung punya data demo (users, donasi, kegiatan, dll).
 * ---------------------------------------------------------------------------
 */
import { buildSeed } from "../src/lib/seed.ts";

type Row = Record<string, unknown>;

const ORDER = [
  "users",
  "donations",
  "txs",
  "activities",
  "applications",
  "certificates",
  "attendance",
  "notifications",
  "blog",
  "feed",
  "fundraising",
  "recurring",
  "supporters",
  "csr",
  "otps",
  "settings",
] as const;

const PK: Record<string, string> = {
  users: "id",
  donations: "id",
  txs: "id",
  activities: "id",
  applications: "id",
  certificates: "id",
  attendance: "id",
  notifications: "id",
  blog: "id",
  feed: "id",
  fundraising: "id",
  recurring: "id",
  supporters: "id",
  csr: "id",
  otps: "contact",
  settings: "key",
};

const JSONB: Record<string, string[]> = {
  activities: ["requirements", "perks"],
  settings: ["value"],
};

function sql(v: unknown, col: string, table: string): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "string") return "'" + v.replace(/'/g, "''") + "'";
  // array / object -> jsonb
  const json = JSON.stringify(v).replace(/'/g, "''");
  return `'${json}'::jsonb`;
}

function main() {
  const db = buildSeed() as unknown as Record<string, Row[]>;
  const out: string[] = [];

  out.push(`-- ===========================================================================`);
  out.push(`--  NARASSA — DATA AWAL (seed) untuk Supabase`);
  out.push(`-- ===========================================================================`);
  out.push(`--  CARA PAKAI: tempel seluruh isi file ini di Supabase SQL Editor -> RUN.`);
  out.push(`--  Sumber data: src/lib/seed.ts (buildSeed()) — dihasilkan otomatis oleh`);
  out.push(`--  scripts/gen-seed-sql.ts sehingga selalu sama dengan aplikasi.`);
  out.push(`--`);
  out.push(`--  Akun demo:`);
  out.push(`--    Admin  : admin@narassa.id    / admin123`);
  out.push(`--    Member : relawan@narassa.id  / demo123`);
  out.push(`-- ===========================================================================`);
  out.push(``);
  out.push(`begin;`);
  out.push(``);

  for (const table of ORDER) {
    const rows = db[table] ?? [];
    out.push(`-- ---------------------------------------------------------------------`);
    out.push(`-- tabel ${table} (${rows.length} baris)`);
    out.push(`-- ---------------------------------------------------------------------`);
    if (rows.length === 0) {
      out.push(`-- (tidak ada data awal)`);
      out.push(``);
      continue;
    }

    const cols: string[] = [];
    for (const r of rows) {
      for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
    }
    const pk = PK[table];
    const jsonbCols = new Set(JSONB[table] ?? []);

    const values = rows.map((r) => {
      const cells = cols.map((c) => {
        const v = r[c];
        return jsonbCols.has(c)
          ? v === null || v === undefined
            ? "NULL"
            : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
          : sql(v, c, table);
      });
      return `  (${cells.join(", ")})`;
    });

    const colList = cols.map((c) => `"${c}"`).join(", ");
    const updateList = cols
      .filter((c) => c !== pk)
      .map((c) => `"${c}" = excluded."${c}"`)
      .join(", ");

    out.push(`insert into public.${table} (${colList}) values`);
    out.push(values.join(",\n"));
    out.push(`on conflict ("${pk}") do update set ${updateList};`);
    out.push(``);
  }

  out.push(`commit;`);
  out.push(``);
  process.stdout.write(out.join("\n"));
}

main();
