
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from "./types/Database.ts"


export default function loadClient(req: Request) {
    // Create a Supabase client with the Auth context of the logged in user.
    return createClient<Database>(
        // Supabase API URL - env var exported by default.
        Deno.env.get('SUPABASE_URL') ?? '',
        // Supabase API privileged service KEY - env var exported by default.
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        // Create client with Auth context of the user that called the function.
        // This way your row-level-security (RLS) policies are applied.
        // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

}