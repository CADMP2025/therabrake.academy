import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { articleId, helpful, comment } = await req.json()
    if (!articleId || typeof helpful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Upsert feedback (unique on article_id, user_id)
    const { data: fb, error } = await supabase
      .from('faq_feedback')
      .upsert({ article_id: articleId, user_id: user.id, was_helpful: helpful, comment }, { onConflict: 'article_id,user_id' })
      .select()
      .maybeSingle()
    if (error) throw error

    // Adjust counters atomically
    const column = helpful ? 'helpful_count' : 'not_helpful_count'
    await supabase.rpc('increment_faq_counter', { p_article_id: articleId, p_column: column })

    return NextResponse.json({ success: true, feedback: fb })
  } catch (err) {
    console.error('FAQ feedback error:', err)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
