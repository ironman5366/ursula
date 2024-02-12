import { searchVolumes } from "./googleBooks.ts";
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";
import { levenshteinDistance } from "./utils.ts";
import Volume from "./types/Volume.ts";

type BooksByAuthorKey = {
  [authorKey: string]: {
    [title: string]: Volume[];
  };
};

/**
 * A heuristic-based approach for grouping a list of volumes into editions and deciding which editions are part of the
 * same book. If the (sorted) author list is an exact string match, we calculate the Levenshtein distance between a slice of the titles.
 * We slice the titles by taking both to be the length of the shorter of the two.
 * If the Levenshtein distance divided by the length of the length of the string is < 25%
 * (read: "if the strings are less than 35% different), we consider the volumes to be part of the same book.
 * We may eventually want to replace this with a more sophisticated approach, or just farm it out to ChatGPT
 */
function groupVolumesToBooks(volumes: VolumeSearchResponse): BooksByAuthorKey {
  const booksByAuthorKey: BooksByAuthorKey = {};

  for (const volume of volumes.items) {
    const authorKey =
      volume.volumeInfo.authors
        ?.sort()
        .map((author) => author.toLowerCase())
        .join(", ") ?? "";

    const existingAuthorBooks = booksByAuthorKey[authorKey];

    if (existingAuthorBooks) {
      let satisfied = false;
      for (const title of Object.keys(existingAuthorBooks)) {
        // Find the shorter title
        const shortestLength = Math.min(
          title.length,
          volume.volumeInfo.title.length
        );

        const titleSlice = title.slice(0, shortestLength);
        const volumeTitleSlice = volume.volumeInfo.title.slice(
          0,
          shortestLength
        );

        const distance = levenshteinDistance(titleSlice, volumeTitleSlice);
        if (distance / shortestLength <= 0.35) {
          existingAuthorBooks[title].push(volume);
          satisfied = true;
          break;
        }
      }

      // If we got to the end and didn't find a suitable match, we'll consider this a new book
      if (!satisfied) {
        booksByAuthorKey[authorKey][volume.volumeInfo.title] = [volume];
      }
    } else {
      booksByAuthorKey[authorKey] = {
        [volume.volumeInfo.title]: [volume],
      };
    }
  }

  return booksByAuthorKey;
}

async function getOrCreateBook(name: string) {
  const volumes = await searchVolumes(name);
  const grouped = groupVolumesToBooks(volumes);
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

  await getOrCreateBook(name);

  return new Response(JSON.stringify({ name }));
}

Deno.serve(handler);
