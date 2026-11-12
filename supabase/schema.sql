-- ============================================================================
--  NARASSA — SKEMA DATABASE SUPABASE  (free tier, tanpa biaya)
-- ============================================================================
--  CARA PAKAI:
--    1. Buka https://supabase.com  ->  New project  (pilih plan FREE).
--    2. Menu kiri: SQL Editor  ->  New query.
--    3. Tempel SELURUH isi file ini  ->  klik RUN.
--    4. Ulangi langkah yang sama untuk file `seed.sql` (data awal).
--
--  APA YANG ADA DI FILE INI:
--    a. 15 tabel yang sama persis dengan objek DB di src/lib/types.ts.
--    b. Row Level Security (RLS) DIAKTIFKAN tanpa policy -> client anon
--       (browser) TIDAK BISA membaca/menulis apa pun. Hanya aplikasi Next.js
--       di server yang memakai SERVICE ROLE KEY yang bisa mengakses data.
--    c. Fungsi `sync_collection()` — dipanggil aplikasi (src/lib/db.ts)
--       untuk menyimpan perubahan: UPSERT semua baris pada tabel tersebut
--       lalu menghapus baris yang sudah tidak ada, secara ATOMIK.
--
--  CATATAN TIPE:
--    - Semua kolom tanggal memakai TEXT (format YYYY-MM-DD / ISO) agar sama
--      persis dengan string yang dipakai kode TypeScript.
--    - Kolom camelCase dibuat "dengan tanda kutip" (mis. "donationId")
--      sehingga namanya sama dengan field pada kode aplikasi.
--    - Kolom ARRAY/OBJECT (requirements, perks) memakai JSONB.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PENGGUNA (login/registrasi member NARASSA)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id            text primary key,
  name          text not null,
  email         text not null unique,
  phone         text,
  "passwordHash" text not null,
  role          text not null default 'user',   -- 'user' | 'admin'
  avatar        text,
  city          text,
  bio           text,
  "volunteerId" text,
  "createdAt"   text
);

-- ---------------------------------------------------------------------------
-- 2. PROGRAM DONASI
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id               text primary key,
  title            text not null,
  category         text,
  organizer        text,
  "organizerAvatar" text,
  image            text,
  description      text,
  collected        bigint not null default 0,
  target           bigint not null default 0,
  "donorsCount"    bigint not null default 0,
  "endDate"        text,
  verified         boolean not null default false,
  featured         boolean not null default false,
  urgent           boolean not null default false,
  "createdAt"      text
);

-- ---------------------------------------------------------------------------
-- 3. TRANSAKSI DONASI (riwayat penerimaan dana)
-- ---------------------------------------------------------------------------
create table if not exists public.txs (
  id          text primary key,
  "donationId" text not null,
  "userId"    text,
  "donorName" text,
  amount      bigint not null default 0,
  method      text,
  anon        boolean not null default false,
  note        text,
  "createdAt" text,
  -- status verifikasi admin: "Menunggu Verifikasi" | "Dikonfirmasi" | "Ditolak"
  status      text,
  -- bukti pembayaran: dataURL base64 hasil kompres gambar (gratis, tanpa storage)
  bukti       text,
  reference   text
);
create index if not exists idx_txs_donation on public.txs ("donationId");

-- ---------------------------------------------------------------------------
-- 4. KEGIATAN RELAWAN
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id            text primary key,
  title         text not null,
  category      text,
  location      text,
  type          text,                              -- 'On-site' | 'Remote'
  organizer     text,
  verified      boolean not null default false,
  urgent        boolean not null default false,
  date          text,                              -- tanggal pelaksanaan
  deadline      text,                              -- batas pendaftaran
  quota         bigint not null default 0,
  registered    bigint not null default 0,
  image         text,
  requirements  jsonb not null default '[]'::jsonb,
  perks         jsonb not null default '[]'::jsonb,
  description   text,
  "createdAt"   text,
  -- kode absensi dari admin (isi QR absensi kegiatan)
  "absenCode"   text
);
create index if not exists idx_activities_date on public.activities (date);
create index if not exists idx_activities_deadline on public.activities (deadline);

