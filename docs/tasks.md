# Project Implementation Tasks

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini berisi peta jalan (*roadmap*) pengembangan proyek dan daftar tugas (*backlog*) terstruktur untuk memantau kemajuan implementasi aplikasi SPK Saham LQ45.

---

## Peta Jalan Implementasi (Project Roadmap)

```
[M1: Inisialisasi & Database] ──> [M2: TOPSIS Core Engine] ──> [M3: Express API Development]
                                                                        │
[M6: Integrasi & Pengujian] <── [M5: Grafis & Ekspor File] <── [M4: React Native UI Setup]
```

---

## Daftar Tugas Detail (Backlog Tasks)

### 🚀 Milestone 1: Inisialisasi Proyek & Desain Database (Target: Minggu 1)
- [ ] **Task 1.1:** Setup repository git dan struktur direktori proyek monorepo (`/backend`, `/frontend`, `/docs`).
- [ ] **Task 1.2:** Inisialisasi backend Node.js dengan TypeScript, Express.js, dan Linter (ESLint/Prettier).
- [ ] **Task 1.3:** Setup database MySQL, instalasi Sequelize ORM, dan konfigurasi berkas `.env` untuk koneksi lokal.
- [ ] **Task 1.4:** Buat skema migrasi tabel database: `stocks`, `criteria`, dan `analysis_histories`.
- [ ] **Task 1.5:** Buat skrip seeder awal untuk data kriteria (PE, ROE, DER, Div. Yield) dan contoh 5 saham alternatif awal.

### 🧮 Milestone 2: Core TOPSIS Engine (Target: Minggu 2)
- [ ] **Task 2.1:** Tulis fungsi normalisasi matriks keputusan ($r_{ij} = \frac{x_{ij}}{\sqrt{\sum x_{ij}^2}}$) dalam TypeScript.
- [ ] **Task 2.2:** Tulis fungsi pembuatan matriks keputusan ternormalisasi terbobot ($y_{ij} = w_j \cdot r_{ij}$).
- [ ] **Task 2.3:** Tulis fungsi penentuan solusi ideal positif ($A^+$) dan negatif ($A^-$) berdasarkan tipe kriteria (Cost/Benefit).
- [ ] **Task 2.4:** Tulis fungsi perhitungan jarak Euclidean alternatif ke solusi ideal ($D_i^+$ dan $D_i^-$).
- [ ] **Task 2.5:** Tulis fungsi perhitungan nilai preferensi ($V_i = \frac{D_i^-}{D_i^+ + D_i^-}$) dan pengurutan ranking.
- [ ] **Task 2.6:** Buat *unit testing* menggunakan Jest untuk memvalidasi presisi matematika TOPSIS terhadap contoh perhitungan manual (akurasi 100%).

### 🔌 Milestone 3: Express REST API (Target: Minggu 2)
- [ ] **Task 3.1:** Implementasikan CRUD REST API untuk manajemen saham alternatif (`GET`, `POST`, `PUT`, `DELETE` `/api/stocks`).
- [ ] **Task 3.2:** Integrasikan validasi request body menggunakan pustaka **Zod** untuk mencegah data numerik tidak valid.
- [ ] **Task 3.3:** Buat handler upload file (`POST /api/stocks/import`) menggunakan Multer untuk membaca CSV dan Excel.
- [ ] **Task 3.4:** Implementasikan API endpoint `POST /api/analysis` yang memanggil data database dan mengeksekusi TOPSIS Core Engine, lalu mengembalikan data hasil ranking.
- [ ] **Task 3.5:** Implementasikan endpoint pengelolaan riwayat analisis (`GET`, `DELETE` `/api/history`).

### 📱 Milestone 4: Frontend UI React Native (Expo) (Target: Minggu 3)
- [ ] **Task 4.1:** Inisialisasi proyek React Native menggunakan **Expo CLI** dengan template TypeScript.
- [ ] **Task 4.2:** Konfigurasi navigasi aplikasi menggunakan **React Navigation** (Bottom Tabs dan Stack Navigators).
- [ ] **Task 4.3:** Desain UI Dashboard Screen (Menampilkan ringkasan statistik dan riwayat analisis terakhir).
- [ ] **Task 4.4:** Desain UI Stock List Screen (Dilengkapi fitur pencarian, filter, dan tombol pintas ke form tambah/impor).
- [ ] **Task 4.5:** Desain UI Weight Setup Screen (Menggunakan slider interaktif dan penanda akumulasi total 100%).

### 📊 Milestone 5: Integrasi API, Visualisasi & Ekspor Laporan (Target: Minggu 4)
- [ ] **Task 5.1:** Hubungkan frontend dengan REST API backend menggunakan **Axios** dan **React Query** untuk pengelolaan state server.
- [ ] **Task 5.2:** Implementasikan visualisasi ranking di Hasil Screen menggunakan grafik batang dari **Victory Native XL**.
- [ ] **Task 5.3:** Implementasikan perbandingan kinerja kriteria menggunakan radar chart untuk 3 saham teratas.
- [ ] **Task 5.4:** Implementasikan pembuatan dokumen laporan PDF hasil analisis di sisi frontend/backend.
- [ ] **Task 5.5:** Implementasikan ekspor lembar kerja Excel (berisi langkah matriks keputusan) untuk kebutuhan akademis.

### 🧪 Milestone 6: Pengujian Sistem & Rilis (Target: Minggu 4)
- [ ] **Task 6.1:** Lakukan uji fungsionalitas keseluruhan alur aplikasi (*End-to-End Testing*) di emulator Android/iOS.
- [ ] **Task 6.2:** Uji skenario kesalahan (contoh: input file CSV acak, API backend mati, bobot tidak seimbang).
- [ ] **Task 6.3:** Uji kinerja aplikasi pada perangkat fisik untuk memverifikasi waktu startup (< 3s) dan perhitungan (< 2s).
- [ ] **Task 6.4:** Lakukan audit kode untuk memastikan kepatuhan terhadap aturan *Clean Architecture* dan *Coding Rules*.
