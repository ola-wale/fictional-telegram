# Company Data Review Portal

A single-page React application where analysts can review, edit, and export company records.

## Setup & Run

```bash
npm install
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Features

### Core

- **Inline editing**  - all fields are always editable, designed for a review-and-correct workflow
- **Validation on blur**  - Zod schemas enforce business rules: NAICS industry classification, public company fields, ISO 3166-1 country codes, and required fields
- **Dependent selects**  - sub-vertical options update when vertical changes; invalid selections are cleared automatically
- **Conditional fields**  - ticker and stock exchange appear only when funding stage is "public"; values are cleared when switching away
- **Dynamic lists**  - add/remove directors and locations with confirmation dialogs; minimum of 1 enforced at both UI and schema level
- **JSON export**  - validates all fields before download; shows a toast with specific error messages if invalid

### Beyond the Brief

- **Company selector**  - switch between companies; edits persist across switches via a ref-backed store
- **Change indicators**  - edited fields show a blue border and "edited" label, compared against original values via context
- **Unsaved changes badge**  - warns when the form has been modified; includes a reset-to-original button
- **Split export button**  - export current company or all companies at once, with per-company validation warnings
- **Error boundary**  - catches rendering errors with a recovery option, preventing full-page crashes
- **Accessible forms**  - `aria-labelledby` on sections, `aria-invalid` + `aria-describedby` on invalid fields, `aria-label` on icon buttons

## Architecture Decisions

- **Always-editable fields** (no view/edit toggle)  - fits the "review and correct" use case and reduces UI complexity
- **`react-hook-form` with `FormProvider`**  - field-level subscriptions via `useWatch` minimize re-renders; `useFieldArray` handles dynamic director/location lists
- **Zod schema factory**  - `createCompanySchema(naicsReference, countryCodes)` accepts reference data as parameters, keeping validation testable with no module-level side effects
- **Single source of truth for enums**  - `COMPANY_STATUSES`, `ENTITY_TYPES`, and `FUNDING_STAGES` are defined once in `types/company.ts`, used by both Zod schemas and UI components
- **Vendor chunk splitting**  - React, UI libs, and form libs are split into separate cached bundles so app code updates don't invalidate vendor caches

## Tech Stack

- **Vite 7** + **React 19** + **TypeScript 5.9** (strict mode)
- **Tailwind CSS v4** (Vite plugin)
- **shadcn/ui**  - Card, Select, Input, Dialog, DropdownMenu, Sonner (toast)
- **react-hook-form 7** + **Zod 4**  - form state management and validation
