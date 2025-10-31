import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple FAQ/KB retriever: returns top matches as suggestions
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    const q = message.trim().slice(0, 200)
    const supabase = await createClient()

    const [faqs, kb] = await Promise.all([
      supabase
        .from('faq_articles')
        .select('id, slug, question, answer')
        .eq('is_published', true)
        .or(`question.ilike.%${q}%,answer.ilike.%${q}%`)
        .limit(3),
      supabase
        .from('knowledge_base_articles')
        .select('id, slug, title, body')
        .eq('is_published', true)
        .or(`title.ilike.%${q}%,body.ilike.%${q}%`)
        .limit(3)
    ])

    return NextResponse.json({
      reply: faqs.error && kb.error ? 'Sorry, I could not find anything relevant.' : 'Here are some resources that might help:',
      faqs: faqs.data || [],
      kb: kb.data || []
    })
  } catch (err) {
    console.error('Chatbot error:', err)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
