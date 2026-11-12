"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, User, Mail, Phone, Lock } from "lucide-react";
import { api, toast } from "@/lib/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api<any>("/api/auth/register", { body: form });
      toast(`Pendaftaran berhasil! Selamat datang, ${res.user.name}.`);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "flex items-center border rounded-lg mt-1 focus-within:ring-2 focus-within:ring-brand";
  const icon = "w-4 h-4 text-slate-400 ml-2.5";
  const input = "w-full p-2.5 focus:outline-none bg-transparent";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <h1 className="font-black text-slate-900 text-lg">Daftar Akun Baru</h1>
          <p className="text-xs text-slate-500">Satu akun untuk donasi &amp; kegiatan relawan.</p>
        </div>

        <form onSubmit={submit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Nama Lengkap</label>
            <div className={field}>
              <User className={icon} />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama Anda"
                className={input}
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700">Email</label>
            <div className={field}>
              <Mail className={icon} />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@domain.com"
                className={input}
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700">No. HP / WA</label>
            <div className={field}>
              <Phone className={icon} />
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0812..."
                className={input}
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700">Password</label>
            <div className={field}>
              <Lock className={icon} />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimal 6 karakter"
                className={input}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-lg disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Daftar Relawan"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-brand-dark font-bold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
