// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";
import { Database } from "@ursula/shared-types/Database.ts";

console.log("Hello from Functions!");

interface RequestParams {
  bookId: number;
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const { bookId }: RequestParams = await req.json();
  let supabase: SupabaseClient<Database>;
  try {
    supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Failed to connect to Supabase" }),
      {
        status: 500,
      }
    );
  }

  // Fetch the book from the database

  console.log("Loading book cover for bookId", bookId);
}

Deno.serve(handler);
