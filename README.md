# Aruna — situs resmi
Vite + React + TypeScript + Bootstrap 5 + CSS kustom. Backend: Cloudflare Pages Functions + D1.

## Lokal
1. `npm install`
2. `node scripts/setup-secrets.mjs "password-min-12-karakter"` → salin keluarannya ke `.dev.vars` (lihat `.dev.vars.example`)
3. `npm run db:local` lalu `npm run preview:cf`
4. Buka alamat admin sesuai `ADMIN_PATH` (diakhiri `/`).

## Produksi (lakukan sendiri setelah review)
Buat database D1, isi `database_id` di `wrangler.toml`, jalankan `migrations/0001_init.sql`, lalu set `ADMIN_PATH` dan `ADMIN_PASSWORD_HASH` sebagai secret di Cloudflare Pages.
