import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('faq_categories')
      .select('id, slug, name, description, sort_order')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return NextResponse.json({ categories: data })
  } catch (err) {
    console.error('Categories error:', err)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
