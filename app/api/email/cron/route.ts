import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email/email-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = {
    onboardingDay3: 0,
    onboardingDay7: 0,
    inactivity7: 0,
    inactivity14: 0,
    inactivity30: 0,
  };

  try {
    // Onboarding Day 3 and Day 7
    const today = new Date();
    const day = (n: number) => new Date(today.getTime() - n * 86400000);
    const day3 = day(3).toISOString();
    const day4 = day(2).toISOString(); // exclusive upper bound
    const day7 = day(7).toISOString();
    const day8 = day(6).toISOString();

    // Fetch users created ~exactly 3 days ago (24h window)
    const { data: users3 } = await (supabase as any)
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .gte('created_at', day3)
      .lt('created_at', day4);

    if (Array.isArray(users3)) {
      for (const u of users3) {
        const name = u.raw_user_meta_data?.name || 'there';
        await emailService.sendOnboardingDay3(
          u.email,
          name,
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          `${process.env.NEXT_PUBLIC_APP_URL}/welcome-tour`,
          u.id
        );
        results.onboardingDay3 += 1;
      }
    }

    // Fetch users created ~exactly 7 days ago
    const { data: users7 } = await (supabase as any)
      .from('auth.users')
      .select('id, email, raw_user_meta_data')
      .gte('created_at', day7)
      .lt('created_at', day8);

    if (Array.isArray(users7)) {
      for (const u of users7) {
        const name = u.raw_user_meta_data?.name || 'there';
        await emailService.sendOnboardingDay7(
          u.email,
          name,
          '<p>Popular this week: Ethics & Law, Supervision, Cultural Competency</p>',
          `${process.env.NEXT_PUBLIC_APP_URL}/courses`,
          u.id
        );
        results.onboardingDay7 += 1;
      }
    }

    // Inactivity nudges: 7, 14, 30 days
    for (const d of [7, 14, 30] as const) {
      const { data: inactive, error } = await (supabase as any).rpc('get_inactive_users', {
        days_threshold: d,
      });
      if (error) {
        console.warn('get_inactive_users RPC failed', error.message);
      }
      if (Array.isArray(inactive)) {
        for (const row of inactive) {
          await emailService.sendInactivity(
            row.email,
            'there',
            row.days_inactive || d,
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            undefined,
            row.user_id
          );
          // Record notification to reduce re-sends
          await supabase.from('progress_notifications').insert({
            user_id: row.user_id,
            notification_type: 're_engagement',
            days_inactive: row.days_inactive || d,
            sent_at: new Date().toISOString(),
          });
          if (d === 7) results.inactivity7 += 1;
          if (d === 14) results.inactivity14 += 1;
          if (d === 30) results.inactivity30 += 1;
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ success: false, error: error.message, results }, { status: 500 });
  }
}
