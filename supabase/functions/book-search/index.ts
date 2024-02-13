import { Book, Author, Edition } from "@ursula/shared-types/derived.ts";
import { Database } from "@ursula/shared-types/Database.ts";
import { searchVolumes } from "./googleBooks.ts";
import VolumeSearchResponse from "./types/VolumeSearchResponse.ts";
import { levenshteinDistance } from "./utils.ts";
import Volume from "./types/Volume.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js";

// Any spam or junk authors we want to ignore. For example 'instaread summaries' just publishes summaries of books.
const AUTHOR_BLACKLIST = new Set(["instaread summaries"]);

type AuthorBooks = {
  authorNames: string[];
  booksByTitle: {
    [title: string]: Volume[];
  };
};

type BooksByAuthorKey = {
  [authorKey: string]: AuthorBooks;
};

/**
 * A heuristic-based approach for grouping a list of volumes into editions and deciding which editions are part of the
 * same book. If the (sorted) author list is an exact string match, we calculate the Levenshtein distance between a slice of the titles.
 * We slice the titles by taking both to be the length of the shorter of the two.
 * If the Levenshtein distance divided by the length of the length of the string is < 0.35
 * (read: "if the strings are less than 35% different, we consider the volumes to be part of the same book.")
 * We may eventually want to replace this with a more sophisticated approach, or just farm it out to ChatGPT
 */
function groupVolumesToBooks(volumes: VolumeSearchResponse): BooksByAuthorKey {
  const booksByAuthorKey: BooksByAuthorKey = {};
  let totalBookCount = 0;

  for (const volume of volumes.items) {
    const authorKey =
      volume.volumeInfo.authors
        ?.sort()
        .map((author) => author.toLowerCase())
        .join(", ") ?? "";

    if (AUTHOR_BLACKLIST.has(authorKey)) {
      continue;
    }

    const authorNames = volume.volumeInfo.authors ?? [];

    const existingAuthorBooks = booksByAuthorKey[authorKey];

    if (existingAuthorBooks) {
      let satisfied = false;
      for (const title of Object.keys(existingAuthorBooks.booksByTitle)) {
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
          booksByAuthorKey[authorKey].booksByTitle[title].push(volume);
          satisfied = true;
          break;
        }
      }

      // If we got to the end and didn't find a suitable match, we'll consider this a new book
      if (!satisfied) {
        booksByAuthorKey[authorKey].booksByTitle[volume.volumeInfo.title] = [
          volume,
        ];
        totalBookCount++;
      }
    } else {
      booksByAuthorKey[authorKey] = {
        booksByTitle: {
          [volume.volumeInfo.title]: [volume],
        },
        authorNames,
      };
      totalBookCount++;
    }
  }

  console.log(
    `Grouped ${
      volumes.items.length
    } volumes into ${totalBookCount} books, with ${
      Object.keys(booksByAuthorKey).length
    } authors.`
  );

  return booksByAuthorKey;
}

async function getOrCreateAuthor(
  supabase: SupabaseClient,
  name: string
): Promise<Author> {
  // Look an author up by name (case-insensitive), in the database, and create them if they don't exist
  const { data, error } = await supabase
    .from("authors")
    .upsert(
      { name: name },
      {
        onConflict: "name",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert the author:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to get or create the author.");
  }

  return data;
}

async function getOrCreateEdition(
  supabase: SupabaseClient<Database>,
  volume: Volume,
  book: Book
): Promise<Edition> {
  const isbn_13 = volume.volumeInfo.industryIdentifiers?.find(
    (identifier) => identifier.type === "ISBN_13"
  );
  const isbn_10 = volume.volumeInfo.industryIdentifiers?.find(
    (identifier) => identifier.type === "ISBN_10"
  );

  const { data, error } = await supabase
    .from("editions")
    .upsert(
      {
        book_id: book.id,
        description: volume.volumeInfo.description,
        name: volume.volumeInfo.title,
        isbn_10: isbn_10?.identifier,
        isbn_13: isbn_13?.identifier,
        google_id: volume.id,
      },
      {
        onConflict: "google_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert the edition:", error);
    throw error;
  }

  return data;
}

async function getOrCreateAuthorBooks(
  supabase: SupabaseClient<Database>,
  authorKey: string,
  authorBooks: AuthorBooks
): Promise<Book[]> {
  const books = [];

  const authorObjs: Author[] = await Promise.all(
    authorBooks.authorNames.map((name) => getOrCreateAuthor(supabase, name))
  );

  for (const [_title, volumes] of Object.entries(authorBooks.booksByTitle)) {
    // Pick the shortest book title for the one that goes into the database.
    const volumeWithShortestTitle = volumes.reduce((prev, current) =>
      prev.volumeInfo.title.length < current.volumeInfo.title.length
        ? prev
        : current
    );

    const { data: book, error } = await supabase
      .from("books")
      .upsert(
        {
          author_key: authorKey,
          name: volumeWithShortestTitle.volumeInfo.title,
          description: volumeWithShortestTitle.volumeInfo.description,
        },
        { onConflict: "name,author_key" }
      )
      .select()
      .single();

    if (error) {
      console.error("Failed to upsert the book:", error);
      throw error;
    }

    // (asynchronously) create authors and editions for the books
    await Promise.all([
      ...authorObjs.map((author) =>
        supabase
          .from("book_authors")
          .upsert({ author_id: author.id, book_id: book.id })
          .select()
          .single()
      ),
      ...volumes.map((volume) => getOrCreateEdition(supabase, volume, book)),
    ]);

    books.push(book);
  }

  return books;
}

async function getOrCreateBooks(
  supabase: SupabaseClient<Database>,
  name: string
) {
  const volumes = await searchVolumes(name);
  const grouped = groupVolumesToBooks(volumes);

  const books: Book[] = (
    await Promise.all(
      Object.entries(grouped).map(([authorKey, authorBooks]) =>
        getOrCreateAuthorBooks(supabase, authorKey, authorBooks)
      )
    )
  ).reduce((prev, current) => prev.concat(current), []);

  return books;
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

  let supabase: SupabaseClient<Database>;
  try {
    supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
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

  console.log("Searching for books with name", name);

  try {
    const books = await getOrCreateBooks(supabase, name);
    console.log(`Found ${books.length} books for query \"${name}\".`);
    return new Response(JSON.stringify({ books }));
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Failed to get or create books" }),
      {
        status: 500,
      }
    );
  }
}

Deno.serve(handler);
