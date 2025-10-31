# Migration Process

This document explains how to create, run, and verify database migrations and how to import legacy data.

## Creating migrations

- Write SQL migrations in `supabase/migrations` with timestamped filenames.
- Prefer idempotent operations (`IF NOT EXISTS`) where practical.
- Include comments and indexes.

## Applying migrations

- Local: Use Supabase CLI or directly apply SQL to your local dev DB.
- Production: Use Supabase dashboard → SQL editor or automated pipelines.
- Verify RLS and policies are enabled for user-facing tables.

## Verification checklist

- Schema diffs reviewed, roll-forward/roll-back paths identified.
- Indexes present for high-traffic queries.
- Functions tested (happy path + edge cases).

## Data imports

Scripts available in `scripts/`:

- `import-legacy-courses.ts`
- `import-remaining-courses.ts`

Run with environment configured (Supabase URL/keys). Dry-run first if possible, then import in batches.

## Post-migration tests

- Run unit/integration tests.
- Smoke test core flows (auth, enrollment, learning, quiz, certificates).
- Validate new tables with sample queries.
