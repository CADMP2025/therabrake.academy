import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    const courseId = searchParams.get('courseId');

    let query = supabase
      .from('lesson_resources')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true });

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    } else if (courseId) {
      query = query.eq('course_id', courseId);
    } else {
      return NextResponse.json(
        { error: 'lessonId or courseId is required' },
        { status: 400 }
      );
    }

    const { data: resources, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, resources });
  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
