<?php
/**
 * php/api_aktivitas.php — DAFTAR KEGIATAN RELAWAN LEWAT API PHP (opsional)
 *
 * Fungsi  : membaca tabel `activities` dari Supabase (urut tanggal pelaksanaan).
 * Pakai    : GET, contoh: http://localhost/narassa/php/api_aktivitas.php
 *            atau dengan filter:  ?category=Lingkungan
 * Catatan  : daftar kegiatan di aplikasi ditampilkan oleh /activity (Next.js).
 */
require __DIR__ . '/config.php';

$query = ['select' => '*', 'order' => 'date.asc', 'limit' => '100'];
if (!empty($_GET['category'])) {
    $query['category'] = 'eq.' . $_GET['category'];
}

$res = supabase_request('GET', '/rest/v1/activities', null, $query);
if ($res['status'] >= 400) {
    out(['error' => 'Gagal membaca data.', 'detail' => $res['json']], 500);
}

out(['ok' => true, 'jumlah' => count($res['json']), 'items' => $res['json']]);
