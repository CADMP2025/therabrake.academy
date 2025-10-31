# Domains & Email Configuration

## Custom domain (Vercel)

- Add `therabrake.academy` in Vercel → Domains
- Follow DNS instructions (A/AAAA/CNAME) as provided by Vercel

## Email sending (Resend)

- Verify domain at <https://resend.com/domains>
- Add DNS records (DKIM TXT, SPF, optional MX)
- Set `RESEND_API_KEY` in Vercel
- Configure from-address (e.g., `noreply@therabrake.academy`)
- See `EMAIL_WORKFLOW_VERIFIED.md` for test results and steps

## DNS Hygiene

- Add DMARC TXT record (p=quarantine or p=reject) with reporting
- Monitor SPF/DKIM/DMARC alignment and deliverability
