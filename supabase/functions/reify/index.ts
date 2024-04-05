// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";
import { Database } from "@ursula/shared-types/Database.ts";
import { Book } from "@ursula/shared-types/derived.ts";

console.log("Hello from Functions!");

interface RequestParams {
  bookId: number;
}

function checkGoogleBooksData(book: Book) {
  // Check whether google books has better data with
}

Deno.serve(async (req) => {
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
  const { data: editions, error } = await supabase
    .from("editions")
    .select("*, books(*)")
    .eq("book_id", bookId);

  if (error || !editions) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch book" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
