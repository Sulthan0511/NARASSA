import { getDB } from "@/lib/db";
import { formatDateId } from "@/lib/format";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kabar Terbaru NARASSA" };

export default async function FeedPage() {
  const db = await getDB();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Kabar Terbaru</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update penyaluran, komunitas, dan program dari lapangan.
        </p>
      </div>

      {db.feed.length === 0 ? (
        <EmptyState title="Belum ada kabar" />
      ) : (
        <div className="space-y-4">
          {db.feed.map((f) => (
            <article key={f.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="" className="w-full h-48 object-cover" />
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2 py-0.5 rounded uppercase">
                    {f.tag}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDateId(f.createdAt)}</span>
                </div>
                <h2 className="font-bold text-slate-900">{f.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
