import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_URL'] || process.env['VITE_SUPABASE_URL']
      : undefined) ||
    (typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env['VITE_SUPABASE_URL'] as string | undefined) ||
        (import.meta.env['NEXT_PUBLIC_SUPABASE_URL'] as string | undefined)
      : undefined) ||
    'https://kbiutqzhcbyuseygcspe.supabase.co'

  const supabasePublishableKey =
    (typeof process !== 'undefined'
      ? process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] ||
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
        process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ||
        process.env['VITE_SUPABASE_ANON_KEY']
      : undefined) ||
    (typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined) ||
        (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined) ||
        (import.meta.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'] as string | undefined) ||
        (import.meta.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string | undefined)
      : undefined) ||
    'sb_publishable_DKdNOtbppccL297o2_Ixkw_f2j0Rf7-'

  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}
