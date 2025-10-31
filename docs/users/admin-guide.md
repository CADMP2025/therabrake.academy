# Admin System Management Guide

This guide covers catalog curation, user management, compliance, and system operations for administrators.

## Dashboards and modules

- Admin portal: /admin
- Certificates & audits: /admin/certificates and verification logs
- Security & compliance: /admin/security

## User and access management

- Roles: Assign Student, Instructor, or Admin roles.
- MFA: Encourage or enforce MFA for staff accounts.
- Enrollments: View and adjust enrollments (extend, revoke) per policy.

## Catalog and content

- Course approvals: Review drafts and approve for publishing.
- Categories and tags: Maintain a consistent taxonomy for search and discovery.
- Featured and recommended: Curate home and catalog highlights.

## Payments and programs

- Pricing rules: Verify Stripe products/prices align with catalog settings.
- Webhooks: Monitor Stripe webhooks at /api/stripe/webhook(s).
- Refunds and extensions: Follow policy; log decisions.

## Certificates and CE compliance

- Templates: Maintain certificate templates and CE hour mappings.
- Revocation: Revoke certificates if necessary with justification; logs are immutable.
- Audit: Export certificate audit logs for regulators.

## Support operations

- FAQs, guides, videos: Keep the Help Center updated.
- Ticket triage: Route tickets to instructors or support specialists.
- SLAs: Track first response and resolution times.

## Security and privacy

- Incident response: Follow the security incident SOP and document timeline.
- Data retention: Apply retention and deletion policies.
- Access reviews: Quarterly reviews of admin/instructor roles.

## Maintenance tasks

- Backups: Verify automated backups and perform restoration tests.
- Monitoring: Review error rates and key performance indicators.
- Updates: Coordinate release windows and change management.
