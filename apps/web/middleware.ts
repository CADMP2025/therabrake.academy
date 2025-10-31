import { createServerClient } from '@supabase/ssr'
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
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getSession()

  // Handle affiliate link tracking
  const affiliateParam = request.nextUrl.searchParams.get('ref')
  if (affiliateParam) {
    const { data: linkData } = await supabase
      .from('instructor_affiliate_links')
      .select('id')
      .eq('unique_code', affiliateParam)
      .eq('is_active', true)
      .single()

    if (linkData) {
      // Use the database function to increment clicks
      await supabase.rpc('increment_affiliate_clicks', {
        link_id: linkData.id
      })

      // Store affiliate code in cookie
      response.cookies.set('affiliate_ref', affiliateParam, {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: 'lax',
      })
    }
  }

  // Protected routes
  const protectedPaths = ['/dashboard', '/instructor', '/admin', '/student']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    if (request.nextUrl.pathname.startsWith('/instructor')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'instructor' && profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
