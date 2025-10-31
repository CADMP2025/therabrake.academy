# Backups Strategy

## Objectives

- Ensure recoverability of critical data with minimal loss and downtime.

## Supabase

- Enable Point-in-Time Recovery (PITR)
- Daily automated backups
- Quarterly test restores

## Logical dumps

- Weekly `pg_dump` (schema + data) stored in secure storage
- Encrypt backups at rest and in transit

## Restoration testing

- Restore to staging, run integrity checks, and smoke tests

## Documentation

- Keep this document updated with retention periods and storage locations
