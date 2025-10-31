# Troubleshooting Guide

Common issues and quick resolutions for Students, Instructors, and Admins.

## Sign-in and account

- Can’t log in: Reset at /auth/forgot-password; confirm email delivery and check spam.
- MFA issues: Ensure time sync on authenticator; use recovery codes if enrolled.
- Email not received: Verify address; for corporate email, whitelist <noreply@therabrake.academy>.

## Video and playback

- Buffering: Reduce quality, close background bandwidth usage, try wired/wifi with lower congestion.
- No audio: Check device volume, player mute, and output device.
- Captions missing: Refresh; if persistent, report the lesson URL to support.

## Course and quiz

- Lesson won’t complete: Watch to the end; check that the tab stays active; refresh after completion.
- Quiz stuck: Reload and resubmit; if reappears, capture console errors and contact support.
- Certificate not generating: Ensure all required lessons/quizzes are complete; retry after 60 seconds.

## Payments

- Purchase failed: Retry; if card declined, try another payment method; confirm bank didn’t block.
- Duplicate charge: Stop trying; contact support with receipt; refund policy applies.

## Admin & instructor

- Content not visible: Check publish status and catalog filters; clear cache and reload.
- Stripe webhooks failing: Verify signing secret and endpoint URL; check recent webhook logs.
- Emails not sending: Verify Resend domain status and API key; check EMAIL_WORKFLOW_VERIFIED.md.

## Technical checks

- Browser support: Latest Chrome, Firefox, Safari, or Edge recommended.
- Local cache: Clear cookies/cache for persistent UI anomalies.
- Status: Check status page (if configured) for ongoing incidents.
