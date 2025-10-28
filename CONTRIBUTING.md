# 🎌 Contributing to \[Your Project Name\]

Welcome, contributor! We're excited to have you here. This document outlines everything you need to know to contribute effectively.

We value community contributions and strive to make this process clear and rewarding.

## 📜 Code of Conduct

This project and everyone participating in it is governed by the [Your Project Code of Conduct](https://www.google.com/search?q=httpsax). Please read it to understand what behavior will and will not be tolerated.

## 🤔 How Can I Contribute?

### 🐞 Reporting Bugs

* **Search first:** Check the [Issues tab](https://www.google.com/search?q=httpsax/issues) to see if the bug has already been reported.

* **New issue:** If not, [open a new issue](https://www.google.com/search?q=httpsax/issues/new).

* **Be descriptive:** Include your OS, browser, screenshots, and clear steps to reproduce the bug.

### ✨ Suggesting Enhancements

* **Search first:** Check the [Issues tab](https://www.google.com/search?q=httpsax/issues) for similar suggestions.

* **New issue:** If not, [open a new issue](https://www.google.com/search?q=httpsax/issues/new) and use the "Feature Request" template.

* **Be clear:** Explain the problem and your proposed solution.

## 🚀 Getting Started: Local Development

### 1. Fork & Clone

1. Fork the repository.

2. Clone your fork: `git clone https://github.com/[YOUR_USERNAME]/[YOUR_PROJECT].git`

3. Add upstream: `git remote add upstream https://github.com/[YOUR_USERNAME]/[YOUR_PROJECT].git`

### 2. Install Dependencies

We use `bun` as our package manager and runtime.

```
bun install

```

### 3. Setup Supabase

1. **Install Supabase CLI:** `bunx supabase init`

2. **Start Services:** `bunx supabase start`

3. **Link Project (if needed):** `bunx supabase link --project-ref [PROJECT_ID]`

4. **Pull Migrations:** `bunx supabase db pull` (if pulling existing schema)

### 4. Setup Environment

1. Copy `.env.example` to `.env.local`.

2. Get your `anon` and `service_role` keys from `bunx supabase status`.

3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

### 5. Run Development Server

```
bun run dev

```

## 💻 Development Workflow

### Supabase Migrations

* **NEVER** edit the database schema via the Supabase Studio dashboard in production.

* **ALWAYS** use migrations for schema changes.

1. Make changes (e.g., in Studio locally or via SQL).

2. Generate migration: `bunx supabase db diff -f [migration_name]`

3. Apply migration locally: `bunx supabase db reset` (resets and applies all migrations)

### Supabase Type Generation

After any database schema change, update the TypeScript types:

```
bunx supabase gen types typescript --project-id [PROJECT_ID] --schema public > src/types/supabase.ts

```

### shadcn/ui Components

* Add new components using the CLI: `bunx shadcn-ui@latest add [component_name]`

### TanStack Query (React Query)

* **Query Keys:** Use structured, serializable keys.

* **Format:** `['scope', 'entity', { id, params... }]`

* **Example:** `['todos', 'list', { filter: 'completed' }]`, `['todos', 'detail', { id: todoId }]`

## 📖 Coding Conventions

### General

* **Language:** Code and comments should be in **English**.

* **Formatting:** We use Prettier and ESLint. Run `bun run lint` and `bun run format` before committing.

* **Imports:**

  * Use absolute paths (`@/components/Button`) over relative paths (`../../../components/Button`).

  * Sort imports: 1. React 2. Next.js 3. Libraries 4. Absolute paths (`@/`) 5. Relative paths (`./`).

### File Naming & Structure (Next.js App Router)

* **App Router:** We use the `app` directory.

* **Route Groups:** Use route groups `(groupName)` to organize routes without affecting the URL (e.g., `(auth)/login`).

* **Colocation:** Place components, hooks, and tests alongside the features they belong to (e.g., in `src/features/featureName`).

* **File Naming:** Use `kebab-case` for files and folders (e.g., `user-profile.tsx`), except for React components which should be `PascalCase` (e.g., `UserProfile.tsx`).

### TypeScript

* **Strict Mode:** We use strict mode. Avoid `any` at all costs.

* **Types:** Define types in `src/types` or colocate them. Use `Interface` for object shapes and `type` for functions, unions, etc.

* **`supabase.ts`:** This file is auto-generated. **DO NOT EDIT IT MANUALLY.**

### UI & CSS (Mobile First)

* **Tailwind CSS:** We use Tailwind exclusively. Avoid inline styles (`style={{}}`).

* **Mobile First:** Design and build for mobile first. Use `sm:`, `md:`, `lg:` prefixes for larger screens.

* **`shadcn/ui`:** Use `shadcn/ui` components as the base. If customization is needed, eject the component (`add` command) and modify it.

* **CSS Variables:** Use Tailwind's theme variables (`theme.config.js`) for custom colors, fonts, or spacing.

### Database (Supabase)

* **Naming:**

  * Tables & Fields: `snake_case` (e.g., `user_profiles`, `created_at`).

  * Views: Prefix with `v_` (e.g., `v_user_details`).

  * Procedures (RPC): Prefix with `fn_` (e.g., `fn_get_user_role`).

* **Row Level Security (RLS):** RLS **MUST** be enabled on all tables that contain sensitive user data.

* **Indexes:** Add indexes (`btree`, `gin`, etc.) to frequently queried columns for performance.

### API & Server Actions

* **Prefer Server Actions:** For form submissions and mutations, prefer Next.js Server Actions over traditional API routes.

* **API Routes (if used):**

  * **JSON Format:** APIs should consume and produce `camelCase` JSON (e.g., `createdAt`) to align with JavaScript, even if the DB is `snake_case`. (Use mapping functions or Supabase's `postgrest-js` helpers).

* **Error Handling:** Return structured errors from Server Actions or APIs.

### การตรวจสอบข้อมูล (Data Validation)

* **Tool:** ใช้ [Zod](https://zod.dev/) เป็นหลักในการสร้าง schema

* **Client-Side:** ใช้ Zod ร่วมกับ `react-hook-form` (ซึ่งเป็นพื้นฐานของ component `
` ใน shadcn/ui) เพื่อให้ feedback ผู้ใช้ทันทีในฟอร์ม

  * `const formSchema = z.object({ email: z.string().email("อีเมลไม่ถูกต้อง") });`

* **Server-Side (Security):** *ต้อง* validate ข้อมูล *เสมอ* ใน Server Actions หรือ API Routes (ห้ามเชื่อถือ client)

  * ใช้ `formSchema.safeParse(data)` เพื่อตรวจสอบข้อมูลที่ส่งมาจาก client ก่อนนำไปใช้กับ Supabase

* **Single Source of Truth (DRY):** พยายามใช้ schema เดียวกันทั้ง client และ server โดยเก็บไว้ในที่เดียว (เช่น `src/lib/schemas.ts`)

### Authentication (Supabase Auth)

* **SSR Helpers:** Use Supabase Auth Helpers/SSR (`@supabase/ssr`) to manage user sessions, especially in Server Components and Server Actions.

* **Server-Side Checks:** **ALWAYS** verify user authentication and authorization on the server (Server Actions, API Routes, Page `layout.tsx` or `page.tsx`) before performing privileged actions.

* **RLS:** Rely on RLS policies in Supabase as the primary source of truth for data access rules.

### Maintainability (Code Quality)

* **Single Responsibility Principle (SRP):** Components and functions should do one thing well.

* **Don't Repeat Yourself (DRY):** Abstract reusable logic into custom hooks (`use...`), components, or utility functions (`src/lib/utils.ts`).

* **Comments:** Write comments for complex logic, not for *what* the code does, but *why* it does it.

* **Environment Variables:**

  * **NEVER** commit `.env.local`.

  * Client-side variables **MUST** be prefixed with `NEXT_PUBLIC_`.

  * Server-side variables (e.g., `SUPABASE_SERVICE_ROLE_KEY`) should NOT have the prefix and are only accessible on the server.

### Unit Testing (Vitest + React Testing Library)

* **Test Behavior, Not Implementation:** Users don't care about `useState`. They care that clicking a button shows a modal.

* **Queries:** Use `screen.getByRole`, `getByLabelText`, `getByText` first. Avoid `getByTestId` unless absolutely necessary.

* **What to test:**

  * User interactions (`fireEvent`, `@testing-library/user-event`).

  * Conditional rendering.

  * Accessibility attributes.

* **Mocks:** Mock API calls (Supabase client), hooks, and external modules using `vi.mock`.

### State Management (Client)

* **Server State:** Use `TanStack Query` for all data fetching, caching, and server-side mutations. This is our default state manager.

* **Client State (Simple):** For simple, localized UI state (e.g., "is modal open"), use `React.useState` or `React.useReducer`.

* **Client State (Global):** For global client-side state (e.g., "theme", "user settings"), use `Zustand`. Avoid `React.Context` for state that updates frequently, as it can cause performance issues.

### Error Handling & UX

* **`react-hot-toast`:** Use `react-hot-toast` (or similar) to provide non-intrusive feedback to the user for actions (e.g., "Profile saved!", "Error: Could not connect").

* **Error Boundaries:** Wrap major sections of the app (e.g., in `layout.tsx`) with React Error Boundaries to prevent a component crash from taking down the whole page.

* **Suspense:** Use `React.Suspense` with streaming for loading states, especially in Server Components.

### Accessibility (a11y)

* **Semantic HTML:** Use `button`, `nav`, `main` correctly.

* **`shadcn/ui`:** Our base components (Radix) are accessible. When building on top of them, ensure you maintain accessibility.

* **Keyboard Navigation:** All interactive elements must be usable with a keyboard.

* **Labels:** All form inputs (``) must have an associated ``.

## 🧪 Testing

We have three types of tests. All should be run before submitting a PR.

1. **Unit Tests:** `bun test`

2. **E2E Tests (Playwright):** `bun run test:e2e`

3. **Load Tests (k6):** `bun run test:load`

## 🛡️ Security Vulnerability Reporting

If you discover a security vulnerability, please **DO NOT** open a public issue.
Email us immediately at [security@yourdomain.com](mailto:security@yourdomain.com). We will review and address it privately.

## 📦 Dependency Management

* **Use `bun`:** Use `bun add` or `bun remove` to manage dependencies.

* **Review:** Check for unnecessary or large dependencies before adding them.

## ⬆️ Submitting a Pull Request (PR)

1. **Fetch Up-to-date:** `git fetch upstream`

2. **Rebase:** `git rebase upstream/main` (or `upstream/master`)

3. **Push:** `git push origin YOUR_BRANCH_NAME --force`

4. **Open PR:** Open a Pull Request from your branch to the `main` branch of the *upstream* repository.

5. **Link Issue:** Link the issue your PR resolves (e.g., "Closes #123").

6. **Fill Template:** Fill out the PR template clearly.

### PR Checklist

* \[ \] My code follows the coding conventions.

* \[ \] I have run `bun run lint` and `bun run format`.

* \[ \] I have added/updated tests (Unit, E2E) for my changes.

* \[ \] All tests pass: `bun test` and `bun run test:e2e`.

* \[ \] I have updated documentation if necessary.

Thank you for contributing!
