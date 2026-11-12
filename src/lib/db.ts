/**
 * ============================================================================
 *  src/lib/db.ts  —  LAPISAN AKSES DATA NARASSA (adapter)
 * ============================================================================
 *
 *  APA INI?
 *    Satu-satunya pintu baca/tulis data aplikasi. Semua halaman & API route
 *    memanggil `getDB()` (baca) dan `mutate()` (tulis) — TIDAK ada kode lain
 *    yang boleh menyentuh database secara langsung.
 *
 *  DUA MODE (dipilih otomatis dari environment variable):
 *    1. MODE SUPABASE (dipakai di Vercel / production)
 *       Env `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` terisi
 *       -> data dibaca/ditulis ke Postgres milik Supabase (gratis, free tier)
 *          lewat REST (PostgREST) memakai @supabase/supabase-js.
 *       -> Penulisan memakai fungsi database `sync_collection()` yang ada di
 *          `supabase/schema.sql` (upsert baris + hapus baris yang hilang).
 *
 *    2. MODE LOKAL / OFFLINE (tanpa env)
 *       -> data dibaca/ditulis ke `data/db.json` (seperti aplikasi awal),
 *          dipakai untuk pengembangan lokal tanpa koneksi Supabase.
 *
 *  KENAPA DIBUAT ADAPTER?
 *    Agar 39 file pemanggil (halaman + API) tidak perlu berubah: kontrak
 *    `getDB()` dan `mutate(fn)` tetap sama (hanya menjadi async karena
 *    jaringan). Di Vercel filesystem bersifat read-only, sehingga `db.json`
 *    TIDAK bisa dipakai untuk menyimpan data pendaftaran/donasi — maka
 *    Supabase menjadi penyimpanan permanen resmi.
 *
 *  KEAMANAN (free tier):
 *    - `SUPABASE_SERVICE_ROLE_KEY` HANYA untuk kode server (file ini tidak
 *      pernah di-import komponen "use client"). Jangan pakai awalan
 *      NEXT_PUBLIC_ untuk kedua env tersebut.
 *    - Row Level Security aktif di semua tabel tanpa policy -> client anon
 *      TIDAK bisa membaca/menulis apa pun; hanya service role (server) yang
 *      bisa, karena service role melewati RLS.
 *
 *  CATATAN KONSISTENSI:
 *    - Ada cache snapshot sangat pendek (2 detik) per instance serverless
 *      untuk mengurangi jumlah query. Setiap `mutate()` langsung membatalkan
 *      cache, sehingga data hasil tulis langsung terlihat di instance yang
 *      sama. Di instance lain maksimal telat ~2 detik.
 * ============================================================================
 */
import fs from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildSeed } from "./seed";
import type { DB } from "./types";

/** Nama tabel di Supabase — harus SAMA dengan yang ada di supabase/schema.sql */
const TABLES = [
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

type TableName = (typeof TABLES)[number];

/* -------------------------------------------------------------------------- */
/* Klien Supabase (server only)                                               */
/* -------------------------------------------------------------------------- */

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const projectUrl = url.trim();
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(projectUrl);
  } catch {
    throw new Error(
      "SUPABASE_URL tidak valid. Isi dengan Project URL dari Supabase, contoh: https://<project-ref>.supabase.co."
    );
  }
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
    throw new Error(
      "SUPABASE_URL tidak valid. Isi dengan Project URL dari Supabase, contoh: https://<project-ref>.supabase.co."
    );
  }
  if (!supabase) {
    supabase = createClient(projectUrl, key.trim(), {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return supabase;
}

/** True bila aplikasi sedang terhubung ke Supabase. */
export function isCloudDB(): boolean {
  return getSupabaseClient() !== null;
}

/* -------------------------------------------------------------------------- */
/* Cache snapshot singkat                                                     */
/* -------------------------------------------------------------------------- */

const CACHE_TTL_MS = 2000;
let cache: { at: number; data: DB } | null = null;

function invalidateCache() {
  cache = null;
}

/* -------------------------------------------------------------------------- */
/* Fallback lokal (data/db.json) — mode dev tanpa Supabase                    */
/* -------------------------------------------------------------------------- */

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function loadLocal(): DB {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const seed = buildSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as DB;
  } catch {
    const seed = buildSeed();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2));
    return seed;
  }
}

function persistLocal(db: DB) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_PATH);
}

/* -------------------------------------------------------------------------- */
/* API PUBLIK                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Baca seluruh isi database (15 tabel) sebagai satu objek DB.
 * @returns Promise<DB> — wajib di-`await` dari route handler / server component.
 */
export async function getDB(): Promise<DB> {
  const client = getSupabaseClient();

  // Mode lokal -------------------------------------------------------------
  if (!client) {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
    const data = loadLocal();
    cache = { at: Date.now(), data };
    return data;
  }

  // Mode Supabase ----------------------------------------------------------
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;

  const pairs = await Promise.all(
    TABLES.map(async (table) => {
      const { data, error } = await client.from(table).select("*");
      if (error) {
        throw new Error(
          `Gagal membaca tabel "${table}" dari Supabase: ${error.message}. ` +
            `Pastikan supabase/schema.sql sudah dijalankan di SQL Editor dan ` +
            `SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY benar.`
        );
      }
      return [table, data ?? []] as const;
    })
  );

  const db = Object.fromEntries(pairs) as unknown as DB;
  cache = { at: Date.now(), data: db };
  return db;
}

/**
 * Jalankan satu transaksi logika tulis.
 *
 * Pola pemakaian (tetap sama sejak awal proyek):
 *   const baru = await mutate((m) => {
 *     m.users.push(satuOrang);      // ubah objek in-memory
 *     m.otps.splice(0, 1);          // hapus baris juga didukung
 *     return satuOrang;             // nilai kembalian disampaikan ke pemanggil
 *   });
 *
 * Cara kerja:
 *   1. Salin snapshot database (structuredClone).
 *   2. Jalankan fungsi Anda pada salinan kerja.
 *   3. Bandingkan 15 tabel — yang berubah saja yang dikirim ke Supabase.
 *   4. Kirim ke fungsi SQL `sync_collection()` (upsert seluruh baris pada
 *      tabel itu + hapus baris yang tidak ada lagi) -> atomik di sisi database.
 *   5. Batalkan cache.
 */
export async function mutate<T>(fn: (db: DB) => T): Promise<T> {
  const db = await getDB();
  const before = structuredClone(db) as unknown as Record<TableName, unknown[]>;
  const result = fn(db);
  const after = db as unknown as Record<TableName, unknown[]>;

  const changed = TABLES.filter(
    (t) => JSON.stringify(before[t]) !== JSON.stringify(after[t])
  );

  if (changed.length > 0) {
    const client = getSupabaseClient();
    if (!client) {
      persistLocal(db); // mode lokal: tulis penuh ke db.json
    } else {
      for (const table of changed) {
        const { error } = await client.rpc("sync_collection", {
          p_table: table,
          p_rows: after[table] as unknown[],
        });
        if (error) {
          throw new Error(
            `Gagal menyimpan tabel "${table}" ke Supabase: ${error.message}. ` +
              `Pastikan fungsi sync_collection() dari supabase/schema.sql sudah dibuat.`
          );
        }
      }
    }
  }

  invalidateCache();
  cache = { at: Date.now(), data: db };
  return result;
}

/** Pembuat ID unik (tidak berubah). */
export function uid(prefix = ""): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
