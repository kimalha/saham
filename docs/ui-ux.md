
# UI/UX Specification

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini mendefinisikan pedoman desain antarmuka (*UI Design System*), skema warna, tipografi, komponen utama, serta tata letak layar (*layout templates*) untuk aplikasi mobile SPK Saham LQ45.

---

## 1. Panduan Desain Visual (Design System)

Untuk memberikan impresi modern, premium, dan profesional, aplikasi dirancang menggunakan tema **Dark Mode** sebagai setelan utama dengan skema warna yang kontras dan harmonis.

### 1.1 Skema Warna (Color Palette)
Aplikasi menggunakan sistem pewarnaan berbasis HSL/Hex berikut:

| Peran Warna | Hex Code | Keterangan |
| :--- | :--- | :--- |
| **Primary Background** | `#0B0F19` | Latar belakang utama (Gelap/Navy pekat). |
| **Secondary Background** | `#161F30` | Latar belakang kartu, form, dan kontainer. |
| **Accent Primary** | `#3B82F6` | Biru terang untuk tombol utama, link, dan highlight. |
| **Success / Benefit Accent**| `#10B981` | Hijau Emerald untuk kriteria bertipe *Benefit* dan indikator positif. |
| **Danger / Cost Accent** | `#EF4444` | Merah Crimson untuk kriteria bertipe *Cost* dan indikator error. |
| **Text Primary** | `#F3F4F6` | Putih abu-abu terang untuk kontras teks utama. |
| **Text Secondary** | `#9CA3AF` | Abu-abu medium untuk label, deskripsi, dan info sekunder. |

### 1.2 Tipografi
Menggunakan font sistem modern (San Francisco di iOS / Roboto di Android) dengan hierarki ketebalan:
* **H1 (Header Utama):** 24pt, Bold
* **H2 (Sub-Header):** 18pt, Semi-Bold
* **Body Text (Teks Konten):** 14pt, Regular
* **Caption / Label:** 12pt, Light

---

## 2. Tata Letak Layar Utama (Screen Layout Mockups)

### 2.1 Layar Dashboard
Layar utama yang menampilkan rangkuman cepat status aplikasi kepada pengguna.
```
+---------------------------------------------------+
|  [Logo SPK] Saham LQ45                            |
+---------------------------------------------------+
|  Statistik Data                                   |
|  +-------------------+   +--------------------+   |
|  | Saham Terdaftar   |   | Analisis Terakhir  |   |
|  | 45 Saham          |   | 18-07-2026         |   |
|  +-------------------+   +--------------------+   |
|                                                   |
|  Hasil Rekomendasi Terakhir                       |
|  +---------------------------------------------+  |
|  | #1 BBCA (V = 0.8920)                        |  |
|  | Bobot: PE(25%) ROE(30%) DER(20%) DIV(25%)   |  |
|  +---------------------------------------------+  |
|                                                   |
|  [   MULAI ANALISIS BARU (Button)             ]   |
+---------------------------------------------------+
```

### 2.2 Layar Pengaturan Bobot (Weight Setup)
Form interaktif untuk mengatur bobot kriteria sebelum analisis.
```
+---------------------------------------------------+
|  < Kembali      PENGATURAN BOBOT                  |
+---------------------------------------------------+
|  Sesuaikan Bobot Kriteria (Total Wajib 100%)       |
|                                                   |
|  PE Ratio (Cost)                                  |
|  [=========o------------------------]  25%        |
|                                                   |
|  ROE (Benefit)                                    |
|  [============o---------------------]  30%        |
|                                                   |
|  DER (Cost)                                       |
|  [========o-------------------------]  20%        |
|                                                   |
|  Dividend Yield (Benefit)                         |
|  [==========o-----------------------]  25%        |
|                                                   |
|  +---------------------------------------------+  |
|  | Status: TOTAL BOBOT PAS 100% (Warna Hijau)  |  |
|  +---------------------------------------------+  |
|                                                   |
|  [        HITUNG PERINGKAT SAHAM              ]   |
+---------------------------------------------------+
```

---

## 3. Komponen Visualisasi Data & Animasi

### 3.1 Visualisasi Grafik
* **Grafik Batang (Bar Chart):** Digunakan untuk menampilkan peringkat preferensi ($V_i$) secara horizontal dari nilai tertinggi ke terendah, memudahkan perbandingan kontras nilai preferensi.
* **Radar Chart:** Menampilkan performa 3 alternatif saham teratas pada satu bidang grafik. Setiap sumbu radar mewakili nilai ternormalisasi dari PE Ratio, ROE, DER, dan Dividend Yield.

### 3.2 Animasi Mikro (*Micro-Animations*)
Untuk meningkatkan kepuasan pengguna (*delight*), animasi transisi berikut diimplementasikan:
* **Progress Loader:** Efek *shimmer* pada kartu daftar saham saat memuat data dari API.
* **Analisis Progress:** Efek putaran ikon memutar (*lottie spinner*) yang dinamis saat kalkulasi TOPSIS dijalankan di backend untuk memberikan feedback proses komputasi.
* **Slider Snap:** Animasi geser yang halus pada slider bobot yang otomatis mengunci pada kelipatan 5%.
