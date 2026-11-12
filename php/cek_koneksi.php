<?php
/**
 * php/cek_koneksi.php — UJI KONEKSI KE SUPABASE
 *
 * Fungsi : memastikan kredensial benar, tabel sudah dibuat, dan data awal
 *          (seed) sudah masuk. Buka file ini di browser (XAMPP/Laragon).
 * Hasil  : JSON berisi status koneksi + jumlah baris tiap tabel.
 *
 * Jika muncul 401 -> URL / service_role key salah.
 * Jika tabel bernilai 0 -> `supabase/schema.sql` atau `seed.sql` belum dijalankan.
 */
require __DIR__ . '/config.php';

$tables = [
    'users', 'donations', 'txs', 'activities', 'applications', 'certificates',
    'attendance', 'notifications', 'blog', 'feed', 'fundraising', 'recurring',
    'supporters', 'csr', 'otps',
];

$result = ['koneksi' => false, 'pesan' => '', 'jumlah_baris' => []];

if ($SUPABASE_URL === 'https://ISI-PROJECT-URL-ANDA.supabase.co' || $SUPABASE_KEY === 'ISI-SERVICE-ROLE-KEY-ANDA') {
    $result['pesan'] = 'Isi dulu $SUPABASE_URL dan $SUPABASE_KEY di php/config.php';
    out($result, 500);
}

$first = true;
foreach ($tables as $t) {
    $r = supabase_request('GET', '/rest/v1/' . $t, null, ['select' => '*', 'limit' => '1000']);
    if ($r['status'] >= 400) {
        $result['pesan'] = "Gagal membaca tabel '$t': " . json_encode($r['json']);
        out($result, 500);
    }
    if ($first) { $result['koneksi'] = true; $first = false; }
    $result['jumlah_baris'][$t] = is_array($r['json']) ? count($r['json']) : 0;
}

$result['pesan'] = 'Terhubung ke Supabase. Semua tabel terbaca.';
out($result);
