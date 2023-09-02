// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
import { searchVolumes } from "./googleBooks.ts"
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts"
import Book from "./types/Book.ts";
import loadClient from "./supabase.ts";
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'


interface BookSearchRequest {
  name: string;
}

interface BookSearchResponse {}

function cacheBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  return new Promise((resolve, reject) => {
    client.from("search_cache").insert({"name": name}).select().then(({data, error}) => {
      if (error) reject(error);

      const cacheId = data[0].id;
      searchVolumes(name).then((volumes: VolumeSearchResponse) => {
        volumes.items.forEach((volume) => {
          // TODO: will supa let me do this in one query?
          client.from("books").insert({
            "title": volume.volumeInfo.title,
            "author_name": volume.volumeInfo.authors,
          })
          client.from("search_cache_books").insert({

          })
        })
      });
    })
  })
}

function searchBooks(client: SupabaseClient, name: string): Promise<Book[]> {
  /**
   * Uses searchVolumes to get a list of VolumeSearchResponse objects, then uses the supabase CLI to put them all into the
   * database
   */
  return new Promise((resolve, reject) => {
    client.from("search_cache").select("id, name").eq("name", name).then((nameQueryResp) => {
      if (resp.data.length > 0) {

      }
    })
  })
}

serve(async (req: Request) => {
  const { name } = await req.json() as BookSearchRequest;
  const client = loadClient(req);

  const volumeResponse = await searchBooks(client, name);

  return new Response(
    JSON.stringify(volumeResponse),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
