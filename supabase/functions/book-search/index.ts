import { Book } from "@ursula/shared-types/derived.ts";
import { searchVolumes } from "./googleBooks.ts";

async function getOrCreateBook(name: string) {
  const volumes = await searchVolumes(name);
  console.log("volumes are ", volumes);
}

async function handler(req: Request): Promise<Response> {
  // Grab the URL params
  const url = new URL(req.url);
  const name = url.searchParams.get("name");

  if (!name) {
    return new Response(JSON.stringify({ error: "name is required" }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ name }));
}

Deno.serve(handler);
