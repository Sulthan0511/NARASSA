export const metadata = { title: "Syarat & Ketentuan" };

const SECTIONS = [
  {
    t: "1. Penerimaan Syarat",
    b: "Dengan mengakses dan menggunakan platform NARASSA, Anda menyetujui syarat dan ketentuan ini. Jika tidak setuju, mohon tidak menggunakan layanan kami.",
  },
  {
    t: "2. Akun Pengguna",
    b: "Anda bertanggung jawab menjaga kerahasiaan kredensial login. Informasi yang didaftarkan harus benar dan dapat dipertanggungjawabkan. Kami berhak menonaktifkan akun yang melanggar ketentuan.",
  },
  {
    t: "3. Donasi & Pembayaran",
    b: "Donasi yang telah dikonfirmasi bersifat final dan tidak dapat ditarik kembali kecuali terdapat kekeliruan teknis yang dapat dibuktikan. Pembayaran diproses melalui kanal resmi (QRIS, virtual account, transfer) yang bekerja sama dengan NARASSA.",
  },
  {
    t: "4. Penggalangan Dana",
    b: "Penggalang wajib menyampaikan informasi program yang benar, menggunakan dana sesuai tujuan yang dinyatakan, dan memberikan laporan penyaluran. NARASSA dapat menolak atau menurunkan program yang melanggar kebijakan.",
  },
  {
    t: "5. Kegiatan Relawan",
    b: "Pendaftar relawan wajib hadir tepat waktu atau memberi kabar apabila berhalangan. Panitia berhak menolak pendaftaran yang tidak memenuhi syarat kegiatan.",
  },
  {
    t: "6. Batas Tanggung Jawab",
    b: "NARASSA bertindak sebagai perantara teknis antara donatur/relawan dengan penggalang. Kerugian yang timbul akibat penyalahgunaan dana oleh penggalang akan ditindaklanjuti sesuai ketentuan hukum yang berlaku.",
  },
  {
    t: "7. Perubahan Ketentuan",
    b: "Kami dapat memperbarui syarat dan ketentuan sewaktu-waktu. Penggunaan lanjutan setelah perubahan berarti Anda menyetujui versi terbaru.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <h1 className="text-2xl font-black text-slate-900">Syarat &amp; Ketentuan</h1>
      <p className="text-xs text-slate-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}</p>
      {SECTIONS.map((s) => (
        <section key={s.t} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <h2 className="font-extrabold text-sm text-slate-900">{s.t}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{s.b}</p>
        </section>
      ))}
    </div>
  );
}
