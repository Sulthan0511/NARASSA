/**
 * ============================================================================
 *  API ABSENSI RELAWAN
 *
 *  POST /api/attendance   body: { activityId, code }
 *    - code adalah isi QR absensi yang dibuat admin
 *      (payload QR: NARASSA:<activityId>:<code>, lihat AdminPanel -> QR Absen)
 *    - divalidasi: kegiatan ada, punya kode, kode harus COCOK
 *    - satu member hanya bisa absen sekali per kegiatan
 *    - data kehadiran langsung terlihat admin di modal "QR Absen" kegiatan itu
 *
 *  GET  /api/attendance   -> riwayat kehadiran milik member yang login
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate, uid } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return error("Silakan login untuk absensi.", 401);

  const b = await readBody<{ activityId?: string; code?: string }>(req);
  const activityId = (b.activityId || "").trim();
  const code = (b.code || "").trim();

  if (!activityId) return error("Pilih kegiatan yang akan diabsen.");
  if (!code) return error("Kode absen dari QR belum dimasukkan.");

  const result = await mutate((m) => {
    const act = m.activities.find((a) => a.id === activityId);
    if (!act) return { fail: "Kegiatan tidak ditemukan." } as const;
    if (!act.absenCode)
      return { fail: "Kegiatan ini belum memiliki kode absen (dibuat oleh admin)." } as const;
    if (act.absenCode.toUpperCase() !== code.toUpperCase())
      return { fail: "Kode absen tidak sesuai dengan kegiatan ini." } as const;

    const already = m.attendance.find(
      (a) => a.userId === user.id && a.activityId === act.id
    );
    if (already)
      return { fail: `Anda sudah absen untuk kegiatan "${act.title}".` } as const;

    const now = new Date();
    m.attendance.unshift({
      id: uid("at-"),
      userId: user.id,
      activityId: act.id,
      checkInAt: now.toISOString(),
    });
    m.notifications.unshift({
      id: uid("nt-"),
      userId: user.id,
      title: "Kehadiran tercatat",
      body: `Absensi Anda untuk "${act.title}" berhasil dicatat dan diterima panitia.`,
      type: "relawan",
      read: false,
      createdAt: now.toISOString().split("T")[0],
    });
    return { ok: true as const, at: now.toISOString(), title: act.title };
  });

  if ("fail" in result) return error(result.fail as string);
  return json(result);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return error("Silakan login.", 401);
  const { getDB } = await import("@/lib/db");
  const db = await getDB();
  return json({ items: db.attendance.filter((a) => a.userId === user.id) });
}
