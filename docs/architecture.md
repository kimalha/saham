# Software Architecture

## Overview

Aplikasi merupakan Sistem Pendukung Keputusan (SPK) berbasis web yang menggunakan metode TOPSIS untuk memberikan rekomendasi saham terbaik berdasarkan data fundamental perusahaan yang termasuk dalam indeks LQ45.

Arsitektur menggunakan konsep Client-Server.

```
Frontend (React)
        │
 REST API
        │
Backend (Laravel)
        │
 Eloquent ORM
        │
     MySQL
```

---

# Frontend

Tech Stack

- React
- TypeScript
- TailwindCSS
- Shadcn UI
- React Router
- Axios
- TanStack Table
- Recharts

Folder Structure

```
src/
    components/
    pages/
    layouts/
    hooks/
    services/
    types/
    contexts/
    utils/
```

---

# Backend

Laravel 12

Folder penting

```
app/

Controllers/

Models/

Services/

Repositories/

Requests/

Policies/

Resources/

database/

migrations/

seeders/
```

Business Logic tidak boleh berada di Controller.

Semua proses TOPSIS berada pada

```
app/Services/TopsisService.php
```

---

# Authentication

Laravel Breeze

Role

- Admin
- User

Middleware

- auth
- admin

---

# Modul

## Authentication

- Login
- Logout

---

## Dashboard

Menampilkan statistik sistem.

---

## Stocks

CRUD saham.

---

## Fundamental Data

CRUD data fundamental.

---

## Criteria

CRUD bobot.

---

## TOPSIS

Semua proses perhitungan.

---

## Reports

Riwayat hasil.

---

# Data Flow

Admin

↓

Input Data Saham

↓

Input Nilai Fundamental

↓

Input Bobot

↓

Klik Hitung

↓

TopsisService

↓

Ranking

↓

Disimpan ke Database

↓

Ditampilkan ke User

---

# Design Pattern

Gunakan

- Repository Pattern
- Service Pattern
- Form Request Validation
- Resource API

Controller hanya memanggil Service.

---

# Error Handling

Gunakan JSON Response

```
{
    success: false,
    message: "...",
    errors: {}
}
```

---

# Logging

Semua proses perhitungan disimpan ke log Laravel.

---

# Security

- CSRF
- Rate Limiting
- Password Hash
- Authorization Policy

---

# Scalability

Semua modul dibuat independen agar mudah ditambah metode SAW, AHP, MOORA di masa depan.