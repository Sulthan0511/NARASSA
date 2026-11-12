/**
 * ============================================================================
 *  API PROGRAM DONASI (ADMIN)
 *  PATCH  /api/admin/donations/[id] -> ubah informasi program
 *  DELETE /api/admin/donations/[id] -> hapus program (riwayat transaksi tetap)
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);
  const { id } = await ctx.params;
  const b = await readBody<{
    title?: string;
    category?: string;
    organizer?: string;
    target?: number;
    endDate?: string;
    description?: string;
    image?: string;
    urgent?: boolean;
    verified?: boolean;
  }>(req);

  const ok = await mutate((m) => {
    const d = m.donations.find((x) => x.id === id);
    if (!d) return false;
    if (b.title !== undefined && b.title.trim()) d.title = b.title.trim();
    if (b.category !== undefined) d.category = b.category;
    if (b.organizer !== undefined && b.organizer.trim()) d.organizer = b.organizer.trim();
    if (b.target !== undefined) {
      const t = Number(b.target);
      // target tidak boleh lebih kecil dari dana yang sudah terkumpul
      if (Number.isFinite(t) && t >= 100000) d.target = Math.max(t, d.collected);
    }
    if (b.endDate !== undefined) d.endDate = b.endDate;
    if (b.description !== undefined) d.description = b.description;
    if (b.image !== undefined && b.image.trim()) d.image = b.image.trim();
    if (b.urgent !== undefined) d.urgent = !!b.urgent;
    if (b.verified !== undefined) d.verified = !!b.verified;
    return true;
  });

  if (!ok) return error("Program donasi tidak ditemukan.", 404);
  return json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);
  const { id } = await ctx.params;

  const ok = await mutate((m) => {
    const before = m.donations.length;
    m.donations = m.donations.filter((x) => x.id !== id);
    return m.donations.length !== before;
  });

  if (!ok) return error("Program donasi tidak ditemukan.", 404);
  return json({ ok: true });
}
