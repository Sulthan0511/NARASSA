import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);
  const { id } = await ctx.params;
  const b = await readBody<{ status?: string }>(req);
  if (!b.status || !["Diterima", "Ditolak", "Menunggu"].includes(b.status))
    return error("Status tidak valid.");

  const ok = await mutate((m) => {
    const app = m.applications.find((a) => a.id === id);
    if (!app) return false;
    app.status = b.status as typeof app.status;
    m.notifications.unshift({
      id: "nt-" + Date.now().toString(36),
      userId: app.userId,
      title: b.status === "Diterima" ? "Pendaftaran diterima" : b.status === "Ditolak" ? "Pendaftaran ditolak" : "Status diperbarui",
      body: `Status pendaftaran Anda untuk "${app.activityTitle}": ${b.status}.`,
      type: "relawan",
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
    });
    return true;
  });
  if (!ok) return error("Pendaftar tidak ditemukan.", 404);
  return json({ ok: true });
}
