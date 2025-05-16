// /src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Use environment variables to store your public Supabase URL and anon key.
// Create a .env.local file in the root of your Next.js project with these values.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
