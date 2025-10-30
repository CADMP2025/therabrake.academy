import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/courses/tags - Get all course tags
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: tags, error } = await supabase
      .from('course_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ 
      data: tags || [],
      success: true 
    });

  } catch (error: any) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tags', success: false },
      { status: 500 }
    );
  }
}
