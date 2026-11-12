import { getDB } from "@/lib/db";
import ActivityCard from "@/components/ActivityCard";
import { EmptyState } from "@/components/ui";
import ActivityFilter from "@/components/ActivityFilter";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cari Kegiatan Relawan" };

const CAT_ORDER = ["Semua", "Lingkungan", "Pendidikan", "Bencana", "Anak", "Lansia"];

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
    region?: string;
    time?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const db = await getDB();

  const regionOf = (loc: string) => {
    const parts = loc.split(",").map((s) => s.trim());
    return parts.length > 1 ? parts[parts.length - 1] : loc;
  };

  const rawCats = Array.from(new Set(db.activities.map((a) => a.category)));
  const categories = [
    ...CAT_ORDER.filter((c) => c === "Semua" || rawCats.includes(c)),
    ...rawCats.filter((c) => !CAT_ORDER.includes(c)),
  ];
  const regions = Array.from(
    new Set(db.activities.map((a) => regionOf(a.location)))
  ).sort((a, b) => a.localeCompare(b, "id"));

  let items = [...db.activities];

  if (sp.category && sp.category !== "Semua")
    items = items.filter((a) => a.category.toLowerCase() === sp.category!.toLowerCase());
  if (sp.type && sp.type !== "Semua") items = items.filter((a) => a.type === sp.type);
  if (sp.region && sp.region !== "Semua")
    items = items.filter((a) => regionOf(a.location) === sp.region);
  if (sp.time && sp.time !== "Semua") {
    const now = Date.now();
    items = items.filter((a) => {
      const diff = (+new Date(a.date + "T00:00:00") - now) / 86400000;
      if (sp.time === "lewat") return diff < 0;
      return diff >= 0 && diff <= Number(sp.time);
    });
  }
  if (sp.q) {
    const q = sp.q.toLowerCase();
    items = items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.organizer.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }

  if (sp.sort === "terdekat")
    items.sort((a, b) => +new Date(a.date) - +new Date(b.date));
  else items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Cari Kegiatan Relawan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Temukan dan ikuti aksi relawan berdampak sosial di seluruh Indonesia.
        </p>
      </div>

      <ActivityFilter count={items.length} categories={categories} regions={regions} />

      {items.length === 0 ? (
        <EmptyState
          title="Tidak ada kegiatan yang cocok"
          hint="Coba ubah kata kunci, kategori, atau filter lainnya."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((a) => (
            <ActivityCard key={a.id} item={a} />
          ))}
        </div>
      )}
    </div>
  );
}
