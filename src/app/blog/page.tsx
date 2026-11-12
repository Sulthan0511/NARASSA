import Link from "next/link";
import { getDB } from "@/lib/db";
import { formatDateId } from "@/lib/format";
import { EmptyState } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Warta Lingkungan" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDB();

  const rawCats = Array.from(new Set(db.blog.map((p) => p.category)));
  const categories = ["Semua", ...rawCats];
  const active = sp.category && sp.category !== "Semua" ? sp.category : "Semua";
  const posts = active === "Semua" ? db.blog : db.blog.filter((p) => p.category === active);

  const chipCls = (on: boolean) =>
    `px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
      on
        ? "bg-brand text-white shadow-xs"
        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Warta Lingkungan</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Kabar ringkas, data riset dan pembaruan ekologi terkini untuk aksi relawan.
          </p>
        </div>
        <div className="-mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto">
          <div className="flex gap-2 w-max lg:w-auto lg:flex-wrap lg:justify-end">
            {categories.map((c) => (
              <Link key={c} href={c === "Semua" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`} className={chipCls(active === c)}>
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
        <h2 className="text-base sm:text-lg font-black text-slate-900">Berita Terpilih</h2>
        <span className="text-xs font-bold text-brand-dark whitespace-nowrap">
          {posts.length} Laporan Terbaru
        </span>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Belum ada berita pada kategori ini"
          hint="Pilih kategori lainnya."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group flex flex-col"
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="w-full h-44 sm:h-48 object-cover" />
                <span className="absolute top-3 left-3 text-[10px] font-extrabold text-white bg-brand/90 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {p.category}
                </span>
              </div>
              <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 font-semibold">
                  <span>{formatDateId(p.createdAt)}</span>
                  <span className="truncate text-slate-500">{p.author}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-dark">
                  {p.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {p.excerpt}
                </p>
                <span className="mt-auto pt-2.5 border-t border-slate-100 inline-flex items-center gap-1 text-xs font-bold text-brand-dark">
                  Baca <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
