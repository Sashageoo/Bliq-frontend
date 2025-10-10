import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fallback to window env for non-Vite contexts (optional)
  // @ts-ignore
  const w = typeof window !== 'undefined' ? (window as any) : {}
  // @ts-ignore
  const url = supabaseUrl || w.SUPABASE_URL
  // @ts-ignore
  const key = supabaseAnonKey || w.SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
