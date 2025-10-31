# Monitoring & Alerting

How to observe the system in production and catch issues early.

## Sentry

- Configure DSN via env var `SENTRY_DSN`.
- Files present: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- Verify that PII is scrubbed and breadcrumbs are useful.

## Logs & metrics

- Vercel request logs: filter 5xx and slow requests.
- Custom logs in APIs for key flows (enrollment status, progress dashboard) already exist.
- Consider adding counters/timers for high-traffic endpoints.

## Alerts

- Sentry alert rules: error rate thresholds and regression alerts.
- Webhook failure alerts: Stripe dashboard notifications.
- Email queue failures: Resend dashboard monitoring.

## Dashboards

- Create dashboards for completion rates, active users, and error trends.
- Track quiz success rates and certificate generation volume.

## Runbooks

- Link alerts to runbooks (Troubleshooting and Disaster Recovery docs).
