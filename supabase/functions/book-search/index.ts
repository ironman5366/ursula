// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractISBN, searchVolumes } from "./googleBooks.ts";
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";
import Book from "./types/Book.ts";
import loadClient from "./supabase.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface BookSearchRequest {
  name: string;
}

function cacheBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  console.log("Caching books with name ", client)
  return new Promise((resolve, reject) => {
    let books: Book[] = [];
    client.from("search_cache").insert({ "query": name }).select("id").then(
      ({ data: searchCacheIds, error }) => {
        if (error) {
          console.error("Search cache insert error ", error);
          reject(error);
          return;
        }

        if (searchCacheIds === null) {
          reject();
          return;
        }

        // I shouldn't have to do this cast - Deno is being weird
        searchCacheIds = searchCacheIds as { id: number }[];
        const cacheId: number = searchCacheIds[0].id;

        console.log("Doing google books search for volumes")
        searchVolumes(name).then((volumes: VolumeSearchResponse) => {
          console.log(`Found ${volumes.totalItems} items`)
          volumes.items.forEach((volume) => {
            console.log("Volume ", volume)
            const isbn = extractISBN(volume.volumeInfo);
            console.log("Volume ISBN", isbn)
            if (isbn === null) {
              return;
            }

            // TODO: will supa let me do this in one query?

            // Get or create an author with this name in the database
            client.from("authors").upsert({
                name: volume.volumeInfo.authors?.[0],
            }).select("id").then(({data: authorIds, error}) => {
              if (error || authorIds === null) {
                reject(error);
                return;
              }
              const authorId = (authorIds as { id: number }[])[0].id;
              client.from("books").insert({
                title: volume.volumeInfo.title,
                google_id: volume.id,
                small_thumbnail_url: volume.volumeInfo.imageLinks?.smallThumbnail,
                large_thumbnail_url: volume.volumeInfo.imageLinks?.thumbnail,
                author_id: authorId,
                isbn,
              }).select("*").then(({ data: bookIds, error }) => {
                console.log("Did book insert,", bookIds, error);
                if (error || bookIds === null) {
                  reject(error);
                  return;
                }
                client.from("search_cache_books").insert({
                  "cache_id": cacheId,
                  "book_id": (bookIds as Book[])[0].id,
                }).then(() => {
                  books.push((bookIds as Book[])[0]);
                });
              });
            })


          });
          console.log(`Resolving with ${books.length} books`)
          resolve(books);
        });
      },
    );
  });
}

function searchBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  /**
   * Uses searchVolumes to get a list of VolumeSearchResponse objects, then uses the supabase SDK to put them all into the
   * database
   */
  return new Promise((resolve, reject) => {
    // Check whether the search is cached
    client.from("search_cache").select("id, query").eq("query", name).then(
      ({ data, error }) => {
        if (error) {
          reject(error);
          return;
        }
        const resp = data as { id: number; query: string }[];
        if (resp.length > 0) {
          // If so, find all the associated books
          client.from("search_cache_books").select("book_id").eq(
            "cache_id",
            resp[0].id,
          ).then(({ data: bookIds, error }) => {
            if (error) {
              reject(error);
              return;
            }
            if (bookIds === null) {
              reject();
              return;
            }
            client.from("books").select("*").in(
              "id",
              (bookIds as { book_id: number }[]).map((bookId) =>
                bookId.book_id
              ),
            ).then(({ data: books, error }) => {
              if (error) {
                reject(error)
                return;
              }
              if (books === null) {
                reject();
              } else {
                resolve(books as Book[]);
              }
              return;
            });
          });
        } else {
            cacheBooks(client, name).then((books) => {
              resolve(books);
            });
        }
      },
    );
  });
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
    );
  } catch (e) {
    console.error(e);
    return new Response("", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
