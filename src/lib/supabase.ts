import { createClient } from '@supabase/supabase-js';

// Hardcoding the URL to bypass Vercel's stubborn cache
const supabaseUrl = "https://wxfpwgtvwrnnzdnljqtz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
