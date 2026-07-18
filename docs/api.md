# API Documentation

## Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS (Studi Kasus: Saham Indeks LQ45)

Dokumen ini menjelaskan spesifikasi kontrak API RESTful yang menghubungkan frontend React Native dengan backend Node.js & Express.

---

## 1. Spesifikasi Umum

* **Base URL:** `http://localhost:5000/api` (Development)
* **Format Request/Response:** `application/json`
* **Skema Autentikasi:** N/A (Versi 1 belum mengimplementasikan autentikasi).

---

## 2. Endpoint Alternatif Saham

### 2.1 Get All Stocks
Mengambil seluruh daftar alternatif saham yang terdaftar di database.
* **Method & Path:** `GET /stocks`
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "code": "BBCA",
      "name": "Bank Central Asia Tbk.",
      "pe_ratio": 24.50,
      "roe": 19.20,
      "der": 0.15,
      "dividend_yield": 2.10
    },
    {
      "id": 2,
      "code": "ASII",
      "name": "Astra International Tbk.",
      "pe_ratio": 8.90,
      "roe": 14.50,
      "der": 0.90,
      "dividend_yield": 6.20
    }
  ]
}
```

### 2.2 Create Stock
Menambahkan alternatif saham baru secara manual.
* **Method & Path:** `POST /stocks`
* **Request Body:**
```json
{
  "code": "BMRI",
  "name": "Bank Mandiri (Persero) Tbk.",
  "pe_ratio": 11.20,
  "roe": 20.10,
  "der": 0.95,
  "dividend_yield": 4.50
}
```
* **Response (201 Created):**
```json
{
  "status": "success",
  "message": "Stock created successfully",
  "data": {
    "id": 6,
    "code": "BMRI",
    "name": "Bank Mandiri (Persero) Tbk.",
    "pe_ratio": 11.20,
    "roe": 20.10,
    "der": 0.95,
    "dividend_yield": 4.50
  }
}
```

### 2.3 Update Stock
Mengubah data rasio keuangan saham alternatif.
* **Method & Path:** `PUT /stocks/:id`
* **Request Body:** (Mengirimkan field yang ingin diubah saja)
```json
{
  "pe_ratio": 10.80,
  "dividend_yield": 4.80
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Stock updated successfully",
  "data": {
    "id": 6,
    "code": "BMRI",
    "name": "Bank Mandiri (Persero) Tbk.",
    "pe_ratio": 10.80,
    "roe": 20.10,
    "der": 0.95,
    "dividend_yield": 4.80
  }
}
```

### 2.4 Delete Stock
Menghapus alternatif saham berdasarkan ID.
* **Method & Path:** `DELETE /stocks/:id`
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Stock deleted successfully"
}
```

### 2.5 Bulk Import Stocks
Mengimpor data alternatif saham dalam bentuk Excel/CSV.
* **Method & Path:** `POST /stocks/import`
* **Content-Type:** `multipart/form-data`
* **Request Body:** (Key: `file` - binary file xlsx/csv)
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Imported 12 stocks successfully"
}
```

### 2.6 Sync API Saham
Melakukan pembaruan data secara real-time dari API pihak ketiga.
* **Method & Path:** `POST /stocks/sync`
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "Sync completed. Updated 45 stocks."
}
```

---

## 3. Endpoint Analisis & Perhitungan

### 3.1 Run TOPSIS Analysis
Mengeksekusi perhitungan pemeringkatan TOPSIS berdasarkan input bobot dan daftar alternatif saham yang dipilih.
* **Method & Path:** `POST /analysis`
* **Request Body:**
```json
{
  "title": "Simulasi Investasi Budi",
  "stock_ids": [1, 2, 6],
  "weights": {
    "pe_ratio": 25.00,
    "roe": 30.00,
    "der": 20.00,
    "dividend_yield": 25.00
  }
}
```
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "history_id": 12,
    "title": "Simulasi Investasi Budi",
    "created_at": "2026-07-18T16:20:00Z",
    "ranking": [
      {
        "id": 6,
        "code": "BMRI",
        "preference_score": 0.7245,
        "rank": 1
      },
      {
        "id": 1,
        "code": "BBCA",
        "preference_score": 0.6120,
        "rank": 2
      },
      {
        "id": 2,
        "code": "ASII",
        "preference_score": 0.4850,
        "rank": 3
      }
    ],
    "calculation_steps": {
      "matrix_d": [...],
      "matrix_r": [...],
      "matrix_y": [...],
      "ideal_solutions": {
        "positive": [0.0821, 0.1241, 0.0150, 0.0980],
        "negative": [0.1560, 0.0520, 0.1980, 0.0210]
      },
      "distances": [
        { "id": 6, "d_plus": 0.0215, "d_minus": 0.1542 },
        { "id": 1, "d_plus": 0.0542, "d_minus": 0.1120 }
      ]
    }
  }
}
```

---

## 4. Endpoint Riwayat Analisis

### 4.1 Get Analysis History
Mengambil daftar seluruh riwayat analisis yang disimpan.
* **Method & Path:** `GET /history`
* **Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 12,
      "title": "Simulasi Investasi Budi",
      "created_at": "2026-07-18T16:20:00Z",
      "weight_pe": 25.00,
      "weight_roe": 30.00,
      "weight_der": 20.00,
      "weight_div": 25.00
    }
  ]
}
```

### 4.2 Get History Detail
Mengambil riwayat spesifik lengkap dengan hasil ranking dan langkah kalkulasi terperinci (sama seperti response saat hitung).
* **Method & Path:** `GET /history/:id`
* **Response (200 OK):** (Berisi detail data kalkulasi yang tersimpan)

### 4.3 Delete History Item
Menghapus rekaman riwayat berdasarkan ID.
* **Method & Path:** `DELETE /history/:id`
* **Response (200 OK):**
```json
{
  "status": "success",
  "message": "History entry deleted successfully"
}
```
