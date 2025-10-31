# Database Schema Documentation (Supabase/Postgres)

This document summarizes the core schema and relationships derived from migrations under `supabase/migrations`.

## Core domains

- Auth: `auth.users` (managed by Supabase)
- Catalog: `courses`, `modules`, `lessons`, `resources`, `reviews`, `tags` (see course migrations)
- Enrollment: `enrollments`, `scheduled_notifications` (expiration/grace/notifications)
- Progress: `lesson_progress`, `video_progress`, `learning_streaks`, `weekly_activity_summary`, `daily_activity_log`, `progress_notifications`
- Quiz: `quizzes`, `questions`, `attempts` (and related)
- Certificates: certificate records, audit logs, verification & revocation tables
- Payments: Stripe-related references (payment_intent_id, subscription_id) and webhook logs
- Support: FAQs, guides, videos, tickets

## Enrollment highlights

- `enrollments`
  - Tracks user access to a course with `status`, `enrolled_at`, `expires_at`, and optional `grace_period_ends_at`.
  - Optional `program_type`, `membership_tier`, `payment_intent_id`, `subscription_id` for commerce alignment.
  - Indexes on expiration, program type, membership, and Stripe references.
- `scheduled_notifications`
  - Linked to `enrollments(id)`; schedules and logs expiration-related emails (`7_day_warning`, `3_day_warning`, `1_day_warning`, `access_expired`).
  - RLS allows users to view only their own entries via enrollment ownership.
- Helper functions
  - `get_user_enrollments_with_status(user_id)` returns status, days remaining, grace period flags, and course title.
  - `has_active_course_access(user_id, course_id)` evaluates access considering grace.
  - `extend_enrollment_expiry(enrollment_id, extension_days, payment_intent_id?)` updates expiry and metadata.
  - `grant_course_access(user_id, course_id, duration_days?, grace_period_days?, payment_intent_id?)` creates or returns active access.

## Progress highlights

- `learning_streaks` (unique per user) with `current_streak`, `longest_streak`, and `last_activity_date`.
- `progress_notifications` to avoid duplicate emails and record milestones.
- `weekly_activity_summary` for pre-aggregated dashboard metrics.
- `daily_activity_log` with UPSERT logic via `log_daily_activity(...)`.
- Functions: `update_learning_streak`, `get_inactive_users(days)`, `calculate_weekly_summary`, `check_course_milestone`.

## Certificates

- Tables for certificate generation, audit log, verification codes, and revocation are included in migrations `20251009175842_*` and `2025103012*`.
- Admin-only revoke policies and immutable audit trails.

## Security

- RLS is enabled for user-facing tables (streaks, activity, notifications, etc.).
- Policies generally scope by `auth.uid()` equality to `user_id`.
- Use Supabase service role only in server contexts where needed.

## ER overview

- User (auth.users)
  - 1..n Enrollments -> Course
  - 1..n LessonProgress + VideoProgress
  - 1..1 LearningStreaks
  - 1..n QuizAttempts
- Course
  - 1..n Modules -> 1..n Lessons -> 0..n Resources
  - 0..n Reviews

For precise columns and constraints, refer to SQL in `supabase/migrations/*.sql` and generated types if present.
