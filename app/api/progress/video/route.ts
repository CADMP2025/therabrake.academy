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
    const { lessonId, courseId, lastPosition, timeSpent, progress } = body;

    // Update video progress
    const { data, error } = await supabase
      .from('video_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        last_position: lastPosition || 0,
        time_spent: timeSpent || 0,
        progress_percentage: progress || 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Video progress update error:', error);
    return NextResponse.json(
      { error: 'Failed to update video progress' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      );
    }

    // Get video progress
    const { data, error } = await supabase
      .from('video_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || { lastPosition: 0, timeSpent: 0, progress_percentage: 0 });
  } catch (error) {
    console.error('Video progress fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video progress' },
      { status: 500 }
    );
  }
}
