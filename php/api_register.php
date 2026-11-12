<?php
/**
 * php/api_register.php — PENDAFTARAN MEMBER LEWAT API PHP (opsional)
 *
 * Fungsi  : menyimpan pendaftar baru ke tabel `users` di Supabase
 *           (nama, email, no. HP, password yang sudah di-hash bcrypt).
 * Pakai    : POST JSON, contoh body: {"name":"Budi","email":"b@x.com",
 *            "phone":"0812","password":"rahasia123"}
 * Catatan  : jalur resmi pendaftaran di aplikasi adalah halaman /auth/register
 *           (Next.js). Endpoint ini hanya untuk integrasi/latihan PHP Anda.
 * Keamanan : gunakan hanya di server sendiri (XAMPP lokal / hosting);
 *            service_role key tidak boleh dibagikan ke publik.
 */
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(['error' => 'Gunakan metode POST.'], 405);
}

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$name     = trim($in['name'] ?? '');
$email    = strtolower(trim($in['email'] ?? ''));
$phone    = trim($in['phone'] ?? '');
$password = $in['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    out(['error' => 'nama, email, password wajib diisi.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    out(['error' => 'Format email tidak valid.'], 422);
}
if (strlen($password) < 6) {
    out(['error' => 'Password minimal 6 karakter.'], 422);
}

// cek duplikat
$cek = supabase_request('GET', '/rest/v1/users', null, ['email' => 'eq.' . $email, 'select' => 'id']);
if (!empty($cek['json']) && count($cek['json']) > 0) {
    out(['error' => 'Email sudah terdaftar.'], 409);
}

$user = [
    'id'            => 'u-' . bin2hex(random_bytes(6)),
    'name'          => $name,
    'email'         => $email,
    'phone'         => $phone,
    'passwordHash'  => password_hash($password, PASSWORD_BCRYPT),
    'role'          => 'user',
    'avatar'        => null,
    'city'          => null,
    'bio'           => null,
    'volunteerId'   => 'NRS-VOL-' . random_int(10000, 99999),
    'createdAt'     => date('Y-m-d'),
];

$res = supabase_request('POST', '/rest/v1/users', $user);
if ($res['status'] >= 400) {
    out(['error' => 'Gagal menyimpan ke Supabase.', 'detail' => $res['json']], 500);
}
out(['ok' => true, 'user' => ['id' => $user['id'], 'name' => $name, 'email' => $email]]);
