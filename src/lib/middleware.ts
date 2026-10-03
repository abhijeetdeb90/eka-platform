import { createServerClient } from '@supabase/ssr'

/**
 * Updates user session using standard Web API Request.
 * Compatible with TanStack Start, Nitro, Cloudflare Workers, and Vercel edge/serverless runtimes.
 */
export async function updateSession(request: Request) {
  const url = new URL(request.url)
  const supabaseUrl =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_URL'] || process.env['VITE_SUPABASE_URL']
      : undefined) || 'https://kbiutqzhcbyuseygcspe.supabase.co'

  const supabasePublishableKey =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] ||
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
        process.env['VITE_SUPABASE_PUBLISHABLE_KEY']
      : undefined) || 'sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-'

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll(): Array<{ name: string; value: string }> {
        const cookieHeader = request.headers.get('cookie') || ''
        const result: Array<{ name: string; value: string }> = []
        for (const cookie of cookieHeader.split(';')) {
          const trimmed = cookie.trim()
          if (!trimmed) continue
          const index = trimmed.indexOf('=')
          if (index !== -1) {
            result.push({
              name: trimmed.substring(0, index).trim(),
              value: trimmed.substring(index + 1),
            })
          }
        }
        return result
      },
      setAll() {
        // Response cookies can be handled via response headers in server routes
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  return {
    user,
    url,
    isAuthRoute: url.pathname.startsWith('/auth') || url.pathname.startsWith('/login'),
  }
}
