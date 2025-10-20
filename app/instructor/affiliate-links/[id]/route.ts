// app/api/instructor/affiliate-links/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { is_active } = body;
    
    // Update link (RLS ensures user owns this link)
    const { data, error } = await supabase
      .from('instructor_affiliate_links')
      .update({ is_active })
      .eq('id', params.id)
      .eq('instructor_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Link update error:', error);
      return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, link: data });
    
  } catch (error) {
    console.error('Affiliate link PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}