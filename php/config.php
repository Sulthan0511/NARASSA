<?php
/**
 * ============================================================================
 *  php/config.php — PENGATURAN KONEKSI KE SUPABASE  (untuk skrip PHP)
 * ============================================================================
 *
 *  APA INI?
 *    File pengaturan bersama untuk semua skrip di folder `php/`.
 *    Skrip PHP di folder ini bersifat PENDUKUNG/OPSIONAL — aplikasi web
 *    NARASSA (Next.js) TIDAK memakai PHP sama sekali. Aplikasi sudah
 *    terhubung ke Supabase lewat src/lib/db.ts.
 *
 *  PENTING — APA YANG DITEMPEL KE SUPABASE:
 *    Supabase TIDAK menjalankan PHP. Yang Anda tempel di Supabase hanyalah
 *    file SQL: `supabase/schema.sql` (tabel) dan `supabase/seed.sql` (data).
 *    File PHP ini hanya dijalankan di komputer/server Anda sendiri
 *    (contoh: XAMPP) untuk uji koneksi / input data manual.
 *
 *  CARA PAKAI:
 *    1. Salin file ini menjadi `php/config.local.php` (opsional, agar
 *       kredensial tidak ikut ter-commit) ATAU isi nilai di bawah langsung.
 *    2. Ambil kredensial dari Supabase Dashboard -> Project Settings -> API:
 *         - Project URL   -> $SUPABASE_URL
 *         - service_role  -> $SUPABASE_KEY  (RAHASIA! hanya untuk server)
 *    3. Jalankan via localhost XAMPP, mis. http://localhost/narassa/php/cek_koneksi.php
 * ============================================================================
 */

// ---- Kredensial Supabase (GANTI DENGAN PUNYA ANDA) ------------------------
$SUPABASE_URL = 'https://ISI-PROJECT-URL-ANDA.supabase.co'; // contoh: https://abcdefghij.supabase.co
$SUPABASE_KEY = 'ISI-SERVICE-ROLE-KEY-ANDA';                 // key "service_role" (secret)

// ---- Muat file lokal jika ada (opsional, tidak wajib) ---------------------
$local = __DIR__ . '/config.local.php';
if (is_file($local)) { include $local; }

/**
 * Kirim permintaan HTTP ke Supabase REST (PostgREST).
 *
 * @param string $method  GET | POST | PATCH | DELETE | PUT
 * @param string $path    path relatif, contoh: '/rest/v1/users'
 * @param array|null $body data JSON yang dikirim (untuk POST/PATCH)
 * @param array|null $query tambahan query string, contoh: ['select' => '*']
 * @return array ['status'=>int, 'json'=>array, 'error'=>string|null]
 */
function supabase_request(string $method, string $path, ?array $body = null, ?array $query = null): array
{
    global $SUPABASE_URL, $SUPABASE_KEY;

    $url = rtrim($SUPABASE_URL, '/') . $path;
    if ($query) { $url .= '?' . http_build_query($query); }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_HTTPHEADER     => [
            'apikey: ' . $SUPABASE_KEY,
            'Authorization: Bearer ' . $SUPABASE_KEY,
            'Content-Type: application/json',
            'Prefer: return=representation',
        ],
    ]);
    if ($body !== null && in_array($method, ['POST', 'PATCH', 'PUT'], true)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $res  = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($res === false) {
        return ['status' => 0, 'json' => null, 'error' => 'cURL error: ' . $err];
    }
    $json = json_decode($res, true);
    return ['status' => $code, 'json' => $json, 'error' => null];
}

/** Balasan JSON standar untuk endpoint API. */
function out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
