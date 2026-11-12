import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Users, MapPin, Building2, Clock, ArrowRight } from "lucide-react";
import { getDB } from "@/lib/db";
import { formatRupiah, formatDateId, daysLeft } from "@/lib/format";
import DonateButton from "@/components/DonateButton";
import DonationTabs from "@/components/DonationTabs";
import ShareRow from "@/components/ShareRow";
import { DEFAULT_PAYMENT_ACCOUNTS } from "@/lib/seed";
import type { PaymentAccount } from "@/lib/types";
import { ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

const PAYMENTS = ["QRIS", "BCA", "MANDIRI", "BNI", "BRI", "GOPAY", "OVO", "SHOPEEPAY"];

export default async function DonationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDB();
  const item = db.donations.find((d) => d.id === id);
  if (!item) notFound();

  const pct = Math.min(100, Math.round((item.collected / item.target) * 100));
  const sisaHari = daysLeft(item.endDate);
  const txs = db.txs.filter((t) => t.donationId === item.id).slice(0, 8);
  const related = db.donations.filter((d) => d.id !== item.id);
  const campaignCount = db.donations.filter((d) => d.organizer === item.organizer).length;

  const endDate = new Date(item.endDate + "T00:00:00");
  const hariNama = endDate.toLocaleDateString("id-ID", { weekday: "long" });
  const tanggal = endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const lead = item.description.split(/(?<=\.)\s+/)[0] || item.description;

  const feed = db.feed.slice(0, 3).map((f) => ({
    id: f.id,
    title: f.title,
    body: f.body,
    date: formatDateId(f.createdAt),
    tag: f.tag,
  }));

  const txItems = txs.map((t) => ({
    id: t.id,
    name: t.anon ? "Donatur Anonim" : t.donorName,
    meta: `${formatDateId(t.createdAt)} · ${t.method}${t.reference ? ` · Ref ${t.reference}` : ""}`,
    amount: formatRupiah(t.amount),
    status: t.status || "Dikonfirmasi",
  }));

  // rekening tujuan transfer (diatur admin lewat /admin -> Pengaturan)
  const paymentAccounts = (db.settings.find((s) => s.key === "payment_accounts")
    ?.value as PaymentAccount[] | undefined) ?? DEFAULT_PAYMENT_ACCOUNTS;

  const thumbs = related.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <header className="space-y-3 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/donation"
            className="text-[11px] font-bold text-brand-dark hover:underline flex items-center gap-1"
          >
            <span aria-hidden>←</span> Semua Penggalangan
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded uppercase">
            {item.category}
          </span>
          {item.verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded">
              <BadgeCheck className="w-3.5 h-3.5" /> Program Terverifikasi
            </span>
          )}
          {item.urgent && (
            <span className="text-[10px] font-bold text-white bg-red-600 px-2.5 py-1 rounded uppercase">
              Mendesak
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
          {item.title}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">{lead}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <aside className="lg:col-span-1 lg:order-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-2xs lg:sticky lg:top-24">
            <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-brand-light text-brand-dark flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 leading-snug">
                  {item.organizer}
                </p>
                <p className="text-[11px] text-slate-400">Penggalang resmi NARASSA</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Dana Terkumpul
                </p>
                <p className="text-2xl sm:text-3xl font-black text-brand-dark leading-tight">
                  {formatRupiah(item.collected)}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Target {formatRupiah(item.target)}</span>
                <span className="text-brand-dark">{pct}%</span>
              </div>
              <ProgressBar value={item.collected} max={item.target} />

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Users className="w-4 h-4 text-brand" /> {item.donorsCount.toLocaleString("id-ID")}{" "}
                Donasi
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold text-slate-700">
                  Batas Akhir Penutupan Donasi
                </p>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {sisaHari > 0 ? `Sisa ${sisaHari} Hari` : "Berakhir"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Hari", value: hariNama },
                  { label: "Tanggal", value: tanggal },
                  { label: "Pukul", value: "23:59 WIB" },
                ].map((b) => (
                  <div key={b.label} className="bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-1">
                    <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                      {b.label}
                    </p>
                    <p className="text-[11px] sm:text-xs font-extrabold text-slate-900 mt-0.5 break-words">
                      {b.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Penggalangan dana akan ditutup otomatis pada batas waktu di atas untuk proses
                rekapitulasi audit dan pencairan dana.
              </p>
            </div>

            <DonateButton
              item={item}
              accounts={paymentAccounts}
              variant="panel"
              className="w-full py-3 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-md transition"
            />

            <ShareRow title={item.title} />

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <p className="text-[11px] font-extrabold text-slate-700 text-center">
                Metode Pembayaran Instan &amp; Terverifikasi
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {PAYMENTS.map((p) => (
                  <span
                    key={p}
                    className="py-1.5 px-1 bg-slate-50 border border-slate-200 rounded-md text-[9px] font-black text-slate-600 text-center"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-2 lg:order-1 space-y-5">
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 sm:h-72 lg:h-80 object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent text-white text-[11px] font-bold px-4 py-3">
                Dokumentasi Program · {item.organizer}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {thumbs.map((t, i) => (
                <div key={t.id} className="relative rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt="" className="w-full h-28 sm:h-36 object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent text-white text-[10px] font-bold px-3 py-2 truncate">
                    {i === 0 ? "Dokumentasi Relawan" : "Penyaluran di Lapangan"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Penggalang Dana
              </p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    item.organizerAvatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  }
                  alt=""
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-900 truncate">{item.organizer}</p>
                  <p className="text-[11px] text-brand-dark font-bold flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Penggalang Dana Resmi Terdaftar
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                <strong className="text-slate-700">{campaignCount} Kampanye Sukses</strong> ·{" "}
                {item.category}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Penerima Manfaat Langsung
              </p>
              <div className="space-y-2">
                <p className="text-sm font-extrabold text-slate-900">{item.category}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-brand shrink-0" />
                  {sisaHari > 0 ? `${sisaHari} hari lagi penyaluran` : "Program telah berakhir"}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-brand shrink-0" /> Terdampak di seluruh
                  Indonesia
                </p>
              </div>
            </div>
          </div>

          <DonationTabs
            description={item.description}
            feed={feed}
            txs={txItems}
            collected={item.collected}
            target={item.target}
            donors={item.donorsCount}
            pct={pct}
            endDateLabel={tanggal}
          />

          <section className="bg-gradient-to-r from-brand-deep to-brand text-white rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <h2 className="text-lg sm:text-xl font-black leading-snug">
                Mari Jadi Jembatan Kebaikan
              </h2>
              <p className="text-xs text-white/85 line-clamp-2">{item.title}</p>
            </div>
            <DonateButton
              item={item}
              accounts={paymentAccounts}
              label={
                <>
                  Bantu Sekarang <ArrowRight className="w-4 h-4 inline -mt-0.5" />
                </>
              }
              className="px-6 py-3 bg-white text-brand-dark font-extrabold text-sm rounded-lg shadow-md hover:bg-slate-100 transition shrink-0 inline-flex items-center gap-2"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
