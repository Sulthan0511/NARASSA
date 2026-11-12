/**
 * ============================================================================
 *  API DONASI MEMBER (alur VERIFIKASI ADMIN)
 *  1. Member memilih nominal + metode -> melihat nomor rekening tujuan (dari
 *     tabel settings "payment_accounts") -> transfer -> mengunggah BUKTI
 *     pembayaran lewat website.
 *  2. Endpoint ini HANYA membuat transaksi berstatus "Menunggu Verifikasi"
 *     (dengan bukti). Dana BELUM masuk ke jumlah terkumpul.
 *  3. Admin mengecek uang sudah masuk -> menekan Setujui di tab
 *     "Verifikasi Donasi" (PATCH /api/admin/txs/[id]) -> barulah
 *     collected/donorsCount bertambah dan donor menerima notifikasi.
 * ============================================================================
 */
import { error, json, readBody } from "@/lib/api";
import { mutate, uid } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

/** Batas aman bukti base64 (setelah kompres di browser, biasanya ~200-400 KB) */
const MAX_BUKTI_CHARS = 1_500_000;

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const user = await getSessionUser();
  const body = await readBody<{
    amount: number;
    method: string;
    anon: boolean;
    donorName: string;
    note: string;
    bukti: string;
    reference?: string;
  }>(req);

  const amount = Number(body.amount);
  if (!amount || amount < 1000) return error("Minimal donasi Rp1.000.");
  if (!body.donorName?.trim()) return error("Nama donatur wajib diisi.");
  if (!body.method?.trim()) return error("Metode pembayaran wajib dipilih.");

  // bukti pembayaran WAJIB — ini syarat verifikasi admin
  const bukti = (body.bukti || "").trim();
  if (!bukti.startsWith("data:image/")) {
    return error("Bukti pembayaran wajib diunggah (format gambar).");
  }
  if (bukti.length > MAX_BUKTI_CHARS) {
    return error("Ukuran bukti pembayaran terlalu besar. Maksimal ±1 MB setelah dikompres.");
  }

  const saved = await mutate((m) => {
    const campaign = m.donations.find((d) => d.id === id);
    if (!campaign) return null;

    const txId = uid("tx-");
    m.txs.unshift({
      id: txId,
      donationId: campaign.id,
      userId: user?.id ?? null,
      donorName: body.anon ? "Donatur Anonim" : body.donorName.trim(),
      amount,
      method: body.method.trim(),
      anon: !!body.anon,
      note: body.note || "",
      status: "Menunggu Verifikasi",
      bukti,
      reference: (body.reference || "").trim(),
      createdAt: new Date().toISOString().split("T")[0],
    });

    if (user) {
      m.notifications.unshift({
        id: uid("nt-"),
        userId: user.id,
        title: "Bukti donasi terkirim",
        body: `Donasi ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)} untuk "${campaign.title}" sedang menunggu verifikasi admin.`,
        type: "donasi",
        read: false,
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    return { txId };
  });

  if (!saved) return error("Program donasi tidak ditemukan.", 404);

  return json({
    ok: true,
    status: "Menunggu Verifikasi",
    txId: saved.txId,
    message:
      "Bukti pembayaran terkirim. Donasi akan tercatat setelah diverifikasi oleh admin NARASSA.",
  });
}
