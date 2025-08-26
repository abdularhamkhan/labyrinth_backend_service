"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Regular client for user operations
const supabase = (0, supabase_js_1.createClient)(env_1.ENV.supabaseURL, env_1.ENV.supabaseAnonKey);
// Admin client for bucket operations (requires service role key)
const supabaseAdmin = (0, supabase_js_1.createClient)(env_1.ENV.supabaseURL, env_1.ENV.supabaseServiceKey, // We'll add this to env
{
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
exports.supabaseAdmin = supabaseAdmin;
exports.default = supabase;
