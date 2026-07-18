# AI Project Context

---

title: AI Project Context
version: 1.0.0
status: Approved
owner: Product Team
last_updated: 2026-07-18

related:
* project-context.md
* ../docs/prd.md
* ../docs/architecture.md

---

## 1. Project Purpose & Description

**SPK Saham LQ45** (Sistem Pendukung Keputusan Pemilihan Saham Terbaik Menggunakan Metode TOPSIS) is a mobile decision support system application. It aims to rank Indonesian stock tickers under the **LQ45 index** objectively.

The application evaluates stocks using the **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)** method. It calculates the rank of alternatives using fundamental financial indicators. The project serves both as an investment decision aid and as an educational tool for Multi-Criteria Decision Making (MCDM).

---

## 2. Product Scope

### In-Scope (Version 1.0):
* **Alternative Management:** CRUD operations on stock alternatives (code, name, and ratios).
* **Data Ingestion:** Manual entry form, local CSV/Excel bulk upload, and third-party Financial API synchronization.
* **Criteria Configuration:** Support for PE Ratio (Cost), ROE (Benefit), DER (Cost), and Dividend Yield (Benefit) with custom weights totaling 100%.
* **TOPSIS Math Engine:** Exact mathematical calculations. Includes step-by-step matrix tables display.
* **Visualization:** Bar charts for ranking and radar charts comparing top-performing stocks.
* **Data Portability:** Generating and downloading reports in PDF and Excel formats.
* **History:** Storing past analysis logs locally on the device.

### Out-of-Scope (Version 1.0):
* Direct stock buying/selling (broker integration).
* Portfolio tracking and balance management.
* Technical stock charts (candlesticks, RSI, MACD).
* Price predictions using machine learning.
* Cloud user accounts and synchronized multi-device logins.

---

## 3. Technology Stack

* **Mobile Frontend:** React Native (Expo SDK), TypeScript, React Navigation, React Query, Axios, React Hook Form, Zod.
* **API Backend:** Node.js, Express.js, TypeScript.
* **ORM & Database:** Sequelize ORM, MySQL.
* **Data Charts:** Victory Native XL (Bar Chart & Radar Chart).
* **Export Utilities:** Custom PDF generator, ExcelJS.

---

## 4. Business Domain Rules

The decision support logic is bound to exactly 4 financial criteria:

1. **Price to Earnings (PE) Ratio:**
   * Type: **Cost** (Lower is better/cheaper).
   * Ideal Threshold: `< 15`.
2. **Return on Equity (ROE):**
   * Type: **Benefit** (Higher is better/more profitable).
   * Ideal Threshold: `> 15%`.
3. **Debt to Equity Ratio (DER):**
   * Type: **Cost** (Lower is better/safer).
   * Ideal Threshold: `< 1` (or `< 100%`).
4. **Dividend Yield:**
   * Type: **Benefit** (Higher is better/higher cash yield).
   * Ideal Threshold: `> 4%`.

* **Weight Constrain:** The cumulative weight value of all 4 criteria **must equal exactly 100%**. Calculations must fail if weights do not sum up to 100%.
* **Ranking Sort Order:** Results must be ordered in descending fashion based on the calculated preference score ($V_i$), ranging from $1.0$ (best) to $0.0$ (worst).
