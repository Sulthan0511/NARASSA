# Folder `php/` — API Pendukung (OPSIONAL)

> **Baca dulu:** aplikasi web NARASSA (folder `src/`, Next.js) **sudah terhubung ke
> Supabase** lewat `src/lib/db.ts`. App **tidak membutuhkan file PHP ini**.
> Folder ini dibuat sebagai lapisan API alternatif untuk keperluan latihan,
> integrasi, atau uji koneksi database dari luar aplikasi.

## PENTING — apa yang ditempel ke Supabase?

| Yang Anda punya | Ditempel / dipakai di mana? |
|---|---|
| `supabase/schema.sql` | ✅ **Tempel di Supabase → SQL Editor → RUN** (membuat 15 tabel + fungsi) |
| `supabase/seed.sql` | ✅ **Tempel di Supabase → SQL Editor → RUN** (data demo) |
| Seluruh isi folder `php/` | ❌ **BUKAN untuk Supabase.** Supabase tidak menjalankan PHP. |

Supabase hanya menerima **SQL** (SQL Editor) dan menyediakan **API REST otomatis**
(PostgREST) yang dipakai aplikasi Next.js — tanpa menulis PHP.

## Daftar file

| File | Fungsi |
|---|---|
| `config.php` | Pengaturan kredensial Supabase (`$SUPABASE_URL`, `$SUPABASE_KEY`) + helper `supabase_request()` & `out()` untuk semua skrip. |
| `cek_koneksi.php` | Uji koneksi: mengecek kredensial, keterbacaan 15 tabel, dan jumlah baris data. |
| `api_register.php` | **POST** — simpan member baru ke tabel `users` (password di-hash bcrypt, kompatibel dengan login aplikasi). |
| `api_login.php` | **POST** — verifikasi email + password terhadap tabel `users`. |
| `api_aktivitas.php` | **GET** — daftar kegiatan relawan (opsional filter `?category=Lingkungan`). |

## Cara menjalankan (XAMPP / Laragon)

1. Ambil kredensial: Supabase **Dashboard → Project Settings → API**
   - `Project URL` → isi `$SUPABASE_URL` di `config.php`
   - `service_role` (secret) → isi `$SUPABASE_KEY` di `config.php`
2. Letakkan folder proyek di `htdocs` (XAMPP) atau `www` (Laragon), nyalakan Apache.
3. Buka:
   - `http://localhost/narassa/php/cek_koneksi.php` → harus `koneksi: true`
   - `http://localhost/narassa/php/api_aktivitas.php`
   - Uji POST (register/login) dengan Postman atau `curl`.

## Keamanan

- `service_role` key **bersifat rahasia** — jangan simpan di file yang dipublikasikan
  (gunakan `config.local.php` yang di-`.gitignore`, atau variabel environment).
- Jangan jalankan folder ini di hosting publik tanpa autentikasi; skrip ini menerima
  siapa saja yang bisa mengakses URL-nya.
- Untuk kebutuhan produksi, gunakan jalur resmi aplikasi (`/auth/register`, `/auth/login`)
  yang sudah memiliki session cookie & proteksi.
