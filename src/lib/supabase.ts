
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = "https://mqbhgonzdpehefedmlmx.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
