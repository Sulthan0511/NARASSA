import { error, json, readBody } from "@/lib/api";
import { mutate, uid } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);
  const b = await readBody<{
    title: string;
    category: string;
    location: string;
    type: string;
    date: string;
    deadline: string;
    quota: number;
    description: string;
    image?: string;
  }>(req);
  if (!b.title?.trim()) return error("Judul kegiatan wajib diisi.");

  const created = await mutate((m) => {
    const act = {
      id: uid("ac-"),
      title: b.title.trim(),
      category: b.category || "Sosial",
      location: b.location || "Jakarta",
      type: (b.type === "Remote" ? "Remote" : "On-site") as "On-site" | "Remote",
      organizer: "Tim Admin NARASSA",
      verified: true,
      urgent: false,
      date: b.date || new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      deadline: b.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      quota: Number(b.quota) || 20,
      registered: 0,
      image: b.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
      requirements: ["Minimal 18 tahun", "Komitmen hadir tepat waktu"],
      perks: ["E-Sertifikat Resmi", "Konsumsi", "ID Card Relawan"],
      description: b.description || "Program relawan baru yang dipublikasikan administrator.",
      createdAt: new Date().toISOString().split("T")[0],
    };
    m.activities.unshift(act);
    return act;
  });
  return json({ ok: true, activity: created });
}
