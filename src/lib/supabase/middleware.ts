import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Helper: create a redirect response that preserves Supabase auth cookies.
 * Without this, token-refresh cookies set by getUser() are lost on redirect,
 * causing the next request to see an expired/missing session → redirect loop.
 */
function redirectWithCookies(url: URL, status: 301 | 302 | 307 | 308, source: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url, status)
  source.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie.name, cookie.value, {
      // Preserve attributes — NextResponse.cookies won't have the full
      // options from set(), but the name+value is enough for auth cookies.
    })
  })
  return redirect
}

export async function updateSession(request: NextRequest) {
  // Canonical domain redirect: www → naked domain
  // Prevents cookie mismatches and redirect loops between www and non-www
  const host = request.headers.get('host') || ''
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = host.replace(/^www\./, '')
    url.port = '' // remove port for clean redirect
    return NextResponse.redirect(url, 301)
  }

  let supabaseResponse = NextResponse.next({ request })

  // Intercept auth codes arriving at root or other pages
  // Supabase sends ?code=xxx to the Site URL — redirect to /auth/callback
  const code = request.nextUrl.searchParams.get('code')
  if (code && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    // Preserve the 'next' param if present, default to /dashboard
    if (!url.searchParams.has('next')) {
      url.searchParams.set('next', '/dashboard')
    }
    return NextResponse.redirect(url)
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes — redirect to login if not authenticated
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Forward refreshed cookies so the browser persists the updated tokens
    return redirectWithCookies(url, 302, supabaseResponse)
  }

  // Already logged in — redirect away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return redirectWithCookies(url, 302, supabaseResponse)
  }

  return supabaseResponse
}
