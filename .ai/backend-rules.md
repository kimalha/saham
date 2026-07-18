# AI Backend Coding Rules

This document outlines the rules for implementing the REST API backend server of the SPK Saham LQ45 application using Node.js, Express.js, and Sequelize ORM.

---

## 1. Node.js & Express.js Structure

* **Modular Framework Routing:** Group route handlers into separate route modules (e.g., `src/routes/stock.routes.ts`, `src/routes/analysis.routes.ts`).
* **Controllers and Repositories:** Keep Express controllers thin. They should handle HTTP serialization/deserialization and validation, then delegate data fetching to Sequelize repositories, and business math to the TOPSIS domain engine.
* **TypeScript Execution:** Execute the development backend using `ts-node-dev` and build production files into pure JavaScript using `tsc`.

---

## 2. Sequelize ORM & Database Rules

* **Sequelize Models:** Use typed Sequelize models. Declare class attributes and associations clearly (e.g., `Stock` model attributes mapping to columns, timestamps enabled).
* **Migrations First:** Do not use `sequelize.sync({ force: true })` in production. Always write incremental migration files to define and modify the schema of MySQL tables (`stocks`, `criteria`, `analysis_histories`).
* **MySQL Data Types:** Column mappings must utilize appropriate database primitives:
  * Financial indicators (e.g., `pe_ratio`, `roe`, `der`, `dividend_yield`) must map to `DECIMAL(10, 4)` to prevent rounding errors.
  * Store the full calculation result in `analysis_histories` as a `JSON` type data column.

---

## 3. Request Validation with Zod

* **Route Middlewares:** Validate all request query parameters, URL path parameters, and request body payloads using custom validation middlewares running Zod schemas:
  ```typescript
  import { Request, Response, NextFunction } from 'express';
  import { AnyZodObject } from 'zod';

  export const validateRequest = (schema: AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error) {
        res.status(400).json({ status: 'error', message: 'Validation failed', errors: error });
      }
    };
  ```
* **Strict Schema Definition:** Schemas must enforce correct types (e.g., stock code must be uppercase letters, weights must be numbers between 0 and 100).

---

## 4. Bulk Operations and Upload Handling

* **CSV/Excel Parser:** Use libraries like `csv-parser` or `xlsx` to parse uploaded sheet data inside the import endpoint.
* **Database Transactions:** Perform bulk database insertions (such as stock data imports) inside a SQL database Transaction. If any row contains malformed data or throws an error, rollback the entire transaction to preserve database integrity.
