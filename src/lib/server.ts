import { createServerClient } from '@supabase/ssr'

export interface CookieStoreAdapter {
  getAll?: () => Array<{ name: string; value: string }>
  setAll?: (cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => void
}

/**
 * Server-side Supabase client for TanStack Start / Nitro / Node runtime.
 * Can be called inside server functions (createServerFn) or API handlers.
 */
export function createClient(cookieStore?: CookieStoreAdapter) {
  const supabaseUrl =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'] || process.env['SUPABASE_URL']
      : undefined) ||
    'https://kbiutqzhcbyuseygcspe.supabase.co'

  const supabasePublishableKey =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] ||
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
        process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
        process.env['SUPABASE_PUBLISHABLE_KEY']
      : undefined) ||
    'sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-'

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll ? cookieStore.getAll() : []
      },
      setAll(cookiesToSet) {
        if (cookieStore?.setAll) {
          cookieStore.setAll(cookiesToSet)
        }
      },
    },
  })
}
