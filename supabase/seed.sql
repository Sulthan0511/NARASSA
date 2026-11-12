-- ===========================================================================
--  NARASSA — DATA AWAL (seed) untuk Supabase
-- ===========================================================================
--  CARA PAKAI: tempel seluruh isi file ini di Supabase SQL Editor -> RUN.
--  Sumber data: src/lib/seed.ts (buildSeed()) — dihasilkan otomatis oleh
--  scripts/gen-seed-sql.ts sehingga selalu sama dengan aplikasi.
--
--  Akun demo:
--    Admin  : admin@narassa.id    / admin123
--    Member : relawan@narassa.id  / demo123
-- ===========================================================================

begin;

-- ---------------------------------------------------------------------
-- tabel users (2 baris)
-- ---------------------------------------------------------------------
insert into public.users ("id", "name", "email", "phone", "passwordHash", "role", "avatar", "city", "bio", "volunteerId", "createdAt") values
  ('u-admin', 'Tim Admin NARASSA', 'admin@narassa.id', '081290008000', '$2b$10$S1tYKJxwPIWrsS5QikbC..S/iX3hXVdCrNZxyBjR8qW7CcNkbluz2', 'admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80', 'Jakarta', 'Administrator resmi platform NARASSA.', 'NRS-VOL-00001', '2025-10-07'),
  ('u-demo', 'Rizky Ramadhan', 'relawan@narassa.id', '081299887766', '$2b$10$CCxLKFB1S7bYxcCuhQmsuuRx0rxP.bXF9WfLWOo7MigyMoaHShRL6', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 'Jakarta Utara', 'Relawan kemanusiaan & pencinta lingkungan.', 'NRS-VOL-99201', '2026-04-05')
