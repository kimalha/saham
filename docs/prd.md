# Product Requirements Document (PRD)

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

---

## 1. Status & Informasi Dokumen

* **Status:** Approved
* **Versi:** 1.0.0
* **Tanggal:** 18 Juli 2026
* **Owner:** Tim Product & Engineering

---

## 2. Deskripsi & Tujuan Produk

Tujuan utama dari aplikasi ini adalah untuk menyediakan sistem pendukung keputusan yang andal, efisien, dan transparan bagi investor ritel, pemula, dan akademisi dalam memilih saham-saham LQ45 menggunakan metode TOPSIS berdasarkan data fundamental keuangan.

---

## 3. Matriks Keberhasilan (Success Metrics)

Untuk memastikan aplikasi berjalan dengan baik dan memberikan nilai bagi pengguna, metrik berikut harus dipenuhi:

| Area | Metrik | Target |
| :--- | :--- | :--- |
| **Kinerja Perhitungan** | Kecepatan eksekusi perhitungan algoritma TOPSIS | < 2 detik untuk 100 alternatif (saham) |
| **Responsivitas Aplikasi** | Waktu pemuatan awal aplikasi (cold start) | < 3 detik |
| **Keberhasilan Pengguna** | Tingkat penyelesaian alur analisis tanpa bantuan | 100% (berdasarkan pengujian usability) |
| **Ketepatan Data** | Akurasi hasil perhitungan dibandingkan perhitungan manual | 100% presisi matematis |
| **Ekspor Laporan** | Waktu yang dibutuhkan untuk membuat file PDF/Excel | < 3 detik |

---

## 4. Aturan Bisnis (Business Rules)

### 4.1 Kriteria Penilaian
Aplikasi mendukung tepat 4 kriteria fundamental keuangan dengan ketentuan sebagai berikut:

1. **Price to Earnings (PE) Ratio**
   * **Tipe:** Cost (Semakin kecil nilainya, semakin baik/murah)
   * **Nilai Ideal:** < 15
2. **Return on Equity (ROE)**
   * **Tipe:** Benefit (Semakin besar nilainya, semakin baik/menguntungkan)
   * **Nilai Ideal:** > 15%
3. **Debt to Equity Ratio (DER)**
   * **Tipe:** Cost (Semakin kecil nilainya, semakin baik/aman)
   * **Nilai Ideal:** < 1 (atau < 100%)
4. **Dividend Yield**
   * **Tipe:** Benefit (Semakin besar nilainya, semakin baik/menguntungkan)
   * **Nilai Ideal:** > 4%

### 4.2 Batasan Bobot (Weight Constraints)
* Total nilai bobot yang dimasukkan oleh pengguna untuk keempat kriteria di atas **wajib berjumlah tepat 100%** (atau 1.0 dalam skala desimal).
* Jika total bobot tidak sama dengan 100%, sistem harus memblokir jalannya proses analisis dan menampilkan pesan peringatan.

---

## 5. Kebutuhan Fungsional (Functional Requirements)

Berikut adalah daftar kebutuhan fungsional sistem:

| ID Kebutuhan | Deskripsi Fungsional | Prioritas |
| :--- | :--- | :--- |
| **FR-01** | Pengguna dapat menambahkan data saham (alternatif) baru secara manual. | High |
| **FR-02** | Pengguna dapat mengubah (edit) data kriteria saham yang sudah ada. | High |
| **FR-03** | Pengguna dapat menghapus data saham dari daftar alternatif. | High |
| **FR-04** | Pengguna dapat mengimpor data saham dalam jumlah banyak menggunakan file Excel (.xlsx) atau CSV. | Medium |
| **FR-05** | Pengguna dapat melakukan sinkronisasi data saham LQ45 secara otomatis dari Financial API yang disediakan. | Medium |
| **FR-06** | Sistem memvalidasi seluruh data input saham untuk memastikan tidak ada nilai kosong atau karakter non-numerik sebelum proses analisis dijalankan. | High |
| **FR-07** | Pengguna dapat menyesuaikan bobot untuk masing-masing kriteria (PE, ROE, DER, Dividend Yield). | High |
| **FR-08** | Sistem memvalidasi bahwa total bobot kriteria harus tepat 100%. | High |
| **FR-09** | Sistem menjalankan perhitungan metode TOPSIS sesuai dengan standar matematika (Matriks Keputusan -> Normalisasi -> Matriks Terbobot -> Solusi Ideal Positif & Negatif -> Jarak Solusi -> Nilai Preferensi). | High |
| **FR-10** | Sistem menghasilkan dan menampilkan daftar peringkat (ranking) saham berdasarkan nilai preferensi tertinggi ke terendah. | High |
| **FR-11** | Sistem menyediakan halaman detail yang menampilkan visualisasi seluruh tahapan perhitungan TOPSIS. | High |
| **FR-12** | Sistem menampilkan hasil analisis dalam bentuk grafik (grafik batang peringkat dan radar chart perbandingan). | Medium |
| **FR-13** | Pengguna dapat mengekspor hasil analisis dan peringkat saham ke dalam format file PDF. | Medium |
| **FR-14** | Pengguna dapat mengekspor hasil analisis dan tabel perhitungan ke dalam format file Excel. | Medium |
| **FR-15** | Sistem menyimpan riwayat analisis yang telah dilakukan lengkap dengan bobot dan data alternatif saat analisis dijalankan. | High |

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

* **Arsitektur:** Menggunakan *Clean Architecture* dengan pemisahan yang jelas antara Presentation Layer, Application Layer, Business/Domain Layer, dan Data/Repository Layer.
* **Teknologi:** React Native (Expo) untuk Frontend, Node.js & Express untuk API Backend, dan MySQL sebagai database dengan Sequelize ORM.
* **Ketersediaan & Keamanan:** 
  * Validasi input di sisi klien dan server untuk mencegah SQL Injection dan input tidak valid.
  * Penyimpanan konfigurasi sensitif menggunakan environment variables (`.env`).
* **Aksesibilitas:** 
  * Ukuran target sentuh minimal 44x44 dp pada layar mobile.
  * Kontras warna yang cukup dan dukungan untuk dynamic text sizing.
  * Penyajian data chart juga harus didukung dengan tabel padanannya untuk aksesibilitas pembaca layar.

---

## 7. Kriteria Penerimaan (Acceptance Criteria)

1. Pengguna harus dapat menyelesaikan satu siklus analisis (Input data -> Atur bobot -> Jalankan TOPSIS -> Lihat hasil) tanpa mengalami crash atau error aplikasi.
2. Hasil peringkat saham harus berubah secara dinamis dan presisi saat pengguna melakukan perubahan pada bobot kriteria.
3. Seluruh dokumen hasil ekspor (PDF dan Excel) harus berisi data alternatif yang valid, nilai preferensi, dan informasi bobot yang digunakan saat analisis.
4. Setiap langkah matematika dalam perhitungan TOPSIS (termasuk matriks normalisasi dan penentuan solusi ideal) harus dapat diakses dan diverifikasi kebenarannya oleh pengguna di layar detail perhitungan.