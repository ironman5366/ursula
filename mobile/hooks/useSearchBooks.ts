import { useQuery } from "@tanstack/react-query";
import { Book } from "../../shared-types/derived";
import { supabase } from "../utils/supabase.ts";

async function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {
  console.log("Searching", name);
  const { data, error } = (await supabase.rpc("search_book_titles", {
    search_text: name,
  })) as { data: { book: Book; rank: number }[]; error: Error };

  if (error) {
    throw error;
  }
  console.log("Got results", data);

  const includesPopularBook = data.some(
    ({ book }: { book: Book; rank: number }) => book.popularity > 0
  );

  // Books with popularity = 0 tend to be... messy data. So if we have other
  // options, we'll filter them out
  const books = includesPopularBook
    ? data.filter(
        ({ book }: { book: Book; rank: number }) => book.popularity > 0
      )
    : data;

  return books.map(({ book }: { book: Book; rank: number }) => book);
}

export default function useSearchBooks({
  name,
  enabled,
}: {
  name: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["SEARCH_BOOKS", name],
    queryFn: () => fetchSearchBooks({ name }),
    enabled,
  });
}
