import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    const supabase = await createClient()

    let query = supabase
      .from('knowledge_base_articles')
      .select('id, slug, title, body, category, keywords, updated_at')
      .eq('is_published', true)

    if (q) {
      query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%,keywords.cs.{${q}}`)
    }

    query = query.order('updated_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ articles: data || [] })
  } catch (err) {
    console.error('KB error:', err)
    return NextResponse.json({ error: 'Failed to load knowledge base' }, { status: 500 })
  }
}
