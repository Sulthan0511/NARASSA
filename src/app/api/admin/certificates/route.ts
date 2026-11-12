import { error, json, readBody } from "@/lib/api";
import { getDB, mutate, uid } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);
  const b = await readBody<{ userId: string; activityTitle: string; hoursCount: number; role: string }>(req);
  const target = (await getDB()).users.find((u) => u.id === b.userId);
  if (!target) return error("Penerima sertifikat tidak ditemukan.");
  if (!b.activityTitle?.trim()) return error("Judul kegiatan wajib diisi.");

  const cert = await mutate((m) => {
    const c = {
      id: `CERT-NRS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: target.id,
      recipientName: target.name,
      activityTitle: b.activityTitle.trim(),
      organizer: admin.name,
      dateIssued: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      hoursCount: Number(b.hoursCount) || 8,
      role: b.role || "Relawan Terverifikasi",
      verificationCode: "NRS-VER-" + Math.floor(100000 + Math.random() * 900000),
    };
    m.certificates.unshift(c);
    m.notifications.unshift({
      id: uid("nt-"),
      userId: target.id,
      title: "E-Sertifikat terbit",
      body: `Sertifikat "${c.activityTitle}" telah diterbitkan dan siap diunduh.`,
      type: "sistem",
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
    });
    return c;
  });
  return json({ ok: true, certificate: cert });
}
