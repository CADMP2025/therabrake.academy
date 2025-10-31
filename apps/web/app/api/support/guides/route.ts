import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('support_guides')
      .select('id, slug, title, description, steps, category')
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ guides: data || [] })
  } catch (err) {
    console.error('Guides error:', err)
    return NextResponse.json({ error: 'Failed to load guides' }, { status: 500 })
  }
}
