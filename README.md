# NARASSA — Platform Donasi & Relawan (Fullstack)

Web platform sosial NARASSA: pendaftaran relawan, kegiatan & kalender, absensi QR,
donasi, sertifikat, notifikasi, dan panel admin.

| Lapisan | Teknologi | Biaya |
|---|---|---|
| Frontend + API | **Next.js 15** (App Router) + React 19 + Tailwind CSS v4 | Gratis |
| Database + API DB | **Supabase** (Postgres + PostgREST) | **Free tier** |
| Kode sumber | **GitHub** | Gratis |
| Hosting / Deploy | **Vercel** (Hobby) | Gratis |

> **Tidak ada satu pun komponen berbayar.** Tidak ada Supabase Auth berbayar,
> tidak ada Storage berbayar, tidak ada paket Vercel berbayar — hanya layanan
> free tier / versi gratis.

---

## 1. Peta fitur dokumen → kode

Acuan: **`skill/Jadwal NARASSA - Company (1).pdf`** (daftar 20 fitur),
**`skill/MOM_NARASSA 4 November 2026 (1).docx`** (keputusan rapat),
**`skill/UI - NARASSA.pdf`** (referensi tampilan / UI WAJIB).

| # | Fitur (dokumen Jadwal & MOM) | Kode |
|---|---|---|
| 1 | Login (email + password) | `src/app/auth/login/page.tsx`, `src/app/api/auth/login/route.ts` |
| 2 | Sign Up (email / no. HP + password) | `src/app/auth/register/page.tsx`, `src/app/api/auth/register/route.ts` |
| 3 | Logout + session expired | `src/app/api/auth/logout/route.ts`, `src/lib/auth.ts` (exp 7 hari) |
| 4 | Forgot Password + OTP (email/no. HP) | `src/app/auth/forgot/page.tsx`, `src/app/api/auth/otp/route.ts` |
| 5 | Change Password → logout otomatis & relogin | `src/components/ProfileTabs.tsx`, `src/app/api/auth/change-password/route.ts` |
| 6 | (dokumen) Register "data kontrak perusahaan" + balasan verifikasi admin | **Tidak dipakai — sesuai arahan terbaru**: member hanya daftar, login, ikut kegiatan, berdonasi, terima sertifikat, dan absen. Tidak ada fitur galang dana/supporter/donasi-rutin/CSR. |
| 7 | Dashboard: informasi utama | `src/app/page.tsx` (beranda) |
| 7b/7c | Kegiatan & donasi deadline terdekat | `src/app/page.tsx` — section **Kegiatan Volunteer** (urut tanggal) & **Donasi Berdampak Nyata** (urut `endDate` + badge "Sisa N Hari") |
| 8 | Absensi volunteer via QR Code (QR dibuat admin, discan member) | Admin: tab **Kegiatan Relawan → QR Absen** (`api/admin/activities/[id]/absen`); Member: `src/app/attendance/page.tsx` + `AttendanceTabs.tsx` (kamera `html5-qrcode` / input kode) → `src/app/api/attendance/route.ts`; kehadiran tampil langsung di panel QR Absen admin |
| 9 | Notifikasi | `src/app/notification/page.tsx`, `src/app/api/notifications/route.ts`, lonceng di `src/components/Header.tsx` |
| 10 | UI/UX (simpel, clean, elegan — sesuai PDF UI) | Seluruh `src/app/**` & `src/components/**` (acuan: `skill/UI - NARASSA.pdf`) |
| 11 | Navbar / menu navigasi | `src/components/Header.tsx`, `src/components/MobileNav.tsx`, `src/components/Footer.tsx` |
| 12 | Kalender kegiatan | `src/app/calendar/page.tsx`, `src/components/CalendarView.tsx` |
| 13 | Candidate (daftar + info kandidat relawan) | `src/app/api/activities/[id]/register/route.ts`, tab **Kandidat Relawan** di `src/components/AdminPanel.tsx` |
| 14 | Filter kegiatan | `src/components/ActivityFilter.tsx`, `src/app/activity/page.tsx` |
| 15 | Kegiatan (daftar, detail, deadline, highlight) | `src/app/activity/page.tsx`, `src/app/activity/[id]/page.tsx`, `src/components/ActivityCard.tsx` |
| 16 | Pendaftaran volunteer | `src/components/RegisterButton.tsx` |
| 17 | Donasi (dana terkumpul, deadline, hari/tanggal/jam, **bukti transfer diverifikasi admin**) | `src/app/donation/[id]/page.tsx` (panel Hari/Tanggal/Pukul + rekening tujuan + unggah bukti), `api/donations/[id]/donate` (status *Menunggu Verifikasi*), tab **Verifikasi Donasi** + `api/admin/txs/[id]` (Setujui/Tolak) |
| 18 | Sertifikat untuk relawan | `src/app/certificates/page.tsx`, `src/components/CertificatePreview.tsx` |
| 19b | **Manajemen program donasi (Admin)**: tambah, ubah, hapus (member TIDAK bisa membuat program) | tab **Program Donasi** di `AdminPanel.tsx`, `api/admin/donations` (POST) & `api/admin/donations/[id]` (PATCH/DELETE) |
| 19 | **Manajemen kegiatan (Admin)**: tambah, ubah, hapus | `src/app/admin/page.tsx`, tab **Kegiatan Relawan** di `AdminPanel.tsx`, `src/app/api/admin/activities/route.ts` (POST) & `src/app/api/admin/activities/[id]/route.ts` (PATCH/DELETE) |
| 20 | **Manajemen sertifikat (Admin)**: terbitkan & cabut | Tab **Terbitkan Sertifikat** di `AdminPanel.tsx`, `src/app/api/admin/certificates/route.ts` (POST) & `src/app/api/admin/certificates/[id]/route.ts` (DELETE) |

