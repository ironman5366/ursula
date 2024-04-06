// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";
import { Database } from "@ursula/shared-types/Database.ts";
import { Book, Edition } from "@ursula/shared-types/derived.ts";
import { findVolume } from "./googleBooks.ts";

console.log("Hello from Functions!");

interface RequestParams {
  bookId: number;
}

interface BookInfo {
  book: Book;
  editions: Edition[];
}

async function fetchBook(
  supabase: SupabaseClient<Database>,
  bookId: number
): Promise<Book> {
  // Fetch the book from the database
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (error) {
    throw error;
  }

  return book;
}

async function fetchEditions(
  supabase: SupabaseClient<Database>,
  bookId: number
): Promise<Edition[]> {
  const { data: editions, error } = await supabase
    .from("editions")
    .select("*")
    .eq("book_id", bookId);

  if (error) {
    throw error;
  }

  return editions;
}

function getIsbns(editions: Edition[]): Set<string> {
  const isbn_13s: Set<string> = new Set();
  const isbn_10s: Set<string> = new Set();

  for (const edition of editions) {
    if (edition.isbn_13) {
      isbn_13s.add(edition.isbn_13);
    }
    if (edition.isbn_10) {
      isbn_10s.add(edition.isbn_10);
    }
  }

  if (isbn_13s.size > 0) {
    return isbn_13s;
  }

  return isbn_10s;
}

async function checkGoogleBooksData(
  book: Book,
  editions: Edition[]
): Promise<Book> {
  let updatedBook: Book = book;

  const isbns = getIsbns(editions);
  if (isbns.size === 0) {
    console.warn("No ISBNs found for book", book.id);
    return updatedBook;
  }

  const googleBookResults = await Promise.all(
    Array.from(isbns).map((isbn) => findVolume(isbn))
  );

  // TODO: finish this

  return updatedBook;
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

  let book: Book;
  let editions: Edition[];
  try {
    [book, editions] = await Promise.all([
      fetchBook(supabase, bookId),
      fetchEditions(supabase, bookId),
    ]);
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Failed to fetch book" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
