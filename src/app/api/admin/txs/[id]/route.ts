/**
 * ============================================================================
 *  API VERIFIKASI DONASI OLEH ADMIN
 *
 *  PATCH /api/admin/txs/[id]   body: { action: "approve" | "reject" }
 *
 *  approve -> transaksi status "Dikonfirmasi", dana MASUK ke jumlah terkumpul
 *             (collected += amount, donorsCount += 1), donor diberi notifikasi.
 *  reject  -> transaksi status "Ditolak", dana TIDAK masuk, donor diberi
 *             notifikasi.
 *
 *  Dipanggil dari tab "Verifikasi Donasi" pada panel /admin.
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return error("Akses admin diperlukan.", 403);

  const { id } = await ctx.params;
  const b = await readBody<{ action: "approve" | "reject" }>(req);
  if (b.action !== "approve" && b.action !== "reject")
    return error("Aksi tidak dikenal (approve/reject).");

  const result = await mutate((m) => {
    const tx = m.txs.find((t) => t.id === id);
    if (!tx) return { fail: "Transaksi tidak ditemukan." } as const;
    if (tx.status === "Dikonfirmasi" && b.action === "approve")
      return { fail: "Transaksi ini sudah pernah dikonfirmasi." } as const;

    const campaign = m.donations.find((d) => d.id === tx.donationId);

    if (b.action === "approve") {
      tx.status = "Dikonfirmasi";
      if (campaign) {
        campaign.collected += tx.amount;
        campaign.donorsCount += 1;
      }
    } else {
      tx.status = "Ditolak";
    }

    if (tx.userId) {
      m.notifications.unshift({
        id: "nt-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        userId: tx.userId,
        title: b.action === "approve" ? "Donasi dikonfirmasi" : "Donasi ditolak",
        body:
          b.action === "approve"
            ? `Donasi ${formatRupiah(tx.amount)} untuk "${campaign?.title ?? "program"}" telah dikonfirmasi admin. Terima kasih!`
            : `Donasi ${formatRupiah(tx.amount)} untuk "${campaign?.title ?? "program"}" ditolak oleh admin (bukti tidak sesuai). Silakan ulangi dengan bukti yang benar.`,
        type: "donasi",
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    return { ok: true as const, status: tx.status };
  });

  if ("fail" in result) return error(result.fail as string);
  return json(result);
}
