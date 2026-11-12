-- Bucket publik untuk foto kegiatan.
-- Upload tetap dilakukan lewat signed upload URL yang hanya diterbitkan
-- endpoint admin setelah autentikasi; bucket publik hanya membuat foto
-- dapat ditampilkan di halaman kegiatan.
-- Batas file: 50 MiB = 52,428,800 byte.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('activity-images', 'activity-images', true, 52428800, null)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
