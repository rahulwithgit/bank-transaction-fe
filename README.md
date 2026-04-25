# HCL Favorite Accounts - Frontend Application

A modern, responsive, and secure React-based frontend application for managing your Favorite Bank Accounts. Built as part of the HCLTech workbook. 

This application connects to a Spring Boot backend API to securely authenticate users with OTP and provides full CRUD capabilities (Create, Read, Update, Delete) to keep tracking favorite account details, automatically parsing IBAN bank names in real-time.

---

## 🌟 Key Features

- **OTP Flow & JWT Authentication** 
  - Login system accepting a Customer ID and an OTP.
  - Automatically performs frontend hashing (`SHA-256`) of the OTP before securely sending it to the backend.
  - Intercepts API requests with `fetchAuthenticated` to auto-inject the obtained JWT bearer token.
- **Complete CRUD Lifecycle**
  - View paginated dashboard arrays of favorite accounts.
  - Securely Add (`POST`), Edit (`PUT`), and Delete (`DELETE`) favorite bank accounts entirely linked dynamically to your backend server running on `10.138.176.184:8080`.
- **Intelligent Validation**
  - Extracts the bank name locally out of standard IBAN patterns on the fly.
  - Full client-side validation logic restricting unauthorized special characters within Account names or IBAN limits.
- **Robust Testing Setup**
  - Component-by-component frontend test suites integrated efficiently with `Vitest` & `React Testing Library`.
- **Glassmorphism UI**
  - Visually engaging, responsive Glassmorphism design aesthetics.

---

## 🛠️ Technologies & Stack

- **React Engine:** React v19, React Router DOM (v7)
- **Tooling:** Vite, TypeScript
- **Styling UI:** Vanilla CSS (`index.css`) & Lucide React (for crisp iconography)
- **Testing:** `Vitest`, `@testing-library/react`, `@testing-library/jest-dom`

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies using `npm`.

```bash
npm install
```

### 2. Running Locally (Dev Server)
To run the local Vite development server:
```bash
npm run dev
```

*The application will quickly spin up, typically on `http://localhost:5173`. Any changes saved in your `src/` directory reflect instantaneously via Hot Module Replacement (HMR).*

---

## 🧪 Testing your Application

This project is fully equipped with React testing libraries. You can test validations and UI rendering conditions directly to ensure application stability.

To run the full suite:
```bash
npm test
```

To run your tests continuously in **watch mode** during development:
```bash
npm test -- --watch
```

> **Note:** For more in-depth testing mechanics, refer to the dedicated **`TESTING.md`** file located in the root of the project!

---

## 🏗️ Folder Structure

```text
src/
├── components/          # Reusable UI component shells (e.g. Layout.tsx)
├── pages/               # Main application pages (Login, AccountsList, AccountForm)
├── services/            # API integration & generic fetch helpers (api.ts)
├── utils/               # Independent utility logics (bank.ts, validators.ts, crypto.ts)
├── types.ts             # Global TypeScript type definitions
└── main.tsx             # React entry point
```
