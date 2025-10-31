import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // FIXED: Await the createClient() call
    const supabase = await createClient();
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();

    // Log authentication event
    const { error } = await supabase.rpc('log_auth_event', {
      user_id: session?.user?.id,
      event_type: 'auth_action',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Auth log error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}