---

## 2. Struktur folder penting

```
narassa/
├── supabase/
│   ├── schema.sql      ← DITEMPEL ke Supabase SQL Editor (15 tabel + RLS + fungsi)
│   └── seed.sql        ← DITEMPEL ke Supabase SQL Editor (data demo + akun demo)
├── php/                ← API PHP pendukung/opsional (BUKAN untuk Supabase) — lihat php/README.md
├── scripts/
│   └── gen-seed-sql.ts ← pembuat ulang seed.sql: node scripts/gen-seed-sql.ts > supabase/seed.sql
├── src/lib/db.ts       ← SATU-SATUNYA pintu data (adapter Supabase / lokal)
├── src/lib/auth.ts     ← session cookie + bcrypt
└── data/db.json        ← cache lokal mode offline (tidak ikut ter-commit)
```

---

## 3. LANGKAH A — Setup Supabase (gratis)

1. Buka **https://supabase.com** → **Sign in** (bisa pakai GitHub) → **New project**
   → pilih plan **Free** → beri nama (mis. `narassa`) → simpan *Database password*.
2. Tunggu project selesai dibuat (~1–2 menit).
3. Menu kiri → **SQL Editor** → **New query** → **tempel seluruh isi
   `supabase/schema.sql`** → klik **RUN**.
   (Membuat 15 tabel, mengaktifkan Row Level Security, dan fungsi `sync_collection`.)
4. **New query lagi** → **tempel seluruh isi `supabase/seed.sql`** → **RUN**.
   (Mengisi data demo + akun demo.)
5. Ambil kredensial: menu kiri **Project Settings → API**:
   - **Project URL** → format `https://xxxxxxxx.supabase.co`
   - **service_role** (secret) → `eyJhbGciOi...`
   > Gunakan **service_role**, *bukan* anon key — aplikasi memakai service role
   > dari server, dan RLS memblokir akses anon.

---

## 4. LANGKAH B — Jalankan di komputer (lokal)

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
# isi .env.local: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET
npm run dev                     # buka http://localhost:3000
```

- **Tanpa `.env.local`** aplikasi tetap jalan dalam **mode lokal**
  (data dibaca/ditulis ke `data/db.json`) — berguna untuk uji UI tanpa internet.
- **Dengan `.env.local`** aplikasi memakai **Supabase** (mode yang dipakai di Vercel).

---

## 5. LANGKAH C — Push ke GitHub

```bash
git init
git add .
git commit -m "NARASSA: platform donasi & relawan (Next.js + Supabase)"
git branch -M main
git remote add origin https://github.com/USERNAME/narassa.git
git push -u origin main
```

`.env*`, `node_modules/`, `.next/`, dan `data/db.json` sudah masuk `.gitignore`
 sehingga **kunci tidak pernah ikut ter-commit**.

---

## 6. LANGKAH D — Deploy ke Vercel (gratis)

1. Buka **https://vercel.com** → **Sign in with GitHub** → **Add New → Project**
   → pilih repo `narassa` → **Import**.
2. Sebelum **Deploy**, isi **Environment Variables** (bisa juga via
   *Settings → Environment Variables*):

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | Project URL dari Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key dari Supabase |
   | `SESSION_SECRET` | teks acak (mis. hasil `openssl rand -hex 32`) |

3. Klik **Deploy**. Selesai — dapat URL produksi mis.
   `https://narassa.vercel.app`.
4. Update env kapan pun: *Settings → Environment Variables* → **Redeploy**.

---

## 7. Akun demo & uji cepat

| Peran | Email | Password |
|---|---|---|
| Admin | `admin@narassa.id` | `admin123` |
| Member | `relawan@narassa.id` | `demo123` |

