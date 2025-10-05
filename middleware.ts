import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Protected route patterns
const protectedRoutes = ['/dashboard', '/instructor', '/admin'];
const publicRoutes = ['/auth', '/courses', '/about', '/pricing', '/'];

// Security monitoring
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';

  // ==========================================
  // SECURITY HEADERS (SOC 2 Requirement)
  // ==========================================
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict CSP
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com; " +
    "frame-src https://js.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );

  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production' && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${req.headers.get('host')}${req.nextUrl.pathname}`, 301);
  }

  // ==========================================
  // RATE LIMITING (Prevent Brute Force)
  // ==========================================
  if (path.startsWith('/auth/login') || path.startsWith('/api/auth')) {
    const rateLimitKey = `${ip}-auth`;
    const now = Date.now();
    const attempts = failedAttempts.get(rateLimitKey);

    if (attempts) {
      const timeSinceFirst = now - attempts.firstAttempt;
      const fifteenMinutes = 15 * 60 * 1000;

      if (timeSinceFirst > fifteenMinutes) {
        failedAttempts.delete(rateLimitKey);
      } else if (attempts.count >= 5) {
        // Log security event
        console.warn('Rate limit exceeded:', { ip, path, attempts: attempts.count });
        
        return new Response('Too many attempts. Please try again in 15 minutes.', {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((fifteenMinutes - timeSinceFirst) / 1000))
          }
        });
      }
    }
  }

  // ==========================================
  // AUTHENTICATION CHECKS
  // ==========================================
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirect to login with return URL
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Role-based access control
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Admin routes
    if (path.startsWith('/admin') && profile?.role !== 'admin') {
      return new Response('Unauthorized', { status: 403 });
    }

    // Instructor routes
    if (path.startsWith('/instructor') && !['instructor', 'admin'].includes(profile?.role || '')) {
      return new Response('Unauthorized', { status: 403 });
    }

    // Log authentication event for audit
    if (path.startsWith('/dashboard') || path.startsWith('/instructor') || path.startsWith('/admin')) {
      await supabase.rpc('log_auth_event', {
        p_event_type: 'page_access',
        p_user_id: session.user.id,
        p_user_email: session.user.email,
        p_ip_address: ip,
        p_user_agent: req.headers.get('user-agent') || 'unknown',
        p_success: true
      });
    }
  }

  // ==========================================
  // GEO-BLOCKING (Admin Protection)
  // ==========================================
  if (path.startsWith('/admin')) {
    const country = req.geo?.country;
    const blockedCountries = ['CN', 'RU', 'KP', 'IR']; // High-risk countries
    
    if (country && blockedCountries.includes(country)) {
      console.warn('Admin access blocked from:', { country, ip });
      return new Response('Access denied from this location', { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
