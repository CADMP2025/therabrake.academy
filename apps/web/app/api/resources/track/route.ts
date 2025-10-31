import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { resourceId, lessonId, courseId } = body;

    // Track resource download
    const { error } = await supabase
      .from('resource_downloads')
      .insert({
        user_id: user.id,
        resource_id: resourceId,
        lesson_id: lessonId,
        course_id: courseId,
        downloaded_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resource tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track resource download' },
      { status: 500 }
    );
  }
}
