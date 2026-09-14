import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zkhqpqrrwcfbkhkchuie.supabaseco'
const supabaseAnonKey = 'sb_publishable_uKK4OfkJDe0OI46aPW2M9g_5rhYgmGS'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
