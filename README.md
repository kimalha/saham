# 📈 SPK Saham LQ45 - TOPSIS

> Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)

---

# Overview

SPK Saham LQ45 adalah aplikasi mobile yang membantu investor dalam menentukan saham terbaik berdasarkan analisis fundamental menggunakan metode **TOPSIS**.

Aplikasi ini tidak memberikan sinyal beli atau jual secara otomatis, melainkan menghasilkan **peringkat saham** berdasarkan beberapa kriteria fundamental yang dapat disesuaikan oleh pengguna.

Sistem dirancang sebagai media pendukung keputusan (Decision Support System) sehingga seluruh proses perhitungan bersifat transparan dan dapat dipelajari langkah demi langkah.

---

# Objectives

Tujuan utama aplikasi adalah:

* Membantu investor membandingkan beberapa saham secara objektif.
* Mengurangi subjektivitas dalam pemilihan saham.
* Menyediakan implementasi metode TOPSIS yang mudah dipahami.
* Menjadi media pembelajaran Sistem Pendukung Keputusan.
* Menyediakan aplikasi mobile yang ringan, cepat, dan mudah digunakan.

---

# Key Features

## Data Management

* Input data saham secara manual
* Import data dari Excel
* Import data dari CSV
* Sinkronisasi data dari API
* Edit data saham
* Hapus data saham

---

## Criteria Management

Empat kriteria utama digunakan dalam proses perhitungan.

| Kriteria       | Tipe    |
| -------------- | ------- |
| PE Ratio       | Cost    |
| ROE            | Benefit |
| DER            | Cost    |
| Dividend Yield | Benefit |

Pengguna dapat mengubah bobot masing-masing kriteria sesuai preferensi investasi.

---

## TOPSIS Calculation

Sistem menghitung seluruh proses TOPSIS secara otomatis.

Tahapan yang dilakukan:

1. Decision Matrix
2. Normalization
3. Weighted Matrix
4. Positive Ideal Solution
5. Negative Ideal Solution
6. Separation Distance
7. Preference Value
8. Ranking

---

## Visualization

Aplikasi menyediakan visualisasi hasil berupa:

* Ranking Chart
* Radar Chart
* Summary Cards
* Detail Calculation
* Ranking Table

---

## Export

Hasil analisis dapat diekspor menjadi:

* PDF
* Excel

---

# Technology Stack

## Mobile

* React Native
* Expo

## Backend

* Node.js
* Express.js

## Database

* MySQL
* Sequelize ORM

## API

* REST API

## Charts

* Victory Native XL (direkomendasikan)
* atau react-native-chart-kit

## Export

* jsPDF
* SheetJS

---

# Project Structure

```text
spk-topsis-lq45/

docs/
.ai/

mobile/
backend/

README.md
```

---

# Documentation

Seluruh dokumentasi proyek berada pada folder **docs/**.

| File            | Description                  |
| --------------- | ---------------------------- |
| prd.md          | Product Requirement Document |
| architecture.md | System Architecture          |
| ui-ux.md        | UI & UX Specification        |
| database.md     | Database Design              |
| api.md          | REST API Specification       |
| algorithm.md    | TOPSIS Algorithm             |
| roadmap.md      | Development Roadmap          |

---

# AI Development Context

Folder **.ai/** berisi aturan yang digunakan AI Coding selama proses pengembangan.

Contoh:

* Coding Standards
* UI Rules
* Backend Rules
* Component Rules
* Project Context

Dokumen tersebut bertujuan menjaga konsistensi kode, struktur proyek, dan pengalaman pengguna.

---

# Target Users

Aplikasi ditujukan untuk:

* Investor pemula
* Mahasiswa
* Peneliti
* Akademisi
* Pengembang Sistem Pendukung Keputusan

---

# Product Principles

Seluruh pengembangan aplikasi harus mengikuti prinsip berikut:

## Transparency

Semua proses TOPSIS dapat dilihat pengguna.

---

## Simplicity

Antarmuka harus sederhana dan mudah digunakan.

---

## Maintainability

Kode harus modular dan mudah dikembangkan.

---

## Scalability

Arsitektur harus memungkinkan penambahan kriteria maupun metode SPK lain di masa depan.

---

## Performance

Perhitungan harus tetap cepat meskipun jumlah alternatif bertambah.

---

# Project Goals

Versi pertama aplikasi akan mendukung:

* Pemilihan saham LQ45
* Metode TOPSIS
* Empat kriteria penilaian
* Ranking saham
* Detail perhitungan
* Export hasil

Versi berikutnya dapat menambahkan:

* SAW
* AHP
* MOORA
* WASPAS
* VIKOR
* Analisis teknikal
* AI Recommendation
* Portfolio Management

---

# License

Dokumen dan kode sumber dikembangkan untuk kebutuhan penelitian, pembelajaran, dan pengembangan perangkat lunak.

Lisensi akhir akan ditentukan pada tahap publikasi proyek.
