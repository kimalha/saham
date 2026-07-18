# AI Frontend Coding Rules

This document outlines the rules for implementing the mobile frontend client of the SPK Saham LQ45 application using React Native and Expo.

---

## 1. React Native & Expo Guidelines

* **Expo SDK Version:** Use the latest stable Expo SDK features. Avoid using bare workflow libraries unless absolutely required; prefer Expo config plugins.
* **Functional Components:** Write functional components using TypeScript arrow syntax. Avoid legacy class-based components.
* **Hooks Consumption:** Keep hooks near the top of components. Write reusable custom hooks for fetching data or managing forms.

---

## 2. Navigation Structure (React Navigation)

* **Tab & Stack Navigators:** Implement bottom tabs for top-level pages (*Dashboard, Stocks, Analysis, History, Settings*). Nested screens (e.g., *Calculation Details, Result Details*) must use Stack Navigation.
* **TypeScript Types for Routing:** Declare parameter lists for all navigators explicitly. Ensure type-safety when navigating between screens:
  ```typescript
  type RootStackParamList = {
    MainTabs: undefined;
    AnalysisResults: { historyId: number };
    CalculationDetails: { results: TopsisResult[] };
  };
  ```

---

## 3. Data Querying & State Management (React Query & Axios)

* **React Query for Async States:** Use `useQuery` for fetch queries and `useMutation` for writes/calculations (e.g., adding stock alternatives, calculating TOPSIS).
* **Axios Client Configuration:** Configure a centralized Axios client instance with baseUrl and timeout defaults. Handle request/response interceptors globally for error reporting.
* **Cache Management:** Invalidate the `stocks` query cache when new stocks are imported or synced, ensuring UI list components display updated datasets instantly.

---

## 4. Form Management & Validation

* **React Hook Form:** Manage input forms (like manual stock addition or editing) using `React Hook Form` to prevent unnecessary component re-renders.
* **Zod Validation Integration:** Pair form validation with `@hookform/resolvers/zod`. Define schemas in a separate file (e.g., `src/validators/stock.validator.ts`) to validate data before submitting it to backend routes.

---

## 5. Charts & Data Visualization

* **Victory Native XL:** Render bar charts and radar charts using the Victory Native XL library.
* **Accessibility Fallback:** For every chart presented on the screen, provide an option to switch to a structured data table view. This assists visually impaired users or those relying on screen readers.
