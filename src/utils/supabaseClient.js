import { createClient } from "@supabase/supabase-js";

// Log environment variables to debug if Vercel reads them
console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Fetch environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Explicit error handling for missing variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anonymous Key is missing!");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
