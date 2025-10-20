// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // =========================================
  // AFFILIATE TRACKING - NEW ADDITION
  // =========================================
  const refCode = request.nextUrl.searchParams.get('ref')
  
  if (refCode) {
    try {
      // Get client information
      const ipAddress = request.ip || 
                       request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       '0.0.0.0'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      const referrer = request.headers.get('referer') || undefined

      // Verify the affiliate link exists and is active
      const { data: linkData, error: linkError } = await supabase
        .from('instructor_affiliate_links')
        .select('id, instructor_id')
        .eq('unique_code', refCode)
        .eq('is_active', true)
        .single()

      if (!linkError && linkData) {
        // Record the click
        const { data: clickData, error: clickError } = await supabase
          .from('affiliate_clicks')
          .insert({
            affiliate_link_id: linkData.id,
            instructor_id: linkData.instructor_id,
            ip_address: ipAddress,
            user_agent: userAgent,
            referrer: referrer
          })
          .select()
          .single()

        if (!clickError && clickData) {
          // Update click count on the affiliate link
          await supabase
            .from('instructor_affiliate_links')
            .update({ 
              click_count: supabase.sql`click_count + 1`,
              last_used_at: new Date().toISOString()
            })
            .eq('id', linkData.id)

          // Store click ID in cookie for conversion tracking (30 days)
          response.cookies.set('affiliate_click_id', clickData.id, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          })
          
          // Store ref code for analytics (not httpOnly)
          response.cookies.set('affiliate_ref', refCode, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: false, // Allow client-side access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
          })

          console.log(`✅ Affiliate click tracked: ${refCode} -> ${clickData.id}`)
        } else {
          console.error('Failed to record affiliate click:', clickError)
        }
      } else {
        console.warn(`Invalid or inactive affiliate code: ${refCode}`)
      }
    } catch (error) {
      console.error('Error tracking affiliate click:', error)
      // Don't block the request if tracking fails
    }
  }
  // =========================================
  // END AFFILIATE TRACKING
  // =========================================

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes
  const protectedRoutes = ['/dashboard', '/instructor', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}