import { useQuery } from "@tanstack/react-query";
import { Book } from "../../shared-types/derived";
import { supabase } from "../utils/supabase.ts";
import { SearchResult } from "../../shared-types/SearchResult.ts";

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

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const { data, error } = await supabase.rpc("search_all", {
    search_text: query,
  });

  if (error) {
    throw error;
  }

  const includesOrderKey = data.some((result) => result.order_key > 0);

  // If we have some results with an order key > 0, we'll filter out the rest
  const filtered = includesOrderKey
    ? data.filter((result) => result.order_key > 0)
    : data;

  return filtered as SearchResult[];
}

export default function useSearch({
  query,
  enabled,
}: {
  query: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["SEARCH", query],
    queryFn: () => fetchSearchResults(query),
    enabled,
  });
}
