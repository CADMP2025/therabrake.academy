import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST create ticket; GET list own tickets
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { email, subject, body, priority, category } = await req.json()
    if (!email || !subject || !body) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const insertPayload = {
      user_id: user?.id || null,
      email,
      subject,
      body,
      priority: priority || 'normal',
      category: category || null,
    }
    const { data, error } = await supabase
      .from('support_tickets')
      .insert(insertPayload)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ success: true, ticket: data })
  } catch (err) {
    console.error('Ticket create error:', err)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ tickets: data })
  } catch (err) {
    console.error('Ticket list error:', err)
    return NextResponse.json({ error: 'Failed to load tickets' }, { status: 500 })
  }
}