on conflict ("id") do update set "name" = excluded."name", "email" = excluded."email", "phone" = excluded."phone", "passwordHash" = excluded."passwordHash", "role" = excluded."role", "avatar" = excluded."avatar", "city" = excluded."city", "bio" = excluded."bio", "volunteerId" = excluded."volunteerId", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel donations (9 baris)
-- ---------------------------------------------------------------------
insert into public.donations ("id", "title", "category", "organizer", "organizerAvatar", "image", "description", "collected", "target", "donorsCount", "endDate", "verified", "featured", "urgent", "createdAt") values
  ('dn-1', 'Bantuan Darurat Logistik & Medis Banjir Demak-Grobogan', 'Bencana Alam', 'Yayasan Peduli Sesama', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80', 'Penyediaan dapur umum darurat, perahu karet, popok bayi, dan posko kesehatan gratis bagi 1.200 kepala keluarga terdampak banjir.', 124500000, 150000000, 428, '2026-11-14', true, true, true, '2026-11-02'),
  ('dn-2', 'Beasiswa Pendidikan 100 Anak Pesisir Muara Angke', 'Pendidikan', 'Gerakan Sahabat Anak Nusantara', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 'Bantuan biaya perlengkapan sekolah, seragam, buku cerita, dan SPP 1 tahun untuk anak nelayan kurang mampu.', 48200000, 60000000, 215, '2026-11-16', true, true, true, '2026-10-28'),
  ('dn-3', 'Operasi Jantung Balita Ghaisan (1.5 Tahun)', 'Medis & Kesehatan', 'Komunitas Kasih Bunda', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80', 'Dik Ghaisan membutuhkan operasi penutupan kebocoran sekum jantung tahap kedua di RS Harapan Kita.', 165000000, 180000000, 680, '2026-11-15', true, true, true, '2026-10-21'),
  ('dn-4', 'Revitalisasi Terumbu Karang & Mangrove Kepulauan Seribu', 'Lingkungan', 'EcoNusantara Foundation', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80', 'Penanaman 2.000 bibit mangrove dan rehabilitasi media tanam terumbu karang di Pulau Pari.', 22800000, 40000000, 142, '2026-11-24', true, false, false, '2026-11-05'),
  ('dn-5', 'Renovasi Rumah Singgah Yatim Dhuafa Cirebon', 'Panti & Yatim', 'Rumah Cahaya Yatim', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80', 'Perbaikan atap, kamar tidur, dan ruang belajar untuk 35 anak yatim penghuni rumah singgah.', 31500000, 75000000, 96, '2026-12-09', true, false, false, '2026-11-07'),
  ('dn-6', 'Pembangunan Menara & Tempat Wudhu Masjid Al-Ikhlas', 'Rumah Ibadah', 'Panitia Masjid Al-Ikhlas', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=600&q=80', 'Kelanjutan pembangunan menara setinggi 18 meter dan renovasi aula wudhu untuk jamaah 500 KK.', 87300000, 200000000, 310, '2026-12-26', true, false, false, '2026-10-31'),
  ('dn-7', 'Satwa Terluka: Perawatan Rusa & Elang Jalak Lawu', 'Menolong Hewan', 'Nusantara Wildlife Care', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?auto=format&fit=crop&w=600&q=80', 'Biaya operasi, pakan, dan kandang rehabilitasi untuk 12 satwa liar hasil perdagangan ilegal.', 12750000, 25000000, 88, '2026-11-29', true, false, false, '2026-11-08'),
  ('dn-8', 'Zakat & Wakaf Produktif untuk Petani Kecil NTT', 'Zakat & Wakaf', 'Lembaga Amil Zakat Bina Umat', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', 'Pendanaan bibit, pupuk, dan alat tani produktif untuk 200 keluarga petani di Sumba dan Flores.', 64000000, 100000000, 254, '2026-12-16', true, true, false, '2026-10-26'),
  ('dn-9', 'Paket Sembako Lansia Terlantar Surabaya', 'Sosial', 'Komunitas Peduli Lansia', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=120&q=80', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80', 'Distribusi paket sembako bulanan dan pemeriksaan kesehatan gratis untuk 150 lansia terlantar.', 9400000, 18000000, 67, '2026-12-03', true, false, false, '2026-11-09')
on conflict ("id") do update set "title" = excluded."title", "category" = excluded."category", "organizer" = excluded."organizer", "organizerAvatar" = excluded."organizerAvatar", "image" = excluded."image", "description" = excluded."description", "collected" = excluded."collected", "target" = excluded."target", "donorsCount" = excluded."donorsCount", "endDate" = excluded."endDate", "verified" = excluded."verified", "featured" = excluded."featured", "urgent" = excluded."urgent", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel txs (2 baris)
-- ---------------------------------------------------------------------
insert into public.txs ("id", "donationId", "userId", "donorName", "amount", "method", "anon", "note", "createdAt", "status") values
  ('tx-1', 'dn-1', 'u-demo', 'Rizky Ramadhan', 100000, 'QRIS', false, 'Semoga bermanfaat', '2026-11-09', 'Dikonfirmasi'),
  ('tx-2', 'dn-3', NULL, 'Donatur Anonim', 500000, 'BCA Virtual Account', true, '', '2026-11-10', 'Dikonfirmasi')
on conflict ("id") do update set "donationId" = excluded."donationId", "userId" = excluded."userId", "donorName" = excluded."donorName", "amount" = excluded."amount", "method" = excluded."method", "anon" = excluded."anon", "note" = excluded."note", "createdAt" = excluded."createdAt", "status" = excluded."status";

-- ---------------------------------------------------------------------
-- tabel activities (6 baris)
-- ---------------------------------------------------------------------
insert into public.activities ("id", "title", "category", "location", "type", "organizer", "verified", "urgent", "date", "deadline", "quota", "registered", "image", "requirements", "perks", "description", "createdAt") values
  ('ac-1', 'Relawan Sabtu Ceria: Pengajar Anak Pesisir', 'Anak', 'Muara Angke, Jakarta Utara', 'On-site', 'Gerakan Sahabat Anak Nusantara', true, true, '2026-11-19', '2026-11-14', 20, 16, 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', '["Minimal usia 18 tahun (Mahasiswa/Umum)","Menyukai aktivitas mengajar & mendongeng","Dapat hadir full-day pada hari Sabtu"]'::jsonb, '["E-Sertifikat Resmi","Konsumsi Makan Siang","Kaos Relawan NARASSA","Uang Transportasi"]'::jsonb, 'Kegiatan mengajar literasi dasar, mendongeng interaktif, dan kelas kerajinan tangan untuk anak-anak pemukiman nelayan.', '2026-10-30'),
  ('ac-2', 'Aksi Bersih Pantai & Penanaman 1.000 Mangrove', 'Lingkungan', 'Pulau Pari, Kepulauan Seribu', 'On-site', 'EcoNusantara Foundation', true, true, '2026-11-22', '2026-11-16', 30, 28, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', '["Sehat fisik & dapat berenang dasar","Membawa botol minum pribadi (Tumblr)"]'::jsonb, '["E-Sertifikat 16 Jam Kerja","Kapal Penyeberangan Pulang-Pergi","Konsumsi 2x"]'::jsonb, 'Aksi kolaboratif relawan dalam pengumpulan sampah plastik pantai dan pemasangan bibit mangrove muda.', '2026-11-01'),
  ('ac-3', 'Digital Relawan: UI/UX & Content Creator Kampanye', 'Pendidikan', 'Indonesia (Work From Anywhere)', 'Remote', 'NARASSA Digital Media Hub', true, false, '2026-11-26', '2026-11-19', 5, 4, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', '["Menguasai Canva, Figma, atau Adobe Illustrator","Memiliki portofolio desain visual / microblog"]'::jsonb, '["E-Sertifikat Digital Professional","Portofolio Project Terverifikasi"]'::jsonb, 'Membantu membuat konten infografis dan desain media sosial untuk mendukung transparansi penggalangan dana darurat.', '2026-11-04'),
  ('ac-4', 'Pendampingan Psikososial Pasca Bencana Banjir', 'Bencana', 'Demak, Jawa Tengah', 'On-site', 'Yayasan Peduli Sesama', true, true, '2026-11-17', '2026-11-13', 15, 11, 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', '["Latar belakang Psikologi/Konseling disukai","Bersedia menginap di posko relawan 2 hari"]'::jsonb, '["E-Sertifikat Tanggap Darurat","Akomodasi & Posko","Konsumsi Penuh"]'::jsonb, 'Pemberian trauma healing ringan, permainan anak, serta pendampingan moral untuk keluarga pengungsi.', '2026-11-03'),
  ('ac-5', 'Bedah Rumah Lansia Dhuafa bersama Komunitas RW 04', 'Lansia', 'Bekasi Selatan, Jawa Barat', 'On-site', 'Komunitas Peduli Lansia', true, false, '2026-11-30', '2026-11-23', 25, 9, 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80', '["Usia minimal 17 tahun","Bersedia bekerja fisik (gotong royong)"]'::jsonb, '["E-Sertifikat Bakti Sosial","Konsumsi","Transportasi Lokasi"]'::jsonb, 'Perbaikan atap dan dinding rumah tidak layak huni milik 5 lansia dhuafa.', '2026-11-06'),
  ('ac-6', 'Kelas Literasi Digital untuk Siswa SMP Nusantara', 'Pendidikan', 'SMP Nusantara, Tangerang', 'On-site', 'NARASSA Volunteer Network', true, false, '2026-12-07', '2026-11-28', 12, 3, 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80', '["Paham dasar komputer & internet aman","Sabar mengajar remaja"]'::jsonb, '["E-Sertifikat Pengajar","Konsumsi","Merchandise NARASSA"]'::jsonb, 'Workshop keamanan digital, membuat CV, dan presentasi untuk 60 siswa kelas 9.', '2026-11-09')
on conflict ("id") do update set "title" = excluded."title", "category" = excluded."category", "location" = excluded."location", "type" = excluded."type", "organizer" = excluded."organizer", "verified" = excluded."verified", "urgent" = excluded."urgent", "date" = excluded."date", "deadline" = excluded."deadline", "quota" = excluded."quota", "registered" = excluded."registered", "image" = excluded."image", "requirements" = excluded."requirements", "perks" = excluded."perks", "description" = excluded."description", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel applications (3 baris)
-- ---------------------------------------------------------------------
insert into public.applications ("id", "activityId", "activityTitle", "userId", "name", "email", "phone", "motivation", "status", "appliedDate") values
  ('ap-1', 'ac-1', 'Relawan Sabtu Ceria: Pengajar Anak Pesisir', 'u-demo', 'Rizky Ramadhan', 'relawan@narassa.id', '081299887766', 'Saya memiliki pengalaman 1 tahun mengajar bimbel anak dan sangat tertarik berbagi ilmu di Muara Angke.', 'Diterima', '2026-11-05'),
  ('ap-2', 'ac-2', 'Aksi Bersih Pantai & Penanaman 1.000 Mangrove', 'u-user2', 'Budi Santoso', 'budi.santoso@yahoo.com', '085712345678', 'Aktif di UKM Pencinta Alam dan ingin ambil bagian langsung penanaman mangrove.', 'Diterima', '2026-11-06'),
  ('ap-3', 'ac-3', 'Digital Relawan: UI/UX & Content Creator Kampanye', 'u-user3', 'Amanda Putri', 'amanda.p@gmail.com', '081345678901', 'UI/UX Designer junior yang bersedia menyumbangkan keahlian visual untuk kemanusiaan.', 'Menunggu', '2026-11-08')
on conflict ("id") do update set "activityId" = excluded."activityId", "activityTitle" = excluded."activityTitle", "userId" = excluded."userId", "name" = excluded."name", "email" = excluded."email", "phone" = excluded."phone", "motivation" = excluded."motivation", "status" = excluded."status", "appliedDate" = excluded."appliedDate";

-- ---------------------------------------------------------------------
-- tabel certificates (2 baris)
-- ---------------------------------------------------------------------
insert into public.certificates ("id", "userId", "recipientName", "activityTitle", "organizer", "dateIssued", "hoursCount", "role", "verificationCode") values
  ('CERT-NRS-2026-088', 'u-demo', 'Rizky Ramadhan', 'Aksi Tanggap Darurat Logistik Banjir Demak', 'NARASSA Volunteer Network', '12 September 2026', 18, 'Relawan Tim Logistik Posko Utama', 'NRS-VER-994812'),
  ('CERT-NRS-2025-142', 'u-demo', 'Rizky Ramadhan', 'Festival Edukasi Literasi & Kebudayaan Anak Pesisir', 'Gerakan Sahabat Anak Nusantara', '20 Desember 2025', 12, 'Fasilitator Studio Mendongeng', 'NRS-VER-332109')
on conflict ("id") do update set "userId" = excluded."userId", "recipientName" = excluded."recipientName", "activityTitle" = excluded."activityTitle", "organizer" = excluded."organizer", "dateIssued" = excluded."dateIssued", "hoursCount" = excluded."hoursCount", "role" = excluded."role", "verificationCode" = excluded."verificationCode";

-- ---------------------------------------------------------------------
-- tabel attendance (0 baris)
-- ---------------------------------------------------------------------
-- (tidak ada data awal)

-- ---------------------------------------------------------------------
-- tabel notifications (3 baris)
-- ---------------------------------------------------------------------
insert into public.notifications ("id", "userId", "title", "body", "type", "read", "createdAt") values
  ('nt-1', 'u-demo', 'Aplikasi Diterima', 'Selamat! Pendaftaran relawan "Aksi Bersih Pantai & Penanaman 1.000 Mangrove" disetujui.', 'relawan', false, '2026-11-07'),
  ('nt-2', 'u-demo', 'Penyaluran Donasi', 'Donasi Banjir Demak tahap 1 telah disalurkan ke lokasi bencana.', 'donasi', false, '2026-11-09'),
  ('nt-3', 'u-demo', 'E-Sertifikat Terbit', 'Sertifikat keikutsertaan kegiatan Anda telah diterbitkan dan siap diunduh.', 'sistem', true, '2026-11-10')
on conflict ("id") do update set "userId" = excluded."userId", "title" = excluded."title", "body" = excluded."body", "type" = excluded."type", "read" = excluded."read", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel blog (4 baris)
-- ---------------------------------------------------------------------
insert into public.blog ("id", "title", "slug", "excerpt", "content", "image", "category", "author", "createdAt") values
  ('bl-1', '5 Cara Memilih Galang Dana yang Transparan & Terpercaya', 'cara-pilih-galang-dana-transparan', 'Donasi online makin mudah, tapi kehati-hatian tetap perlu. Kenali ciri penggalangan dana yang sehat.', 'Dalam memilih galang dana, pertama pastikan lembaganya terdaftar resmi dan memiliki laporan penyaluran rutin. Kedua, cek rincian penggunaan dana — nominal besar tanpa rincian adalah tanda bahaya. Ketiga, baca update terbaru dari penggalang; kampanye hidup biasanya memperbarui progres mingguan. Keempat, gunakan kanal pembayaran resmi yang terverifikasi, jukan transfer ke rekening pribadi. Kelima, manfaatkan fitur donasi berkala agar bantuan Anda berkelanjutan tanpa perlu transfer manual setiap bulan.

Di NARASSA, setiap program donasi melewati verifikasi dokumen legalitas, rekening bank, dan identitas penggalang sebelum tayang. Laporan penyaluran juga dapat diakses publik melalui halaman dampak.', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=600&q=80', 'Tips Donasi', 'Tim Editorial NARASSA', '2026-11-06'),
  ('bl-2', 'Pengalaman Relawan: 3 Hari di Posko Banjir Demak', 'pengalaman-relawan-posko-demak', 'Catatan lapangan salah satu relawan NARASSA saat bergabung dalam aksi tanggap darurat.', 'Hari pertama dimulai dengan pendataan pengungsi dan distribusi paket kebersihan. Dapur umum bekerja dua shift, dan relawan lokal ternyata jadi kunci koordinasi.

Hari kedua, fokus bergeser ke posko kesehatan. Tim medis menangani ratusan pemeriksaan, sementara relawan non-medis mendampingi anak-anak trauma healing.

Hari terakhir, kami membantu evakuasi perabot warga dan bersih-bersih lumpur. Yang paling berkesan: warga yang datang mengantar kopi meski rumahnya masih terendam. Aksi sosial bukan soal jumlah, melainkan kehadiran.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80', 'Cerita Lapangan', 'Rizky Ramadhan', '2026-10-30'),
  ('bl-3', 'CSR Berdampak: Bagi Perusahaan yang Ingin Mulai', 'csr-berdampak-panduan-perusahaan', 'Program CSR tidak harus mahal. Yang penting terukur, berkelanjutan, dan melibatkan karyawan.', 'Langkah pertama tentukan fokus isu yang selaras dengan bisnis — misalnya pendidikan bagi perusahaan teknologi, atau lingkungan bagi manufaktur.

Langkah kedua, ukur baseline sebelum program berjalan tanpa data awal, dampak akan sulit dibuktikan.

Langkah ketiga, libatkan karyawan lewat volunteerism. Program CSR yang melibatkan partisipasi langsung terbukti meningkatkan retensi dan kebanggaan tim.

NARASSA menyediakan skema kemitraan CSR dengan kontrak awal, pelaporan dampak berkala, dan opsi penempatan relawan perusahaan.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80', 'Mitra CSR', 'Divisi Kemitraan NARASSA', '2026-10-23'),
  ('bl-4', 'Zakat, Wakaf, dan Donasi Produktif: Memahami Bedanya', 'zakat-wakaf-donasi-produktif', 'Tiga instrumen kebajikan dengan karakter berbeda. Mana yang paling sesuai untuk Anda?', 'Zakat adalah kewajiban dengan nisab dan golongan penerima yang sudah ditetapkan. Wakaf bersifat abadi — pokoknya tidak boleh habis, hanya hasilnya yang disalurkan.

Donasi produktif, seperti modal kerja petani atau alat usaha mikro, berpotensi menghasilkan efek berganda: penerima menjadi mandiri dan tidak kembali bergantung pada bantuan.

Kombinasi ketiganya memberi keseimbangan: zakat memenuhi kebutuhan dasar, wakaf membangun aset umat jangka panjang, dan donasi produktif membuka jalan keluar dari kemiskinan struktural.', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80', 'Edukasi', 'Divisi Edukasi NARASSA', '2026-10-16')
on conflict ("id") do update set "title" = excluded."title", "slug" = excluded."slug", "excerpt" = excluded."excerpt", "content" = excluded."content", "image" = excluded."image", "category" = excluded."category", "author" = excluded."author", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel feed (3 baris)
-- ---------------------------------------------------------------------
insert into public.feed ("id", "title", "body", "image", "tag", "createdAt") values
  ('fd-1', 'Penyaluran tahap 1 banjir Demak telah sampai di 6 desa', 'Tim lapangan NARASSA beserta Yayasan Peduli Sesama menyalurkan 400 paket sembako dan 2 unit perahu karet di Kecamatan Bonang.', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80', 'Laporan Penyaluran', '2026-11-10'),
  ('fd-2', '18 relawan baru resmi bergabung minggu ini', 'Selamat kepada 18 relawan yang telah menyelesaikan orientasi digital NARASSA. Sertifikat keanggotaan dapat diunduh di menu profil.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', 'Komunitas', '2026-11-08'),
  ('fd-3', 'Program beasiswa pesisir tembus 80% dari target', 'Terima kasih 215 donatur! Beasiswa untuk 100 anak nelayan Muara Angke kini telah mengumpulkan Rp48,2 juta dari target Rp60 juta.', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 'Kabar Donasi', '2026-11-06')
on conflict ("id") do update set "title" = excluded."title", "body" = excluded."body", "image" = excluded."image", "tag" = excluded."tag", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel fundraising (1 baris)
-- ---------------------------------------------------------------------
insert into public.fundraising ("id", "userId", "organizerName", "orgType", "title", "category", "target", "deadline", "phone", "email", "description", "status", "createdAt") values
  ('fr-1', 'u-demo', 'Rizky Ramadhan', 'Komunitas', 'Perpustakaan Keliling Anak Pesisir', 'Pendidikan', 25000000, '2027-01-10', '081299887766', 'relawan@narassa.id', 'Membangun 3 unit perpustakaan keliling sepeda motor untuk anak pesisir Jakarta Utara.', 'Menunggu', '2026-11-09')
on conflict ("id") do update set "userId" = excluded."userId", "organizerName" = excluded."organizerName", "orgType" = excluded."orgType", "title" = excluded."title", "category" = excluded."category", "target" = excluded."target", "deadline" = excluded."deadline", "phone" = excluded."phone", "email" = excluded."email", "description" = excluded."description", "status" = excluded."status", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel recurring (1 baris)
-- ---------------------------------------------------------------------
insert into public.recurring ("id", "userId", "amount", "period", "method", "campaignId", "active", "createdAt") values
  ('rc-1', 'u-demo', 50000, 'Bulanan', 'QRIS', 'dn-2', true, '2026-10-12')
on conflict ("id") do update set "userId" = excluded."userId", "amount" = excluded."amount", "period" = excluded."period", "method" = excluded."method", "campaignId" = excluded."campaignId", "active" = excluded."active", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel supporters (1 baris)
-- ---------------------------------------------------------------------
insert into public.supporters ("id", "userId", "name", "email", "tier", "message", "createdAt") values
  ('sp-1', 'u-demo', 'Rizky Ramadhan', 'relawan@narassa.id', 'Kawan Baik', 'Terus berkarya untuk Nusantara!', '2026-10-22')
on conflict ("id") do update set "userId" = excluded."userId", "name" = excluded."name", "email" = excluded."email", "tier" = excluded."tier", "message" = excluded."message", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel csr (1 baris)
-- ---------------------------------------------------------------------
insert into public.csr ("id", "companyName", "picName", "phone", "email", "type", "note", "status", "createdAt") values
  ('cs-1', 'PT Sahabat Kebaikan Indonesia', 'Hendra Wijaya', '081290001111', 'csr@sahabatkebaikan.co.id', 'CSR Donasi', 'Ingin bekerja sama program beasiswa 2027.', 'Menunggu Verifikasi Kontrak', '2026-11-07')
on conflict ("id") do update set "companyName" = excluded."companyName", "picName" = excluded."picName", "phone" = excluded."phone", "email" = excluded."email", "type" = excluded."type", "note" = excluded."note", "status" = excluded."status", "createdAt" = excluded."createdAt";

-- ---------------------------------------------------------------------
-- tabel otps (0 baris)
-- ---------------------------------------------------------------------
-- (tidak ada data awal)

-- ---------------------------------------------------------------------
-- tabel settings (1 baris)
-- ---------------------------------------------------------------------
insert into public.settings ("key", "value") values
  ('payment_accounts', '[{"method":"QRIS","number":"9182000123456789","owner":"PT NARASSA INDONESIA"},{"method":"BCA","number":"123456789012","owner":"PT NARASSA INDONESIA"},{"method":"Mandiri","number":"141001234567890","owner":"PT NARASSA INDONESIA"},{"method":"BNI","number":"0123456789","owner":"PT NARASSA INDONESIA"},{"method":"BRI","number":"123450001234","owner":"PT NARASSA INDONESIA"},{"method":"GoPay","number":"081290008000","owner":"NARASSA INDONESIA"},{"method":"OVO","number":"081290008000","owner":"NARASSA INDONESIA"},{"method":"ShopeePay","number":"081290008000","owner":"NARASSA INDONESIA"}]'::jsonb)
on conflict ("key") do update set "value" = excluded."value";

commit;
