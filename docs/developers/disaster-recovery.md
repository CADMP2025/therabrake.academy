# Disaster Recovery Procedures

Defines how to prepare for and recover from incidents: data loss, outage, or compromised credentials.

## Objectives

- RTO (Recovery Time Objective): < 4 hours
- RPO (Recovery Point Objective): < 15 minutes for critical data

## Backups

- Supabase: Enable PITR and automatic daily backups.
- Offsite snapshots: Weekly logical dumps (pg_dump) stored in secure storage.
- Verify restores quarterly.

## Credential management

- Rotate keys quarterly or after incidents (Supabase, Stripe, Resend, Sentry).
- Use environment-scoped keys. Store secrets in Vercel and in password manager.

## Incident response

1. Detect & triage: Check monitoring alerts, Sentry, and logs.
2. Contain: Temporarily disable affected features if needed.
3. Eradicate: Patch vulnerabilities, rotate keys, restore services.
4. Recover: Restore data from latest backup; verify integrity.
5. Postmortem: Document root cause, timeline, and corrective actions.

## Restore playbooks

- Database restore:
  - Use Supabase PITR to restore to a new instance or roll forward.
  - Validate RLS and policies, compare row counts and constraints.
- Stripe webhooks replay:
  - Use Stripe dashboard to replay events after downtime.
- Email delivery:
  - Validate Resend domain status and API key; requeue critical emails if necessary.

## Communication

- Update status page and notify users if downtime is prolonged.
- Coordinate with support to handle tickets and refunds.
