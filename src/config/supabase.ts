import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

// Regular client for user operations
const supabase = createClient(ENV.supabaseURL, ENV.supabaseAnonKey);

// Admin client for bucket operations (requires service role key)
const supabaseAdmin = createClient(
  ENV.supabaseURL,
  ENV.supabaseServiceKey, // We'll add this to env
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabase;
export { supabaseAdmin };
