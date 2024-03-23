import { useQuery } from "@tanstack/react-query";
import { supabase } from "../utils/supabase.ts";
import { SearchResult } from "../../shared-types/SearchResult.ts";
import { Book } from "@ursula/shared-types/derived.ts";

export async function fetchSearchBooksOnly(query: string): Promise<Book[]> {
  const { data, error } = await supabase
    .rpc("search_only_books", {
      search_text: query,
    })
    .limit(30);

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchSearchResults(
  query: string
): Promise<SearchResult[]> {
  const { data, error } = await supabase
    .rpc("search_all", {
      search_text: query,
    })
    .limit(30);

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

interface SearchProps {
  query: string;
  enabled: boolean;
}

export default function useSearch({ query, enabled }: SearchProps) {
  return useQuery({
    queryKey: ["SEARCH", query],
    queryFn: () => fetchSearchResults(query),
    enabled,
  });
}
