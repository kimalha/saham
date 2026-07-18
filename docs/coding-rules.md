# Coding & Development Rules

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini mendefinisikan standar pengodean (*coding standards*), aturan arsitektur, konvensi penamaan, dan pola penanganan kesalahan (*error handling*) yang wajib diikuti oleh seluruh pengembang dalam proyek SPK Saham LQ45.

---

## 1. Aturan Arsitektur & Ketergantungan (Clean Architecture Rules)

Untuk menjaga modularitas dan mempermudah pengujian, aturan ketergantungan antar-lapisan berikut wajib dipatuhi:

* **Prinsip Ketergantungan Satu Arah:** Lapisan dalam (*domain/business*) tidak boleh mengetahui atau mengimpor apa pun dari lapisan luar (*presentation/repository/framework*).
* **Bebas Logika di UI:** Komponen React Native hanya bertindak sebagai representasi visual. Seluruh perhitungan matematis TOPSIS, penyaringan data yang kompleks, dan pemanggilan API harus diisolasi ke dalam hooks (React Query), helper, atau modul terpisah.
* **Validasi Input Terpusat:** Setiap data yang masuk ke sistem (dari form UI maupun request body API) harus divalidasi menggunakan skema **Zod** sebelum diproses lebih lanjut.

---

## 2. Konvensi Penamaan (Naming Conventions)

### 2.1 Berkas dan Direktori
* **Folder:** Menggunakan format *kebab-case* (contoh: `src/components/stock-card/`).
* **Komponen React:** Menggunakan format *PascalCase* (contoh: `StockDetailsScreen.tsx`, `CustomSlider.tsx`).
* **Berkas Logika / Hooks / Helper:** Menggunakan format *camelCase* (contoh: `useTopsisAnalysis.ts`, `topsisEngine.ts`).

### 2.2 Kode Program (TypeScript)
* **Variabel & Fungsi:** Menggunakan *camelCase* (contoh: `const peWeight = 25;`, `function calculateEuclideanDistance()`).
* **Class & Interface / Type:** Menggunakan *PascalCase* (contoh: `interface StockAlternative`, `class TopsisCalculationException`).
* **Konstanta / Enum:** Menggunakan *UPPER_SNAKE_CASE* (contoh: `const MAX_CRITERIA_COUNT = 4;`).

### 2.3 Endpoint API RESTful
* Menggunakan huruf kecil dan bentuk jamak (*plural noun*) untuk resource (contoh: `GET /api/stocks`, `DELETE /api/history/:id`).
* Menggunakan kata kerja untuk aksi spesifik yang bukan CRUD (contoh: `POST /api/stocks/sync`, `POST /api/analysis`).

---

## 3. Aturan TypeScript & Tipe Data

* **Strict Mode Aktif:** Berkas `tsconfig.json` harus mengaktifkan `"strict": true`.
* **Hindari Penggunaan `any`:** Seluruh parameter fungsi, variabel, dan nilai kembalian (*return type*) wajib dideklarasikan tipenya secara eksplisit. Jika terpaksa menerima data dinamis, gunakan tipe `unknown` dan lakukan *type casting* atau validasi tipe terlebih dahulu.
* **Tipe Data untuk Uang / Nilai Desimal:** Perhitungan rasio keuangan dan TOPSIS harus dihitung menggunakan tipe data `number` di TypeScript. Di tingkat database MySQL, gunakan tipe data `DECIMAL` untuk mencegah galat pembulatan bilangan pecahan (*floating-point rounding error*).

---

## 4. Penanganan Kesalahan (Error Handling Pattern)

* **Gunakan Try-Catch yang Bermakna:** Jangan menangkap error tanpa melakukan penanganan atau logging.
* **Error Handling di Express API:** Gunakan middleware penanganan error terpusat. Kirim response yang bersih kepada pengguna dan simpan detail error ke server log.
  ```typescript
  // Contoh Response Error API
  {
    "status": "error",
    "message": "Pesan error yang ramah pengguna (contoh: Total bobot kriteria harus tepat 100%)",
    "code": "VALIDATION_ERROR"
  }
  ```
* **Error Handling di React Native:** Tampilkan umpan balik visual yang jelas (seperti Banner Merah atau Toast Error) saat terjadi kegagalan jaringan atau input tidak valid, agar pengguna tidak bingung.

---

## 5. Standar Commit Git (Git Commit Guidelines)

Pesan commit harus mengikuti standar *Conventional Commits* untuk mempermudah pelacakan perubahan:

* **Format:** `<type>(<scope>): <subject>`
* **Type yang diperbolehkan:**
  * `feat`: Fitur baru.
  * `fix`: Perbaikan bug/error.
  * `docs`: Pembaruan atau penulisan dokumentasi baru.
  * `style`: Perubahan format kode (Prettier, Linter, spasi) tanpa mengubah logika program.
  * `refactor`: Restrukturisasi kode untuk meningkatkan kualitas tanpa menambah fitur.
  * `test`: Penulisan atau perbaikan unit testing.
  * `chore`: Pembaruan dependency, konfigurasi build tool, dll.
* **Contoh Commit:**
  * `feat(topsis): add logic for calculating positive and negative ideal solutions`
  * `fix(api): resolve decimal rounding bug in der criteria ranking`
  * `docs(readme): update backend installation steps`
