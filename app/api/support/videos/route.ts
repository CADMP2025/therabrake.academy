import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tutorial_videos')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return NextResponse.json({ videos: data || [] })
  } catch (err) {
    console.error('Videos error:', err)
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 })
  }
}
