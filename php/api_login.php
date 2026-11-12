<?php
/**
 * php/api_login.php — LOGIN MEMBER LEWAT API PHP (opsional)
 *
 * Fungsi  : memeriksa email + password terhadap tabel `users` di Supabase.
 * Pakai    : POST JSON {"email":"relawan@narassa.id","password":"demo123"}
 * Catatan  : login resmi aplikasi ada di /auth/login (Next.js) dengan session
 *            cookie; endpoint ini untuk latihan/integrasi PHP saja dan tidak
 *            membuat session aplikasi.
 */
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    out(['error' => 'Gunakan metode POST.'], 405);
}

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$email    = strtolower(trim($in['email'] ?? ''));
$password = $in['password'] ?? '';

if ($email === '' || $password === '') {
    out(['error' => 'Email dan password wajib diisi.'], 422);
}

$cek = supabase_request('GET', '/rest/v1/users', null, ['email' => 'eq.' . $email, 'select' => '*']);
$rows = is_array($cek['json']) ? $cek['json'] : [];
if (count($rows) === 0) {
    out(['error' => 'Email tidak terdaftar.'], 401);
}

$u = $rows[0];
if (!password_verify($password, $u['passwordHash'])) {
    out(['error' => 'Password salah.'], 401);
}

out([
    'ok'   => true,
    'user' => [
        'id'          => $u['id'],
        'name'        => $u['name'],
        'email'       => $u['email'],
        'role'        => $u['role'],
        'volunteerId' => $u['volunteerId'],
    ],
]);
