// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";
import { Database } from "@ursula/shared-types/Database.ts";
import { Book } from "@ursula/shared-types/derived.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/nanoid.ts";

interface RequestParams {
  bookId: number;
}

async function fetchImageAndUploadToSupabase(
  imageUrl: string,
  supabase: SupabaseClient<Database>
) {
  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();
  const filename = `${nanoid()}.jpg`;
  const { error } = await supabase.storage
    .from("book_thumbnails")
    .upload(filename, imageBuffer);

  if (error) {
    throw error;
  }

  return filename;
}

async function loadBookCover(
  supabase: SupabaseClient<Database>,
  book: Book
): Promise<Book> {
  if (book.last_cover_update) {
    return book;
  }

  book.last_cover_update = new Date().toISOString();

  if (book.covers && book.covers.length >= 1) {
    const firstCoverId = book.covers.sort()[0];
    const coverTemplate = `https://covers.openlibrary.org/b/id/${firstCoverId}`;
    const imagePromises: Promise<string>[] = [
      fetchImageAndUploadToSupabase(`${coverTemplate}-S.jpg`, supabase),
      fetchImageAndUploadToSupabase(`${coverTemplate}-M.jpg`, supabase),
      fetchImageAndUploadToSupabase(`${coverTemplate}-L.jpg`, supabase),
    ];

    const [small_cover_key, medium_cover_key, large_cover_key] =
      await Promise.all(imagePromises);
    book = {
      ...book,
      small_cover_key,
      medium_cover_key,
      large_cover_key,
    };
  }

  // Update the book in the database
  const { data: updatedBook, error } = await supabase
    .from("books")
    .update(book)
    .eq("id", book.id)
    .single();

  if (error) {
    throw error;
  }

  return updatedBook;
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
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", bookId)
    .single();

  if (error || !book) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch book" }), {
      status: 500,
    });
  }

  const updatedBook = await loadBookCover(supabase, book);
  return new Response(JSON.stringify(updatedBook), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(handler);
