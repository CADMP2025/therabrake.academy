import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // fetch ticket if owner or admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const isAdmin = profile?.role === 'admin'

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', params.id)
      .maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!isAdmin && data.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: comments } = await supabase
      .from('ticket_comments')
      .select('*')
      .eq('ticket_id', params.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({ ticket: data, comments: comments || [] })
  } catch (err) {
    console.error('Ticket get error:', err)
    return NextResponse.json({ error: 'Failed to load ticket' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const isAdmin = profile?.role === 'admin'

    const updates = await req.json()

    if (updates.comment) {
      const { error } = await supabase.from('ticket_comments').insert({
        ticket_id: params.id,
        user_id: user.id,
        author_role: isAdmin ? 'admin' : 'user',
        body: updates.comment,
      })
      if (error) throw error
    }

    if (isAdmin && (updates.status || updates.priority)) {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: updates.status, priority: updates.priority, updated_at: new Date().toISOString() })
        .eq('id', params.id)
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Ticket update error:', err)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
