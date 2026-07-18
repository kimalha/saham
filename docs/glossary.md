# Glossary

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini mendefinisikan istilah-istilah keuangan (*financial terms*) dan istilah sistem pendukung keputusan (*decision support system terms*) yang digunakan dalam aplikasi ini.

---

## 1. Istilah Keuangan (Financial Terms)

* **LQ45:** Indeks pasar saham di Bursa Efek Indonesia (BEI) yang terdiri dari 45 saham perusahaan terbuka yang memiliki likuiditas tinggi, kapitalisasi pasar besar, serta didukung oleh fundamental perusahaan yang baik.
* **Price to Earnings (PE) Ratio:** Rasio pasar untuk menilai harga saham dengan membandingkan harga saham per lembar terhadap laba bersih per lembar saham (*Earnings Per Share*). Digunakan untuk mengidentifikasi murah atau mahalnya harga saham (kriteria bertipe *Cost*).
* **Return on Equity (ROE):** Rasio profitabilitas yang mengukur kemampuan perusahaan menghasilkan laba bersih dari ekuitas (modal bersih) yang diinvestasikan pemegang saham. Dinyatakan dalam persentase (kriteria bertipe *Benefit*).
* **Debt to Equity Ratio (DER):** Rasio solvabilitas untuk mengukur tingkat utang perusahaan dibandingkan dengan modal bersihnya. DER yang tinggi menandakan risiko keuangan yang lebih besar (kriteria bertipe *Cost*).
* **Dividend Yield:** Rasio yang menunjukkan persentase dividen tahunan yang dibagikan perusahaan terhadap harga sahamnya saat ini. Mengukur keuntungan langsung yang diterima pemegang saham dalam bentuk tunai (kriteria bertipe *Benefit*).

---

## 2. Istilah Sistem Pendukung Keputusan (DSS Terms)

* **Sistem Pendukung Keputusan (SPK):** Sistem interaktif berbasis komputer yang membantu pengambil keputusan memecahkan masalah semi-terstruktur atau tidak terstruktur dengan memanfaatkan data dan model keputusan.
* **Multi-Criteria Decision Making (MCDM):** Bidang studi pengambilan keputusan yang berurusan dengan evaluasi beberapa alternatif berdasarkan berbagai kriteria yang sering kali bertentangan satu sama lain.
* **Alternatif:** Pilihan-pilihan solusi atau objek yang akan dievaluasi dan diperingkat oleh sistem. Dalam aplikasi ini, alternatif adalah masing-masing entitas **Saham LQ45**.
* **Kriteria:** Standar atau rasio ukuran yang digunakan sebagai dasar penilaian untuk membandingkan alternatif. Aplikasi ini menggunakan 4 kriteria rasio keuangan.
* **Bobot Kriteria ($w_j$):** Nilai kepentingan relatif dari suatu kriteria dibandingkan dengan kriteria lainnya. Nilai bobot ditentukan oleh pengguna berdasarkan preferensi pribadi (total wajib 100%).
* **Kriteria Tipe Benefit:** Kriteria yang nilainya berkorelasi positif dengan preferensi keputusan. Semakin besar nilainya, semakin baik peringkat alternatifnya (contoh: ROE, Dividend Yield).
* **Kriteria Tipe Cost:** Kriteria yang nilainya berkorelasi negatif dengan preferensi keputusan. Semakin kecil nilainya, semakin baik peringkat alternatifnya (contoh: PE Ratio, DER).
* **Matriks Keputusan ($D$):** Matriks berukuran $m \times n$ berisi data mentah dari $m$ alternatif pada $n$ kriteria yang siap diproses.
* **Matriks Normalisasi ($R$):** Matriks keputusan yang nilainya telah disamakan skalanya menjadi rentang 0 hingga 1 menggunakan rumus normalisasi vektor agar dapat diperbandingkan secara adil.
* **Solusi Ideal Positif ($A^+$):** Solusi hipotetis yang mewakili nilai terbaik (nilai maksimum untuk benefit, nilai minimum untuk cost) di antara semua alternatif yang dievaluasi.
* **Solusi Ideal Negatif ($A^-$):** Solusi hipotetis yang mewakili nilai terburuk (nilai minimum untuk benefit, nilai maksimum untuk cost) di antara semua alternatif yang dievaluasi.
* **Jarak Euclidean:** Jarak geometris lurus antara dua titik dalam ruang multi-dimensi. Digunakan untuk menghitung seberapa jauh posisi suatu alternatif dari solusi ideal positif ($D^+$) dan solusi ideal negatif ($D^-$).
* **Skor Preferensi ($V_i$):** Skor akhir hasil kalkulasi TOPSIS untuk alternatif $i$ (rentang 0 s.d 1). Semakin mendekati 1, semakin dekat alternatif tersebut ke solusi ideal positif dan semakin jauh dari solusi ideal negatif.
