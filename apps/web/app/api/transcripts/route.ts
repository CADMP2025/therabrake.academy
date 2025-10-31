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

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId is required' },
        { status: 400 }
      );
    }

    const { data: transcripts, error } = await supabase
      .from('video_transcripts')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('language_code', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, transcripts });
  } catch (error) {
    console.error('Transcripts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcripts' },
      { status: 500 }
    );
  }
}
