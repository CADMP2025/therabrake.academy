-- Check if email_logs table exists and has data
SELECT 
  email_type,
  recipient_email,
  subject,
  status,
  resend_id,
  sent_at
FROM email_logs
ORDER BY sent_at DESC
LIMIT 10;

-- Check success rate
SELECT 
  email_type,
  status,
  COUNT(*) as count
FROM email_logs
GROUP BY email_type, status
ORDER BY email_type;
