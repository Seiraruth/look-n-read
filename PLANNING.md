# 📖 Look 'N Read - Web App Komik Modern

> Platform interaktif untuk membaca dan mengelola koleksi komik digital dengan teknologi terkini.

**Status:** 🚀 In Development | **Tech Stack:** Laravel 11 + React 18 + TypeScript + Tailwind CSS

---

## 📋 Daftar Isi

1. [Arsitektur Database](#-arsitektur-database)
2. [Struktur Tim & Tanggung Jawab](#-struktur-tim--tanggung-jawab)
3. [Alur Penggunaan Aplikasi](#-alur-penggunaan-aplikasi)
4. [Timeline & Milestone](#-timeline--milestone)

---

## 📊 Arsitektur Database

Database menggunakan **Relational Model** dengan MySQL/PostgreSQL untuk memastikan integritas data dan skalabilitas.

### 🎯 Tabel Inti

#### `users` - Data Admin

Menyimpan kredensial dan informasi administrator sistem.

| Field        | Type        | Keterangan                    |
| ------------ | ----------- | ----------------------------- |
| `id`         | INT PK      | Identifier unik               |
| `name`       | VARCHAR     | Nama admin                    |
| `email`      | VARCHAR UNQ | Email login (unik)            |
| `password`   | VARCHAR     | Password terenkripsi (bcrypt) |
| `role`       | ENUM        | 'admin', 'editor' (future)    |
| `created_at` | TIMESTAMP   | Waktu pembuatan akun          |
| `updated_at` | TIMESTAMP   | Waktu update terakhir         |

#### `comics` - Katalog Komik

Menyimpan informasi utama setiap judul komik.

| Field         | Type        | Keterangan                                 |
| ------------- | ----------- | ------------------------------------------ |
| `id`          | INT PK      | Identifier unik                            |
| `title`       | VARCHAR     | Judul komik (cth: "One Piece")             |
| `slug`        | VARCHAR UNQ | URL-friendly identifier (cth: "one-piece") |
| `synopsis`    | LONGTEXT    | Sinopsis cerita lengkap                    |
| `author`      | VARCHAR     | Nama pengarang/penulis                     |
| `artist`      | VARCHAR     | Nama ilustrator/seniman                    |
| `cover_image` | VARCHAR     | Path ke file cover (guest/covers/)         |
| `status`      | ENUM        | 'Ongoing', 'Completed', 'Hiatus'           |
| `rating`      | DECIMAL     | Rating 1-10 dari user (future)             |
| `view_count`  | INT         | Total views (untuk statistik)              |
| `created_at`  | TIMESTAMP   | Tanggal upload ke platform                 |
| `updated_at`  | TIMESTAMP   | Tanggal update terakhir                    |

#### `genres` - Kategori

Master data untuk klasifikasi genre komik.

| Field         | Type        | Keterangan                                       |
| ------------- | ----------- | ------------------------------------------------ |
| `id`          | INT PK      | Identifier unik                                  |
| `name`        | VARCHAR     | Nama genre (cth: "Action", "Romance", "Mystery") |
| `slug`        | VARCHAR UNQ | URL-friendly version                             |
| `description` | TEXT        | Deskripsi genre (opsional)                       |
| `icon`        | VARCHAR     | Path ke icon genre (future)                      |
| `created_at`  | TIMESTAMP   | -                                                |
| `updated_at`  | TIMESTAMP   | -                                                |

#### `types` - Tipe Format Komik

Master data untuk membedakan format/asal komik.

| Field        | Type        | Keterangan                                         |
| ------------ | ----------- | -------------------------------------------------- |
| `id`         | INT PK      | Identifier unik                                    |
| `name`       | VARCHAR     | Nama type ("Manga", "Manhua", "Manhwa", "Webtoon") |
| `slug`       | VARCHAR UNQ | URL-friendly version                               |
| `created_at` | TIMESTAMP   | -                                                  |
| `updated_at` | TIMESTAMP   | -                                                  |

#### `chapters` - Daftar Chapter

Menyimpan setiap chapter/episode dalam komik.

| Field            | Type      | Keterangan                                     |
| ---------------- | --------- | ---------------------------------------------- |
| `id`             | INT PK    | Identifier unik                                |
| `comic_id`       | INT FK    | Relasi ke tabel comics                         |
| `chapter_number` | DECIMAL   | Nomor chapter (cth: 1, 10.5, 50 untuk special) |
| `title`          | VARCHAR   | Judul chapter (opsional)                       |
| `published_at`   | TIMESTAMP | Tanggal rilis chapter                          |
| `page_count`     | INT       | Total halaman dalam chapter                    |
| `created_at`     | TIMESTAMP | -                                              |
| `updated_at`     | TIMESTAMP | -                                              |

### 🔗 Tabel Relasi & Detail

#### `comic_genre` - Pivot Table

Relasi Many-to-Many antara komik dan genre (1 komik bisa multi-genre).

| Field      | Type        | Keterangan                               |
| ---------- | ----------- | ---------------------------------------- |
| `comic_id` | INT FK      | Relasi ke comics                         |
| `genre_id` | INT FK      | Relasi ke genres                         |
|            | PRIMARY KEY | (comic_id, genre_id) - mencegah duplikat |

#### `comic_type` - Pivot Table (Future)

Relasi Many-to-Many antara komik dan type format.

| Field      | Type        | Keterangan          |
| ---------- | ----------- | ------------------- |
| `comic_id` | INT FK      | Relasi ke comics    |
| `type_id`  | INT FK      | Relasi ke types     |
|            | PRIMARY KEY | (comic_id, type_id) |

#### `chapter_images` - Halaman Komik

Menyimpan setiap halaman/panel dalam chapter.

| Field         | Type      | Keterangan                                            |
| ------------- | --------- | ----------------------------------------------------- |
| `id`          | INT PK    | Identifier unik                                       |
| `chapter_id`  | INT FK    | Relasi ke chapters                                    |
| `image_path`  | VARCHAR   | Path file gambar (guest/chapters/)                    |
| `page_number` | TINYINT   | Urutan halaman (1, 2, 3, ...) - PENTING untuk sorting |
| `image_size`  | INT       | Ukuran file dalam bytes (metadata)                    |
| `width`       | SMALLINT  | Lebar gambar (pixel)                                  |
| `height`      | SMALLINT  | Tinggi gambar (pixel)                                 |
| `created_at`  | TIMESTAMP | -                                                     |

**Index Rekomendasi:**

-   `chapters(comic_id)` - untuk query cepat chapter by comic
-   `chapter_images(chapter_id, page_number)` - untuk load halaman berurutan

---

## 👥 Struktur Tim & Tanggung Jawab

**Komposisi:** 2 Backend Developer + 2 Frontend Developer

### 🔧 Backend Team (Laravel 11)

**Fokus:** REST API, Database Design, Business Logic, Security, File Management

#### Backend Lead - Infrastructure & Auth

**Tanggung Jawab:**

-   ✅ Setup project Laravel 11 dengan struktur yang scalable
-   ✅ Konfigurasi environment dan database
-   ✅ Database migrations untuk tabel `users`, `comics`, `genres`, `types`
-   ✅ Implementasi Authentication & Authorization (Sanctum/JWT)
    -   Admin login endpoint
    -   Token refresh mechanism
    -   Role-based access control (future)
-   ✅ CRUD API untuk Genre Management
-   ✅ Database seeding dengan data dummy untuk testing
-   ✅ API Documentation (Postman collection atau Swagger)
-   ✅ Error handling & response standardization

**Deliverables:**

```
- POST /api/auth/login (Admin)
- POST /api/auth/logout
- GET /api/genres (Admin & Guest)
- POST /api/genres (Admin only)
- PUT /api/genres/{id} (Admin only)
- DELETE /api/genres/{id} (Admin only)
```

#### Backend Developer - Comics & Content

**Tanggung Jawab:**

-   ✅ Database migrations untuk `chapters`, `chapter_images`, `comic_type`
-   ✅ Comic Management API (CRUD + Cover Upload)
    -   Cover image upload dengan validasi & compression
    -   Slug generation otomatis
-   ✅ Chapter Management
    -   Create/Edit/Delete chapter
    -   Bulk image upload untuk halaman komik
    -   Image ordering & storage optimization
-   ✅ Guest Read-Only API (untuk user pengunjung)
    -   Optimized query dengan pagination
    -   Caching untuk performa
-   ✅ File storage management
    -   Organize uploaded files secara efisien
    -   Cleanup mechanism untuk file orphan
-   ✅ Unit tests untuk critical functions

**Deliverables:**

```
Admin Endpoints:
- POST /api/comics (Create with cover)
- PUT /api/comics/{id} (Edit)
- DELETE /api/comics/{id}
- POST /api/comics/{id}/chapters
- PUT /api/chapters/{id}
- DELETE /api/chapters/{id}
- POST /api/chapters/{id}/upload-pages (Bulk image upload)

Guest Endpoints:
- GET /api/comics (List with filters)
- GET /api/comics/{slug} (Detail + chapters)
- GET /api/chapters/{id}/images (All pages)
- GET /api/genres
```

---

### 🎨 Frontend Team (React 18 + TypeScript + Tailwind + Shadcn/ui)

**Fokus:** UI/UX, Responsive Design, API Integration, User Experience

#### Frontend Lead - Guest Interface

**Tanggung Jawab:**

-   ✅ Desain & implementasi Homepage
    -   Hero section dengan featured comics
    -   Grid komik dengan lazy loading
    -   Filter & search functionality
-   ✅ Detail Page
    -   Comic info (cover, sinopsis, author, rating)
    -   Chapter list dengan sorting
    -   Genre badges
-   ✅ **Reader Feature (Core)**
    -   Vertical scrolling infinite load
    -   Or: Page-by-page viewer dengan slider
    -   Next/Prev chapter navigation
    -   Progress indicator
    -   Responsive untuk mobile/tablet
-   ✅ Search & Filter System
    -   Real-time search
    -   Filter by genre
    -   Sort by newest/popular/rating
-   ✅ Performance optimization
    -   Image lazy loading
    -   Code splitting
    -   State management (Zustand/Redux)

**Key Features:**

-   Smooth reading experience
-   Responsive design mobile-first
-   Loading skeleton untuk better UX
-   Favorite comics (local storage - future: database)

#### Frontend Developer - Admin Dashboard

**Tanggung Jawab:**

-   ✅ Admin authentication flow
    -   Login form integration dengan API
    -   Token storage & refresh handling
    -   Protected routes
-   ✅ Admin Dashboard Layout
    -   Sidebar navigation
    -   User profile & logout
    -   Dashboard overview (stats cards)
-   ✅ Comic Management UI
    -   Form untuk create/edit comic
    -   Image upload preview
    -   Genre multi-select
    -   Comic listing table dengan pagination
    -   Edit & delete actions
-   ✅ Chapter Management UI
    -   Chapter listing per comic
    -   **Advanced:** Drag & drop multiple images upload
    -   Page reordering
    -   Preview sebelum publish
-   ✅ Genre Management
    -   Simple CRUD interface
-   ✅ Error handling & validation
    -   Form validation
    -   Toast notifications
    -   Error boundaries

**Tech Stack:**

-   React Hook Form (form management)
-   TanStack Query (data fetching)
-   React Router (navigation)
-   Shadcn/ui (components)
-   Tailwind CSS (styling)

---

## 🎬 Alur Penggunaan Aplikasi

### Flow Admin

```
1. Admin buka platform
   ↓
2. Login dengan email & password
   ↓
3. Dashboard
   ├─ Manage Genre → Create "Action", "Comedy", "Drama"
   ├─ Create Comic Baru
   │  ├─ Input Judul, Sinopsis, Author
   │  ├─ Upload Cover Image
   │  ├─ Pilih Genre (multi-select)
   │  └─ Simpan
   │
   └─ Open Comic yang sudah dibuat
      ├─ Add Chapter Baru
      │  ├─ Input Chapter Number & Title
      │  ├─ Drag & Drop upload 20 gambar halaman
      │  ├─ Verifikasi urutan halaman
      │  └─ Publish Chapter
      │
      └─ Edit/Delete existing chapters
```

### Flow User (Pengunjung)

```
1. User buka homepage
   ↓
2. Lihat featured & grid komik terbaru
   ↓
3. Filter by genre (Action, Romance, dll) atau search
   ↓
4. Click komik → Lihat detail + chapter list
   ↓
5. Pilih chapter → Baca komik (vertical scroll atau page viewer)
   ↓
6. Navigasi next/prev chapter
   ↓
7. Back to homepage atau favorite komik ini
```

---

## 📅 Timeline & Milestone

### Phase 1: Foundation (Week 1-2)

-   [ ] Project setup (Laravel + React boilerplate)
-   [ ] Database design finalization & migrations
-   [ ] Basic authentication implementation
-   [ ] API documentation

### Phase 2: Core Features (Week 3-4)

-   [ ] Genre CRUD API & UI
-   [ ] Comic management (create, upload cover, edit, delete)
-   [ ] Chapter management
-   [ ] Guest API endpoints

### Phase 3: Advanced Features (Week 5-6)

-   [ ] Bulk image upload untuk chapter pages
-   [ ] Admin dashboard styling & UX polish
-   [ ] Reader implementation (vertical scroll + pagination)
-   [ ] Search & filter optimization

### Phase 4: Polish & Testing (Week 7-8)

-   [ ] Unit tests & integration tests
-   [ ] Performance optimization
-   [ ] Bug fixes & refinement
-   [ ] Deployment preparation

---

## 🛠️ Tech Stack Summary

| Layer             | Technology                           | Version |
| ----------------- | ------------------------------------ | ------- |
| **Backend**       | Laravel                              | 11.x    |
| **API**           | REST (Sanctum)                       | -       |
| **Database**      | MySQL/PostgreSQL                     | Latest  |
| **Frontend**      | React                                | 18.x    |
| **Language**      | TypeScript                           | 5.x     |
| **Styling**       | Tailwind CSS                         | 3.x     |
| **UI Components** | Shadcn/ui                            | Latest  |
| **State**         | Zustand/TanStack Query               | -       |
| **Testing**       | PHPUnit (Backend), Vitest (Frontend) | Latest  |

---

## 📝 Catatan Penting

✅ **Database Best Practices:**

-   Gunakan soft deletes untuk comics & chapters (future)
-   Index pada `slug`, `comic_id`, `chapter_id`, `page_number`
-   Implement database transactions untuk bulk operations

✅ **Security:**

-   Validate & sanitize semua input
-   Use CORS properly untuk API
-   Implement rate limiting untuk upload
-   Secure file storage (tidak guest/downloadable langsung)

✅ **Performance:**

-   Image compression pada upload
-   Paginate large lists
-   Cache frequently accessed data
-   Lazy load images di frontend
-   CDN untuk static assets (future)

✅ **Maintainability:**

-   Follow PSR-12 (PHP) dan ESLint config (JS)
-   Write meaningful commits
-   Comment complex logic
-   Keep components small & reusable

---

**Last Updated:** December 6, 2025