Alur uji singkat:
1. **Login member** → lihat lonceng notifikasi & profil.
2. **Kegiatan** → filter → *Daftar* (muncul di admin → **Kandidat Relawan**).
3. **Kalender** → klik tanggal → *Unduh Briefing* / *Rute Maps*.
4. **Donasi** → pilih nominal & metode → lihat **nomor rekening tujuan** → transfer → **unggah bukti pembayaran** → status *Menunggu Verifikasi* (jumlah terkumpul BELUM naik).
5. **Absensi** → tab QR → scan/absen.
6. **Login admin** → `/admin`:
   - tab **Verifikasi Donasi** → lihat gambar bukti → *Setujui* (dana masuk ke jumlah
     terkumpul + notifikasi ke donor) atau *Tolak*.
   - tab **Program Donasi** → Tambah/Ubah/Hapus program (satu-satunya cara membuat program).
   - tab **Kegiatan Relawan** → *QR Absen* → buat kode → tunjukkan QR; daftar kehadiran
     peserta tampil langsung di modal itu.
   - tab **Pengaturan** → ubah nomor rekening/e-wallet tujuan donasi.
   - tab **Kandidat Relawan** (Setujui/Tolak) & **Terbitkan Sertifikat** (Terbitkan/Cabut).
7. **Sertifikat** → cek kode verifikasi di halaman user.

---

## 8. Dokumentasi di dalam kode

- `src/lib/db.ts` — penjelasan lengkap adapter data: dua mode (Supabase/lokal),
  cara `getDB()` & `mutate()` bekerja, alasan keamanan service role.
- `supabase/schema.sql` — komentar per tabel, tujuan RLS, dan cara kerja
  fungsi `sync_collection()`.
- `src/app/api/admin/activities/[id]/route.ts` & `certificates/[id]/route.ts`
  — komentar yang mengaitkan endpoint dengan nomor fitur dokumen.
- `php/README.md` — tujuan folder PHP dan apa yang boleh/bukan ditempel ke Supabase.

---

## 8b. Alur penting (sesuai arahan terbaru)

### Alur donasi — transfer lalu diverifikasi admin
1. Member memilih nominal + metode → modal menampilkan **nomor rekening tujuan**
   (dari tabel `settings` kunci `payment_accounts`, bisa diedit admin di
   `/admin` → tab **Pengaturan**).
2. Member transfer lalu **mengunggah bukti pembayaran** lewat website (otomatis
   dikompres JPEG sisi terpanjang 1000px, disimpan sebagai base64 di kolom
   `txs.bukti` — **gratis 100%, tanpa layanan storage tambahan**).
3. Transaksi dibuat berstatus **"Menunggu Verifikasi"**; `collected` dan
   `donorsCount` **BELUM** bertambah.
4. Admin → tab **Verifikasi Donasi** → memeriksa gambar bukti → **Setujui**
   (dana masuk + notifikasi ke donor) atau **Tolak** (tidak masuk + notifikasi).
5. Status tampil sebagai chip di *Rincian Dana* (detail donasi), *Riwayat Donasi*
   (profil), dan tab *Transaksi* admin.

### Alur absensi QR (hari pelaksanaan)
1. Admin → **Kegiatan Relawan → QR Absen** → *Buat Kode Absen* → QR berisi
   payload `NARASSA:<id>:<kode>` ditampilkan (kode juga bisa disalin).
2. Member pada hari-H → `/attendance` → **Pindai QR Kamera** (HP) atau
   **Input Kode Manual** → divalidasi di `src/app/api/attendance/route.ts`.
3. Kehadiran tersimpan di tabel `attendance` dan **langsung muncul di modal
   QR Absen milik admin** untuk kegiatan tersebut, plus notifikasi ke member.
   Satu member hanya bisa absen sekali per kegiatan.

### Fitur yang dihapus (sesuai arahan)
Halaman, API, link, dan tab admin berikut sudah **dihapus total**: Galang Dana
(`/fundraising`), Supporter (`/supporter`), Donasi Rutin (`/donasi-rutin`), dan
CSR (`/csr`). Member hanya: daftar, login, ikut kegiatan, berdonasi, menerima
sertifikat, dan absen. Admin membuat semua kegiatan & program donasi.

---

## 9. Catatan free tier & troubleshooting

| Masalah | Solusi |
|---|---|
| Project Supabase **pause** setelah ~7 hari tidak ada aktivitas | Buka Dashboard → klik **Restore** (tetap gratis). |
| `Gagal membaca tabel ... dari Supabase` | Pastikan `schema.sql` sudah RUN dan env `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` benar di Vercel, lalu **Redeploy**. |
| Data berubah tapi belum muncul (Vercel) | Cache baca hanya 2 detik; tunggu atau buka ulang halaman. |
| Gambar Unsplash tidak muncul | Butuh internet; ganti `image` di database bila perlu. |
| `npm run dev` jalan tapi deploy Vercel error | Cek log deploy → pastikan 3 env vars terisi. |
| Lupa isi env di Vercel | App akan jalan **mode lokal** (data tidak persisten di serverless) — *tidak* diinginkan untuk demo; isi env lalu redeploy. |

---

## 10. Perintah yang tersedia

```bash
npm run dev        # server pengembangan
npm run build      # build produksi
npm run start      # jalankan build produksi
npm run typecheck  # cek tipe TypeScript
node scripts/gen-seed-sql.ts > supabase/seed.sql   # buat ulang data seed
```
