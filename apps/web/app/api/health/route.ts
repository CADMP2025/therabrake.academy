import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    
    if (error) {
      return NextResponse.json(
        { status: 'unhealthy', database: 'disconnected', error: error.message },
        { status: 503 }
      )
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Internal server error' },
      { status: 503 }
    )
  }
}
