/**
 * ============================================================================
 *  API MANAJEMEN SERTIFIKAT (ADMIN)
 *  Dokumen "Jadwal NARASSA" fitur #20  &  MOM 4 November 2026 poin 6:
 *    "Admin dapat melakukan manajemen sertifikat"
 *
 *  POST   /api/admin/certificates       -> terbitkan sertifikat (di route.ts)
 *  DELETE /api/admin/certificates/[id]  -> cabut/hapus sertifikat terbit
 *                                          (sertifikat langsung hilang dari
 *                                           halaman /certificates milik user)
 * ============================================================================
 */
import { error, json } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const { id } = await ctx.params;
  const ok = await mutate((m) => {
    const before = m.certificates.length;
    m.certificates = m.certificates.filter((c) => c.id !== id);
    return m.certificates.length !== before;
  });

  if (!ok) return error("Sertifikat tidak ditemukan.", 404);
  return json({ ok: true });
}
