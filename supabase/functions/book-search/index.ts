// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {extractISBN, searchVolumes} from "./googleBooks.ts"
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts"
import Book from "./types/Book.ts";
import loadClient from "./supabase.ts";
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'


interface BookSearchRequest {
  name: string;
}

function cacheBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    let books: Book[] = [];
    client.from("search_cache").insert({"query": name}).select("id").then(({data: searchCacheIds, error}) => {
      if (error) {
        console.error("Search cache insert error ", error)
        reject(error)
      }

      if (searchCacheIds === null) {
        reject();
      }

      // I shouldn't have to do this cast - Deno is being weird
      searchCacheIds = searchCacheIds as {id: number}[];
      const cacheId: number = searchCacheIds[0].id;

      searchVolumes(name).then((volumes: VolumeSearchResponse) => {
        volumes.items.forEach((volume) => {
          const isbn = extractISBN(volume.volumeInfo);
            if (isbn === null) {
                return;
            }

          // TODO: will supa let me do this in one query?
          client.from("books").insert({
            title: volume.volumeInfo.title,
            author_name: volume.volumeInfo.authors,
            isbn,
          }).select("*").then(({data: bookIds, error }) => {
            if (error || bookIds === null) { 
              reject(error);
            }
            client.from("search_cache_books").insert({
              "cache_id": cacheId,
              "book_id": (bookIds as Book[])[0].id,
            }).then(() => {
              books.push((bookIds as Book[])[0]);
            })
          })
        })
        resolve(books)
      });
    })
  })
}

function searchBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  /**
   * Uses searchVolumes to get a list of VolumeSearchResponse objects, then uses the supabase SDK to put them all into the
   * database
   */
  return new Promise((resolve, reject) => {
    client.from("search_cache").select("id, query").eq("query", name).then(({ data, error }) => {
      if (error) {
        console.debug("rjcting error")
        reject(error);
        return;
      }
      console.debug("Searched cache ", data, error);
      const resp = data as {id: number, query: string}[];
      if (resp.length > 0) {
        client.from("search_cache_books").select("book_id").eq("search_cache_id", resp[0].id).then(({ data: bookIds, error }) => {
          if (error) reject(error)
          if (bookIds === null) {
            reject();
          }
          client.from("books").select("*").in("id", (bookIds as {book_id: number}[]).map((bookId) => bookId.book_id)).then(({ data: books, error }) => {
            if (error) reject(error)
            if (books === null) {
              reject();
            }
            resolve(books as Book[])
          })
        })
      }
      cacheBooks(client, name).then((books) => {
        resolve(books)
      })
    })
  })
}

serve(async (req: Request) => {
  const { name } = await req.json() as BookSearchRequest;
  const client = loadClient();

  console.log("Searching for books with name ", name);
  try {
    const volumeResponse = await searchBooks(client, name);
    console.log(`Found ${volumeResponse.length} books with name ${name}`);
    return new Response(
        JSON.stringify(volumeResponse),
        { headers: { "Content-Type": "application/json" } },
    )
  } catch(e) {
    console.error(e);
    return new Response("", {status: 500, headers: {"Content-Type": "application/json"}})
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
