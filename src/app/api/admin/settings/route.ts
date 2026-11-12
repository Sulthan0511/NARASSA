/**
 * ============================================================================
 *  API PENGATURAN ADMIN
 *  POST /api/admin/settings   body: { key, value }
 *
 *  Saat ini hanya kunci "payment_accounts": daftar nomor rekening/e-wallet
 *  tujuan transfer donasi (diedit admin di /admin -> tab Pengaturan, dan
 *  ditampilkan pada modal donasi milik member).
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const ALLOWED_KEYS = ["payment_accounts"];

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const b = await readBody<{ key: string; value: unknown }>(req);
  if (!ALLOWED_KEYS.includes(b.key)) return error("Kunci pengaturan tidak diizinkan.");

  if (b.key === "payment_accounts") {
    if (!Array.isArray(b.value)) return error("Data rekening harus berupa daftar.");
    for (const a of b.value as any[]) {
      if (!a || typeof a.method !== "string" || !a.method.trim())
        return error("Setiap rekening wajib punya nama metode.");
      if (a.number === undefined || String(a.number).trim() === "")
        return error("Setiap rekening wajib punya nomor.");
    }
  }

  const ok = await mutate((m) => {
    const row = m.settings.find((s) => s.key === b.key);
    if (row) row.value = b.value;
    else m.settings.unshift({ key: b.key, value: b.value });
    return true;
  });

  if (!ok) return error("Gagal menyimpan pengaturan.");
  return json({ ok: true });
}
