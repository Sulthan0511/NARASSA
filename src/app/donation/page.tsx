import { getDB } from "@/lib/db";
import DonationCard from "@/components/DonationCard";
import { EmptyState } from "@/components/ui";
import DonationFilter from "@/components/DonationFilter";

export const dynamic = "force-dynamic";
export const metadata = { title: "Program Donasi Online & Galang Dana Terpercaya" };

export default async function DonationPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const db = await getDB();
  let items = [...db.donations];

  if (sp.category && sp.category !== "Semua")
    items = items.filter((d) => d.category.toLowerCase() === sp.category!.toLowerCase());
  if (sp.q) {
    const q = sp.q.toLowerCase();
    items = items.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.organizer.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    );
  }
  if (sp.sort === "terbaru") items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  else if (sp.sort === "terdekat")
    items.sort((a, b) => +new Date(a.endDate) - +new Date(b.endDate));
  else if (sp.sort === "progress")
    items.sort((a, b) => b.collected / b.target - a.collected / a.target);
  else items.sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Program Donasi Online &amp; Galang Dana Terpercaya
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Salurkan kepedulian Anda secara terbuka dan 100% aman.
        </p>
      </div>

      <DonationFilter />

      {items.length === 0 ? (
        <EmptyState title="Tidak ada program donasi yang cocok" hint="Coba ubah kata kunci atau kategori." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => (
            <DonationCard key={d.id} item={d} />
          ))}
        </div>
      )}
    </div>
  );
}
