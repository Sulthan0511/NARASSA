"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, Lock } from "lucide-react";
import { api, toast } from "@/lib/client";

export default function ForgotPage() {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const run = async (fn: () => Promise<any>, successMsg?: string) => {
    setBusy(true);
    try {
      const res = await fn();
      if (successMsg) toast(successMsg);
      return res;
    } catch (err: any) {
      toast(err.message, "error");
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const requestOtp = async () => {
    const res = await run(
      () => api<any>("/api/auth/otp", { body: { action: "request", contact } }),
      "OTP terkirim."
    );
    if (res.demoOtp) setDemoOtp(res.demoOtp);
    setStep(2);
  };

  const verifyOtp = async () => {
    await run(
      () => api("/api/auth/otp", { body: { action: "verify", contact, code } }),
      "OTP terverifikasi."
    );
    setStep(3);
  };

  const reset = async () => {
    await run(
      () => api("/api/auth/otp", { body: { action: "reset", contact, code, password } }),
      "Password baru berhasil dibuat!"
    );
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-black text-slate-900 text-lg">Reset Password (OTP)</h1>
          <p className="text-xs text-slate-500">
            Langkah <strong>{step}</strong> dari 3
          </p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-brand" : "bg-slate-200"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">Masukkan Email/No HP untuk menerima OTP:</p>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="0812... / email@..."
              className="w-full p-2.5 border rounded-lg"
            />
            <button
              onClick={requestOtp}
              disabled={busy || !contact}
              className="w-full py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
            >
              {busy ? "Mengirim..." : "Kirim OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">
              Masukkan OTP 6-digit
              {demoOtp && (
                <>
                  {" "}
                  (mode demo: <strong className="text-brand-dark font-mono">{demoOtp}</strong>)
                </>
              )}
              :
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="123456"
              className="w-full p-2.5 border rounded-lg text-center font-mono font-bold text-lg tracking-widest"
            />
            <button
              onClick={verifyOtp}
              disabled={busy || code.length !== 6}
              className="w-full py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
            >
              {busy ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-400 font-bold py-1">
              ← Ganti kontak
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-500">Masukkan password baru Anda:</p>
            <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-brand">
              <Lock className="w-4 h-4 text-slate-400 ml-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password baru (min. 6)"
                className="w-full p-2.5 focus:outline-none bg-transparent"
              />
            </div>
            <button
              onClick={reset}
              disabled={busy || password.length < 6}
              className="w-full py-2.5 bg-brand text-white font-bold rounded-lg disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> {busy ? "Menyimpan..." : "Simpan Password"}
              </span>
            </button>
          </div>
        )}

        <p className="text-xs text-center text-slate-500">
          Ingat password?{" "}
          <Link href="/auth/login" className="text-brand-dark font-bold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
