<div align="center">

# Look 'N Read

Modern comic web app for browsing and reading comics per chapter, complete with an API-based admin panel (CRUD for comics/chapters/genres).

</div>

Modern comic web app for browsing and reading comics per chapter, complete with an API-based admin panel (CRUD for comics/chapters/genres).

**Backend:** Laravel 10 + Sanctum (token auth)
**Frontend:** React + TypeScript + Tailwind CSS (built via Vite)
**Database:** MySQL (default in `.env.example`)

## Features

### Guest (Public)

-   Comic list & comic detail
-   Read chapters (image pages)
-   Genre list (for filtering)

### Admin (Protected)

-   Admin login (Sanctum token)
-   Comic CRUD
-   Chapter CRUD
-   Genre CRUD

Planning docs & auth concept: see `PLANNING.md` and `MIDDLEWARE_CONCEPT.md`.

## Tech Stack

-   PHP **^8.1**
-   Laravel **^10.10**
-   Laravel Sanctum **^3.3**
-   Node.js + npm
-   Vite **^5**
-   React + TypeScript
-   Tailwind CSS

## Routing Structure (Summary)

### Web (SPA Entry)

All web routes are redirected to the `welcome` view so React Router handles routing:

-   `GET /{any?}` → `resources/views/welcome.blade.php` (see `routes/web.php`)

### API

Guest/Public (no login):

-   `GET /api/comics`
-   `GET /api/comics/{comic:slug}`
-   `GET /api/chapters`
-   `GET /api/chapters/{chapter:id}`
-   `GET /api/read/{comic:slug}/{chapter:number}`
-   `GET /api/genres`

Admin (requires Sanctum token):

-   `POST /api/auth/admin/login`
-   `POST /api/auth/admin/logout`
-   `GET /api/auth/admin/me`
-   `POST /api/auth/admin/comics`
-   `PUT /api/auth/admin/comics/{comic:slug}`
-   `DELETE /api/auth/admin/comics/{comic:id}`
-   `POST /api/auth/admin/chapters`
-   `PUT /api/auth/admin/chapters/{chapter:id}`
-   `DELETE /api/auth/admin/chapters/{chapter:id}`
-   `POST /api/auth/admin/genres`
-   `PUT /api/auth/admin/genres/{id}`
-   `DELETE /api/auth/admin/genres/{id}`

## Requirements

-   PHP 8.1+
-   Composer
-   Node.js 18+ (recommended)
-   MySQL/MariaDB (or adjust `DB_CONNECTION`)

If you use **Laragon (Windows)**: make sure Apache/Nginx + MySQL are running.

## Setup (Local Development)

### 1) Install dependencies

```powershell
composer install
npm install
```

### 2) Environment configuration

Copy `.env.example` to `.env` and set your database configuration.

```powershell
Copy-Item .env.example .env
```

Then generate the app key:

```powershell
php artisan key:generate
```

Default database config in `.env.example`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 3) Migrations & seeding

```powershell
php artisan migrate
php artisan db:seed
```

Available seeders:

-   Default admin: `Database\\Seeders\\CreateAdminUser`
    -   Email: `admin@looknread.com`
    -   Password: `admin123`
-   Sample comics: `Database\\Seeders\\ComicSeeder`

> Note: the comic seeder sets `cover_image` like `comics/covers/one-piece.jpg`. Make sure the assets/images exist as needed.

### 4) Storage symlink (for file uploads)

If your app stores files in `storage/app/public`, create a symlink to `public/storage`:

```powershell
php artisan storage:link
```

## Running the App

There’s an npm script to run Vite + Laravel server together:

```powershell
npm run start
```

Or run separately:

```powershell
php artisan serve
```

```powershell
npm run dev
```

Build assets for production:

```powershell
npm run build
```

## Testing

Unit/Feature tests use PHPUnit.

```powershell
php artisan test
```

## Auth Notes (Sanctum)

Admin login returns a token. Use that token on subsequent requests:

-   Header: `Authorization: Bearer <token>`

## Folder Conventions (Summary)

-   `app/Http/Controllers` — API controllers
-   `app/Models` — main models (`Comic`, `Chapter`, `Genre`, etc.)
-   `database/migrations` — database schema
-   `database/seeders` — seeders (includes default admin)
-   `resources/js` — React + TypeScript frontend
-   `routes/api.php` — API endpoints
-   `routes/web.php` — SPA catch-all

## License

This project follows the licenses of its dependencies. For this repository’s code: see `LICENSE` if available.

---

<div align="center">

# Look 'N Read (Bahasa Indonesia)

Web app komik modern untuk browsing dan membaca komik per-chapter, lengkap dengan admin panel (CRUD komik/chapter/genre) berbasis API.

</div>

