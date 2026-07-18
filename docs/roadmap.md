# Product Roadmap

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini mendefinisikan rencana rilis fitur, pengembangan jangka menengah, serta visi jangka panjang dari aplikasi SPK Saham LQ45.

---

## 1. Peta Jalan Pengembangan (Milestone Timeline)

```
[V1.0 - Core MVP] ───────> [V1.5 - Multi-Method & Sync] ───────> [V2.0 - Realtime & Web]
(Target: Q3 2026)          (Target: Q1 2027)                     (Target: Q3 2027)
```

---

## 2. Rincian Fase Rilis (Release Details)

### 🚀 Fase 1: Core MVP (V1.0) - Q3 2026
Fokus pada penyediaan fungsi dasar pengambil keputusan saham LQ45 secara mandiri berbasis mobile lokal.

* **Fitur Utama:**
  * Penghitungan TOPSIS pada 4 kriteria fundamental keuangan (PE, ROE, DER, Dividend Yield).
  * Manajemen alternatif saham lokal (Tambah, Edit, Hapus, dan Impor Excel/CSV).
  * Halaman transparansi yang menampilkan rincian matriks perhitungan.
  * Visualisasi grafik batang peringkat dan radar chart komparasi 3 saham terbaik.
  * Ekspor hasil analisis ke format PDF dan Excel.
  * Penyimpanan riwayat analisis lokal.
* **Teknologi:** React Native (Expo), Node.js, Express, MySQL.

---

### 📈 Fase 2: Ekspansi Fitur & Sinkronisasi Cloud (V1.5) - Q1 2027
Meningkatkan fleksibilitas metode keputusan dan integrasi penyimpanan awan (*cloud sync*).

* **Fitur Utama:**
  * **Dukungan Banyak Metode (MCDM Multi-Method):** Penambahan metode **Simple Additive Weighting (SAW)**, **Analytical Hierarchy Process (AHP)** untuk pembobotan kriteria, dan **WASPAS**.
  * **Kriteria Dinamis:** Pengguna dapat menambahkan kriteria fundamental baru secara dinamis selain 4 kriteria default (misalnya rasio PBV, EPS, atau NPM).
  * **Autentikasi & Akun Pengguna:** Sistem login (Google & Email) serta sinkronisasi data alternatif dan riwayat analisis ke database cloud secara otomatis.
  * **Penyaringan Sektor Saham:** Tidak terbatas pada LQ45, tetapi mencakup penyaringan saham per sektor industri (Perbankan, Energi, Properti, dll.).

---

### 🌐 Fase 3: Sistem Real-Time & Platform Web (V2.0) - Q3 2027
Transformasi produk menjadi platform analitik saham tingkat lanjut berbasis web dan mobile dengan umpan data real-time.

* **Fitur Utama:**
  * **Integrasi API Saham Real-Time:** Sinkronisasi data rasio keuangan langsung dari API Bursa Efek Indonesia (IDX) setiap akhir hari bursa (*end-of-day*).
  * **Aplikasi Web SPK:** Peluncuran dashboard analitik berbasis web menggunakan Next.js yang terhubung dengan database yang sama.
  * **Asisten AI Analisis:** Integrasi chatbot cerdas berbasis LLM yang memberikan rekomendasi investasi naratif berdasarkan hasil ranking TOPSIS.
  * **Portofolio Simulator:** Fitur untuk melacak simulasi keuntungan saham-saham terpilih dari ranking TOPSIS di masa lalu.