-- ---------------------------------------------------------------------------
-- 5. PENDAFTAR RELAWAN / KANDIDAT (fitur "Candidate")
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id             text primary key,
  "activityId"   text not null,
  "activityTitle" text,
  "userId"       text,
  name           text,
  email          text,
  phone          text,
  motivation     text,
  status         text not null default 'Menunggu',  -- Menunggu|Diterima|Ditolak
  "appliedDate"  text
);
create index if not exists idx_applications_user on public.applications ("userId");

-- ---------------------------------------------------------------------------
-- 6. SERTIFIKAT RELAWAN (fitur "Sertifikat" + "Manajemen Sertifikat Admin")
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id                 text primary key,
  "userId"           text,
  "recipientName"    text,
  "activityTitle"    text,
  organizer          text,
  "dateIssued"       text,
  "hoursCount"       bigint not null default 0,
  role               text,
  "verificationCode" text
);
create index if not exists idx_certificates_user on public.certificates ("userId");

-- ---------------------------------------------------------------------------
-- 7. ABSENSI RELAWAN (fitur "Absensi" QR Code)
-- ---------------------------------------------------------------------------
create table if not exists public.attendance (
  id           text primary key,
  "userId"     text not null,
  "activityId" text,
  "checkInAt"  text
);

-- ---------------------------------------------------------------------------
-- 8. NOTIFIKASI
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id         text primary key,
  "userId"   text,
  title      text,
  body       text,
  type       text,                                 -- donasi|relawan|sistem
  read       boolean not null default false,
  "createdAt" text
);
create index if not exists idx_notifications_user on public.notifications ("userId");

-- ---------------------------------------------------------------------------
-- 9. BLOG / BERITA & ISU
-- ---------------------------------------------------------------------------
create table if not exists public.blog (
  id         text primary key,
  title      text not null,
  slug       text not null unique,
  excerpt    text,
  content    text,
  image      text,
  category   text,
  author     text,
  "createdAt" text
);

-- ---------------------------------------------------------------------------
-- 10. FEED / KABAR TERBARU
-- ---------------------------------------------------------------------------
create table if not exists public.feed (
  id         text primary key,
  title      text,
  body       text,
  image      text,
  tag        text,
  "createdAt" text
);

-- ---------------------------------------------------------------------------
-- 11. PENGAJUAN GALANG DANA
-- ---------------------------------------------------------------------------
create table if not exists public.fundraising (
  id             text primary key,
  "userId"       text,
  "organizerName" text,
  "orgType"      text,
  title          text,
  category       text,
  target         bigint not null default 0,
  deadline       text,
  phone          text,
  email          text,
  description    text,
  status         text not null default 'Menunggu',
  "createdAt"    text
);

-- ---------------------------------------------------------------------------
-- 12. DONASI RUTIN
-- ---------------------------------------------------------------------------
create table if not exists public.recurring (
  id          text primary key,
  "userId"    text,
  amount      bigint not null default 0,
  period      text,                                -- Mingguan|Bulanan
  method      text,
  "campaignId" text,
  active      boolean not null default true,
  "createdAt" text
);

-- ---------------------------------------------------------------------------
-- 13. SUPPORTER
-- ---------------------------------------------------------------------------
create table if not exists public.supporters (
  id          text primary key,
  "userId"    text,
  name        text,
  email       text,
  tier        text,
  message     text,
  "createdAt" text
);

-- ---------------------------------------------------------------------------
-- 14. KONTRAK / PENGAJUAN CSR  (menjawab dokumen: "data kontrak perusahaan
--     + balasan hasil verifikasi" — status diisi oleh admin)
-- ---------------------------------------------------------------------------
create table if not exists public.csr (
  id           text primary key,
  "companyName" text,
  "picName"    text,
  phone        text,
  email        text,
  type         text,
  note         text,
  status       text not null default 'Menunggu Verifikasi Kontrak',
  "createdAt"  text
);

-- ---------------------------------------------------------------------------
-- 15. KODE OTP (lupa password) — primary key = kontak (email / no. HP)
-- ---------------------------------------------------------------------------
create table if not exists public.otps (
  contact    text primary key,
  code       text,
  "expiresAt" bigint
);

-- ---------------------------------------------------------------------------
-- 16. PENGATURAN ADMIN (key/value) — saat ini: "payment_accounts" berisi daftar
--     rekening/e-wallet tujuan transfer donasi (bisa diedit lewat /admin)
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  key   text primary key,
  value jsonb
);

