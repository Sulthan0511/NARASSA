/**
 * ============================================================================
 *  API KODE ABSENSI KEGIATAN (ADMIN)
 *  POST /api/admin/activities/[id]/absen   body: { regenerate?: boolean }
 *
 *  Membuat kode absen harian untuk sebuah kegiatan; kode ini yang muncul di
 *  QR (payload: NARASSA:<activityId>:<kode>) dan discan member saat hari H.
 *  Tanpa regenerate, kode yang sudah ada dikembalikan (idempoten).
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const { id } = await ctx.params;
  const b = await readBody<{ regenerate?: boolean }>(req).catch(() => ({}) as { regenerate?: boolean });

  const result = await mutate((m) => {
    const act = m.activities.find((a) => a.id === id);
    if (!act) return { fail: "Kegiatan tidak ditemukan." } as const;
    if (!act.absenCode || b?.regenerate) {
      act.absenCode = Math.random().toString(36).toUpperCase().slice(2, 8);
    }
    return { ok: true as const, absenCode: act.absenCode! };
  });

  if ("fail" in result) return error(result.fail as string);
  return json(result);
}
