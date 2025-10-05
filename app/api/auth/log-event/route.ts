import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();
    
    const { eventType, success, metadata } = body;
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();

    // Log authentication event
    const { error } = await supabase.rpc('log_auth_event', {
      p_event_type: eventType,
      p_user_id: session?.user?.id || null,
      p_user_email: session?.user?.email || metadata?.email || 'unknown',
      p_ip_address: ip,
      p_user_agent: userAgent,
      p_success: success
    });

    if (error) {
      console.error('Failed to log auth event:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth event logging error:', error);
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
}
