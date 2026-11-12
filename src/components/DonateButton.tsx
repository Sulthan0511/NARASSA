"use client";

import { useState } from "react";
import { X, ShieldCheck, CheckCircle2, Plus, Upload, Landmark, Clock3 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { api, toast } from "@/lib/client";
import type { Donation, PaymentAccount } from "@/lib/types";

const PRESETS = [10000, 25000, 50000, 100000, 250000, 500000];
const PANEL_PRESETS = [20000, 50000, 100000, 250000, 500000];

/** Kompres gambar bukti di browser (JPEG, sisi terpanjang 1000px) agar ringan
 *  dan aman disimpan sebagai base64 pada database. */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("File bukan gambar yang valid."));
      img.onload = () => {
        const max = 1000;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas tidak didukung."));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function DonateButton({
  item,
  className = "w-full py-2 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg transition",
  label = "Donasi Sekarang",
  variant = "button",
  accounts = [],
}: {
  item: Donation;
  className?: string;
  label?: React.ReactNode;
  variant?: "button" | "panel";
  accounts?: PaymentAccount[];
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(50000);
  const [selected, setSelected] = useState<number>(100000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState(accounts[0]?.method || "");
  const [anon, setAnon] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [bukti, setBukti] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const finalAmt = custom ? parseInt(custom) : amount;
  const account = accounts.find((a) => a.method === method) || accounts[0];

  const openModal = () => {
    if (!finalAmt || finalAmt < 1000) {
      toast("Minimal donasi Rp1.000.", "error");
      return;
    }
    if (custom) {
      const v = parseInt(custom);
      setAmount(isNaN(v) ? selected : v);
    } else {
      setAmount(selected);
    }
    if (!method && accounts[0]) setMethod(accounts[0].method);
    setDone(false);
    setOpen(true);
  };

  const pickBukti = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Bukti harus berupa gambar.", "error");
    try {
      const dataUrl = await compressImage(file);
      setBukti(dataUrl);
    } catch (e: any) {
      toast(e.message || "Gagal memproses gambar.", "error");
    }
  };

  const submit = async () => {
    if (!finalAmt || finalAmt < 1000) return toast("Minimal donasi Rp1.000.", "error");
    if (!bukti) return toast("Unggah dulu bukti pembayaran Anda.", "error");
    if (bukti.length > 1_500_000) return toast("Bukti terlalu besar, kompres ulang gambarnya.", "error");
    setBusy(true);
    try {
      await api(`/api/donations/${item.id}/donate`, {
        body: {
          amount: finalAmt,
          method: method || account?.method || "Transfer",
          anon,
          donorName: anon ? "Donatur Anonim" : name || "Donatur",
          note,
          bukti,
          reference,
        },
      });
      setDone(true);
      toast("Bukti pembayaran terkirim, menunggu verifikasi admin.");
    } catch (e: any) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const modal = open && (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand" /> Pembayaran Donasi
          </h3>
          <button onClick={() => setOpen(false)} aria-label="Tutup">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-600 font-bold line-clamp-2">{item.title}</p>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-brand mx-auto" />
            <p className="font-bold text-slate-900 text-sm">Bukti Pembayaran Terkirim</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Donasi Anda <strong className="text-brand-dark">{formatRupiah(finalAmt || 0)}</strong>{" "}
              sedang <strong>menunggu verifikasi admin</strong>. Jumlah terkumpul akan bertambah
              setelah admin memastikan uangnya sudah masuk.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition"
            >
              Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pilih Nominal Donasi:</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustom("");
                    }}
                    className={`py-2 rounded-lg text-[11px] font-bold border ${
                      amount === amt && !custom
                        ? "bg-brand text-white border-brand"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Nominal lainnya (Rp)"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="w-full p-2.5 mt-1 border rounded-lg text-xs"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Nama Donatur</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full p-2.5 mt-1 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700">Metode Pembayaran</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2.5 mt-1 border rounded-lg"
                >
                  {(accounts.length ? accounts : [{ method: "Transfer Bank", number: "-", owner: "NARASSA" }]).map(
                    (a) => (
                      <option key={a.method} value={a.method}>
                        {a.method}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* REKENING TUJUAN — sesuai alur: transfer dulu ke nomor ini */}
            <div className="bg-brand-soft border border-brand-light rounded-xl p-3.5 space-y-1.5">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-brand-dark uppercase tracking-wide">
                <Landmark className="w-3.5 h-3.5" /> Tujuan Transfer ({account?.method || "Transfer"})
              </p>
              <p className="text-base font-black text-slate-900 font-mono tracking-wide">
                {account?.number || "-"}
              </p>
              <p className="text-[11px] text-slate-600 font-semibold">a.n. {account?.owner || "NARASSA"}</p>
              <p className="text-xs font-bold text-brand-dark">
                Total yang harus ditransfer: {formatRupiah(finalAmt || 0)}
              </p>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-bold text-slate-700">Catatan (opsional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Doa / pesan untuk penerima"
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            {/* BUKTI PEMBAYARAN — wajib, diverifikasi admin */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Unggah Bukti Pembayaran <span className="text-red-600">*</span>
              </label>
              <label
                className={`flex items-center justify-center gap-2 border border-dashed rounded-xl py-4 px-3 text-xs font-bold cursor-pointer transition ${
                  bukti ? "border-brand bg-brand-soft text-brand-dark" : "border-slate-300 text-slate-500 hover:border-brand"
                }`}
              >
                <Upload className="w-4 h-4" />
                {bukti ? "Ganti gambar bukti" : "Pilih screenshot / foto struk transfer"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickBukti(e.target.files?.[0])}
                />
              </label>
              {bukti && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bukti} alt="Bukti pembayaran" className="w-16 h-16 object-cover rounded-lg border" />
                  <div className="text-[11px] text-slate-500">
                    <p className="font-bold text-slate-700">Bukti siap dikirim</p>
                    <button onClick={() => setBukti("")} className="text-red-600 font-bold hover:underline">
                      Hapus
                    </button>
                  </div>
                </div>
              )}
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="No. referensi transfer (opsional)"
                className="w-full p-2.5 border rounded-lg text-xs"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={anon}
                onChange={(e) => setAnon(e.target.checked)}
                className="accent-brand"
              />{" "}
              Sembunyikan nama saya (donatur anonim)
            </label>

            <div className="flex justify-between text-xs font-bold border-t pt-3">
              <span className="text-slate-500">Total Donasi</span>
              <span className="text-brand-dark">{formatRupiah(finalAmt || 0)}</span>
            </div>

            <button
              onClick={submit}
              disabled={busy}
              className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-lg disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              <Clock3 className="w-4 h-4" />
              {busy ? "Mengirim..." : "Kirim Bukti & Ajukan Verifikasi"}
            </button>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Transfer manual ke rekening di atas, lalu unggah buktinya. Donasi tercatat setelah
              diverifikasi admin.
            </p>
          </>
        )}
      </div>
    </div>
  );

  if (variant === "panel") {
    return (
      <div className="space-y-3">
        <p className="text-xs font-extrabold text-slate-900">Pilih Nominal Donasi Cepat</p>
        <div className="grid grid-cols-3 gap-2">
          {PANEL_PRESETS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelected(amt);
                setCustom("");
              }}
              className={`py-2.5 rounded-lg text-[11px] font-bold border transition ${
                selected === amt && !custom
                  ? "bg-brand text-white border-brand shadow-xs"
                  : "border-slate-200 text-slate-700 bg-white hover:border-brand hover:text-brand-dark"
              }`}
            >
              {formatRupiah(amt)}
            </button>
          ))}
          <button
            onClick={() => {
              setCustom("");
              setTimeout(() => document.getElementById("nominal-lainnya")?.focus(), 0);
            }}
            className="py-2.5 rounded-lg text-[11px] font-bold border border-dashed border-slate-300 text-slate-500 hover:border-brand hover:text-brand-dark transition inline-flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" /> Lainnya...
          </button>
        </div>
        <input
          id="nominal-lainnya"
          type="number"
          placeholder="Nominal lainnya (Rp)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button onClick={openModal} className={className}>
          {label}
        </button>
        {modal}
      </div>
    );
  }

  return (
    <>
      <button onClick={openModal} className={className}>
        {label}
      </button>
      {modal}
    </>
  );
}
