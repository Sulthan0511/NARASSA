import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Leaf,
  UserPlus,
  HandHeart,
} from "lucide-react";
import { getDB } from "@/lib/db";
import { DEFAULT_PAYMENT_ACCOUNTS } from "@/lib/seed";
import { formatRupiah, formatDateId, daysLeft } from "@/lib/format";
import DonateButton from "@/components/DonateButton";
import HeroCarousel from "@/components/HeroCarousel";
import type { PaymentAccount } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Foto hero carousel (3 slide) sesuai contoh desain. */
const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
];

const CTA_FEATURES = [
  {
    title: "100+ Teman Aksi",
    desc: "Mitra & kegiatan aktif terus berjalan.",
  },
  {
    title: "E-Sertifikat Resmi",
    desc: "Bukti peranan relawan terverifikasi.",
  },
  {
    title: "Transparansi Laporan",
    desc: "Pantau dampak dan distribusi dana.",
  },
];

/** Badge sisa hari pendaftaran: merah ≤2 hari, amber ≤5 hari, hijau sisanya. */
function deadlineBadge(deadline: string) {
  const d = daysLeft(deadline);
  if (d <= 0) return { text: "Pendaftaran ditutup", cls: "bg-slate-700" };
  if (d <= 2) return { text: `🔴 Sisa ${d} hari`, cls: "bg-rose-600" };
  if (d <= 5) return { text: `🟡 Sisa ${d} hari`, cls: "bg-amber-600" };
  return { text: `🟢 Sisa ${d} hari`, cls: "bg-emerald-600" };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function HomePage() {
  const db = await getDB();

  const activities = [...db.activities]
    .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline))
    .slice(0, 3);

  const donations = [...db.donations]
    .sort((a, b) => +new Date(a.endDate) - +new Date(b.endDate))
    .slice(0, 2);

  const [featuredNews, ...restNews] = db.blog;
  const sideNews = restNews.slice(0, 2);

  const paymentAccounts =
    (db.settings.find((s) => s.key === "payment_accounts")?.value as PaymentAccount[]) ||
    DEFAULT_PAYMENT_ACCOUNTS;

  const sectionHead =
    "flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-slate-200/60 pb-3";
  const sectionTitle = "text-xl sm:text-2xl font-black text-slate-900 tracking-tight";
  const sectionSub = "text-xs text-slate-500 leading-relaxed max-w-xl";
  const sectionLink =
    "text-xs font-bold text-brand hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap";

  return (
    <div className="space-y-14 pb-16">
      {/* ============================= HERO ============================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-brand-light text-brand text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200/70 w-fit">
              <Leaf className="w-3.5 h-3.5" /> Platform Relawan &amp; Donasi Terpercaya
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Nyalakan Aksi,
              <br />
              <span className="text-brand">Rangkul Asa.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
              NARASSA menjadi jembatan bagi para relawan untuk berkontribusi dalam berbagai gerakan
              sosial, pelestarian lingkungan, dan pemberdayaan masyarakat melalui aksi yang
              transparan, berdampak, dan berkelanjutan.
            </p>
            <div>
              <Link
                href="/activity"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md"
              >
                Jelajahi Kegiatan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <HeroCarousel slides={HERO_SLIDES} />
        </div>
      </section>

      {/* =================== SECTION 1: KEGIATAN VOLUNTEER =================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className={sectionHead}>
          <div>
            <h2 className={sectionTitle}>Kegiatan Volunteer</h2>
            <p className={sectionSub}>
              Kuota volunteer terbatas! Yuk, segera bergabung dan jadi bagian dari aksi nyata
              bersama NARASSA.
            </p>
          </div>
          <Link href="/activity" className={sectionLink}>
            Lihat Semua Kegiatan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => {
            const percent = Math.min(100, Math.round((act.registered / Math.max(1, act.quota)) * 100));
            const badge = deadlineBadge(act.deadline);
            return (
              <article
                key={act.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <Link href={`/activity/${act.id}`} className="relative block h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-3 left-3 ${badge.cls} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow`}
                    >
                      {badge.text}
                    </span>
                  </Link>

                  <div className="p-5 space-y-3">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand shrink-0" /> {act.location}
                    </div>

                    <Link href={`/activity/${act.id}`}>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-brand">
                        {act.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[11px] font-medium text-slate-600">
                        <span>
                          Terkumpul {act.registered} / {act.quota} Relawan
                        </span>
                        <span className="font-bold text-brand">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    {formatDateId(act.date)}
                  </span>
                  <Link
                    href={`/activity/${act.id}`}
                    className="text-brand font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =================== SECTION 2: DONASI BERDAMPAK NYATA =================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className={sectionHead}>
          <div>
            <h2 className={sectionTitle}>Donasi Berdampak Nyata</h2>
            <p className={sectionSub}>
              100% donasi terdistribusi langsung dan dipantau berkala dengan laporan audit publik.
            </p>
          </div>
          <Link href="/donation" className={sectionLink}>
            Semua Penggalangan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {donations.map((don) => {
            const percent = Math.min(100, Math.round((don.collected / Math.max(1, don.target)) * 100));
            const tag = don.urgent
              ? { text: "🔥 Prioritas Tinggi", cls: "bg-amber-100 text-amber-800 border-amber-200" }
              : { text: "💧 Program Terpilih", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" };
            return (
              <article
                key={don.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                <Link href={`/donation/${don.id}`} className="sm:w-1/2 relative h-48 sm:h-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={don.image} alt={don.title} className="w-full h-full object-cover" />
                </Link>
                <div className="sm:w-1/2 p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span
                      className={`inline-block border text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tag.cls}`}
                    >
                      {tag.text}
                    </span>
                    <Link href={`/donation/${don.id}`}>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug hover:text-brand">
                        {don.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2">{don.description}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-brand">{formatRupiah(don.collected)}</span>
                        <span className="font-bold text-slate-700">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-brand h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        dari target {formatRupiah(don.target)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs pt-1">
                      <span className="text-slate-500 text-[11px] inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {don.donorsCount} Donatur
                      </span>
                      <DonateButton
                        item={don}
                        accounts={paymentAccounts}
                        label="Donasi Sekarang"
                        className="bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =================== SECTION 3: BERITA & ISU =================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className={sectionHead}>
          <div>
            <h2 className={sectionTitle}>Berita &amp; Isu Lingkungan Aktual</h2>
            <p className={sectionSub}>
              Laporan mendalam dari relawan dan penggiat ekologi di berbagai sudut nusantara.
            </p>
          </div>
          <Link href="/blog" className={sectionLink}>
            Baca Seluruh Artikel <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featuredNews && (
            <Link
              href={`/blog/${featuredNews.slug}`}
              className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-56 sm:h-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                  {featuredNews.category}
                </span>
                <div className="absolute bottom-3 left-4 text-white text-[11px] font-medium drop-shadow-md">
                  {formatDateId(featuredNews.createdAt)}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-brand uppercase">
                  {featuredNews.category}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
                  {featuredNews.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {featuredNews.excerpt}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-brand-light text-brand flex items-center justify-center font-bold text-xs">
                      {initials(featuredNews.author)}
                    </span>
                    <span className="font-semibold text-slate-700">{featuredNews.author}</span>
                  </div>
                  <span className="text-brand font-bold inline-flex items-center gap-1">
                    Baca Lengkap <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          <div className="space-y-6">
            {sideNews.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="block bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="h-32 rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-medium text-slate-400">
                    {p.category} • {formatDateId(p.createdAt)}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.excerpt}</p>
                </div>
                <span className="text-xs font-bold text-brand hover:underline block pt-1 inline-flex items-center gap-1">
                  Pelajari Program <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================== SECTION 4: CTA BANNER =================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark text-white rounded-3xl p-8 sm:p-10 shadow-xl grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <span className="inline-block bg-white/10 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/20">
              🌿 Langkahkan Peran Diri Anda Hari Ini
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Siap Nyalakan Semangat Kebaikan?
              <br />
              Bergabunglah Bersama NARASSA.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-xl">
              Baik sebagai relawan perorangan, inisiator komunitas kampus, maupun korporasi mitra
              dampak sosial—ruang aksi Anda terbuka luas di sini.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-brand-dark font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4" /> Daftar Jadi Relawan
              </Link>
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all border border-emerald-400/40"
              >
                <HandHeart className="w-4 h-4" /> Salurkan Donasi
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {CTA_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-white">{feat.title}</h4>
                  <p className="text-[10px] text-emerald-200/80">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