Web app komik modern untuk browsing dan membaca komik per-chapter, lengkap dengan admin panel (CRUD komik/chapter/genre) berbasis API.

**Backend:** Laravel 10 + Sanctum (token auth)
**Frontend:** React + TypeScript + Tailwind CSS (built via Vite)
**Database:** MySQL (default `.env.example`)

## Fitur

### Guest (Public)

-   List komik & detail komik
-   Baca chapter (halaman gambar)
-   List genre (untuk kebutuhan filter)

### Admin (Protected)

-   Login admin (Sanctum token)
-   CRUD komik
-   CRUD chapter
-   CRUD genre

Dokumen perencanaan & konsep auth: lihat `PLANNING.md` dan `MIDDLEWARE_CONCEPT.md`.

## Tech Stack

-   PHP **^8.1**
-   Laravel **^10.10**
-   Laravel Sanctum **^3.3**
-   Node.js + npm
-   Vite **^5**
-   React + TypeScript
-   Tailwind CSS

## Struktur Routing (Ringkas)

### Web (SPA Entry)

Semua route web diarahkan ke view `welcome` agar React Router yang mengatur:

-   `GET /{any?}` → `resources/views/welcome.blade.php` (lihat `routes/web.php`)

### API

Guest/Public (tanpa login):

-   `GET /api/comics`
-   `GET /api/comics/{comic:slug}`
-   `GET /api/chapters`
-   `GET /api/chapters/{chapter:id}`
-   `GET /api/read/{comic:slug}/{chapter:number}`
-   `GET /api/genres`

Admin (butuh token Sanctum):

-   `POST /api/auth/admin/login`
-   `POST /api/auth/admin/logout`
-   `GET /api/auth/admin/me`
-   `POST /api/auth/admin/comics`
-   `PUT /api/auth/admin/comics/{comic:slug}`
-   `DELETE /api/auth/admin/comics/{comic:id}`
-   `POST /api/auth/admin/chapters`
-   `PUT /api/auth/admin/chapters/{chapter:id}`
-   `DELETE /api/auth/admin/chapters/{chapter:id}`
-   `POST /api/auth/admin/genres`
-   `PUT /api/auth/admin/genres/{id}`
-   `DELETE /api/auth/admin/genres/{id}`

## Requirements

-   PHP 8.1+
-   Composer
-   Node.js 18+ (disarankan)
-   MySQL/MariaDB (atau sesuaikan `DB_CONNECTION`)

Jika kamu pakai **Laragon (Windows)**: pastikan Apache/Nginx + MySQL sudah jalan.

## Setup (Local Development)

### 1) Install dependency

```powershell
composer install
npm install
```

### 2) Konfigurasi environment

Copy `.env.example` menjadi `.env` lalu set konfigurasi database.

```powershell
Copy-Item .env.example .env
```

Lalu generate app key:

```powershell
php artisan key:generate
```

Default database di `.env.example`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 3) Migrasi & seeding

```powershell
php artisan migrate
php artisan db:seed
```

Seeder yang tersedia:

-   Admin default: `Database\\Seeders\\CreateAdminUser`
    -   Email: `admin@looknread.com`
    -   Password: `admin123`
-   Sample komik: `Database\\Seeders\\ComicSeeder`

> Catatan: seeder komik mengisi `cover_image` seperti `comics/covers/one-piece.jpg`. Pastikan asset/gambar tersedia sesuai kebutuhan kamu.

### 4) Storage symlink (untuk upload file)

Jika aplikasi menyimpan file ke `storage/app/public`, buat symlink ke `public/storage`:

```powershell
php artisan storage:link
```

## Menjalankan Aplikasi

Tersedia script npm untuk menjalankan Vite + Laravel server bersamaan:

```powershell
npm run start
```

Atau jalankan terpisah:

```powershell
php artisan serve
```

```powershell
npm run dev
```

Build asset untuk production:

```powershell
npm run build
```

## Testing

Unit/Feature test menggunakan PHPUnit.

```powershell
php artisan test
```

## Catatan Auth (Sanctum)

Login admin mengembalikan token. Gunakan token tersebut pada request berikutnya:

-   Header: `Authorization: Bearer <token>`

## Konvensi Folder (Ringkas)

-   `app/Http/Controllers` — controller API
-   `app/Models` — model utama (`Comic`, `Chapter`, `Genre`, dll.)
-   `database/migrations` — skema database
-   `database/seeders` — seeding (termasuk admin default)
-   `resources/js` — React + TypeScript frontend
-   `routes/api.php` — endpoint API
-   `routes/web.php` — SPA catch-all

## Lisensi

Project ini mengikuti lisensi dari dependency yang digunakan. Code di repo ini: lihat `LICENSE` jika tersedia.
