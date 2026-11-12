/**
 * ============================================================================
 *  API MANAJEMEN KEGIATAN (ADMIN)
 *  Dokumen "Jadwal NARASSA" fitur #19  &  MOM 4 November 2026 poin 6:
 *    "Admin dapat melakukan manajemen kegiatan / mengelola informasi kegiatan"
 *
 *  PATCH  /api/admin/activities/[id]   -> ubah informasi kegiatan
 *  DELETE /api/admin/activities/[id]   -> hapus kegiatan beserta pendaftarannya
 *
 *  Keduanya wajib admin (requireAdmin) dan menyimpan data lewat mutate()
 *  -> supabase.sync_collection() (lihat src/lib/db.ts).
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
    type?: string;
    location?: string;
    date?: string;
    deadline?: string;
    quota?: number;
    description?: string;
  }>(req);

  if (b.title !== undefined && !b.title?.trim()) return error("Judul kegiatan wajib diisi.");
  if (b.type !== undefined && !["On-site", "Remote"].includes(b.type))
    return error("Mode kegiatan tidak valid.");

  const ok = await mutate((m) => {
    const act = m.activities.find((a) => a.id === id);
    if (!act) return false;

    const oldTitle = act.title;

    if (b.title !== undefined) act.title = b.title.trim();
    if (b.category !== undefined) act.category = b.category;
    if (b.type !== undefined) act.type = b.type as "On-site" | "Remote";
    if (b.location !== undefined) act.location = b.location;
    if (b.date !== undefined) act.date = b.date;
    if (b.deadline !== undefined) act.deadline = b.deadline;
    if (b.description !== undefined) act.description = b.description;
    if (b.quota !== undefined) {
      const q = Number(b.quota);
      // kuota tidak boleh lebih kecil dari jumlah relawan yang sudah terdaftar
      act.quota = Number.isFinite(q) ? Math.max(q, act.registered, 1) : act.quota;
    }

    // judul berubah -> samakan juga pada daftar kandidat & sertifikat terkait
    if (act.title !== oldTitle) {
      m.applications.forEach((a) => {
        if (a.activityId === act.id) a.activityTitle = act.title;
      });
      m.certificates.forEach((c) => {
        if (c.activityTitle === oldTitle) c.activityTitle = act.title;
      });
    }
    return true;
  });

  if (!ok) return error("Kegiatan tidak ditemukan.", 404);
  return json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const { id } = await ctx.params;
  const ok = await mutate((m) => {
    const before = m.activities.length;
    m.activities = m.activities.filter((a) => a.id !== id);
    if (m.activities.length === before) return false;
    // rapikan pendaftar kegiatan yang dihapus
    m.applications = m.applications.filter((a) => a.activityId !== id);
    return true;
  });

  if (!ok) return error("Kegiatan tidak ditemukan.", 404);
  return json({ ok: true });
}
