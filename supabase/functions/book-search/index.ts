// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { extractISBN, searchVolumes } from "./googleBooks.ts";
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";
import Book from "./types/Book.ts";
import loadClient from "./supabase.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {coerceId, coerceSingleResponse} from "./utils.ts";

interface BookSearchRequest {
  name: string;
}

function cacheBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    const books: Book[] = []
    console.log("Caching books with name ", name);
    // Create a new entry in the search cache
    client.from("search_cache").insert({
      "query": name
    }).select("id").then((cacheInsertResp) => {
      const cacheId = coerceId(cacheInsertResp);
        if (cacheId === null) {
            reject(cacheInsertResp.error);
            return;
        }

        // Do a google books search for volumes
        console.log("Doing google books search for volumes");
        // TODO: this needs to be a promise.all situation
        const volumePromises: PromiseLike<void>[] = [];
        searchVolumes(name).then((volumes: VolumeSearchResponse) => {
          console.log(`Found ${volumes.totalItems} items`);
          volumes.items.forEach((volume) => {
            console.log("Volume ", volume);
            const isbn = extractISBN(volume.volumeInfo);
              if (isbn === null) {
                return;
              }
              volumePromises.push(client.from("authors").upsert({
                name: volume.volumeInfo.authors?.[0],
              }).select("id").then((authorResp) => {
                const authorId = coerceId(authorResp);
                  if (authorId === null) {
                    reject(authorResp.error);
                    return
                  }
                  client.from("books").upsert({
                    title: volume.volumeInfo.title,
                    google_id: volume.id,
                    small_thumbnail_url: volume.volumeInfo.imageLinks
                        ?.smallThumbnail,
                    large_thumbnail_url: volume.volumeInfo.imageLinks?.thumbnail,
                    author_id: authorId,
                    isbn,
                  }).select("*").then((bookResp) => {
                    const book: Book | null = coerceSingleResponse(bookResp);
                      if (book === null) {
                          reject(bookResp.error);
                          return;
                      }
                      client.from("search_cache_books").insert({
                          "cache_id": cacheId,
                          "book_id": book?.id,
                      }).then(() => {
                        books.push(book as Book);
                        console.log("Pushed to books, books is now ", books);
                      })
                  })
              }));
          });
          Promise.all(volumePromises).then(() => {
            console.log("Finished volume search, resolving with", books);
            resolve(books);
            return;
          })
        })
    })
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
                reject(error);
                return;
              }
              if (books === null) {
                reject();
              } else {
                console.log("Got books from cache", books);
                resolve(books as Book[]);
              }
              return;
            });
          });
        } else {
          cacheBooks(client, name).then((books) => {
            console.log("Cached books, got back ", books);
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
