import { useQuery } from "@tanstack/react-query";
import { Book } from "../../shared-types/derived";
import { supabase } from "../utils/supabase.ts";

async function fetchSearchBooks({ name }: { name: string }): Promise<Book[]> {
  console.log("Searching", name);
  const { data: books, error } = await supabase.rpc("search_book_titles", {
    search_text: name,
  });

  if (error) {
    throw error;
  }

  console.log(`Got ${books.length} results`);

  const includesPopularBook = books.some((book) => book.popularity > 0);

  // Books with popularity = 0 tend to be... messy data. So if we have other
  // options, we'll filter them out
  return includesPopularBook
    ? books.filter((book) => book.popularity > 0)
    : books;
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
