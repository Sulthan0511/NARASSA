import { notFound } from "next/navigation";
import Link from "next/link";
import { getDB } from "@/lib/db";
import { formatDateId } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDB();
  const post = db.blog.find((b) => b.slug === slug);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="text-xs text-slate-400">
        <Link href="/" className="hover:text-brand-dark">
          Beranda
        </Link>{" "}
        /{" "}
        <Link href="/blog" className="hover:text-brand-dark">
          Artikel
        </Link>{" "}
        / <span className="text-slate-600 font-semibold">{post.title}</span>
      </nav>

      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt="" className="w-full h-56 sm:h-72 object-cover" />
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-brand-dark bg-brand-light px-2.5 py-1 rounded uppercase">
              {post.category}
            </span>
            <span className="text-[11px] text-slate-400">
              {post.author} · {formatDateId(post.createdAt)}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">{post.title}</h1>
          <div className="prose-sm space-y-4">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-slate-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>

      <div className="flex justify-between text-xs font-bold">
        <Link href="/blog" className="text-brand-dark hover:underline">
          ← Semua Artikel
        </Link>
        <Link href="/donation" className="text-brand-dark hover:underline">
          Mulai Berdonasi →
        </Link>
      </div>
    </div>
  );
}
