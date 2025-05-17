import { createClient } from "@supabase/supabase-js";

// Debugging: log environment variables to the console
console.log("NEXT_PUBLIC_SUPABASE_URL from process.env:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY from process.env:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Fetch environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

												
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anonymous Key is missing!");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
