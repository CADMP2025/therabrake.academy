import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('faq_articles')
      .select('*, faq_categories(name, slug)')
      .eq('slug', params.slug)
      .maybeSingle()
    if (error) throw error
    if (!data || (!data.is_published)) {
      // only admins can see unpublished via direct API; enforce here as 404 for public
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ article: data })
  } catch (err) {
    console.error('FAQ fetch error:', err)
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updates = await req.json()
    updates.updated_by = user.id
    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('faq_articles')
      .update(updates)
      .eq('slug', params.slug)
      .select()
      .maybeSingle()
    if (error) throw error
    return NextResponse.json({ success: true, article: data })
  } catch (err) {
    console.error('FAQ update error:', err)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { error } = await supabase
      .from('faq_articles')
      .delete()
      .eq('slug', params.slug)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('FAQ delete error:', err)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
