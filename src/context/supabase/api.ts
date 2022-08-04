import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { SUPABASE_API_KEY, SUPABASE_PROJECT_URL } from "./constants";

export const supabase: SupabaseClient = createClient(
    SUPABASE_PROJECT_URL,
    SUPABASE_API_KEY
);
