import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "./types/Database.ts";

export default function loadClient() {
  return createClient<Database>(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API privileged service KEY - env var exported by default.
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
}
