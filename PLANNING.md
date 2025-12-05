# 🚀 Planning Web App Komik Sederhana

Dokumen ini berisi rancangan struktur database dan pembagian tugas tim untuk proyek Web App Komik (Laravel + React).

## 1. Struktur Database (Schema Design)

Kita menggunakan **Relational Database** (MySQL/MariaDB/PostgreSQL). Berikut adalah tabel-tabel yang diperlukan:

### A. Tabel Utama

**1. `users` (Admin)**
_Tabel bawaan Laravel, digunakan khusus untuk Admin login._

-   `id` (Primary Key)
-   `name` (Nama Admin)
-   `email` (Email Login)
-   `password` (Password Terenkripsi)
-   `timestamps` (created_at, updated_at)

**2. `comics` (Data Komik)**
_Menyimpan informasi umum tentang komik._

-   `id` (Primary Key)
-   `title` (Judul Komik, misal: "One Piece")
-   `slug` (URL friendly, misal: "one-piece" - _Unique_)
-   `synopsis` (Sinopsis/Deskripsi cerita - _Text_)
-   `author` (Nama Pengarang)
-   `cover_image` (Path lokasi file gambar sampul)
-   `status` (Enum: 'Ongoing', 'Completed')
-   `timestamps`

**3. `genres` (Kategori)**
_Master data untuk genre/kategori._

-   `id` (Primary Key)
-   `name` (Nama Genre, misal: "Action", "Romance", "Horror")
-   `slug` (misal: "action")
-   `timestamps`

**4. `types` (Tipe Comic)**
_Master data untuk Type Comic._

-   `id` (Primary Key)
-   `name` (Nama Type, misal: "Manhwa", "Manhua", "Manga")
-   `slug` (misal: "action")
-   `timestamps`

**5. `chapters` (List Chapter)**
_Menyimpan daftar chapter yang ada dalam satu komik._

-   `id` (Primary Key)
-   `comic_id` (Foreign Key -> comics)
-   `chapter_number` (Nomor Chapter, misal: 1, 10.5 - _Float/Decimal_)
-   `title` (Judul Chapter, opsional. Misal: "Pertarungan Dimulai")
-   `timestamps`

### B. Tabel Detail & Relasi

**6. `comic_genre` (Tabel Pivot / Penghubung)**
_Menangani relasi Many-to-Many (Satu komik bisa punya banyak genre)._

-   `comic_id` (Foreign Key -> comics)
-   `genre_id` (Foreign Key -> genres)
    _Kombinasi comic_id dan genre_id tidak boleh duplikat._

**7. `chapter_images` (Gambar Halaman Komik)**
_Menyimpan file gambar per halaman dalam satu chapter._

-   `id` (Primary Key)
-   `chapter_id` (Foreign Key -> chapters)
-   `image_path` (Lokasi file gambar halaman)
-   `page_number` (Urutan halaman: 1, 2, 3... penting agar halaman tidak acak)

---

## 2. Pembagian Tugas Tim (4 Orang)

Komposisi Tim: **2 Backend Developer** & **2 Frontend Developer**.

### 🛠️ Tim Backend (Laravel 10)

_Fokus: API, Database, Logika Bisnis, Keamanan._

**👤 Backend 1: System Architect & User Management**

-   **Inisialisasi Project:** Setup Laravel, Git Repository, dan konfigurasi `.env`.
-   **Database Migration:** Membuat file migration untuk tabel `users`, `genres`, `comics`, dan `comic_genre`.
-   **Auth API:** Membuat fitur Login & Logout untuk Admin (menggunakan Sanctum).
-   **Master Data Genre:** Membuat CRUD (Create, Read, Update, Delete) untuk Genre.
-   **Seeding:** Membuat data dummy (palsu) untuk user dan genre agar frontend bisa testing.

**👤 Backend 2: Core Logic & File Handling**

-   **Database Migration:** Membuat file migration untuk tabel `chapters` dan `chapter_images`.
-   **Comic CRUD:** Logika tambah/edit/hapus komik beserta upload cover image.
-   **Complex Logic (Chapter Upload):** Membuat fitur upload **Bulk Images** (banyak gambar sekaligus) untuk satu chapter, dan menyimpannya secara berurutan di database.
-   **Public API:** Membuat Endpoint khusus untuk pengunjung (User) yang "Read Only" (Cuma bisa baca, tidak bisa edit), misal:
    -   `GET /api/comics` (List semua komik)
    -   `GET /api/comics/{slug}` (Detail komik + list chapter)
    -   `GET /api/chapter/{id}` (Ambil semua gambar dalam 1 chapter)

---

### 🎨 Tim Frontend (React TS + Tailwind + Shadcn)

_Fokus: Tampilan, Interaksi User, Konsumsi API._

**👤 Frontend 1: Public Interface (User Pengunjung)**

-   **Homepage:** Mendesain halaman utama yang menampilkan Grid daftar komik (dengan filter Genre).
-   **Detail Page:** Halaman detail komik (Info Author, Sinopsis, List Chapter).
-   **Chapter Reader (Fitur Utama):** Membuat halaman baca komik.
    -   Tantangan: Menampilkan gambar panjang ke bawah (Vertical Scroll) atau per halaman (Slider).
    -   Fitur Navigasi: Tombol "Next Chapter" dan "Prev Chapter".
-   **Search:** Fitur pencarian judul komik.

**👤 Frontend 2: Admin Dashboard (Backoffice)**

-   **Login Page:** Halaman login admin yang terhubung ke API Auth.
-   **Admin Layout:** Sidebar menu (Dashboard, Manage Komik, Manage Genre).
-   **Form Input Komik:** Desain form untuk input judul, sinopsis, dan upload cover.
-   **Form Input Chapter (Advanced):** Desain form upload yang mendukung **Drag & Drop** banyak gambar sekaligus untuk halaman komik.
-   **Management Table:** Tabel daftar komik dengan tombol Edit & Delete.

---

## 3. Workflow Singkat

1. **Admin** login di Dashboard.
2. **Admin** membuat Genre (Action, Comedy, dll).
3. **Admin** membuat Komik baru (Upload Cover + Pilih Genre).
4. **Admin** masuk ke komik tersebut, lalu "Tambah Chapter".
5. **Admin** upload 20 gambar halaman komik sekaligus.
6. **User (Pengunjung)** membuka web, melihat daftar komik, memilih chapter, dan membaca.
