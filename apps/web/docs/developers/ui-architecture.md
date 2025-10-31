# UI Architecture & Conventions

This document describes the UI structure, naming conventions, and import aliases.

## Tech stack

- Next.js App Router, React, TypeScript, Tailwind CSS, Radix UI
- Alias `@` mapped to project root via `next.config.js` and `tsconfig.json`

## Components structure

- `components/ui/*` – shared UI primitives (button, input, tabs, dialog, etc.)
- `components/course/*`, `components/learn/*`, etc. – feature components
- Pages live under `app/*`; server and client components as needed (`"use client"` where appropriate)

## Naming & casing

- Filenames are lowercase for UI primitives: `input.tsx`, `tabs.tsx`, `button.tsx`.
- Imports must match the exact casing (Linux builds are case-sensitive):
  - ✅ `import { Input } from '@/components/ui/input'`
  - ❌ `import { Input } from '@/components/ui/Input'`

## Styling & helpers

- Use `cn` from `lib/utils.ts` to compose class names with Tailwind Merge.
- Prefer `next/image` for images in feature components (avoid raw `<img>` in new code).

## Accessibility

- Follow ARIA patterns and ensure keyboard navigability.
- Provide `alt` for images; maintain color contrast.
- Test with Playwright + axe where practical.

## Client/Server boundaries

- Keep server logic in route handlers and services; mark client components explicitly.
- Avoid Node-only APIs in edge runtimes.

## Common pitfalls

- Case sensitivity on Vercel: always use lowercase filenames for `components/ui`.
- Do not import server-only modules into client components (and vice versa).
