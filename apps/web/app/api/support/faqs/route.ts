import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/support/faqs?q=&category=&page=&limit=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''
    const category = searchParams.get('category') || ''
    const page = Number(searchParams.get('page') || '1')
    const limit = Math.min(50, Number(searchParams.get('limit') || '10'))
    const offset = (page - 1) * limit

    const supabase = await createClient()

    let query = supabase
      .from('faq_articles')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (category) {
      // resolve category slug to id
      const { data: cat } = await supabase
        .from('faq_categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle()
      if (cat?.id) query = query.eq('category_id', cat.id)
    }

    if (q) {
      // simple ILIKE search across question/answer/keywords
      query = query.or(
        `question.ilike.%${q}%,answer.ilike.%${q}%,keywords.cs.{${q}}
        `
      )
    }

    query = query.order('updated_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      articles: data || [],
      total: count || 0,
      page,
      totalPages: Math.max(1, Math.ceil((count || 0) / limit))
    })
  } catch (err) {
    console.error('FAQ search error:', err)
    return NextResponse.json({ error: 'Failed to load FAQs' }, { status: 500 })
  }
}

// Admin create FAQ (authorized)
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // check admin via profiles.role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const payload = {
      slug: body.slug,
      category_id: body.category_id,
      question: body.question,
      answer: body.answer,
      keywords: body.keywords || [],
      is_published: !!body.is_published,
      created_by: user.id,
      updated_by: user.id,
    }

    const { data, error } = await supabase
      .from('faq_articles')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, article: data })
  } catch (err) {
    console.error('FAQ create error:', err)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
