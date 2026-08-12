# Toko Sembako Ariesta — Website & REST API

**Nama :** (isi nama kamu)
**NIM :** (isi NIM kamu)
**Kelas :** (isi kelas kamu)

## Deskripsi Singkat

Website toko sembako untuk UMKM "Toko Sembako Ariesta" milik Ibu Aries. Dibangun
dengan Node.js + Express.js (pola MVC: models/controllers/routes/views),
menggunakan EJS sebagai view engine. Menyediakan REST API CRUD produk lengkap
dengan autentikasi login admin berbasis session, serta fitur "Tanya AI" berupa
logika balasan dummy (keyword matching) yang diproses di backend — bukan API
AI pihak ketiga.

- **Sprint 1**: struktur halaman, styling responsif, server Express dasar, endpoint baca data.
- **Sprint 2**: REST API CRUD penuh, login admin (session + bcrypt), dashboard admin, fitur chat interaktif via Fetch API.

## Cara Menjalankan Project Secara Lokal

1. Install dependencies:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi `.env` dengan kredensial admin. Untuk membuat hash password baru:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('password_kamu', 10))"
   ```
   lalu tempel hasilnya ke `ADMIN_PASSWORD_HASH` di `.env`.
3. Jalankan server (mode development, auto-restart pakai nodemon):
   ```bash
   npm run dev
   ```
   atau jalankan biasa:
   ```bash
   npm start
   ```
4. Buka browser ke `http://localhost:3000`

**Kredensial admin untuk pengecekan (default):**
- Username: `admin`
- Password: `admin123`

## Struktur Folder (Pola MVC)

```
toko-sembako-ariesta/
├── app.js                    -> entry point server (setup Express, session, routing)
├── .env / .env.example       -> konfigurasi rahasia (kredensial admin, session secret)
├── models/                   -> "Model": sumber data & logic data
│   ├── productModel.js         -> data produk in-memory + fungsi CRUD
│   └── userModel.js             -> validasi kredensial admin (bcrypt)
├── controllers/               -> "Controller": logic request/response
│   ├── pageController.js        -> render halaman EJS
│   ├── authController.js        -> login & logout
│   ├── productController.js     -> REST API CRUD produk
│   └── chatController.js        -> logic balasan dummy Tanya AI
├── middleware/
│   ├── logger.js                -> mencatat tiap request ke terminal
│   └── auth.js                  -> proteksi halaman & endpoint (session-based)
├── routes/                    -> "Route": pemetaan URL ke controller
│   ├── web.js                    -> route halaman
│   └── api.js                     -> route REST API
├── views/                     -> "View": template EJS
│   ├── partials/navbar.ejs & footer.ejs
│   ├── index.ejs, produk.ejs, produk-detail.ejs, tanya-ai.ejs
│   ├── login.ejs, dashboard.ejs
└── public/
    ├── css/style.css
    └── js/ (main.js, produk.js, login.js, dashboard.js, chat.js)
```

## Daftar Endpoint API

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| POST | `/api/login` | Login admin/kasir dengan username & password | Publik |
| POST | `/api/logout` | Logout, menghapus sesi login | Login |
| GET | `/api/products` | Ambil semua produk (mendukung `?kategori=` & `?search=`) | Publik |
| GET | `/api/products/:id` | Ambil 1 produk berdasarkan ID | Publik |
| POST | `/api/products` | Tambah produk baru | Login |
| PUT | `/api/products/:id` | Update produk (harga/stok/nama/kategori) | Login |
| DELETE | `/api/products/:id` | Hapus produk | Login |
| POST | `/api/chat` | Kirim pertanyaan, terima balasan AI dummy | Publik |

Semua response API mengikuti format konsisten `{ status, message?, data? }`.
Endpoint yang butuh login akan menolak request tanpa sesi login dengan
response `{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }` dan HTTP status `401`.

## Penjelasan Tampilan (UI)

- **Navbar**: sticky, menu berubah otomatis — menampilkan "Login Admin" untuk pengunjung biasa, atau "Dashboard" + "Logout" kalau sudah login. Hamburger menu aktif di layar mobile (< 768px).
- **Beranda**: hero section + preview 3 produk terlaris (server-rendered dari model).
- **Produk (publik)**: halaman ini mengambil data produk secara dinamis lewat Fetch API ke `GET /api/products`, termasuk filter kategori & pencarian nama — semua tanpa reload halaman.
- **Detail Produk**: route dinamis `/produk/:id`, menampilkan pesan "Produk Tidak Ditemukan" untuk ID yang tidak valid/tidak ada.
- **Login**: form username & password dengan validasi dasar di frontend, mengirim request lewat Fetch API ke `POST /api/login`. Sesi login disimpan lewat cookie (express-session).
- **Dashboard** (hanya bisa diakses setelah login): form tambah/edit produk serta tabel produk yang bisa diedit/dihapus, semuanya lewat Fetch API tanpa reload halaman. Kalau sesi login habis di tengah jalan, sistem otomatis mengarahkan kembali ke halaman login.
- **Tanya AI**: chat bubble interaktif, mengirim pertanyaan ke `POST /api/chat` dan menampilkan balasan dari backend secara dinamis di DOM.

## Keamanan & Validasi

- Password admin disimpan sebagai **hash bcrypt** (bukan plain text), dan disimpan di `.env` (tidak ikut ter-push ke Git).
- Semua endpoint mutasi produk (POST/PUT/DELETE) diverifikasi status login-nya **di server** lewat middleware `requireLoginApi` — bukan cuma disembunyikan di frontend, sehingga tetap ditolak walau di-hit langsung lewat Postman tanpa login.
- Validasi input dilakukan di **dua sisi**: di frontend (JS) untuk mencegah submit form kosong/tidak valid demi UX, dan di backend (controller) sebagai penjaga terakhir sebelum data disimpan.