-- Tambahkan kolom baru pada instalasi yang sudah berjalan (aman diulang):
alter table public.txs        add column if not exists status   text;
alter table public.txs        add column if not exists bukti    text;
alter table public.txs        add column if not exists reference text;
alter table public.activities add column if not exists "absenCode" text;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — semua tabel DILINDUNGI.
--    Tidak ada policy sama sekali -> role `anon` (browser) ditolak total.
--    Hanya `service_role` (dipakai aplikasi Next.js di server) yang lewat.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'users','donations','txs','activities','applications','certificates',
    'attendance','notifications','blog','feed','fundraising','recurring',
    'supporters','csr','otps','settings'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- FUNGSI SINKRONISASI — dipanggil dari src/lib/db.ts (mutate()).
--   Input : nama tabel (di-whitelist) + seluruh baris terbaru dalam JSON.
--   Proses: UPSERT semua baris, lalu hapus baris yang hilang, ATOMIK.
-- ---------------------------------------------------------------------------
create or replace function public.sync_collection(p_table text, p_rows jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pk     text;
  v_update text;
begin
  -- 1) whitelist nama tabel (keamanan: tidak boleh nama sembarangan)
  if p_table is null or p_table not in (
    'users','donations','txs','activities','applications','certificates',
    'attendance','notifications','blog','feed','fundraising','recurring',
    'supporters','csr','otps','settings'
  ) then
    raise exception 'Tabel tidak diizinkan: %', coalesce(p_table, '(null)');
  end if;

  -- 2) cari kolom primary key tabel tersebut ('id', kecuali otps = 'contact')
  select a.attname into v_pk
  from pg_index i
  join pg_attribute a
    on a.attrelid = i.indrelid
   and a.attnum   = any (i.indkey)
  where i.indrelid = (quote_ident(p_table))::regclass
    and i.indisprimary;

  if v_pk is null then
    raise exception 'Primary key tidak ditemukan untuk tabel %', p_table;
  end if;

  -- 3) daftar "kolom = excluded.kolom" untuk clause ON CONFLICT DO UPDATE
  select string_agg(format('%I = excluded.%I', column_name, column_name), ', '
                     order by ordinal_position)
    into v_update
  from information_schema.columns
  where table_schema = 'public'
    and table_name   = p_table
    and column_name  <> v_pk;

  -- 4) UPSERT seluruh baris (kolom dipetakan dari JSON berdasarkan nama field)
  execute format(
    'insert into public.%I
       select * from jsonb_populate_recordset(null::public.%I, $1)
     on conflict (%I) do update set %s',
    p_table, p_table, v_pk, v_update
  ) using p_rows;

  -- 5) hapus baris yang sudah tidak ada pada kiriman terbaru
  execute format(
    'delete from public.%I t
      where not exists (
        select 1 from jsonb_array_elements($1) e
         where e ->> %L = t.%I
      )',
    p_table, v_pk, v_pk
  ) using p_rows;
end $$;

-- Fungsi hanya boleh dipanggil oleh service role (aplikasi di server)
revoke all on function public.sync_collection(text, jsonb) from public, anon, authenticated;
grant execute on function public.sync_collection(text, jsonb) to service_role;

-- ============================================================================
-- SELESAI. Jalankan `seed.sql` sebagai langkah berikutnya.
-- ============================================================================
-- Supaya API REST Supabase segera mengenali tabel baru (schema cache),
-- jalankan perintah reload ini di akhir sesi SQL yang sama:
notify pgrst, 'reload schema';
-- ============================================================================
