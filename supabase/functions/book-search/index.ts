// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'
import { searchVolumes } from "./googleBooks.ts"
import VolumeSearchResponse from "../types/volumes/VolumeSearchResponse"

interface BookSearchRequest {
  name: string;
}

interface BookSearchResponse {}

function searchBooks(name: string): Promise<VolumeSearchResponse> {
  return searchVolumes()
}

serve(async (req) => {
  const { name } = await req.json() as BookSearchRequest;
  const volumeResponse = await searchBooks(name);

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
