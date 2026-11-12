/**
 * ============================================================================
 *  API PROGRAM DONASI (ADMIN) — hanya admin yang membuat program donasi.
 *  POST /api/admin/donations  -> menerbitkan program donasi baru
 *  (ubah/hapus: /api/admin/donations/[id])
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate, uid } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const b = await readBody<{
    title: string;
    category: string;
    organizer: string;
    target: number;
    endDate: string;
    description: string;
    image?: string;
    urgent?: boolean;
    verified?: boolean;
  }>(req);

  if (!b.title?.trim()) return error("Judul program wajib diisi.");
  const target = Number(b.target);
  if (!target || target < 100000) return error("Target dana minimal Rp100.000.");

  const created = await mutate((m) => {
    const d = {
      id: uid("dn-"),
      title: b.title.trim(),
      category: b.category || "Sosial",
      organizer: b.organizer?.trim() || "Tim Admin NARASSA",
      organizerAvatar: "",
      image:
        b.image?.trim() ||
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80",
      description: b.description?.trim() || "Program donasi terverifikasi NARASSA.",
      collected: 0,
      target,
      donorsCount: 0,
      endDate:
        b.endDate || new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
      verified: b.verified !== false,
      featured: false,
      urgent: !!b.urgent,
      createdAt: new Date().toISOString().split("T")[0],
    };
    m.donations.unshift(d);
    return d;
  });

  return json({ ok: true, donation: created });
}
