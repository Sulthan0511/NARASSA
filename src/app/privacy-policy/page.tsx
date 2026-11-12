export const metadata = { title: "Kebijakan Privasi" };

const SECTIONS = [
  {
    t: "1. Data yang Kami Kumpulkan",
    b: "Kami mengumpulkan nama, email, nomor telepon, data profil relawan, serta riwayat donasi dan keikutsertaan kegiatan yang Anda berikan secara sukarela.",
  },
  {
    t: "2. Penggunaan Data",
    b: "Data digunakan untuk memproses donasi, verifikasi pendaftaran relawan, menerbitkan sertifikat, mengirim notifikasi program, dan meningkatkan kualitas layanan NARASSA.",
  },
  {
    t: "3. Perlindungan",
    b: "Kata sandi disimpan dalam bentuk ter-hash. Akses data internal dibatasi hanya untuk staf yang berwenang. Kami tidak menjual data pribadi Anda kepada pihak ketiga.",
  },
  {
    t: "4. Cookie & Sesi",
    b: "Kami menggunakan cookie sesi untuk mempertahankan status login Anda. Anda dapat menghapus cookie kapan saja melalui pengaturan peramban.",
  },
  {
    t: "5. Hak Pengguna",
    b: "Anda berhak meminta koreksi, penonaktifan, atau penghapusan data pribadi dengan menghubungi halo@narassa.id.",
  },
  {
    t: "6. Keamanan Transaksi",
    b: "Transaksi pembayaran diproses melalui penyedia pembayaran resmi. NARASSA tidak menyimpan nomor kartu atau kredensial perbankan Anda.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
      <h1 className="text-2xl font-black text-slate-900">Kebijakan Privasi</h1>
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
