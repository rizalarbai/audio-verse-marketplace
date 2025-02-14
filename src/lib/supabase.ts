
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = "https://mqbhgonzdpehefedmlmx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYmhnb256ZHBlaGVmZWRtbG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0OTE5MzcsImV4cCI6MjA1NTA2NzkzN30.DilvPrugTwWZp2FXt03YsZnKFg0QVj6DKeo0UuNryAg"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
