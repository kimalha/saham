# AI Coding Rules

This document outlines the general software engineering rules and coding standards that AI assistants must follow when generating code for this repository.

---

## 1. Clean Architecture & Logic Split

To keep the codebase modular, testable, and maintainable, enforce the following separation:

* **Presentation (UI Layer):** Write pure visual components in React Native. Do not insert business calculations, raw API requests, or complex state filtering inside components. Use custom hooks for UI-related state.
* **Application (Orchestration):** Orchestrate user interactions, form submissions, and API interactions. Use **React Query** for async state management and **Zod** for schema validations.
* **Domain (Business Rules):** The TOPSIS mathematics core must exist as pure functions in plain TypeScript. It must have zero dependencies on frameworks, databases, or UI state libraries.
* **Infrastructure (Data/External):** Implement data storage accesses (Sequelize models/repositories on backend, Axios configurations on frontend) here.

---

## 2. TypeScript and Type Safety

* **Enable Strict Mode:** Enforce `"strict": true` in `tsconfig.json` at all times.
* **No `any` Types:** Do not use `any`. Use explicit typings for all variables, parameters, and function return values. Use `unknown` with type guards if a type is not determinable beforehand.
* **Interfaces vs Types:** Use `interface` for structural model declarations (e.g., entity models, DB records) and `type` for unions, intersections, and configurations.
* **Numeric Precisions:** Use the `number` primitive for financial variables. All mathematical ratios must be rounded using `.toFixed(4)` or `.toPrecision(4)` where appropriate to avoid IEEE 754 floating-point accuracy issues.

---

## 3. Code Style and Conventions

* **Naming Rules:**
  * PascalCase for React Native Components, Screens, and Class Definitions.
  * camelCase for variables, object keys, helper functions, and custom hooks.
  * kebab-case for file names and folder structures.
  * UPPER_SNAKE_CASE for constant values.
* **Linter & Code Formatting:** Always comply with Prettier and ESLint configurations. Keep lines under 100 characters where possible. Use 2 spaces for indentation.
* **Imports Ordering:** Group imports logically:
  1. Third-party library imports (React, React Native, etc.).
  2. Local alias imports starting with `@/` or absolute relative paths.
  3. Styles or assets.

---

## 4. Error Handling and Logging

* **Do Not Suppress Errors:** Never write empty `catch` blocks. Always handle exceptions or propagate them.
* **Centralized API Error Handler:** Backend routes must forward exceptions to a centralized error middleware. Return structured errors:
  ```json
  {
    "status": "error",
    "message": "User-friendly description",
    "code": "ERROR_CODE"
  }
  ```
* **Graceful Degradation (UI):** Wrap screens with Error Boundaries. Display clean fallback views when exceptions are encountered. Provide Toast alerts for temporary network failures.
