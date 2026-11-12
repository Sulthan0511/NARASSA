"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, Mail } from "lucide-react";
import { api, toast } from "@/lib/client";

function LoginInner() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api<any>("/api/auth/login", { body: { identifier, password } });
      toast(`Selamat datang, ${res.user.name}!`);
      router.push(res.user.role === "admin" && next === "/" ? "/admin" : next);
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 fill-white text-white" />
          </div>
          <h1 className="font-black text-slate-900 text-lg">Masuk Akun NARASSA</h1>
          <p className="text-xs text-slate-500">Donasi &amp; relawan dalam satu akun.</p>
        </div>

        <form onSubmit={submit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700">Email / No HP</label>
            <div className="flex items-center border rounded-lg mt-1 focus-within:ring-2 focus-within:ring-brand">
              <Mail className="w-4 h-4 text-slate-400 ml-2.5" />
              <input
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@domain.com / 0812..."
                className="w-full p-2.5 focus:outline-none bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700">Password</label>
            <div className="flex items-center border rounded-lg mt-1 focus-within:ring-2 focus-within:ring-brand">
              <Lock className="w-4 h-4 text-slate-400 ml-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 focus:outline-none bg-transparent"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link href="/auth/forgot" className="text-brand-dark font-bold text-[11px]">
              Lupa Password (OTP)?
            </Link>
            <span className="text-[10px] text-slate-400">demo: relawan@narassa.id / demo123</span>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-lg disabled:opacity-60"
          >
            {busy ? "Memproses..." : "Masuk Sesi"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-brand-dark font-bold">
            Daftar Relawan
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
